import {
  MapPin,
  Mail,
  User,
  Briefcase,
  MoreHorizontal,
  Pencil,
  Trash2,
  CalendarDays,
  FileText,
  Banknote,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './JobCard.module.scss';
import { useTheme } from '@/hooks/useTheme';
import axiosInstance from '@/services/api/axios';
import { useAuthStore } from '@/store/useAuthStore';
import ConfirmModal from '@/components/ui/ConfirmModal/ConfirmModal';
import EditJobModal from '../EditJobModal/EditJobModal';

function formatJobExpiresAt(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

const JobCard = ({ selectedChannel, listRefreshSeq = 0 }) => {
  const { theme } = useTheme();
  const authUser = useAuthStore((s) => s.authUser);
  const [editingJob, setEditingJob] = useState(null);
  const [menuOpenJobId, setMenuOpenJobId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [jobPendingDelete, setJobPendingDelete] = useState(null);
  const [deleteJobLoading, setDeleteJobLoading] = useState(false);
  const [deleteJobError, setDeleteJobError] = useState('');
  const jobMenuRef = useRef(null);

  const themeClass = theme === 'dark' ? styles.dark : '';

  useEffect(() => {
    if (menuOpenJobId == null) return undefined;
    const onPointerDown = (e) => {
      if (jobMenuRef.current && !jobMenuRef.current.contains(e.target)) {
        setMenuOpenJobId(null);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [menuOpenJobId]);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axiosInstance.get('/jobs/job-posts');
      setJobs(res.data || []);
    } catch (err) {
      console.error('❌ İş ilanları alınamadı:', err);
      setError('İş ilanları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

  const openDeleteJobModal = useCallback((job) => {
    setMenuOpenJobId(null);
    setDeleteJobError('');
    setJobPendingDelete(job);
  }, []);

  const closeDeleteJobModal = useCallback(() => {
    if (deleteJobLoading) return;
    setJobPendingDelete(null);
    setDeleteJobError('');
  }, [deleteJobLoading]);

  const handleConfirmDeleteJob = useCallback(async () => {
    if (!jobPendingDelete) return;
    setDeleteJobError('');
    setDeleteJobLoading(true);
    try {
      await axiosInstance.delete(`/jobs/job-posts/${jobPendingDelete.id}`);
      setJobPendingDelete(null);
      await fetchJobs();
    } catch (err) {
      console.error('İş ilanı silinemedi:', err);
      setDeleteJobError(
        err?.response?.data?.message || 'İlan silinirken bir hata oluştu.'
      );
    } finally {
      setDeleteJobLoading(false);
    }
  }, [jobPendingDelete, fetchJobs]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, selectedChannel?.id, listRefreshSeq]);

  return (
    <div className={`${styles.jobCardContainer} ${themeClass}`}>
      <div className={styles.jobCardsList}>
          {loading && <p>İş ilanları yükleniyor...</p>}
          {!loading && error && <p>{error}</p>}
          {!loading && !error && jobs.length === 0 && <p>Henüz iş ilanı yok.</p>}

          {!loading &&
            !error &&
            jobs.map((job) => {
              const isOwner = authUser?.id != null && job.user_id === authUser.id;
              const isPassive = job.status === 'expired';
              const expiresLabel = formatJobExpiresAt(job.expires_at);
              return (
                <div
                  key={job.id}
                  className={`${styles.jobCard} ${isPassive ? styles.jobCardPassive : ''}`}
                >
                  <div className={styles.jobCardTop}>
                    <div className={styles.jobTitle}>
                      <Briefcase size={20} />
                      {job.title}
                    </div>
                    <div className={styles.jobCardTopRight}>
                      {isPassive && <span className={styles.passiveBadge}>Pasif</span>}
                      {isOwner && (
                        <div
                          className={styles.jobCardMenuWrap}
                          ref={menuOpenJobId === job.id ? jobMenuRef : null}
                        >
                          <button
                            type="button"
                            className={styles.jobCardMenuBtn}
                            aria-label="İlan seçenekleri"
                            aria-expanded={menuOpenJobId === job.id}
                            aria-haspopup="menu"
                            onClick={() =>
                              setMenuOpenJobId((id) => (id === job.id ? null : job.id))
                            }
                          >
                            <MoreHorizontal size={20} />
                          </button>
                          {menuOpenJobId === job.id && (
                            <div className={styles.jobCardMenuDropdown} role="menu">
                              <button
                                type="button"
                                className={styles.jobCardMenuItem}
                                role="menuitem"
                                onClick={() => {
                                  setEditingJob(job);
                                  setMenuOpenJobId(null);
                                }}
                              >
                                <Pencil size={16} aria-hidden />
                                Düzenle
                              </button>
                              <button
                                type="button"
                                className={`${styles.jobCardMenuItem} ${styles.jobCardMenuItemDanger}`}
                                role="menuitem"
                                onClick={() => openDeleteJobModal(job)}
                              >
                                <Trash2 size={16} aria-hidden />
                                Sil
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`${styles.infoItem} ${styles.company}`}>
                    <User size={16} />
                    <span>{job.User?.fullname || 'İlan Sahibi'}</span>
                  </div>

                  {job.description?.trim() && (
                    <div className={styles.jobDescriptionBlock}>
                      <div className={styles.jobDescriptionHeading}>
                        <FileText size={16} aria-hidden />
                        <span>Açıklama</span>
                      </div>
                      <p className={styles.jobDescription}>{job.description.trim()}</p>
                    </div>
                  )}

                  {job.location?.trim() && (
                    <div className={styles.infoItem}>
                      <MapPin size={16} />
                      <span>{job.location.trim()}</span>
                    </div>
                  )}

                  {job.salary?.trim() && (
                    <div className={styles.infoItem}>
                      <Banknote size={16} aria-hidden />
                      <span className={styles.jobSalaryInline}>{job.salary.trim()}</span>
                    </div>
                  )}

                  {job.contact?.trim() && (
                    <div className={styles.jobContact}>
                      <Mail size={16} />
                      {job.contact.trim()}
                    </div>
                  )}

                  {expiresLabel && (
                    <div className={styles.infoItem}>
                      <CalendarDays size={16} aria-hidden />
                      <span>İlan bitişi: {expiresLabel}</span>
                    </div>
                  )}
                </div>
              );
            })}
      </div>

      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSaved={fetchJobs}
        />
      )}

      <ConfirmModal
        open={jobPendingDelete != null}
        title="İş ilanını sil"
        description={
          jobPendingDelete
            ? `«${jobPendingDelete.title}» ilanını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`
            : ''
        }
        confirmLabel={deleteJobLoading ? 'Siliniyor...' : 'Sil'}
        cancelLabel="Vazgeç"
        onConfirm={handleConfirmDeleteJob}
        onCancel={closeDeleteJobModal}
        confirmDisabled={deleteJobLoading}
        error={deleteJobError}
      />
    </div>
  );
};

JobCard.propTypes = {
  selectedChannel: PropTypes.object,
  listRefreshSeq: PropTypes.number,
};

export default JobCard;

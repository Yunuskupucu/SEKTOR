import { MapPin, DollarSign, Mail, User, Briefcase, Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/JobCard.module.scss';
import { useTheme } from '../../context/useTheme';
import axiosInstance from '../../lib/axios';
import AddJobModal from './AddJobModal';

const JobCard = ({ selectedChannel }) => {
  const { theme } = useTheme();
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const themeClass = theme === 'dark' ? styles.dark : '';

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

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, selectedChannel?.id]);

  return (
    <div className={`${styles.jobCardContainer} ${themeClass}`}>
      <div className={styles.jobCardWrapper}>
        <div className={styles.jobCardsList}>
          {loading && <p>İş ilanları yükleniyor...</p>}
          {!loading && error && <p>{error}</p>}
          {!loading && !error && jobs.length === 0 && <p>Henüz iş ilanı yok.</p>}

          {!loading &&
            !error &&
            jobs.map((job) => (
              <div key={job.id} className={styles.jobCard}>
                <div className={styles.jobTitle}>
                  <Briefcase size={20} />
                  {job.title}
                </div>

                <div className={`${styles.infoItem} ${styles.company}`}>
                  <User size={16} />
                  <span>{job.User?.fullname || 'İlan Sahibi'}</span>
                </div>

                {job.location && (
                  <div className={styles.infoItem}>
                    <MapPin size={16} />
                    <span>{job.location}</span>
                  </div>
                )}

                {job.salary && (
                  <div className={styles.jobSalary}>
                    <DollarSign size={16} />
                    {job.salary}
                  </div>
                )}

                {job.contact && (
                  <div className={styles.jobContact}>
                    <Mail size={16} />
                    {job.contact}
                  </div>
                )}
              </div>
            ))}

          <div className={styles.addJobButtonContainer}>
            <button
              type="button"
              className={styles.addJobButton}
              onClick={() => setIsAddJobOpen(true)}
              aria-label="Yeni iş ilanı ekle"
            >
              <Plus size={26} />
            </button>
          </div>
        </div>
      </div>

      {isAddJobOpen && <AddJobModal onClose={() => setIsAddJobOpen(false)} onCreated={fetchJobs} />}
    </div>
  );
};

JobCard.propTypes = {
  selectedChannel: PropTypes.object,
};

export default JobCard;

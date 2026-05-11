import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../lib/axios';
import '../../styles/AddJobModal.scss';

function formatDateForInput(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const EditJobModal = ({ job, onClose, onSaved }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [salary, setSalary] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isPassive, setIsPassive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!job) return;
    setTitle(job.title || '');
    setDescription(job.description || '');
    setSalary(job.salary || '');
    setLocation(job.location || '');
    setContact(job.contact || '');
    setExpiresAt(formatDateForInput(job.expires_at));
    setIsPassive(job.status === 'expired');
  }, [job]);

  const handleSave = async () => {
    setError('');

    if (!title.trim() || !description.trim()) {
      setError('Başlık ve açıklama alanları zorunludur.');
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.put(`/jobs/job-posts/${job.id}`, {
        title: title.trim(),
        description: description.trim(),
        salary: salary.trim() || null,
        location: location.trim() || null,
        contact: contact.trim() || null,
        expires_at: expiresAt || null,
        status: isPassive ? 'expired' : 'active',
      });

      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      console.error('İş ilanı güncellenirken hata:', err);
      const msg =
        err?.response?.data?.message ||
        'İş ilanı güncellenirken bir hata oluştu. Lütfen tekrar deneyin.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  if (!job) return null;

  return (
    <div className="addJobOverlay">
      <div className="addJobModal addJobModalEdit">
        <div className="addJobHeader">
          <h2 className="addJobTitle">İş İlanını Düzenle</h2>
          <button type="button" className="addJobCloseBtn" onClick={onClose} aria-label="Kapat">
            ×
          </button>
        </div>

        <form className="addJobForm addJobFormEdit" onSubmit={handleSubmit}>
          <div className="addJobModalBody">
          <label className="addJobLabel">
            Başlık *
            <input
              className="addJobInput"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Senior React Geliştirici"
            />
          </label>

          <label className="addJobLabel">
            Açıklama *
            <textarea
              className="addJobTextarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Rol, aranan nitelikler, avantajlar vb."
            />
          </label>

          <label className="addJobLabel">
            Lokasyon
            <input
              className="addJobInput"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Örn: İstanbul / Remote"
            />
          </label>

          <label className="addJobLabel">
            Maaş / Bütçe
            <input
              className="addJobInput"
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Örn: ₺60-90K"
            />
          </label>

          <label className="addJobLabel">
            İletişim
            <input
              className="addJobInput"
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="E-posta, LinkedIn vb."
            />
          </label>

          <label className="addJobLabel">
            İlan Bitiş Tarihi (opsiyonel)
            <input
              className="addJobInput"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </label>

          <div className="addJobSwitchRow">
            <span className="addJobSwitchLabel">İlanı pasifleştir</span>
            <label className="addJobSwitch">
              <input
                type="checkbox"
                checked={isPassive}
                onChange={(e) => setIsPassive(e.target.checked)}
                aria-label="İlanı pasifleştir"
              />
              <span className="addJobSwitchSlider" />
            </label>
          </div>
          <p className="addJobSwitchHint">
            Pasif ilan listede yalnızca size görünür; tekrar yayına almak için bu seçeneği kapatıp
            kaydedin.
          </p>
          </div>

          {error && <div className="addJobError">{error}</div>}

          <div className="addJobFooter addJobFooterEdit">
            <button type="button" className="addJobSecondaryBtn" onClick={onClose}>
              Vazgeç
            </button>
            <button
              type="button"
              className={`addJobPrimaryBtn ${loading ? 'addJobPrimaryBtn--loading' : ''}`}
              disabled={loading}
              onClick={() => handleSave()}
            >
              {loading ? 'Kaydediliyor...' : 'Güncelle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditJobModal.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    salary: PropTypes.string,
    location: PropTypes.string,
    contact: PropTypes.string,
    expires_at: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func,
};

export default EditJobModal;

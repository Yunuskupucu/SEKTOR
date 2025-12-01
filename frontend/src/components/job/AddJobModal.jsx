import PropTypes from 'prop-types';
import { useState } from 'react';
import { axiosInstance } from '../../lib/axios';
import '../../styles/AddJobModal.scss';

const AddJobModal = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [salary, setSalary] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim()) {
      setError('Başlık ve açıklama alanları zorunludur.');
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post('/jobs/job-posts', {
        title: title.trim(),
        description: description.trim(),
        salary: salary.trim() || null,
        location: location.trim() || null,
        contact: contact.trim() || null,
        expires_at: expiresAt || null,
      });

      // Backend, iş ilanını ilgili "İş İlanları" kanalına mesaj olarak da yayınlıyor.
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      console.error('İş ilanı kaydedilirken hata oluştu:', err);
      const msg =
        err?.response?.data?.message ||
        'İş ilanı kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addJobOverlay">
      <div className="addJobModal">
        <div className="addJobHeader">
          <h2 className="addJobTitle">Yeni İş İlanı</h2>
          <button type="button" className="addJobCloseBtn" onClick={onClose} aria-label="Kapat">
            ×
          </button>
        </div>

        <form className="addJobForm" onSubmit={handleSubmit}>
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

          {error && <div className="addJobError">{error}</div>}

          <div className="addJobFooter">
            <button type="button" className="addJobSecondaryBtn" onClick={onClose}>
              Vazgeç
            </button>
            <button
              type="submit"
              className={`addJobPrimaryBtn ${loading ? 'addJobPrimaryBtn--loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddJobModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreated: PropTypes.func,
};

export default AddJobModal;

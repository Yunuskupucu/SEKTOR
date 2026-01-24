import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { axiosInstance } from '../../lib/axios';
import { useTheme } from '../../context/useTheme';
import '../../styles/UserProfileModal.scss';

const UserProfileModal = ({ userId, onClose }) => {
  const { theme } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/auth/users/${userId}/profile`);
        setProfile(response.data.data);
      } catch (err) {
        console.error('Profil yüklenirken hata:', err);
        setError(err?.response?.data?.message || 'Profil yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Bilinmiyor';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="userProfileOverlay" onClick={onClose}>
      <div 
        className={`userProfileModal ${theme === 'dark' ? 'dark' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="userProfileHeader">
          <h2 className="userProfileTitle">Kullanıcı Profili</h2>
          <button 
            type="button" 
            className="userProfileCloseBtn" 
            onClick={onClose} 
            aria-label="Kapat"
          >
            ×
          </button>
        </div>

        <div className="userProfileBody">
          {loading && (
            <div className="userProfileLoading">
              <div className="userProfileSpinner"></div>
              <p>Profil yükleniyor...</p>
            </div>
          )}

          {error && (
            <div className="userProfileError">
              {error}
            </div>
          )}

          {!loading && !error && profile && (
            <div className="userProfileContent">
              <div className="userProfileAvatar">
                {profile.profile_picture_url ? (
                  <img 
                    src={profile.profile_picture_url} 
                    alt={profile.fullname}
                    className="userProfileImage"
                  />
                ) : (
                  <div className="userProfileImagePlaceholder">
                    {profile.fullname?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                )}
              </div>

              <div className="userProfileInfo">
                <h3 className="userProfileName">{profile.fullname || 'İsimsiz Kullanıcı'}</h3>
                
                {profile.email && (
                  <div className="userProfileSection">
                    <label className="userProfileLabel">E-posta</label>
                    <p className="userProfileText">{profile.email}</p>
                  </div>
                )}

                {profile.bio && (
                  <div className="userProfileSection">
                    <label className="userProfileLabel">Hakkında</label>
                    <p className="userProfileText">{profile.bio}</p>
                  </div>
                )}

                <div className="userProfileSection">
                  <label className="userProfileLabel">Katılım Tarihi</label>
                  <p className="userProfileText">{formatDate(profile.createdAt)}</p>
                </div>

                {(profile.github || profile.linkedin) && (
                  <div className="userProfileSection">
                    <label className="userProfileLabel">Sosyal Medya</label>
                    <div className="userProfileSocialLinks">
                      {profile.github && (
                        <a 
                          href={profile.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="userProfileSocialItem"
                          title="GitHub profilini ziyaret et"
                        >
                          <div className="userProfileSocialIcon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                            </svg>
                          </div>
                          <span className="userProfileSocialUrl">{profile.github}</span>
                        </a>
                      )}
                      {profile.linkedin && (
                        <a 
                          href={profile.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="userProfileSocialItem"
                          title="LinkedIn profilini ziyaret et"
                        >
                          <div className="userProfileSocialIcon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </div>
                          <span className="userProfileSocialUrl">{profile.linkedin}</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

UserProfileModal.propTypes = {
  userId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UserProfileModal;

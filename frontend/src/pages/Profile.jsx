import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import {
  FaCamera,
  FaEnvelope,
  FaUser,
  FaLinkedin,
  FaGithub,
} from 'react-icons/fa';
import styles from './Profile.module.scss';
import Header from '@/components/layout/Header/Header';
import { toast } from 'react-hot-toast';
import defaultAvatar from '@/assets/avatar.png';
import { useTheme } from '@/hooks/useTheme';

const Profile = () => {
  const { authUser, updateProfile, updateAvatar } = useAuthStore();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (authUser) {
      setFullname(authUser.fullname || '');
      setEmail(authUser.email || '');
      setLinkedin(authUser.linkedin || '');
      setGithub(authUser.github || '');
      setBio(authUser.bio || '');
      setAvatar(authUser.profile_picture_url || defaultAvatar);
    }
  }, [authUser]);

 const handleAvatarUpdate = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const prev = avatar;
  const temp = URL.createObjectURL(file);
  setAvatar(temp);

  try {
    setLoading(true);
    const newUrl = await updateAvatar(file); // store'dan Cloudinary URL'i dönüyor
    setAvatar(newUrl);
    toast.success('Profil fotoğrafı güncellendi!');
  } catch (err) {
    console.error('Fotoğraf yüklenirken hata:', err);
    setAvatar(prev);
    toast.error(err?.response?.data?.message || err.message || 'Fotoğraf yüklenemedi!');
  } finally {
    setLoading(false);
    URL.revokeObjectURL(temp);
    e.target.value = '';
  }
};

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      await updateProfile({ fullname, email, linkedin, github, bio });
      toast.success('Profil bilgileri başarıyla güncellendi!');
    } catch (error) {
      console.error('Profil güncellenirken hata:', error.response || error);
      toast.error(error.response?.data?.message || 'Profil güncellenemedi!');
    } finally {
      setLoading(false);
    }
  };

  const themeClass = theme === 'dark' ? styles.dark : '';

  return (
    <>
      <Header />
      <div className={`${styles.container} ${themeClass}`}>
        <div className={`${styles.paper} ${themeClass}`}>
          <h1 className={`${styles.title} ${themeClass}`}>PROFİL</h1>

          <div className={styles.avatarContainer}>
            <div className={styles.avatarWrapper}>
              <div className={`${styles.avatar} ${themeClass}`}>
                <img src={avatar} alt="Avatar" className={styles.avatarImage} />
                <div className={`${styles.avatarOverlay} ${themeClass}`}>
                  <label className={styles.uploadButton}>
                    <FaCamera className={styles.cameraIcon} />
                    <span className={styles.uploadText}>
                      {loading ? 'Yükleniyor...' : 'Fotoğraf Değiştir'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpdate}
                      disabled={loading}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.profileDetails}>
            {[
              {
                label: 'Ad Soyad',
                value: fullname,
                setValue: setFullname,
                icon: <FaUser />,
              },
              {
                label: 'Email',
                value: email,
                setValue: setEmail,
                icon: <FaEnvelope />,
              },
              {
                label: 'LinkedIn',
                value: linkedin,
                setValue: setLinkedin,
                icon: <FaLinkedin />,
              },
              {
                label: 'GitHub',
                value: github,
                setValue: setGithub,
                icon: <FaGithub />,
              },
            ].map(({ label, value, setValue, icon }, i) => (
              <div key={i} className={styles.inputGroup}>
                {icon}
                <span className={`${styles.profileLabel}  ${themeClass}`}>
                  {label}:
                </span>
                <input
                  className={`${styles.profileInput} ${themeClass}`}
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  disabled={loading}
                  placeholder={label}
                />
              </div>
            ))}

            <div className={`${styles.bioSection} ${themeClass}`}>
              <textarea
                className={`${styles.profileInput} ${themeClass}`}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Kendinizi Tanıtın"
                rows={5}
                disabled={loading}
              />

              <button
                className={`${styles.updateButton} ${themeClass} ${loading ? styles.loading : ''}`}
                onClick={handleProfileUpdate}
                disabled={loading}
                aria-busy={loading}
                type="button"
              >
                {loading ? 'Güncelleniyor...' : 'Güncelle'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

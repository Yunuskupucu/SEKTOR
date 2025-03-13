import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import {
  FaCamera,
  FaEnvelope,
  FaUser,
  FaLinkedin,
  FaGithub,
} from 'react-icons/fa';
import styles from '../styles/Profile.module.scss';
import Header from '../components/Header';
import { toast } from 'react-hot-toast';
import defaultAvatar from '../assets/avatar.png';

const Profile = () => {
  const { authUser, updateProfile, updateAvatar, checkAuth } = useAuthStore();
  const [fullname, setFullname] = useState(authUser?.fullname || '');
  const [email, setEmail] = useState(authUser?.email || '');
  const [linkedin, setLinkedin] = useState(authUser?.linkedin || '');
  const [github, setGithub] = useState(authUser?.github || '');
  const [bio, setBio] = useState(authUser?.bio || '');
  const [avatar, setAvatar] = useState(authUser?.profile_picture_url || defaultAvatar);
  const [loading, setLoading] = useState(false);
  const [joinDate, setJoinDate] = useState(authUser?.createdAt ? new Date(authUser.createdAt) : '');

  useEffect(() => {
    if (authUser) {
      setFullname(authUser.fullname || '');
      setEmail(authUser.email || '');
      setLinkedin(authUser.linkedin || '');
      setGithub(authUser.github || '');
      setBio(authUser.bio || '');
      setAvatar(authUser.profile_picture_url || defaultAvatar);
      setJoinDate(authUser.createdAt ? new Date(authUser.createdAt) : '');
    }
  }, [authUser]);
  

  const handleAvatarUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      await updateAvatar(file);
      toast.success('Profil fotoğrafı güncellendi!');
    } catch (error) {
      console.error('Fotoğraf yüklenirken hata:', error);
      toast.error('Fotoğraf yüklenemedi!');
    } finally {
      setLoading(false);
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

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.paper}>
          <h1 className={styles.title}>PROFİL</h1>

          {/* Avatar Bölümü */}
          <div className={styles.avatarContainer}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>
                <img src={avatar} alt="" className={styles.avatarImage} />
                <div className={styles.avatarOverlay}>
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
            {/* Ad Soyad */}
            <div className={styles.inputGroup}>
              <FaUser className={styles.icon} />
              <span>Ad Soyad:</span>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Ad Soyad"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div className={styles.inputGroup}>
              <FaEnvelope className={styles.icon} />
              <span>Email:</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            {/* LinkedIn */}
            <div className={styles.inputGroup}>
              <FaLinkedin className={styles.icon} />
              <span>LinkedIn:</span>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="LinkedIn profil linki"
                disabled={loading}
              />
            </div>

            {/* GitHub */}
            <div className={styles.inputGroup}>
              <FaGithub className={styles.icon} />
              <span>GitHub:</span>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="GitHub profil linki"
                disabled={loading}
              />
            </div>

            {/* Hakkımda */}
            <div className={styles.bioSection}>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Kendinizi Tanıtın"
                rows={5}
                disabled={loading}
              />
              <button
                className={styles.updateButton}
                onClick={handleProfileUpdate}
                disabled={loading}
              >
                {loading ? 'Güncelleniyor...' : 'Güncelle'}
              </button>
            </div>
          </div>

          {/* Hesap Bilgileri */}
          <div className={styles.accountInfo}>
            <h2>Profil Bilgileri</h2>
            <div className={styles.joinDate}>
              <span>Üyelik Tarihi</span>
              <span>
                {joinDate
                  ? joinDate.toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                    })
                  : 'Yükleniyor...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

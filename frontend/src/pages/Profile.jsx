import { useState, useEffect } from 'react';
import axios from 'axios';
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

const Profile = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState();
  const [loading, setLoading] = useState(false);

  // Profil bilgilerini getir
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5001/api/users/profile',
          {
            withCredentials: true,
          }
        );
        const { fullname, email, linkedin, github, bio, avatar } =
          response.data;
        setFullname(fullname || '');
        setEmail(email || '');
        setLinkedin(linkedin || '');
        setGithub(github || '');
        setBio(bio || '');
        setAvatar(avatar || 'https://via.placeholder.com/150');
      } catch (error) {
        console.error('Profil bilgileri yüklenirken hata:', error);
      }
    };

    fetchProfile();
  }, []);

  // Profil fotoğrafını güncelle
  const handleAvatarUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:5001/api/users/avatar',
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setAvatar(response.data.avatar);
      toast.success('Profil fotoğrafı güncellendi!');
    } catch (error) {
      console.error('Fotoğraf yüklenirken hata:', error);
      toast.error('Fotoğraf yüklenemedi!');
    } finally {
      setLoading(false);
    }
  };

  // Profil bilgilerini güncelle
  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      await axios.put(
        'http://localhost:5001/api/users/profile',
        {
          fullname,
          email,
          linkedin,
          github,
          bio,
        },
        { withCredentials: true }
      );
      toast.success('Profil bilgileri güncellendi!');
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
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
              <span>Şubat 2025</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

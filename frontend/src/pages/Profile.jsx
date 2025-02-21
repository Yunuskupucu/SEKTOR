import { useState } from 'react';
import {
  FaCamera,
  FaEnvelope,
  FaUser,
  FaLinkedin,
  FaGithub,
} from 'react-icons/fa';
import styles from '../styles/Profile.module.scss';
import Header from '../components/Header';

const Profile = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [bio, setBio] = useState('');

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
                <img
                  src="https://via.placeholder.com/150"
                  alt=""
                  className={styles.avatarImage}
                />
                <div className={styles.avatarOverlay}>
                  <label className={styles.uploadButton}>
                    <FaCamera className={styles.cameraIcon} />
                    <span className={styles.uploadText}>Fotoğraf Değiştir</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          console.log('Seçilen dosya:', file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Profil Detayları */}
          <div className={styles.profileDetails}>
            {/* Ad Soyad */}
            <div className={styles.inputGroup}>
              <FaUser className={styles.icon} />
              <span>Ad Soyad:</span>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Yunus Emre KÜPÜCÜ"
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
                placeholder="LinkedIn"
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
                placeholder="GitHub"
              />
            </div>

            {/* Hakkımda */}
            <div className={styles.bioSection}>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Kendinizi Tanıtın"
                rows={5}
              />
              <button className={styles.updateButton}>Güncelle</button>
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

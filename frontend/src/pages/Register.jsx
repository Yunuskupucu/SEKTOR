import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Register.module.scss';
import { useAuthStore } from '../store/useAuthStore';
import DarkLogo from '../assets/logo/DarkLogo.png';
import LightLogo from '../assets/logo/LightLogo.png';
import { useTheme } from '../context/useTheme';
import { CgDarkMode } from 'react-icons/cg';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { theme, toggleTheme } = useTheme();

  const logoSrc = theme === 'dark' ? LightLogo : DarkLogo;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(fullname, email, password);
      navigate('/');
    } catch (error) {
      console.error(
        'Kayıt işlemi sırasında hata oluştu:',
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || 'Kayıt başarısız!');
    }
  };
  return (
    <div>
      <div>
        <CgDarkMode
          className={`${styles.themeIcon} ${
            theme === 'dark' ? styles.dark : ''
          }`}
          onClick={toggleTheme}
        />
      </div>
      <div
        className={`${styles.container} ${theme === 'dark' ? styles.dark : ''}`}
      >
        <div
          className={`${styles.form} ${theme === 'dark' ? styles.dark : ''}`}
        >
          <h1
            className={`${styles.title} ${theme === 'dark' ? styles.dark : ''}`}
          >
            SEKTÖR
          </h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={theme === 'dark' ? styles.dark : ''}>
                AD SOYAD
              </label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Ad Soyad"
                required
                className={theme === 'dark' ? styles.dark : ''}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={theme === 'dark' ? styles.dark : ''}>
                E-POSTA
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className={theme === 'dark' ? styles.dark : ''}
              />
            </div>

            <div
              className={`${styles.inputGroup} ${
                theme === 'dark' ? styles.dark : ''
              }`}
            >
              <label className={theme === 'dark' ? styles.dark : ''}>
                PAROLA
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                required
                className={theme === 'dark' ? styles.dark : ''}
              />
            </div>
            <button
              className={`${styles.button} ${
                theme === 'dark' ? styles.dark : ''
              }`}
            >
              Kaydol
            </button>
          </form>

          <div
            className={`${styles.navigateSection} ${
              theme === 'dark' ? styles.dark : ''
            }`}
          >
            Hesabınız var mı?
            <span
              className={styles.navigateLink}
              onClick={() => navigate('/login')}
            >
              Giriş Yap
            </span>
          </div>
        </div>
        <div>
          <div>
            <img src={logoSrc} alt="Logo" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.scss';
import { useAuthStore } from '../store/useAuthStore';
import LightLogo from '../assets/logo/LightLogo.png';
import DarkLogo from '../assets/logo/DarkLogo.png';
import { CgDarkMode } from 'react-icons/cg';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useTheme } from '../context/useTheme';
import { FaRegEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';

const API_ORIGIN = 'http://localhost:5001';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const logoSrc = theme === 'dark' ? LightLogo : DarkLogo;

  const themeClass = theme === 'dark' ? styles.dark : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/app');
    } catch (error) {
      console.error(
        'Giriş işlemi sırasında hata oluştu:',
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || 'Giriş başarısız!');
    }
  };

  return (
    <div>
      <div>
        <CgDarkMode className={`${styles.themeIcon} ${themeClass}`} onClick={toggleTheme} />
      </div>
      <div className={`${styles.container} ${themeClass}`}>
        <div className={`${styles.form} ${themeClass}`}>
          <h1 className={`${styles.title} ${themeClass}`}>SEKTÖR</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={themeClass}>E-POSTA</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={themeClass}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={themeClass}>PAROLA</label>
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={themeClass}
                />
                <button
                  type="button"
                  className={`${styles.passwordToggle} ${themeClass}`}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaRegEye />}
                </button>
              </div>
            </div>
            <button className={`${styles.button} ${themeClass}`}>Giriş Yap</button>
          </form>

          <div className={`${styles.orDivider} ${themeClass}`}>
            <span>VEYA</span>
          </div>

          <div className={styles.socialButtons}>
            <button
              type="button"
              className={`${styles.socialButton} ${themeClass}`}
              onClick={() => {
                // Google OAuth akışını başlat
                window.location.href = `${API_ORIGIN}/api/auth/google`;
              }}
            >
              <FaGoogle />
            </button>
            <button
              type="button"
              className={`${styles.socialButton} ${themeClass}`}
              onClick={() => {
                // GitHub OAuth akışını başlat
                window.location.href = `${API_ORIGIN}/api/auth/github`;
              }}
            >
              <FaGithub />
            </button>
          </div>

          <span className={`${styles.navigateSection} ${themeClass}`}>
            Hesabınız yok mu?
            <Link className={styles.navigateLink} to="/register">
              Kaydol
            </Link>
          </span>
        </div>
        <div className={styles.logoContainer}>
          <div>
            <img src={logoSrc} alt="SEKTÖR Logo" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

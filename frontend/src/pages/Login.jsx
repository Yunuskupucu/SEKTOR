import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.scss';
import { useAuthStore } from '../store/useAuthStore';
import LightLogo from '../assets/logo/LightLogo.png';
import DarkLogo from '../assets/logo/DarkLogo.png';
import { CgDarkMode } from 'react-icons/cg';
import { useTheme } from '../context/useTheme';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { theme, toggleTheme } = useTheme();
  const logoSrc = theme === 'dark' ? LightLogo : DarkLogo;

  const themeClass = theme === 'dark' ? styles.dark : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
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
        <CgDarkMode
          className={`${styles.themeIcon} ${themeClass}`}
          onClick={toggleTheme}
        />
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
              <input
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={themeClass}
              />
            </div>
            <button className={`${styles.button} ${themeClass}`}>
              Giriş Yap
            </button>
          </form>

          <span className={`${styles.navigateSection} ${themeClass}`}>
            Hesabınız yok mu?
            <a className={styles.navigateLink} href="/register">
              Kaydol
            </a>
          </span>
        </div>
        <div>
          <div>
            <img src={logoSrc} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

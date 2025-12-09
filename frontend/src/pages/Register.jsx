import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Register.module.scss';
import { useAuthStore } from '../store/useAuthStore';
import DarkLogo from '../assets/logo/DarkLogo.png';
import LightLogo from '../assets/logo/LightLogo.png';
import { useTheme } from '../context/useTheme';
import { CgDarkMode } from 'react-icons/cg';
import { FaRegEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const logoSrc = theme === 'dark' ? LightLogo : DarkLogo;
  const themeClass = theme === 'dark' ? styles.dark : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Parolalar eşleşmiyor. Lütfen tekrar deneyin.');
      return;
    }
    try {
      await register(fullname, email, password);
      navigate('/app');
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
        <CgDarkMode className={`${styles.themeIcon} ${themeClass}`} onClick={toggleTheme} />
      </div>
      <div className={`${styles.container} ${themeClass}`}>
        <div className={`${styles.form} ${themeClass}`}>
          <h1 className={`${styles.title} ${themeClass}`}>SEKTÖR</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={themeClass}>AD SOYAD</label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Ad Soyad"
                required
                className={themeClass}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={themeClass}>E-POSTA</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className={themeClass}
              />
            </div>

            <div className={`${styles.inputGroup} ${themeClass}`}>
              <label className={themeClass}>PAROLA</label>
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="******"
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
            <div className={`${styles.inputGroup} ${themeClass}`}>
              <label className={themeClass}>PAROLA (tekrar) </label>
              <div className={styles.passwordContainer}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="******"
                  required
                  className={themeClass}
                />
                <button
                  type="button"
                  className={`${styles.passwordToggle} ${themeClass}`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaRegEye />}
                </button>
              </div>
            </div>
            <button className={`${styles.button} ${themeClass}`}>Kaydol</button>
          </form>

          <div className={`${styles.navigateSection} ${themeClass}`}>
            Hesabınız var mı?
            <span className={styles.navigateLink} onClick={() => navigate('/login')}>
              Giriş Yap
            </span>
          </div>
        </div>
        <div className={styles.logoContainer}>
          <img src={logoSrc} alt="Logo" className={styles.logo} />
        </div>
      </div>
    </div>
  );
}

export default Register;

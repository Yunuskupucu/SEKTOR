import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.scss';
import { useAuthStore } from '../store/useAuthStore';
import Logo from '../assets/logo/LightLogo.png';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Giriş işlemi sırasında hata oluştu:', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Giriş başarısız!');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h1 className={styles.title}>SEKTÖR</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>E-POSTA</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>PAROLA</label>
            <input
              type="password"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className={styles.button}>Giriş Yap</button>
        </form>

        <span className={styles.navigateDiv}>
          Hesabınız yok mu?{' '}
          <a className={styles.navigateLink} href="/register">
            Kaydol
          </a>
        </span>
      </div>
      <div>
        <div>
          <img src={Logo} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Login;

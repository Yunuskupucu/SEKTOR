import { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.scss';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h1 className={styles.title}>SEKTÖR</h1>
        <div className={styles.inputGroup}>
          <label>E-POSTA</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>PAROLA</label>
          <input
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className={styles.button}>Giriş Yap</button>
        <span className={styles.navigateDiv}>
          Hesabınız yok mu?{' '}
          <a className={styles.navigateLink} href="/register">
            Kaydol
          </a>
        </span>
      </div>
    </div>
  );
}

export default Login;

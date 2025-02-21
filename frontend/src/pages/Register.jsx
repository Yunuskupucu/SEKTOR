import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Register.module.scss';

function Register() {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h1 className={styles.title}>SEKTÖR</h1>

        <div className={styles.inputGroup}>
          <label>AD SOYAD</label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Ad Soyad"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>E-POSTA</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>PAROLA</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="******"
            required
          />
        </div>
        <button className={styles.button}>Kaydol</button>

        <div className={styles.navigateSection}>
          Hesabınız var mı?
          <span
            className={styles.navigateLink}
            onClick={() => navigate('/login')}
          >
            Giriş Yap
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;

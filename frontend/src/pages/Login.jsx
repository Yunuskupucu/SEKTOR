import { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import '../styles/Login.scss';

function Login() {
  // const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="title">SEKTÖR</h1>
        <div>
          <div>
            <label>E-POSTA</label>
          </div>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <div>
            <label>PAROLA</label>
          </div>
          <input
            type="email"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button>Giriş Yap</button>
        <span className="navigate-div">
          Hesabınız yok mu?{' '}
          <a className="navigate-link" href="/register">
            Kaydol
          </a>
        </span>
      </div>
    </div>
  );
}

export default Login;

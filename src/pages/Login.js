import React from "react";
import "../style/Login.css";

function Login() {
  return (
    <main className="login-main">
      <div className="login-container">
        <div className="title">
          <h1>SEKTÖR</h1>
        </div>
        <div className="input-box">
          <label>E-posta</label>
          <input type="email" placeholder="you@example.com" required />
          <label>Parola</label>
          <input type="password" placeholder="password" required />
        </div>

        <button className="login-button">Giriş Yap</button>

        <div className="navigate-section">
          Hesabınız Yok Mu?
          <button className="signup-button">
            <u>Kaydol</u>
          </button>
        </div>
      </div>
    </main>
  );
}

export default Login;

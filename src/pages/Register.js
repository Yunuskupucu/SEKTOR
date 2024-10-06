import React, { useState } from "react";
import "../style/Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <main className="register-main">
      <div className="register-container">
        <div className="title">
          <h1>SEKTÖR</h1>
        </div>
        <div className="input-box">
          <label>Ad Soyad</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ad Soyad"
            required
          />
          <label>E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <label>Parola</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="******"
            required
          />
        </div>

        <button className="register-button">Kaydol</button>
        <div className="navigate-section">
          Hesabınız Var Mı?
          <button className="signup-button">
            <u>Giriş Yap</u>
          </button>
        </div>
      </div>
    </main>
  );
}

export default Register;

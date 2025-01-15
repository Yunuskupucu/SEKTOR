import React from "react";
import "../style/Header.css";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  return (
    <div className="header">
      <nav>
        <h2 className="logo">
          LOGO <span>Logo</span>
        </h2>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About Us</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
        <div className="header-buttons">
          <button
            type="button"
            onClick={() => {
              navigate("/register");
            }}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Header;

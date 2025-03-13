import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiSettings, FiUser, FiLogOut } from 'react-icons/fi';
import styles from '../styles/Header.module.scss';

function Header() {
  const [anchorEl, setAnchorEl] = useState(false);
  const navigate = useNavigate();

  const handleMenuOpen = () => {
    setAnchorEl(!anchorEl);
  };

  const handleMenuClose = () => {
    setAnchorEl(false);
  };

  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleLogout = () => {
    // Çıkış işlemleri buraya eklenecek
    console.log('Çıkış Yapıldı');
    handleMenuClose();
  };

  return (
    <header className={styles.header}>
      <button className={styles.logo} onClick={() => navigate('/home')}>
        <span>S</span>
        <label>SEKTÖR</label>
      </button>

      <div className={styles.settings}>
        <div className={styles.settingsIcon} onClick={handleMenuOpen}>
          <FiSettings size={24} />
        </div>

        <div className={`${styles.dropdown} ${anchorEl ? styles.active : ''}`}>
          <div className={styles.menuItem} onClick={handleProfile}>
            <FiUser size={18} />
            Profil
          </div>
          <div className={styles.menuItem} onClick={handleLogout}>
            <FiLogOut size={18} />
            Çıkış
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

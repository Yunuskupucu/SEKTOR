import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSettings, FiUser, FiLogOut } from 'react-icons/fi';
import styles from '../styles/Header.module.scss';
import { useAuthStore } from '../store/useAuthStore';
import { useTheme } from '../context/useTheme';
import { CgDarkMode } from 'react-icons/cg';

function Header() {
  const [anchorEl, setAnchorEl] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();

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

  const handleLogout = async () => {
    try {
      await logout();
      console.log('Çıkış Yapıldı');
      navigate('/login'); // Çıkış yaptıktan sonra login sayfasına yönlendirin
    } catch (error) {
      console.error('Çıkış işlemi sırasında hata:', error);
    } finally {
      handleMenuClose();
    }
  };
  console.log('Theme:', theme);

  return (
    <header className={styles.header}>
      <button className={styles.logo} onClick={() => navigate('/')}>
        <span>S</span>
        <label>SEKTÖR</label>
      </button>

      <div className={styles.settingsContainer}>
        <div>
          <CgDarkMode className={styles.themeIcon} onClick={toggleTheme} />
        </div>
        <div className={styles.settings}>
          <div className={styles.settingsIcon} onClick={handleMenuOpen}>
            <FiSettings size={24} />
          </div>

          <div
            className={`${styles.dropdown} ${anchorEl ? styles.active : ''}`}
          >
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
      </div>
    </header>
  );
}

export default Header;

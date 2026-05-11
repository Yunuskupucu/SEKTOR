import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSettings, FiUser, FiLogOut, FiBarChart2 } from 'react-icons/fi';
import styles from '../styles/Header.module.scss';
import { useAuthStore } from '../store/useAuthStore';
import { useTheme } from '../context/useTheme';
import ThemeToggleButton from './common/ThemeToggleButton';

function Header() {
  const [anchorEl, setAnchorEl] = useState(false);
  const navigate = useNavigate();
  const { logout, authUser, isCheckingAuth } = useAuthStore();
  const { theme } = useTheme();

  const themeClass = theme === 'dark' ? styles.dark : '';

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

  const handleDashboard = () => {
    navigate('/');
    handleMenuClose();
  };

  const handleLogoClick = () => {
    if (authUser || isCheckingAuth) {
      navigate('/app');
      return;
    }

    navigate('/');
  };

  const handleLogout = async () => {
    try {
      const ok = await logout();

      localStorage.removeItem('auth');
      if (ok !== false) {
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Çıkış işlemi sırasında hata:', error);
    } finally {
      handleMenuClose();
    }
  };
  return (
    <header className={`${styles.header} ${themeClass}`}>
      <button className={styles.logo} onClick={handleLogoClick}>
        <span>S</span>
        <label>SEKTÖR</label>
      </button>

      <div className={styles.settingsContainer}>
        <ThemeToggleButton />
        <div className={styles.settings}>
          <div className={styles.settingsIcon} onClick={handleMenuOpen}>
            <FiSettings size={24} />
          </div>

          <div className={`${styles.dropdown} ${anchorEl ? styles.active : ''}`}>
            <div className={styles.menuItem} onClick={handleProfile}>
              <FiUser size={18} />
              Profil
            </div>
            <div className={styles.menuItem} onClick={handleDashboard}>
              <FiBarChart2 size={18} />
              Dashboard
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

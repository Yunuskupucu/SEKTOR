import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleLogout = () => {
    // Çıkış işlemleri buraya eklenebilir
    console.log('Çıkış Yapıldı');
    handleMenuClose();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Ortadaki Yazı */}
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
          SEKTÖR
        </Typography>

        <IconButton color="inherit" onClick={handleMenuOpen}>
          <SettingsIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleProfile}>Profil</MenuItem>
          <MenuItem onClick={handleLogout}>Çıkış Yap</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

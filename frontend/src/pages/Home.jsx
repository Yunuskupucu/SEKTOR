import { Box } from '@mui/material';
import Sidebar from '../components/Sidebar';

function ChatLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Sohbet içerikleri buraya gelecek */}
        SOHBET BİLEŞENLERİ
      </Box>
    </Box>
  );
}

export default ChatLayout;

import Sidebar from '../components/sidebar/Sidebar';
import '../styles/Home.scss';

function ChatLayout() {
  return (
    <div className="container">
      <div>
        <Sidebar />
      </div>
      <div>
        <div>SOHBET BİLEŞENLERİ</div>
      </div>
    </div>
  );
}

export default ChatLayout;

// <Box sx={{ display: 'flex' }}>
//   <Sidebar />
//   <Box sx={{ flexGrow: 1, p: 3 }}>
//     {/* Sohbet içerikleri buraya gelecek */}
//     SOHBET BİLEŞENLERİ
//   </Box>
// </Box>

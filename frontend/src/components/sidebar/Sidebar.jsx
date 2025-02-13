import { useState } from 'react';
import Channels from './Channels';
import '../../styles/SearchInput.scss';
import '../../styles/Sidebar.scss';
import JSPng from '../../assets/javascript.png';
import PythonPng from '../../assets/python.png';
import JavaPng from '../../assets/java.png';
import HomePng from '../../assets/home.png';
import SwiftPng from '../../assets/swift.png';
import SqlPng from '../../assets/sql.png';
import CppPng from '../../assets/cpp.png';
import CsPng from '../../assets/cs.png';
import CodePng from '../../assets/code.png';
import SearchInput from './SearchInput';

const channelsData = [
  {
    id: 1,
    name: 'Genel',
    channelPic: HomePng,
  },
  {
    id: 2,
    name: 'JavaScript',
    channelPic: JSPng,
  },
  {
    id: 3,
    name: 'Python',
    channelPic: PythonPng,
  },
  {
    id: 4,
    name: 'Java',
    channelPic: JavaPng,
  },
  {
    id: 5,
    name: 'Swift',
    channelPic: SwiftPng,
  },
  {
    id: 6,
    name: 'C#',
    channelPic: CsPng,
  },
  {
    id: 7,
    name: 'C++',
    channelPic: CppPng,
  },
  {
    id: 8,
    name: 'HTML/CSS',
    channelPic: CodePng,
  },
  {
    id: 9,
    name: 'SQL',
    channelPic: SqlPng,
  },
];
const Sidebar = () => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  return (
    <div className="sidebar">
      <SearchInput />
      <Channels
        channels={channelsData}
        selectedChannel={selectedChannel}
        setSelectedChannel={setSelectedChannel}
      />
    </div>
  );
};

export default Sidebar;

//MUI Sidebar
// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   Toolbar,
//   Typography,
//   Box,
// } from '@mui/material';

// const channels = [
//   'Genel',
//   'JavaScript',
//   'Python',
//   'C#',
//   'Java',
//   'Swift',
//   'SQL',
//   'C',
//   'C++',
// ];

// function Sidebar() {
//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: 240,
//         flexShrink: 0,
//         position: 'relative',
//         [`& .MuiDrawer-paper`]: {
//           width: 240,
//           boxSizing: 'border-box',
//           bgcolor: '#1876D1',
//           color: '#fff',
//         },
//       }}
//     >
//       <Toolbar>
//         <Typography variant="h6" sx={{ fontWeight: 'bold', mx: 'auto' }}>
//           Sohbet Kanalları
//         </Typography>
//       </Toolbar>
//       <Box sx={{ overflow: 'auto' }}>
//         <List>
//           {channels.map((channel, index) => (
//             <ListItem key={index} disablePadding>
//               <ListItemButton sx={{ color: '#fff' }}>
//                 <ListItemText primary={channel} />
//               </ListItemButton>
//             </ListItem>
//           ))}
//         </List>
//       </Box>
//     </Drawer>
//   );
// }

// export default Sidebar;

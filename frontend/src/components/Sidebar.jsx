import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Box,
} from '@mui/material';

const channels = [
  'Genel',
  'JavaScript',
  'Python',
  'C#',
  'Java',
  'Swift',
  'SQL',
  'C',
  'C++',
];

function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: 'border-box',
          bgcolor: '#1876D1',
          color: '#fff',
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mx: 'auto' }}>
          Sohbet Kanalları
        </Typography>
      </Toolbar>
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {channels.map((channel, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton sx={{ color: '#fff' }}>
                <ListItemText primary={channel} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;

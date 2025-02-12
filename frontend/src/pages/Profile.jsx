//TODO: Güncelle butonu eylemi yazılacak

import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import {
  Box,
  Container,
  Typography,
  TextField,
  Paper,
  Avatar,
  IconButton,
  Button,
} from '@mui/material';
import { useState } from 'react';

const Profile = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');

  const [bio, setBio] = useState('');
  return (
    <Container maxWidth="sm" sx={{ paddingTop: 8 }}>
      <Paper
        sx={{
          padding: 4,
          borderRadius: 3,
          backgroundColor: 'background.default',
        }}
      >
        <Typography
          variant="h4"
          fontWeight="medium"
          mb={4}
          textAlign="center"
          borderBottom={2}
        >
          PROFİL
        </Typography>
        {/* Avatar Upload Section */}
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Box position="relative">
            <Avatar
              alt="Profile"
              sx={{
                width: 120,
                height: 120,
                border: 4,
                borderColor: 'primary.main',
                objectFit: 'cover',
              }}
            />
            <IconButton
              component="label"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                padding: '8px',
                borderRadius: '50%',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                },
              }}
            >
              <CameraAltIcon style={{ color: '#ffffff' }} />
              <input type="file" id="avatar-upload" hidden accept="image/*" />
            </IconButton>
          </Box>
        </Box>

        {/* Profile Details */}
        <Box mb={4}>
          {/* Full Name */}
          <Box mb={3} display="flex" alignItems="center">
            <PersonIcon sx={{ marginRight: 1 }} />
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ marginRight: 2 }}
            >
              Ad Soyad:
            </Typography>
            <TextField
              variant="standard"
              placeholder="Yunus Emre KÜPÜCÜ"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              sx={{ flexGrow: 1 }}
            />
          </Box>

          {/* Email Address */}
          <Box mb={3} display="flex" alignItems="center">
            <EmailIcon sx={{ marginRight: 3 }} />
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ marginRight: 2 }}
            >
              Email:
            </Typography>
            <TextField
              fullWidth
              variant="standard"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              sx={{ flexGrow: 1, marginLeft: 2 }}
            />
          </Box>
          {/* LinkedIn Account */}
          <Box mb={3} display="flex" alignItems="center">
            <LinkedInIcon sx={{ marginRight: 2 }} />
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ marginRight: 0.5 }}
            >
              LinkedIn:
            </Typography>
            <TextField
              fullWidth
              variant="standard"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="LinkedIn"
              sx={{ flexGrow: 1, marginLeft: 2 }}
            />
          </Box>
          {/* GitHub Account */}
          <Box mb={3} display="flex" alignItems="center">
            <GitHubIcon sx={{ marginRight: 3 }} />
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ marginRight: 1 }}
            >
              GitHub:
            </Typography>
            <TextField
              fullWidth
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="GitHub"
              variant="standard"
              sx={{ flexGrow: 1, marginLeft: 2 }}
            />
          </Box>
          {/* Hakkımda TextBox */}
          <Box textAlign={'center'} mt={3}>
            <TextField
              label="Kendinizi Tanıtın"
              multiline
              rows={5}
              fullWidth
              variant="outlined"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />

            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              Güncelle
            </Button>
          </Box>
        </Box>

        {/* Account Information */}
        <Box
          sx={{
            padding: 3,
            backgroundColor: 'background.default',
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" fontWeight="medium" mb={3} borderBottom={2}>
            Profil Bilgileri
          </Typography>
          <Box mb={2} display="flex" justifyContent="space-between">
            <Typography variant="body2">Üyelik Tarihi</Typography>
            <Typography variant="body2">Şubat 2025</Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;

// import { useState } from 'react';
// import {
//   Avatar,
//   Box,
//   Button,
//   IconButton,
//   TextField,
//   Typography,
// } from '@mui/material';
// import { CameraAlt as CameraAltIcon } from '@mui/icons-material';

// const Profile = () => {
//   const [profileImage, setProfileImage] = useState(null);
//   const [bio, setBio] = useState('Kendinizi tanıtın...');

//   // Kullanıcı bilgileri (Örnek veri)
//   const user = {
//     name: 'Yunus Emre Küpücü',
//     email: 'yunus.kupucu@gmail.com',
//     joinDate: '2023-09-15',
//   };

//   // 📌 Fotoğrafı Base64'e çevirme fonksiyonu
//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfileImage(reader.result); // Base64 formatına çevirerek kaydediyoruz
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         gap: 2,
//         maxWidth: 400,
//         mx: 'auto',
//         mt: 4,
//         p: 3,
//         boxShadow: 3,
//         borderRadius: 2,
//         bgcolor: 'background.paper',
//       }}
//     >
//       {/* 📌 Profil Fotoğrafı */}
//       <Box sx={{ position: 'relative' }}>
//         <Avatar
//           src={profileImage || 'https://via.placeholder.com/150'} // Base64 veya placeholder
//           sx={{ width: 120, height: 120 }}
//         />
//         <IconButton
//           component="label"
//           sx={{
//             position: 'absolute',
//             bottom: 0,
//             right: 0,
//             bgcolor: 'white',
//             boxShadow: 2,
//             '&:hover': { bgcolor: 'lightgray' },
//           }}
//         >
//           <CameraAltIcon />
//           <input
//             type="file"
//             hidden
//             accept="image/*"
//             onChange={handleImageChange}
//           />
//         </IconButton>
//       </Box>

//       {/* 📌 Kullanıcı Bilgileri */}
//       <Typography variant="h6">{user.name}</Typography>
//       <Typography variant="body1" color="text.secondary">
//         {user.email}
//       </Typography>
//       <Typography variant="body2" color="text.secondary">
//         Katılma Tarihi: {user.joinDate}
//       </Typography>

//       {/* 📌 Düzenlenebilir Açıklama */}
//       <TextField
//         label="Hakkımda"
//         multiline
//         rows={4}
//         fullWidth
//         variant="outlined"
//         value={bio}
//         onChange={(e) => setBio(e.target.value)}
//       />

//       <Button variant="contained" color="primary">
//         Güncelle
//       </Button>
//     </Box>
//   );
// };

// export default Profile;

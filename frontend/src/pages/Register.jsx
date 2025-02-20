// import { useState } from 'react';
// import {
//   Container,
//   Button,
//   Typography,
//   Paper,
//   Box,
//   Link,
//   Input,
// } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// function Register() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [fullname, setFullname] = useState('');
//   const [linkedin, setLinkedin] = useState('');
//   const [github, setGithub] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Giriş işlemi burada yapılacak
//     console.log('Email:', email, 'Password:', password);
//   };

//   return (
//     <Container
//       maxWidth="xs"
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: '90vh',
//       }}
//     >
//       <Paper
//         elevation={3}
//         sx={{
//           padding: 4,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           borderRadius: 3,
//           width: '400px',
//         }}
//       >
//         <Typography
//           variant="h4"
//           component="h1"
//           gutterBottom
//           sx={{
//             mb: 3,
//             fontFamily: '"Newsreader" ,serif',
//             fontWeight: '500',
//             fontSize: '35px',
//           }}
//         >
//           SEKTÖR
//         </Typography>

//         <Box component="form" sx={{ width: '100%' }} onSubmit={handleSubmit}>
//           <label style={{ fontSize: '20px' }}>AD SOYAD</label>
//           <Input
//             fullWidth
//             margin="normal"
//             value={fullname}
//             onChange={(e) => setFullname(e.target.value)}
//             required
//             placeholder="Ad Soyad"
//             sx={{ mb: 2, mt: 1 }}
//           />
//           <label style={{ fontSize: '20px' }}>E-POSTA</label>
//           <Input
//             fullWidth
//             margin="normal"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             placeholder="you@example.com"
//             sx={{ mb: 2, mt: 1 }}
//           />{' '}
//           <label style={{ fontSize: '20px' }}>LINKEDIN</label>
//           <Input
//             fullWidth
//             margin="normal"
//             value={linkedin}
//             onChange={(e) => setLinkedin(e.target.value)}
//             placeholder="LinkedIn"
//             sx={{ mb: 2, mt: 1 }}
//           />
//           <label style={{ fontSize: '20px' }}>GITHUB</label>
//           <Input
//             fullWidth
//             margin="normal"
//             value={github}
//             onChange={(e) => setGithub(e.target.value)}
//             placeholder="GitHub"
//             sx={{ mb: 2, mt: 1 }}
//           />
//           <label style={{ fontSize: '20px' }}>PAROLA</label>
//           <Input
//             fullWidth
//             margin="normal"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="******"
//             type="password"
//             sx={{ mb: 2, mt: 1 }}
//           />
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{
//               mt: 1,
//               backgroundColor: '#00a1ff',
//               fontSize: '18px',
//               padding: '10px 0',
//               width: '100%',
//               borderRadius: '5px',
//             }}
//           >
//             Kaydol
//           </Button>
//         </Box>

//         <Typography variant="body1" sx={{ mt: 2 }}>
//           Hesabınız var mı?
//           <Link
//             onClick={() => {
//               navigate('/login');
//             }}
//             component="button"
//             sx={{ ml: 1, color: '#1495e0', fontWeight: 'bold' }}
//           >
//             Giriş Yap
//           </Link>
//         </Typography>
//       </Paper>
//     </Container>
//   );
// }

// export default Register;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.scss';

function Register() {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');

  return (
    <div className="register-container">
      <div className="register-form">
        <h1 className="title">SEKTÖR</h1>

        <div className="input-group">
          <label>AD SOYAD</label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Ad Soyad"
            required
          />
        </div>

        <div className="input-group">
          <label>E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="input-group">
          <label>PAROLA</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="******"
            required
          />
        </div>
        <div className="input-group">
          <label>LINKEDIN</label>
          <input
            type="text"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="linkedin"
            required
          />
        </div>

        <div className="input-group">
          <label>GITHUB</label>
          <input
            type="text"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            placeholder="github"
            required
          />
        </div>

        <button className="register-button">Kaydol</button>

        <div className="navigate-section">
          Hesabınız var mı?
          <span className="navigate-link" onClick={() => navigate('/login')}>
            Giriş Yap
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;

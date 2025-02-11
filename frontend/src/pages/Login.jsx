import { useState } from 'react';
import {
  Container,
  Button,
  Typography,
  Paper,
  Box,
  Link,
  Input,
} from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Giriş işlemi burada yapılacak
    console.log('Email:', email, 'Password:', password);
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            mb: 5,
            fontFamily: '"Newsreader" ,serif',
            fontWeight: '500',
            fontSize: '40px',
          }}
        >
          SEKTÖR
        </Typography>

        <Box component="form" sx={{ width: '100%' }} onSubmit={handleSubmit}>
          <label style={{ fontSize: '24px' }}>E-POSTA</label>
          <Input
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            sx={{ mb: 5, mt: 2 }}
          />
          <label style={{ fontSize: '24px' }}>PAROLA</label>
          <Input
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="******"
            type="password"
            sx={{ mb: 2, mt: 2 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: '#00a1ff',
              fontSize: '18px',
              padding: '10px 0',
              width: '100%',
              borderRadius: '5px',
            }}
          >
            GİRİŞ YAP
          </Button>
        </Box>

        <Typography variant="body1" sx={{ mt: 2 }}>
          Hesabınız yok mu?
          <Link
            component="button"
            sx={{ ml: 1, color: '#1495e0', fontWeight: 'bold' }}
          >
            Kaydol
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Login;

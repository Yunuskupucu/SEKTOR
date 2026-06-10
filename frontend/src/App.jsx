import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import './index.scss';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

function App() {
  const { authUser, fetchProfile, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Loader
          style={{
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            `}
        </style>
      </div>
    );
  }

  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/app" element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/app" />} />
        <Route path="/register" element={!authUser ? <Register /> : <Navigate to="/app" />} />
        <Route
          path="/profile"
          element={
            isCheckingAuth ? (
              <div>Loading...</div>
            ) : authUser ? (
              <Profile />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;

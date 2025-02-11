import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Login from './pages/Login';
import './index.scss';
import Register from './pages/Register';

function App() {
  return (
    <div>
      <Toaster />
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;

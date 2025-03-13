import express from 'express';
import {
  login,
  logout,
  register,
  checkAuth,
  getProfile,
  updateProfile,
  updateAvatar,
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Dosyaların geçici olarak kaydedileceği dizin

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/check', protectRoute, checkAuth); // Bu satırın doğru olduğundan emin olun

// Profil bilgilerini getirme rotası
router.get('/profile', protectRoute, getProfile);

// Profil bilgilerini güncelleme rotası
router.put('/profile', protectRoute, updateProfile);

// Profil fotoğrafı güncelleme rotası
router.post('/avatar', protectRoute, upload.single('avatar'), updateAvatar);

export default router; // Router nesnesini dışa aktar
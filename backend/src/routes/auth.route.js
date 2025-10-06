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
import upload from "../middleware/uploadMiddleware.js"; // ✅ memoryStorage

const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/check', protectRoute, checkAuth); // Bu satırın doğru olduğundan emin olun

// Profil bilgilerini getirme rotası
router.get('/profile', protectRoute, getProfile);

// Profil bilgilerini güncelleme rotası
router.put('/profile', protectRoute, updateProfile);

router.post(
  "/avatar",
  protectRoute,
  (req, res, next) => {
    upload.single("avatar")(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ message: "Dosya boyutu sınırı aşıldı (10MB)." });
        }
        return res.status(400).json({ message: err.message || "Yükleme hatası" });
      }
      next();
    });
  },
  updateAvatar
);


export default router; // Router nesnesini dışa aktar
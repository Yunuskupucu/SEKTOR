import express from 'express';
import multer from 'multer';
import { updateProfile, updateAvatar } from '../controllers/auth.controller.js';
import { body } from 'express-validator';
import authMiddleware from '../middleware/auth.middleware.js'; // Kullanıcı doğrulama için middleware

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Dosyaların geçici olarak kaydedileceği dizin

router.put(
    '/profile',
    authMiddleware, // Kullanıcı doğrulama middleware'i
    [
        body('fullname').optional().isString().withMessage('Fullname must be a string'),
        body('email').optional().isEmail().withMessage('Email must be valid'),
        body('profile_picture_url').optional().isURL().withMessage('Profile picture URL must be valid'),
        body('github').optional().isURL().withMessage('GitHub URL must be valid'),
        body('linkedin').optional().isURL().withMessage('LinkedIn URL must be valid'),
        body('bio').optional().isString().withMessage('Bio must be a string'),
    ],
    updateProfile
);

// Profil fotoğrafı güncelleme rotası
router.post('/avatar', authMiddleware, upload.single('avatar'), updateAvatar);

export default router;
import express from 'express';
import { updateProfile } from '../controllers/auth.controller.js';
import { body } from 'express-validator';
import authMiddleware from '../middleware/auth.middleware.js'; // Kullanıcı doğrulama için middleware

const router = express.Router();

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

export default router;
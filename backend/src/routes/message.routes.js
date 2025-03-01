import express from 'express';
import { sendMessage } from '../controllers/message.controller.js';
import { body } from 'express-validator';

const router = express.Router();

router.post(
    '/',
    [
        body('channel_id').notEmpty().withMessage('Channel ID is required'),
        body('content').notEmpty().withMessage('Content is required'),
    ],
    sendMessage
);

export default router;

import express from 'express';
import { getMessagesByChannel } from '../controllers/message.controller.js'; // getMessagesByChannel fonksiyonunu içe aktar

const router = express.Router();

// Belirli bir kanalın mesajlarını almak için rota
router.get('/:channel_id/messages', getMessagesByChannel);

export default router;
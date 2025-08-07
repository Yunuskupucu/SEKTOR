import express from "express";
import { body } from "express-validator";
import {
  sendMessage,
  sendMessageWithAttachment,
  getMessagesByChannel,
} from "../controllers/message.controller.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/**
 * 📎 1. Dosya ekli mesaj gönderme (POST /api/messages/with-attachment)
 * Bu route EN ÜSTE yazılmalı ki /:channel_id ile çakışmasın.
 */
router.post(
  "/with-attachment",
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        console.error("🛑 Multer Hatası:", err.message);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  sendMessageWithAttachment
);

/**
 * ✉️ 2. Sadece metinli mesaj gönderme (POST /api/messages/)
 */
router.post(
  "/",
  [
    body("channel_id").notEmpty().withMessage("Channel ID is required"),
    body("content").notEmpty().withMessage("Content is required"),
  ],
  sendMessage
);

/**
 * 📜 3. Belirli bir kanalın tüm mesajlarını getirme (GET /api/messages/:channel_id)
 * Bu route EN SONDA olmalı ki diğer path'lerle karışmasın.
 */
router.get("/:channel_id", getMessagesByChannel);

export default router;

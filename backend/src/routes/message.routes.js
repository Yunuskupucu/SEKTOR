// routes/message.routes.js
import express from "express";
import { body } from "express-validator";
import {
  sendMessage,
  sendMessageWithAttachment,
  getMessagesByChannel,
} from "../controllers/message.controller.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// 1) Dosya ekli mesaj
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

// 2) Metinli mesaj
router.post(
  "/",
  [
    body("channel_id").notEmpty().withMessage("Channel ID is required"),
    body("content").notEmpty().withMessage("Content is required"),
  ],
  sendMessage
);

// 3) Kanal mesajları
router.get("/:channel_id(\\d+)", getMessagesByChannel);


export default router;

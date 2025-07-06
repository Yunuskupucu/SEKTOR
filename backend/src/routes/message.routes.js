import express from "express";
import { body } from "express-validator";
import {
  getMessagesByChannel,
  sendMessage,
  sendMessageWithAttachment, // ✅ Bunu eklemen gerekiyor
} from "../controllers/message.controller.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ✅ Metinli mesaj gönderme
router.post(
  "/",
  [
    body("channel_id").notEmpty().withMessage("Channel ID is required"),
    body("content").notEmpty().withMessage("Content is required"),
  ],
  sendMessage
);

// ✅ Dosya ekli mesaj gönderme
router.post(
  "/messages/with-attachment",
  upload.single("file"),
  sendMessageWithAttachment
);

// ✅ Belirli kanaldaki mesajları getir
router.get("/:channel_id", getMessagesByChannel);

export default router;

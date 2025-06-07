import express from "express";
import { getMessagesByChannel, sendMessage } from "../controllers/message.controller.js";
import { body } from "express-validator";
import upload from "../middlewares/uploadMiddleware.js";
const router = express.Router();

// ✅ Mesaj gönderme
router.post(
  "/",
  [
    body("channel_id").notEmpty().withMessage("Channel ID is required"),
    body("content").notEmpty().withMessage("Content is required"),
  ],
  sendMessage
);

// ✅ Kanal mesajlarını getirme (eksikti, EKLEDİK)
router.get("/:channel_id", getMessagesByChannel);
router.post("/messages/with-attachment", upload.single("file"), sendMessageWithAttachment);

export default router;

import express from "express";
import { body } from "express-validator";
import {
  sendMessage,
  sendMessageWithAttachment,
  getMessagesByChannel,
} from "../controllers/message.controller.js";
import upload from "../middleware/uploadMiddleware.js";
import { editMessage, deleteMessageOrAttachment } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router();


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


router.post(
  "/",
  [
    body("channel_id").notEmpty().withMessage("Channel ID is required"),
    body("content").notEmpty().withMessage("Content is required"),
  ],
  sendMessage
);


router.get("/:channel_id(\\d+)", getMessagesByChannel);


router.patch("/:id", protectRoute, editMessage);


router.delete("/:id", protectRoute, deleteMessageOrAttachment);

export default router;

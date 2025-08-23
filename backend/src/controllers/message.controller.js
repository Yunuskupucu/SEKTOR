import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Channel from "../models/channel.model.js";
import { validationResult } from "express-validator";
import { handleSendMessage } from "../lib/handleSendMessage.js";

// Yardımcı: Mutlak URL ekle
const withAttachmentUrl = (req, msg) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const j = typeof msg.toJSON === "function" ? msg.toJSON() : msg;
  return {
    ...j,
    attachment_url: j.attachment ? `${baseUrl}${j.attachment}` : null,
  };
};

// ✅ Metinli mesaj gönderme
export const sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { channel_id, content } = req.body;
  const user_id = req.user?.id || req.body.user_id;

  try {
    const user = await User.findByPk(user_id);
    const channel = await Channel.findByPk(channel_id);
    if (!user || !channel) {
      return res.status(404).json({ message: "User or Channel not found" });
    }

    const fullMessage = await handleSendMessage({ user_id, channel_id, content });
    const payload = withAttachmentUrl(req, fullMessage);

    const io = req.app.get("io");
    io.to(channel_id).emit("newMessage", payload);

    res.status(201).json(payload);
  } catch (error) {
    console.error("❌ sendMessage hata:", error);
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
};

// ✅ Dosya ekli mesaj gönderme
export const sendMessageWithAttachment = async (req, res) => {
  const { channel_id, content } = req.body;
  const user_id = req.user?.id || req.body.user_id;

  try {
    console.log("📥 İçerik:", { channel_id, content, user_id });
    console.log("📁 Dosya:", req.file);

    if (!content && !req.file) {
      return res.status(400).json({ message: "Mesaj veya dosya boş olamaz" });
    }

    const user = await User.findByPk(user_id);
    const channel = await Channel.findByPk(channel_id);
    if (!user || !channel) {
      return res.status(404).json({ message: "Kullanıcı veya kanal bulunamadı" });
    }

    const attachment = req.file ? `/uploads/${req.file.filename}` : null;

    const newMessage = await Message.create({
      user_id,
      channel_id,
      content,
      attachment,
    });

    const fullMessage = await Message.findByPk(newMessage.id, {
      include: [{ model: User, attributes: ["id", "fullname"] }],
    });

    const payload = withAttachmentUrl(req, fullMessage);

    const io = req.app.get("io");
    io.to(channel_id).emit("newMessage", payload);

    res.status(201).json(payload);
  } catch (error) {
    console.error("❌ sendMessageWithAttachment hata:", error);
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// ✅ Belirli bir kanaldaki tüm mesajları çekme
export const getMessagesByChannel = async (req, res) => {
  const { channel_id } = req.params;
  try {
    const messages = await Message.findAll({
      where: { channel_id },
      include: [{ model: User, attributes: ["id", "fullname"] }],
      order: [["timestamp", "ASC"]],
    });

    // her mesaja mutlak url ekle
    const result = messages.map((m) => withAttachmentUrl(req, m));
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ getMessagesByChannel hata:", error);
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
};

// ✅ Tüm kanalları listeleme
export const getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.findAll();
    res.status(200).json(channels);
  } catch (error) {
    console.error("❌ getAllChannels hata:", error);
    res.status(500).json({ message: "Error fetching channels", error: error.message });
  }
};

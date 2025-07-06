import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Channel from "../models/channel.model.js";
import { validationResult } from "express-validator";
import { checkContentModeration } from "../api/geminiModeration.js";


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

    // ✅ İçerik denetimi
    const result = await checkContentModeration(content);
    const moderatedContent = result === "0" ? "Mesaj kaldırıldı." : content;

    const newMessage = await Message.create({ user_id, channel_id, content: moderatedContent });
    const fullMessage = await Message.findByPk(newMessage.id, {
      include: [{ model: User, attributes: ["fullname"] }],
    });

    const io = req.app.get("io");
    io.to(channel_id).emit("newMessage", fullMessage);
    res.status(201).json(fullMessage);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
};

// ✅ Dosya ekli mesaj gönderme (örneğin PDF veya görsel)
export const sendMessageWithAttachment = async (req, res) => {
  const { channel_id, content } = req.body;
  const user_id = req.user?.id || req.body.user_id;

  try {
    const user = await User.findByPk(user_id);
    const channel = await Channel.findByPk(channel_id);
    if (!user || !channel) {
      return res.status(404).json({ message: "User or Channel not found" });
    }

    const attachment = req.file ? `/uploads/${req.file.filename}` : null;

    const newMessage = await Message.create({
      user_id,
      channel_id,
      content,
      attachment,
    });

    const fullMessage = await Message.findByPk(newMessage.id, {
      include: [{ model: User, attributes: ["fullname"] }],
    });

    const io = req.app.get("io");
    io.to(channel_id).emit("newMessage", fullMessage);

    res.status(201).json(fullMessage);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
};

// ✅ Belirli bir kanaldaki tüm mesajları çekme
export const getMessagesByChannel = async (req, res) => {
  const { channel_id } = req.params;
  try {
    const messages = await Message.findAll({
      where: { channel_id },
      include: [{ model: User, attributes: ["fullname"] }],
      order: [["timestamp", "ASC"]],
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
};

// ✅ Tüm kanalları listeleme
export const getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.findAll();
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching channels", error: error.message });
  }
};

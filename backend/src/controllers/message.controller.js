import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Channel from "../models/channel.model.js";
import { validationResult } from "express-validator";

export const sendMessage = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { channel_id, content, attachment } = req.body;
    const user_id = req.user.id; // Assuming user_id is taken from req.user.id

    try {
        // Kullanıcı ve kanalın varlığını kontrol et
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const channel = await Channel.findByPk(channel_id);
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        // Yeni mesajı veritabanına kaydet
        const newMessage = await Message.create({
            user_id, 
            channel_id,
            content,
            attachment,
        });

        // Socket.io ile mesajı kanaldaki herkese gönder
        const io = req.app.get('io');
        io.to(channel_id).emit('newMessage', newMessage);

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Error sending message", error: error.message });
    }
};

export const getMessagesByChannel = async (req, res) => {
    const { channel_id } = req.params;

    try {
        // Kanalın varlığını kontrol et
        const channel = await Channel.findByPk(channel_id);
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        // Kanalın mesajlarını al
        const messages = await Message.findAll({
            where: { channel_id },
            order: [['createdAt', 'ASC']]
        });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Error fetching messages", error: error.message });
    }
};

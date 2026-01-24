import { Op } from "sequelize";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Channel from "../models/channel.model.js";
import { validationResult } from "express-validator";
import { handleSendMessage } from "../lib/handleSendMessage.js";
import { uploadBufferToCloudinary } from "../lib/uploadToCloudinary.js";
import streamifier from "streamifier";

const withAttachmentUrl = (req, msg) => {
  const j = typeof msg.toJSON === "function" ? msg.toJSON() : msg;
  const a = j.attachment;

  // Cloudinary tam URL ise aynen dön
  if (a && /^https?:\/\//i.test(a)) {
    return { ...j, attachment_url: a };
  }

  // Eski yerel dosyalar için host ekle (ör. /uploads/..)
  if (a && a.startsWith("/")) {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    return { ...j, attachment_url: `${baseUrl}${a}` };
  }

  return { ...j, attachment_url: null };
};

// --- LAZY LOADING + LOG
export const getMessagesByChannel = async (req, res) => {
  const { channel_id } = req.params;

  // küçük bir istek-id'si, log takibi için
  const rid = Math.random().toString(36).slice(2, 8).toUpperCase();

  const limitRaw = parseInt(req.query.limit, 10);
  const limit = Math.min(Number.isFinite(limitRaw) ? limitRaw : 15, 100);

  // cursorlar
  const beforeTsMs = req.query.beforeTs ? Number(req.query.beforeTs) : null;
  const beforeId = req.query.beforeId ? Number(req.query.beforeId) : null;
  const beforeTs = Number.isFinite(beforeTsMs) ? new Date(beforeTsMs) : null;

  // Parametre logları
  console.log(
    `[${rid}] GET /messages/${channel_id} | limit=${limit} | beforeTs=${beforeTsMs} | beforeId=${beforeId}`
  );

  // Geçersiz timestamp yakalama
  if (req.query.beforeTs && !Number.isFinite(beforeTsMs)) {
    console.warn(`[${rid}] beforeTs geçersiz:`, req.query.beforeTs);
  }

  try {
    const where = { channel_id };

    // Cursor koşulu
    if (beforeTs) {
      where[Op.or] = [
        { timestamp: { [Op.lt]: beforeTs } },
        ...(Number.isFinite(beforeId)
          ? [
              {
                [Op.and]: [{ timestamp: beforeTs }, { id: { [Op.lt]: beforeId } }],
              },
            ]
          : []),
      ];
    }

    // Where özet log
    console.log(
      `[${rid}] WHERE özet:`,
      JSON.stringify(
        {
          channel_id,
          hasCursor: !!beforeTs,
          orBranches: beforeTs ? (Number.isFinite(beforeId) ? 2 : 1) : 0,
        },
        null,
        0
      )
    );

    console.time(`[${rid}] Message.findAll`);
    const rows = await Message.findAll({
      where,
      include: [{ model: User, attributes: ["id", "fullname"] }],
      order: [
        ["timestamp", "DESC"], 
        ["id", "DESC"],        
      ],
      limit,
      
    });
    console.timeEnd(`[${rid}] Message.findAll`);

   
    const items = rows.reverse().map((m) => withAttachmentUrl(req, m));

    // Cursor üretimi
    const oldest = rows.length ? rows[rows.length - 1] : null;
    const next =
      oldest
        ? {
            beforeTs: new Date(oldest.timestamp).getTime(),
            beforeId: oldest.id,
          }
        : null;

    const hasMore = rows.length === limit;

    console.log(
      ` [${rid}] Sonuç: count=${rows.length} | hasMore=${hasMore} | next=${next ? `${next.beforeTs}/${next.beforeId}` : "null"}`
    );

    // Çok küçük performans ipucu / index uyarısı 
    if (rows.length === 0 && beforeTs && !beforeId) {
      console.log(
        ` [${rid}] Performans: (channel_id, timestamp) üzerine index önerilir. (örn: CREATE INDEX idx_msg_ch_ts ON messages(channel_id, timestamp DESC);)`
      );
    }

    res.status(200).json({ items, next, hasMore });
  } catch (error) {
    console.error(`❌ [${rid}] getMessagesByChannel hata:`, error);
    res
      .status(500)
      .json({ message: "Error fetching messages", error: error.message });
  }
};


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

export const sendMessageWithAttachment = async (req, res) => {
  const { channel_id, content } = req.body;
  const user_id = req.user?.id || req.body.user_id;

  try {
    if (!content && !req.file) {
      return res.status(400).json({ message: "Mesaj veya dosya boş olamaz" });
    }

    const user = await User.findByPk(user_id);
    const channel = await Channel.findByPk(channel_id);
    if (!user || !channel) {
      return res.status(404).json({ message: "Kullanıcı veya kanal bulunamadı" });
    }

    // 🔁 Artık disk yok: req.file.buffer → Cloudinary
    let attachment = null;
    if (req.file) {
      const result = await uploadBufferToCloudinary(
        req.file.buffer,
        req.file.originalname,
        { folder: `sektor/channels/${channel_id}` } // klasörleme
      );
      attachment = result.secure_url; // DB’de sadece URL tutuyoruz
    }

    // Basit oluşturma (handleSendMessage içinde dosya desteği yoksa)
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
//  MESAJ DÜZENLEME
export const editMessage = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const user_id = req.user?.id;

  try {
    if (!content || !content.trim()) {
      return res.status(400).json({ message: "content boş olamaz" });
    }

    const msg = await Message.findByPk(id);
    if (!msg) return res.status(404).json({ message: "Mesaj bulunamadı" });

    if (msg.user_id !== user_id) {
      return res.status(403).json({ message: "Bu mesajı düzenleme yetkin yok" });
    }

    if (msg.status === "removed") {
      return res.status(400).json({ message: "Kaldırılmış mesaj düzenlenemez" });
    }

    await msg.update({ 
      content: content.trim(),
      edited_at: new Date()
    });

    const fullMessage = await Message.findByPk(msg.id, {
      include: [{ model: User, attributes: ["id", "fullname"] }],
    });

    const payload = withAttachmentUrl(req, fullMessage);

    
    const io = req.app.get("io");
    io.to(String(msg.channel_id)).emit("messageUpdated", payload);

    return res.status(200).json(payload);
  } catch (error) {
    console.error("❌ editMessage hata:", error);
    return res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};
// MESAJ VEYA EK SİLME
export const deleteMessageOrAttachment = async (req, res) => {
  const { id } = req.params;
  const mode = (req.query.mode || "").toLowerCase(); // "attachment" | ""
  const user_id = req.user?.id;

  try {
    const msg = await Message.findByPk(id);
    if (!msg) return res.status(404).json({ message: "Mesaj bulunamadı" });

    if (msg.user_id !== user_id) {
      return res.status(403).json({ message: "Bu işlem için yetkin yok" });
    }

    if (msg.status === "removed") {
      return res.status(200).json({ success: true, message: "Mesaj zaten kaldırılmış" });
    }

    // 
    if (mode === "attachment") {
      await msg.update({ attachment: null });

      const fullMessage = await Message.findByPk(msg.id, {
        include: [{ model: User, attributes: ["id", "fullname"] }],
      });

      const payload = withAttachmentUrl(req, fullMessage);

      const io = req.app.get("io");
      io.to(String(msg.channel_id)).emit("messageUpdated", payload); // aynı event yeter

      return res.status(200).json({ success: true, data: payload });
    }

    // 2) soft delete
    await msg.update({
      status: "removed",
      content: "Mesaj kaldırıldı.",
      attachment: null,
    });

    const io = req.app.get("io");
    io.to(String(msg.channel_id)).emit("messageDeleted", {
      id: msg.id,
      channel_id: msg.channel_id,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ deleteMessageOrAttachment hata:", error);
    return res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

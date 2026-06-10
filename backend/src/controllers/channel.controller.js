import Channel from "../models/channel.model.js";
import Message from "../models/message.model.js";
import { Op } from "sequelize";
import { extractChannelDailySummary } from "../api/geminiModeration.js";


export const getChannelStats = async (req, res) => {
  const rawId = req.params.channel_id;
  const channelId = Number(rawId);

  if (!Number.isFinite(channelId)) {
    return res.status(400).json({
      success: false,
      message: "Geçersiz kanal kimliği.",
    });
  }

  try {
    const channel = await Channel.findByPk(channelId, {
      attributes: ["id", "name", "description"],
    });

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Kanal bulunamadı.",
      });
    }

    const messageCount = await Message.count({
      where: { channel_id: channelId },
    });

    return res.status(200).json({
      success: true,
      data: {
        messageCount,
        description: channel.description || null,
        name: channel.name,
      },
    });
  } catch (error) {
    console.error("getChannelStats error:", error);

    return res.status(500).json({
      success: false,
      message: "Kanal bilgisi alınamadı.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const channelTrendCache = new Map();


const CHANNEL_TREND_CACHE_DURATION = 24 * 60 * 60 * 1000;

export const getChannelWeeklyTrends = async (req, res) => {
  const rawId = req.params.channel_id;
  const channelId = Number(rawId);

  if (!Number.isFinite(channelId)) {
    return res.status(400).json({
      success: false,
      message: "Geçersiz kanal kimliği.",
    });
  }

  try {
    const now = new Date();


    const channel = await Channel.findByPk(channelId, {
      attributes: ["id", "name"],
    });

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Kanal bulunamadı.",
      });
    }

    const cached = channelTrendCache.get(channelId);

    if (
      cached &&
      cached.createdAt &&
      now.getTime() - cached.createdAt.getTime() < CHANNEL_TREND_CACHE_DURATION
    ) {
      return res.status(200).json({
        success: true,
        data: {
          fromCache: true,
          channelId,
          channelName: channel.name,
          from: cached.from,
          to: cached.to,
          summary: cached.summary,
          sampledMessageCount: cached.sampledMessageCount,
        },
      });
    }

    const last24Hours = new Date();
    last24Hours.setHours(now.getHours() - 24);

    const rows = await Message.findAll({
      attributes: ["content", "timestamp"],
      where: {
        channel_id: channelId,
        status: "active",
        timestamp: {
          [Op.gte]: last24Hours,
        },
        content: {
          [Op.ne]: "Mesaj kaldırıldı.",
        },
      },
      order: [["timestamp", "DESC"]],
      limit: 100,
    });

    console.log("========== KANAL 24 SAAT ÖZET DEBUG ==========");
console.log("Kanal ID:", channelId);
console.log("Kanal Adı:", channel.name);
console.log("Şu an:", now);
console.log("Son 24 saat başlangıcı:", last24Hours);
console.log("DB'den gelen satır sayısı:", rows.length);
console.log(
  "DB'den gelen mesajlar:",
  rows.map((row) => ({
    content: row.content,
    timestamp: row.timestamp,
  }))
);

    const messages = rows
      .map((row) => (row.content || "").trim().slice(0, 300))
      .filter(Boolean);
  
    if (messages.length === 0) {
      const emptySummary = {
        title: "Son 24 Saat Özeti",
        content: "Bu kanal için son 24 saat içinde analiz edilecek mesaj bulunamadı.",
        mentions: 0,
        hot: false,
      };

      return res.status(200).json({
        success: true,
        data: {
          fromCache: false,
          channelId,
          channelName: channel.name,
          from: last24Hours,
          to: now,
          summary: emptySummary,
          sampledMessageCount: 0,
        },
      });
    }

    const summary = await extractChannelDailySummary(messages);

    const safeSummary = summary || {
      title: "Son 24 Saat Özeti",
      content: "Bu kanal için son 24 saate ait özet şu anda alınamıyor.",
      mentions: 0,
      hot: false,
    };

    channelTrendCache.set(channelId, {
      createdAt: now,
      from: last24Hours,
      to: now,
      summary: safeSummary,
      sampledMessageCount: messages.length,
    });

    return res.status(200).json({
      success: true,
      data: {
        fromCache: false,
        channelId,
        channelName: channel.name,
        from: last24Hours,
        to: now,
        summary: safeSummary,
        sampledMessageCount: messages.length,
      },
    });
  } catch (error) {
    console.error("getChannelWeeklyTrends error:", error);

    return res.status(500).json({
      success: false,
      message: "Kanal trend analizi alınamadı.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
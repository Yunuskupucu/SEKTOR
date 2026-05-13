import Channel from "../models/channel.model.js";
import Message from "../models/message.model.js";
import { extractWeeklyTrends } from "../api/geminiModeration.js";
import { Op } from "sequelize";

/** Kanal için DB’deki açıklama ve toplam mesaj sayısı */
export const getChannelStats = async (req, res) => {
  const rawId = req.params.channel_id;
  const channelId = Number(rawId);

  if (!Number.isFinite(channelId)) {
    return res.status(400).json({ success: false, message: "Geçersiz kanal kimliği." });
  }

  try {
    const channel = await Channel.findByPk(channelId, {
      attributes: ["id", "name", "description"],
    });

    if (!channel) {
      return res.status(404).json({ success: false, message: "Kanal bulunamadı." });
    }

    const messageCount = await Message.count({ where: { channel_id: channelId } });

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
const CHANNEL_TREND_CACHE_DURATION = 24 * 60 * 60 * 1000; //24 saat az token harcasın diye

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

     const cached = channelTrendCache.get(channelId);

     if (
       cached &&
       now.getTime() - cached.createdAt.getTime() < CHANNEL_TREND_CACHE_DURATION
     ) {
       return res.status(200).json({
         success: true,
         data: {
           fromCache: true,
           channelId,
           trends: cached.trends,
           sampledMessageCount: cached.sampledMessageCount,
         },
       });
     }

    const channel = await Channel.findByPk(channelId, {
      attributes: ["id", "name"],
    });

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Kanal bulunamadı.",
      });
    }

const last24Hours = new Date();
last24Hours.setHours(now.getHours() - 24);

    const rows = await Message.findAll({
      attributes: ["content", "timestamp"],
      where: {
        channel_id: channelId,
        status: "active",
        timestamp: { [Op.gte]: last24Hours },
        content: { [Op.ne]: "Mesaj kaldırıldı." },
      },
      order: [["timestamp", "DESC"]],
      limit: 100,
    });

    const messages = rows
      .map((row) => (row.content || "").trim().slice(0, 300))
      .filter(Boolean);

    if (messages.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          fromCache: false,
          channelId,
          channelName: channel.name,
          trends: [],
          sampledMessageCount: 0,
          message: "Bu kanal için son 24 saat içinde analiz edilecek mesaj bulunamadı.",
        },
      });
    }

    const trends = await extractWeeklyTrends(messages);

    const safeTrends =
      trends && trends.length
        ? trends
        : [
            {
              topic: "Veri alınamadı",
              category: channel.name || "Genel",
              mentions: 0,
              growth: 0,
              summary: "Bu kanal için trend verisi şu anda alınamıyor.",
              hot: false,
            },
          ];

    channelTrendCache.set(channelId, {
      createdAt: now,
      trends: safeTrends,
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
        trends: safeTrends,
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
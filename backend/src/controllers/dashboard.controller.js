import { Op, fn, col } from "sequelize";
import { extractWeeklyTrends } from "../api/geminiModeration.js"; 
import User from "../models/user.model.js";
import Channel from "../models/channel.model.js";
import Message from "../models/message.model.js";
import JobPost from "../models/job_post.model.js";

let cachedTrends = null;
let cachedTrendsAt = null;
const TREND_CACHE_DURATION = 30 * 60 * 1000; // 30 dakika

export const getPublicGlobalStats = async (req, res) => {
  try {
    const now = new Date();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const [
      totalUsers,
      totalChannels,
      totalJobPosts,
      activeJobPosts,
      activeChannelsLast7Days,
    ] = await Promise.all([
      User.count(),
      Channel.count(),
      JobPost.count(),
      JobPost.count({
        where: {
          status: "active",
          [Op.or]: [
            { expires_at: null },
            { expires_at: { [Op.gte]: now } },
          ],
        },
      }),
      Message.count({
        distinct: true,
        col: "channel_id",
        where: {
          timestamp: { [Op.gte]: sevenDaysAgo },
        },
      }),
    ]);

    return res.json({
      success: true,
      data: {
        totalUsers,
        totalChannels,
        totalJobPosts,
        activeJobPosts,
        activeChannelsLast7Days,
      },
    });
  } catch (error) {
    console.error("getPublicGlobalStats error:", error);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası. Global istatistikler alınamadı.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getMessageGlobalStats = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const oneDayAgo = new Date();
    oneDayAgo.setDate(now.getDate() - 1);

    const [
      totalMessages,
      messagesLast7Days,
      messagesLast24Hours,
      removedMessagesLast7Days, // 
    ] = await Promise.all([
      Message.count(),

      Message.count({
        where: {
          timestamp: { [Op.gte]: sevenDaysAgo },
        },
      }),

      Message.count({
        where: {
          timestamp: { [Op.gte]: oneDayAgo },
        },
      }),

      // 🆕 Moderasyon nedeniyle kaldırılan mesajların sayısı
      Message.count({
        where: {
          status: "removed", 
          timestamp: { [Op.gte]: sevenDaysAgo },
        },
      }),
    ]);

    return res.json({
      success: true,
      data: {
        totalMessages,
        messagesLast7Days,
        messagesLast24Hours,
        removedMessagesLast7Days, 
      },
    });
  } catch (error) {
    console.error("getMessageGlobalStats error:", error);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası. Mesaj istatistikleri alınamadı.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}; 
// Kanal bazlı mesaj sayısı
export const getMessageStatsPerChannel = async (req, res) => {
  try {
    const messageCounts = await Message.findAll({
      attributes: [
        "channel_id",
        [fn("COUNT", col("id")), "messageCount"],
      ],
      group: ["channel_id"],
      order: [[fn("COUNT", col("id")), "DESC"]],
      raw: true,
    });

    const channelIds = messageCounts.map((item) => item.channel_id);

    const channels = await Channel.findAll({
      attributes: ["id", "name"],
      where: {
        id: channelIds,
      },
      raw: true,
    });

    const channelMap = new Map(
      channels.map((channel) => [channel.id, channel.name])
    );

    const messagesPerChannel = messageCounts.map((item) => ({
      channel_id: item.channel_id,
      channelName: channelMap.get(item.channel_id) || `Kanal ${item.channel_id}`,
      messageCount: Number(item.messageCount || 0),
    }));

    return res.json({
      success: true,
      data: {
        messagesPerChannel,
      },
    });
  } catch (error) {
    console.error("getMessageStatsPerChannel error:", error);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası. Kanal bazlı mesaj istatistikleri alınamadı.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
  // LLM ile haftalık trend konuları çıkarma
export const getWeeklyTrends = async (req, res) => {
  try {
    const now = new Date();

    if (
      cachedTrends &&
      cachedTrendsAt &&
      now.getTime() - cachedTrendsAt.getTime() < TREND_CACHE_DURATION
    ) {
      return res.json({
        success: true,
        data: {
          fromCache: true,
          trends: cachedTrends,
        },
      });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const rows = await Message.findAll({
      attributes: ["content"],
      where: {
        status: "active",
        timestamp: { [Op.gte]: sevenDaysAgo },
        content: { [Op.ne]: "Mesaj kaldırıldı." },
      },
      order: [["timestamp", "DESC"]],
      limit: 100,
    });

    const messages = rows
      .map((r) => (r.content || "").trim().slice(0, 300))
      .filter(Boolean)
      .slice(0, 100);

      console.log("weekly-trends endpoint çalıştı");
console.log("Gemini'ye gönderilen mesaj sayısı:", messages.length);
  

// Fallback 
const trends = await extractWeeklyTrends(messages);

console.log("🟢 TREND:", trends);

const safeTrends = trends && trends.length
  ? trends
  : [
      {
        topic: "Veri alınamadı",
        category: "Genel",
        mentions: 0,
        growth: 0,
        summary: "Trend verisi şu anda alınamıyor (API limiti dolmuş olabilir)",
        hot: false
      }
    ];

cachedTrends = safeTrends;
cachedTrendsAt = now;

return res.json({
  success: true,
  data: {
    from: sevenDaysAgo,
    to: now,
    fromCache: false,
    trends: safeTrends,
    sampledMessageCount: messages.length,
  },
});
  } catch (error) {
    console.error("getWeeklyTrends error:", error.message);
console.error("getWeeklyTrends error full:", error);

    return res.json({
      success: true,
      data: {
        fromCache: true,
        trends: cachedTrends || [
  {
    topic: "Veri alınamadı",
    category: "Genel",
    mentions: 0,
    growth: 0,
    summary: "Trend verisi şu anda alınamıyor.",
    hot: false
  }
],
        sampledMessageCount: 0,
      },
    });
  }
};

export const getWeeklyActivityStats = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const rows = await Message.findAll({
      attributes: [
        [fn("DATE", col("timestamp")), "date"],
        [fn("COUNT", col("Message.id")), "messageCount"],
        [fn("COUNT", fn("DISTINCT", col("user_id"))), "activeUsers"],
      ],
      where: {
        timestamp: { [Op.gte]: sevenDaysAgo },
      },
      group: [fn("DATE", col("timestamp"))],
      order: [[fn("DATE", col("timestamp")), "ASC"]],
      raw: true,
    });

    const weeklyActivity = rows.map((row) => ({
      name: row.date,
      messages: Number(row.messageCount || 0),
      users: Number(row.activeUsers || 0),
    }));

    return res.json({
      success: true,
      data: {
        weeklyActivity,
      },
    });
  } catch (error) {
    console.error("getWeeklyActivityStats error:", error);
    return res.status(500).json({
      success: false,
      message: "Haftalık aktivite alınamadı",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
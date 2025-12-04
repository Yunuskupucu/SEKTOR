import { Op, fn, col } from "sequelize";

import User from "../models/user.model.js";
import Channel from "../models/channel.model.js";
import Message from "../models/message.model.js";
import JobPost from "../models/job_post.model.js";

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
    ]);

    return res.json({
      success: true,
      data: {
        totalMessages,
        messagesLast7Days,
        messagesLast24Hours,
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
export const getMessageStatsPerChannel = async (req, res) => {
  try {
    const messagesPerChannel = await Message.findAll({
      attributes: [
        "channel_id",
        [fn("COUNT", col("id")), "messageCount"],
      ],
      group: ["channel_id"],
      order: [[fn("COUNT", col("id")), "DESC"]],
      raw: true,
    });

    return res.json({
      success: true,
      data: {
        messagesPerChannel, // [{ channel_id: 1, messageCount: '20' }, ...]
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
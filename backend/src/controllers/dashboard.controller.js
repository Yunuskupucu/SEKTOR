// controllers/dashboard.controller.js
import { Op } from "sequelize";

import User from "../models/user.model.js";
import Channel from "../models/channel.model.js";
import Message from "../models/message.model.js";
import JobPost from "../models/job_post.model.js";

export const getPublicGlobalStats = async (req, res) => {
  try {
    const now = new Date();

    // Son 7 gün için tarih
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const [
      totalUsers,
      totalChannels,
      activeChannelsLast7Days,
      totalJobPosts,
      activeJobPosts,
    ] = await Promise.all([
      
      User.count(),

      
      Channel.count(),

      // Son 7 günde mesaj gelen aktif kanal sayısı
      Message.count({
        distinct: true,
        col: "channel_id",
        where: {
          timestamp: {
            [Op.gte]: sevenDaysAgo,
          },
        },
      }),

     
      JobPost.count(),

      // aktif iş ilanı sayısı
     
      
      JobPost.count({
        where: {
          status: "active",
          [Op.or]: [
            { expires_at: null },
            { expires_at: { [Op.gte]: now } },
          ],
        },
      }),
    ]);

    return res.json({
      success: true,
      data: {
        totalUsers,
        totalChannels,
        activeChannelsLast7Days,
        totalJobPosts,
        activeJobPosts,
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

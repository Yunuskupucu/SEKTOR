import sequelize from "../lib/db.js";
import { getOrCreateJobChannelId } from "../lib/jobChannel.js";
import JobPost from "../models/job_post.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Channel from "../models/channel.model.js";

export const createJobPostInChannel = async (req, res) => {
  const user_id = req.user?.id || req.body.user_id;
  const { title, description, salary, location, contact, expires_at } = req.body;
  const jobChannelId = await getOrCreateJobChannelId();

  try {
    const [user, channel] = await Promise.all([
      User.findByPk(user_id),
      Channel.findByPk(jobChannelId),
    ]);
    if (!user || !channel) return res.status(404).json({ message: "User or Channel not found" });

    const result = await sequelize.transaction(async (t) => {
      const job = await JobPost.create(
        {
          user_id,
          channel_id: jobChannelId,
          title, description, salary, location, contact,
          expires_at: expires_at ?? null,
          status: "active",
          visibility: "public",
        },
        { transaction: t }
      );

      const msg = await Message.create(
        {
          user_id,
          channel_id: jobChannelId,
          type: "job_post",
          job_post_id: job.id,
          content: "JOB_POST_CREATED",
        },
        { transaction: t }
      );

      return { job, msg };
    });

    const io = req.app.get("io");
    io.to(String(jobChannelId)).emit("newMessage", {
      id: result.msg.id,
      type: "job_post",
      job_post_id: result.job.id,
      channel_id: jobChannelId,
      timestamp: result.msg.timestamp,
    });

    res.status(201).json({ job: result.job, message: result.msg });
  } catch (err) {
    console.error("❌ createJobPostInChannel:", err);
    res.status(500).json({ message: "Error creating job post", error: err.message });
  }
};

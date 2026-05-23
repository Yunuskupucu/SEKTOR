import sequelize from '../lib/db.js';
import { Op } from 'sequelize';
import { getOrCreateJobChannelId } from '../lib/jobChannel.js';
import JobPost from '../models/job_post.model.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import Channel from '../models/channel.model.js';

export const createJobPostInChannel = async (req, res) => {
  const user_id = req.user?.id;
  if (!user_id) {
    return res.status(401).json({ message: 'Yetkisiz erişim' });
  }
  const { title, description, salary, location, contact, expires_at } = req.body;
  const jobChannelId = await getOrCreateJobChannelId();

  try {
    const [user, channel] = await Promise.all([
      User.findByPk(user_id),
      Channel.findByPk(jobChannelId),
    ]);
    if (!user || !channel) return res.status(404).json({ message: 'User or Channel not found' });

    const result = await sequelize.transaction(async (t) => {
      const job = await JobPost.create(
        {
          user_id,
          channel_id: jobChannelId,
          title,
          description,
          salary,
          location,
          contact,
          expires_at: expires_at ?? null,
          status: 'active',
          visibility: 'public',
        },
        { transaction: t }
      );

      const msg = await Message.create(
        {
          user_id,
          channel_id: jobChannelId,
          type: 'job_post',
          job_post_id: job.id,
          content: 'JOB_POST_CREATED',
        },
        { transaction: t }
      );

      return { job, msg };
    });

    const io = req.app.get('io');
    io.to(String(jobChannelId)).emit('newMessage', {
      id: result.msg.id,
      type: 'job_post',
      job_post_id: result.job.id,
      channel_id: jobChannelId,
      timestamp: result.msg.timestamp,
    });

    res.status(201).json({ job: result.job, message: result.msg });
  } catch (err) {
    console.error('❌ createJobPostInChannel:', err);
    res.status(500).json({ message: 'Error creating job post', error: err.message });
  }
};

export const getJobPostsForJobChannel = async (req, res) => {
  try {
    const jobChannelId = await getOrCreateJobChannelId();

    const now = new Date();
    const viewerId = req.user?.id;

    const visibleToEveryone = {
      channel_id: jobChannelId,
      status: 'active',
      [Op.or]: [{ expires_at: null }, { expires_at: { [Op.gte]: now } }],
    };

    const whereOr = [visibleToEveryone];
    if (viewerId != null) {
      whereOr.push({
        channel_id: jobChannelId,
        user_id: viewerId,
        status: 'expired',
      });
    }

    const jobs = await JobPost.findAll({
      where: { [Op.or]: whereOr },
      include: [
        {
          model: User,
          attributes: ['id', 'fullname', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    const sorted = [...jobs].sort((a, b) => {
      const aPassive = a.status === 'expired' ? 1 : 0;
      const bPassive = b.status === 'expired' ? 1 : 0;
      if (aPassive !== bPassive) return aPassive - bPassive;
      return new Date(b.created_at) - new Date(a.created_at);
    });

    res.json(sorted);
  } catch (err) {
    console.error('❌ getJobPostsForJobChannel:', err);
    res.status(500).json({ message: 'Error fetching job posts', error: err.message });
  }
};

export const updateJobPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const {
      title,
      description,
      salary,
      location,
      contact,
      expires_at,
      visibility,
      status,
    } = req.body;

    const jobPost = await JobPost.findByPk(id);

    if (!jobPost) {
      return res.status(404).json({
        success: false,
        message: "İş ilanı bulunamadı.",
      });
    }

    if (jobPost.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Bu iş ilanını düzenleme yetkiniz yok.",
      });
    }

    await jobPost.update({
      title: title ?? jobPost.title,
      description: description ?? jobPost.description,
      salary: salary ?? jobPost.salary,
      location: location ?? jobPost.location,
      contact: contact ?? jobPost.contact,
      expires_at: expires_at ?? jobPost.expires_at,
      visibility: visibility ?? jobPost.visibility,
      status: status ?? jobPost.status,
    });

    return res.json({
      success: true,
      message: "İş ilanı güncellendi.",
      data: jobPost,
    });
  } catch (error) {
    console.error("updateJobPost error:", error);
    return res.status(500).json({
      success: false,
      message: "İş ilanı güncellenirken hata oluştu.",
    });
  }
};

export const passiveJobPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const jobPost = await JobPost.findByPk(id);

    if (!jobPost) {
      return res.status(404).json({
        success: false,
        message: "İş ilanı bulunamadı.",
      });
    }

    if (jobPost.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Bu iş ilanını pasif hale getirme yetkiniz yok.",
      });
    }


    await jobPost.update({
      status: "passive",
    });

    return res.json({
      success: true,
      message: "İş ilanı pasif hale getirildi.",
      data: jobPost,
    });
  } catch (error) {
    console.error("passiveJobPost error:", error);
    return res.status(500).json({
      success: false,
      message: "İş ilanı pasif hale getirilirken hata oluştu.",
    });
  }
};

export const deleteJobPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const jobPost = await JobPost.findByPk(id);

    if (!jobPost) {
      return res.status(404).json({
        success: false,
        message: "İş ilanı bulunamadı.",
      });
    }

    if (jobPost.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Bu iş ilanını silme yetkiniz yok.",
      });
    }

    await jobPost.destroy();

    return res.json({
      success: true,
      message: "İş ilanı silindi.",
    });
  } catch (error) {
    console.error("deleteJobPost error:", error);
    return res.status(500).json({
      success: false,
      message: "İş ilanı silinirken hata oluştu.",
    });
  }
};

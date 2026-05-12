import Channel from "../models/channel.model.js";
import Message from "../models/message.model.js";

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

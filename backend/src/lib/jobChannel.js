// /lib/jobChannel.js
import { Op } from "sequelize";
import Channel from "../models/channel.model.js";
// endpoint POST /api/jobs/job-posts
let cachedJobChannel = null;

export async function getOrCreateJobChannelId() {
  if (cachedJobChannel?.id) return cachedJobChannel.id;

  // Kanalı büyük/küçük harf duyarsız bul
  let channel = await Channel.findOne({
    where: { name: { [Op.iLike]: "İş İlanları" } },
  });

  // Yoksa oluştur
  if (!channel) {
    channel = await Channel.create({
      name: "İş İlanları",
      description: "Yazılım ile ilgili iş ilanları kanalı",
    });
    console.log("🆕 'İş İlanları' kanalı oluşturuldu:", channel.id);
  }

  cachedJobChannel = { id: channel.id, name: channel.name };
  return channel.id;
}

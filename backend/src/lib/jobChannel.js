
import { Op } from "sequelize";
import Channel from "../models/channel.model.js";

let cachedJobChannel = null;

export async function getOrCreateJobChannelId() {
  if (cachedJobChannel?.id) return cachedJobChannel.id;

  let channel = await Channel.findOne({
    where: { name: { [Op.iLike]: "İş İlanları" } },
  });


  if (!channel) {
    channel = await Channel.create({
      name: "İş İlanları",
      description: "Yazılım ile ilgili iş ilanları kanalı",
    });

  }

  cachedJobChannel = { id: channel.id, name: channel.name };
  return channel.id;
}

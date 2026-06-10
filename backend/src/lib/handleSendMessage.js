
import { checkContentModeration } from "../api/geminiModeration.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import FilterLog from "../models/filter_log.model.js";
console.log(" ÇALIŞAN DOSYA: handleSendMessage.js");

export const handleSendMessage = async ({ user_id, channel_id, content }) => {

  const result = await checkContentModeration(content);
  console.log("[handleSendMessage] Moderasyon sonucu:", result);

  const isRemoved = result === "0"; 

  const moderatedContent = isRemoved ? "Mesaj kaldırıldı." : content;



  const newMessage = await Message.create({
    user_id,
    channel_id,
    content: moderatedContent,
    status: isRemoved ? "removed" : "active",
    removal_reason: isRemoved ? "moderation" : null,
  });
if (isRemoved) {
  try {
    const log = await FilterLog.create({
      message_id: newMessage.id,
      user_id,
      flagged_reason: "AI moderasyon: uygunsuz içerik",
    });

    console.log("FILTER LOG KAYDEDİLDİ:", log.toJSON());
  } catch (err) {
    console.error("FILTER LOG HATASI:", err);
  }
}
  const fullMessage = await Message.findByPk(newMessage.id, {
    include: [{ model: User, attributes: ["fullname"] }],
  });

  return fullMessage;
};

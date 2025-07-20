// lib/handleMessage.js
import { checkContentModeration } from "../api/geminiModeration.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const handleSendMessage = async ({ user_id, channel_id, content }) => {
  console.log("🟡 [handleSendMessage] Moderasyon kontrolü başlıyor...");
  const result = await checkContentModeration(content);
  console.log("📩 [handleSendMessage] Moderasyon sonucu:", result);

  const moderatedContent = result.includes("0") ? "Mesaj kaldırıldı." : content;
  console.log("✏️ [handleSendMessage] Kaydedilecek içerik:", moderatedContent);

  const newMessage = await Message.create({ user_id, channel_id, content: moderatedContent });
  const fullMessage = await Message.findByPk(newMessage.id, {
    include: [{ model: User, attributes: ["fullname"] }],
  });

  return fullMessage;
};

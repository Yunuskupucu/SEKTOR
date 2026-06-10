import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import { geminiChat } from '../api/geminiChat.js';

/**
 * Kanal geçmişini çekip Gemini'ye gönderir, yanıtı "AI Bot" kullanıcısı
 * olarak kaydeder ve socket üzerinden emit eder.
 *
 * @param {object} opts
 * @param {number|string} opts.channel_id   - Tetiklendiği kanal
 * @param {string}        opts.question     - @ai'ye gönderilen ham mesaj
 * @param {object}        opts.io           - Socket.IO server instance
 * @param {object}        opts.req          - Express req (attachment_url üretimi için)
 * @param {number}        [opts.historySize=10] - Bağlam için kaç mesaj alınsın
 */
export const handleAiReply = async ({
  channel_id,
  question,
  io,
  req,
  historySize = 10,
}) => {
  // bot user
  const [aiUser] = await User.findOrCreate({
    where: { email: 'ai-bot@sektor.internal' },
    defaults: {
      fullname: 'Sektör AI',
      email: 'ai-bot@sektor.internal',
      password: Math.random().toString(36), 
      
    },
  });


  const recentRows = await Message.findAll({
    where: { channel_id, status: 'active' },
    include: [{ model: User, attributes: ['fullname'] }],
    order: [['timestamp', 'DESC'], ['id', 'DESC']],
    limit: historySize,
  });


  const history = recentRows
    .reverse()
    .filter((m) => m.user_id !== aiUser.id)   
    .map((m) => ({
      sender: m.User?.fullname ?? 'Anonim',
      content: m.content,
    }));

  //  @ai etiketini sorudan çıkar 
  const cleanQuestion = question.replace(/@ai\b/gi, '').trim();


  console.log(` [handleAiReply] Gemini'ye gönderiliyor | channel=${channel_id} | soru="${cleanQuestion}"`);
  const aiText = await geminiChat(cleanQuestion, history);
  console.log(` [handleAiReply] Gemini yanıtı alındı (${aiText.length} karakter)`);


  const newMsg = await Message.create({
    user_id: aiUser.id,
    channel_id,
    content: aiText,
    status: 'active',
  });

  const fullMessage = await Message.findByPk(newMsg.id, {
    include: [{ model: User, attributes: ['id', 'fullname'] }],
  });


  const payload = withAttachmentUrl(req, fullMessage);


  io.to(String(channel_id)).emit('newMessage', payload);

  return payload;
};

const withAttachmentUrl = (req, msg) => {
  const j = typeof msg.toJSON === 'function' ? msg.toJSON() : msg;
  const a = j.attachment;
  if (!a) return { ...j, attachment_url: null };   
  if (/^https?:\/\//i.test(a)) return { ...j, attachment_url: a };
  if (req && a.startsWith('/')) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return { ...j, attachment_url: `${baseUrl}${a}` };
  }
  return { ...j, attachment_url: null };
};
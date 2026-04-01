// lib/handleAiReply.js
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
  // ── 1. Bot kullanıcısını bul ya da oluştur ──────────────────────────────
  const [aiUser] = await User.findOrCreate({
    where: { email: 'ai-bot@sektor.internal' },
    defaults: {
      fullname: 'Sektör AI',
      email: 'ai-bot@sektor.internal',
      password: Math.random().toString(36), // giriş yapılamaz, rastgele
                              // User modelinde role alanı varsa
    },
  });

  // ── 2. Son N mesajı bağlam için çek ────────────────────────────────────
  const recentRows = await Message.findAll({
    where: { channel_id, status: 'active' },
    include: [{ model: User, attributes: ['fullname'] }],
    order: [['timestamp', 'DESC'], ['id', 'DESC']],
    limit: historySize,
  });

  // Eski → yeni sıraya çevir ve bot mesajlarını filtrele
  const history = recentRows
    .reverse()
    .filter((m) => m.user_id !== aiUser.id)   // botun kendi eski mesajlarını bağlama ekleme
    .map((m) => ({
      sender: m.User?.fullname ?? 'Anonim',
      content: m.content,
    }));

  // ── 3. @ai etiketini sorudan çıkar ─────────────────────────────────────
  const cleanQuestion = question.replace(/@ai\b/gi, '').trim();

  // ── 4. Gemini'den yanıt al ──────────────────────────────────────────────
  console.log(`🤖 [handleAiReply] Gemini'ye gönderiliyor | channel=${channel_id} | soru="${cleanQuestion}"`);
  const aiText = await geminiChat(cleanQuestion, history);
  console.log(`✅ [handleAiReply] Gemini yanıtı alındı (${aiText.length} karakter)`);

  // ── 5. Yanıtı DB'ye kaydet ──────────────────────────────────────────────
  const newMsg = await Message.create({
    user_id: aiUser.id,
    channel_id,
    content: aiText,
    status: 'active',
  });

  const fullMessage = await Message.findByPk(newMsg.id, {
    include: [{ model: User, attributes: ['id', 'fullname'] }],
  });

  // ── 6. attachment_url üretici (mevcut yardımcı ile aynı mantık) ─────────
  const payload = withAttachmentUrl(req, fullMessage);

  // ── 7. Socket emit ──────────────────────────────────────────────────────
  io.to(String(channel_id)).emit('newMessage', payload);

  return payload;
};

// ── Yerel yardımcı (message.controller ile aynı) ────────────────────────────
const withAttachmentUrl = (req, msg) => {
  const j = typeof msg.toJSON === 'function' ? msg.toJSON() : msg;
  const a = j.attachment;
  if (!a) return { ...j, attachment_url: null };                        // ← null guard
  if (/^https?:\/\//i.test(a)) return { ...j, attachment_url: a };
  if (req && a.startsWith('/')) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return { ...j, attachment_url: `${baseUrl}${a}` };
  }
  return { ...j, attachment_url: null };
};
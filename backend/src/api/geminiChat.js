
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

/**
 * Kanal sohbet geçmişine bakarak @ai sorusuna cevap üretir.
 *
 * @param {string} question      - Kullanıcının @ai'ye yönelttiği soru/istek
 * @param {Array}  history       - Son mesajlar: [{ sender: string, content: string }]
 * @returns {Promise<string>}    - Gemini'nin ürettiği metin yanıtı
 */
export const geminiChat = async (question, history = []) => {
  // Geçmişi okunabilir bir bağlam metnine çevir
  const contextBlock =
    history.length > 0
      ? history
          .map((m) => `${m.sender}: ${m.content}`)
          .join('\n')
      : '(Henüz mesaj geçmişi yok)';

  const prompt = `
Sen "Sektör" adlı profesyonel bir iş/kariyer platformunun yardımcı yapay zeka asistanısın.
Kullanıcılar sana kanal sohbetleri içinde "@ai" etiketiyle soru sorabilir.

KANAL GEÇMİŞİ (son mesajlar, kronolojik sırayla):
${contextBlock}

KULLANICININ SORUSU:
${question}

TALİMATLAR:
- Türkçe yanıt ver.
- Yanıtın kısa, net ve profesyonel olsun.
- Sohbet bağlamını dikkate al; gerektiğinde önceki mesajlara atıfta bulun.
- Emoji kullanma, resmi bir dil benimse.
- Yalnızca yanıtı yaz; "Merhaba, ben bir yapay zekayım" gibi giriş cümleleri ekleme.
  `.trim();

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('❌ geminiChat hata:', error.message);
    return 'Şu anda yanıt üretemiyorum, lütfen daha sonra tekrar deneyin.';
  }
};

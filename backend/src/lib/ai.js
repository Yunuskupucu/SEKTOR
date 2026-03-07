import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

/**
 * AI'dan private cevap üretir
 * @param {Object} params
 * @param {string} params.userMessage
 */
export const getAIResponse = async ({ userMessage }) => {
  const prompt = `
Sen SEKTÖR platformunda yazılım asistanısın.
Kullanıcının mesajına Türkçe, kısa ve net bir cevap ver.
- Eğer mesaj bir soru değilse, ne istediğini anlayıp açıklayıcı bir cevap üret.
- Asla kullanıcıya soru tekrar etme.
- 2-6 cümle arası yaz.
Kullanıcı mesajı:
"${userMessage}"
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("❌ AI error:", error);
    return "Şu anda yanıt veremiyorum, lütfen tekrar dene.";
  }
};

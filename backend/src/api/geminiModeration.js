// backend/api/geminiModeration.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Önerilen ücretsiz model (sen ücretli kullanıyorsan değiştirebilirsin)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const checkContentModeration = async (post) => {
  const prompt = `
Bir sosyal medya moderatörüsün. Gönderi içeriklerini değerlendiriyorsun. Aşağıdaki kurallara uymayan içerikleri tespit et:

- Küfür, argo, hakaret, cinsellik
- Nefret söylemi, şiddet, spam
- Türkçe yaygın argo örnekleri: amk, aq, oç, orospu, mal, aptal, salak, siktir, vb.

Eğer gönderi uygunsa sadece "1" yaz.
Eğer gönderi uygunsuzsa sadece "0" yaz.

Gönderi: "${post}"
YANIT:
`;

  try {
    console.log("🟡 Moderasyon isteği gönderiliyor...");

    const result = await model.generateContent(prompt);
    const output = await result.response.text();
    const cleaned = output.trim();

    console.log("🟢 Gemini yanıtı:", JSON.stringify(cleaned));

    // Detaylı karar mekanizması
    if (cleaned.includes("0")) {
      console.log("🚫 Uygunsuz içerik algılandı.");
      return "0";
    } else if (cleaned.includes("1")) {
      console.log("✅ İçerik uygun.");
      return "1";
    } else {
      console.warn("⚠️ Belirsiz cevap alındı, varsayılan olarak uygun kabul edildi.");
      return "1";
    }
  } catch (error) {
    console.error("❌ Gemini API Hatası:", error.message);
    return "1"; // Hata varsa içeriği engelleme
  }
};

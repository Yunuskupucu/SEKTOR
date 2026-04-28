import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/** * Moderasyon ve trend analizi için en ideal ücretsiz model.
 * Ücretsiz Katman: Günlük 1.000 istek, Dakikada 15 istek.
 */
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

export const checkContentModeration = async (post) => {
  // Prompt'u daha kesin sonuç verecek şekilde optimize ettik.
  const prompt = `
  Sen gelişmiş bir Yapay Zeka içerik moderatörüsün. Görevin, metnin sadece kelimelerine değil, "bağlamına" ve "niyetine" bakarak karar vermektir.

  ANALİZ KRİTERLERİ:
  - Kelime tek başına argo olabilir ancak bilimsel, ticari veya teknik bir bağlamda kullanılmışsa (Örn: "Mal sevkiyatı", "Hayvanın dışkısı") TEMİZ kabul et.
  - Eğer kelime doğrudan bir şahsa, gruba veya inanca yönelik saldırı, aşağılama veya taciz amacı taşıyorsa ZARARLI kabul et.
  - Sarkazm (alaycılık) yoluyla yapılan hakaretleri tespit et.

  YANIT FORMATI:
  - İçerik topluluk kurallarına uygun ve zararsızsa (bağlamsal olarak temizse): "1"
  - İçerik hakaret, nefret söylemi veya kötü niyetli argo içeriyorsa: "0"
  
  Metin: "${post}"
  YANIT:
`;

  try {
    console.log('🟡 Moderasyon analizi yapılıyor...');

    const result = await model.generateContent(prompt);
    const output = result.response.text().trim();

    console.log('🟢 Model Yanıtı:', output);

    // Sadece "0" içerip içermediğini kontrol etmek daha güvenlidir.
    return output.includes('0') ? '0' : '1';
  } catch (error) {
    console.error('❌ Gemini API Hatası:', error.message);
    // Hata durumunda (örneğin limit aşımı) mesajı onaylamak güvenli bir varsayılandır.
    return '1';
  }
};

/**
 * Haftalık trend konuları
 */
export const extractWeeklyTrends = async (messages) => {
  const combinedText = messages.join('\n');

  const prompt = `
  Sen bir yazılım ekosistemi veri analistisin. Aşağıdaki mesajları inceleyerek son 7 günün en önemli 5 teknik trendini çıkar.

  ANALİZ KURALLARI:
  1. TEKNİK ODAK: Sadece yazılım dilleri, frameworkler (React, NestJS), araçlar (Docker) veya mimariler (Microservices) hakkında konuşulanları al.
  2. KONSOLİDASYON: Benzer teknik sorunları veya kütüphaneleri tek bir güçlü başlıkta birleştir.
  3. GÜRÜLTÜ AYIKLAMA: "Günaydın", "Teşekkürler" gibi teknik olmayan mesajları tamamen yoksay.

  JSON ŞEMASI:
  {
    "topics": [
      {
        "title": "Kısa teknik başlık (Örn: React 19 Transition Hooks)",
        "category": "Frontend | Backend | Mobile | DevOps | AI | Genel",
        "keywords": ["anahtar_kelime1", "anahtar_kelime2"],
        "sentiment": "positive | neutral | frustrating"
      }
    ]
  }

  MESAJLAR:
  ${combinedText}
`;
  try {
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('❌ Trend Analiz Hatası:', error.message);
    return { topics: [] };
  }
};

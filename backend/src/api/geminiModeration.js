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
    Sen bir içerik moderatörüsün. Aşağıdaki metni küfür, ağır argo, hakaret ve nefret söylemi açısından incele.
    
    KURALLAR:
    1. İçerik temiz ve topluluk kurallarına uygunsa sadece "1" yanıtını ver.
    2. İçerik argo, küfür veya hakaret içeriyorsa sadece "0" yanıtını ver.
    3. Başka hiçbir açıklama yapma.

    İncelenecek Metin: "${post}"
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
Aşağıdaki mesajları analiz et ve son 7 günün en çok konuşulan 5 ana konusunu çıkar.

KURALLAR:
- Sadece JSON döndür. Başka hiçbir şey yazma.
- "title" 2-5 kelime olsun.
- Benzer konuları birleştir.
- Küfür/argo içeren veya "Mesaj kaldırıldı." olan içerikleri konu olarak sayma.
- Kişi isimlerini konu yapma.

ÇIKTI FORMATI:
{
  "topics": [
    { "title": "...", "keywords": ["...","...","..."] },
    { "title": "...", "keywords": ["...","...","..."] },
    { "title": "...", "keywords": ["...","...","..."] },
    { "title": "...", "keywords": ["...","...","..."] },
    { "title": "...", "keywords": ["...","...","..."] }
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

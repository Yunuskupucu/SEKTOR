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
Sen gelişmiş bir Yapay Zeka içerik moderatörüsün.

Görevin, mesajın bağlamını ve niyetini analiz ederek zararlı olup olmadığına karar vermektir.

ZARARLI KABUL ET:
- Doğrudan hakaret, aşağılama veya küçük düşürme
- Cinsel içerikli küfürler
- Aile bireylerine yönelik küfürler
- Irk, din, cinsiyet, millet veya gruba yönelik saldırılar
- Tehdit, taciz veya hedef gösterme
- Sansürlenmiş, harfleri değiştirilmiş veya noktalama ile gizlenmiş küfürler
- Kısaltılmış argo/küfür ifadeleri
- Sarkazm yoluyla yapılan hakaretler

TEMİZ KABUL ET:
- Teknik, bilimsel veya ticari bağlamdaki kelimeler
- Küfür içermeyen olumsuz eleştiriler
- Bir kişiye yöneltilmeyen teknik değerlendirmeler

ÖNEMLİ:
Bir kelime ticari, teknik veya bilimsel bağlamda kullanılıyorsa temiz kabul et.
Ancak mesaj doğrudan bir kişiye, gruba veya kullanıcıya saldırıyorsa zararlı kabul et.

Sadece tek karakter döndür:
1 = temiz
0 = zararlı

Metin:
"${post}"

YANIT:
`;

  try {
    console.log('🟡 Moderasyon analizi yapılıyor...');

    const result = await model.generateContent({
  contents: [
    {
      role: 'user',
      parts: [{ text: prompt }]
    }
  ],
  generationConfig: {
    temperature: 0,
    maxOutputTokens: 5
  }
});
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

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
export const extractWeeklyTrends = async (messages = []) => {
  if (!messages.length) {
    return [];
  }

  const combinedText = messages.join('\n');

  const prompt = `
Sen bir yazılım ekosistemi veri analistisin. Aşağıdaki mesajları inceleyerek son 7 günün en önemli 5 teknik trendini çıkar.

SADECE geçerli JSON array döndür.
Markdown kullanma.
Açıklama yazma.
Kod bloğu kullanma.
JSON dışında hiçbir metin yazma.

JSON formatı birebir şöyle olmalı:
[
  {
    "topic": "Kısa teknik başlık",
    "category": "Frontend",
    "mentions": 0,
    "growth": 0,
    "summary": "Kısa özet",
    "hot": false
  }
]

Kurallar:
- Sadece teknik konuları al.
- Günaydın, teşekkürler, selam gibi teknik olmayan mesajları yoksay.
- category sadece şu değerlerden biri olsun: Frontend, Backend, Mobile, DevOps, AI.
- mentions sayısal değer olsun.
- growth 0 ile 100 arasında sayısal değer olsun.
- hot boolean olsun.

MESAJLAR:
${combinedText}
`;

  try {
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    const cleaned = raw
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const jsonStart = cleaned.indexOf('[');
    const jsonEnd = cleaned.lastIndexOf(']');

    if (jsonStart === -1 || jsonEnd === -1) {
      console.error('❌ Gemini JSON array döndürmedi:', cleaned);
      return [];
    }

    const jsonText = cleaned.slice(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonText);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    console.error('❌ Trend Analiz Hatası:', error.message);
    return [];
  }
};
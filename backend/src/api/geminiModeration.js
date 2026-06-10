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
    console.log(' Moderasyon analizi yapılıyor...');

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

    console.log(' Model Yanıtı:', output);

    // Sadece "0" içerip içermediğini kontrol etmek daha güvenlidir.
    return output.includes('0') ? '0' : '1';
  } catch (error) {
    console.error(' Gemini API Hatası:', error.message);
    // Hata durumunda (örneğin limit aşımı) mesajı onaylamak güvenli bir varsayılandır.
    return '1';
  }
};

/**
 * Son 100 mesajdan kanal bazlı trend konuları çıkarır.
 */
export const extractWeeklyTrends = async (messages = []) => {
  if (!messages.length) {
    return [];
  }

  const combinedText = messages
    .map((message, index) => {
      const channelName = message.channelName || "Bilinmeyen Kanal";
      const content = message.content || "";

      return `${index + 1}. Kanal: ${channelName}\nMesaj: ${content}`;
    })
    .join("\n\n");

  const prompt = `
Sen bir yazılım ekosistemi veri analistisin.

Aşağıdaki mesajlar platformdaki son 100 aktif mesajdan oluşmaktadır.
Görevin, en çok konuşulan teknik konuları kanal bazlı analiz etmektir.

SADECE geçerli JSON array döndür.
Markdown kullanma.
Açıklama yazma.
Kod bloğu kullanma.
JSON dışında hiçbir metin yazma.

JSON formatı birebir şöyle olmalı:
[
  {
    "title": "Kanal adı",
    "content": "Bu kanalda öne çıkan teknik konuların kısa özeti.",
    "mentions": 0,
    "hot": false
  }
]

Kurallar:
- title alanına mutlaka kanal adını yaz.
- content alanında o kanalda en çok konuşulan teknik konuları kısa ve anlaşılır şekilde özetle.
- Günaydın, teşekkürler, selam gibi teknik olmayan mesajları yoksay.
- Aynı kanal için mümkünse tek sonuç üret.
- En fazla 5 kanal/trend döndür.
- mentions sayısal değer olsun.
- hot boolean olsun.
- content alanı 1 cümlelik kısa açıklama olsun.
- Kanalda yeterli teknik içerik yoksa o kanalı listeleme.

MESAJLAR:
${combinedText}
`;

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 700,
      },
    });

    const raw = result.response.text().trim();

    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const jsonStart = cleaned.indexOf("[");
    const jsonEnd = cleaned.lastIndexOf("]");

    if (jsonStart === -1 || jsonEnd === -1) {
      console.error(" Gemini JSON array döndürmedi:", cleaned);
      return [];
    }

    const jsonText = cleaned.slice(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonText);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((item) => ({
    title: item.title || "Genel",
    content: item.content || "Bu kanalda öne çıkan teknik konular analiz edildi.",
    hot: Boolean(item.hot),
  }));

  } catch (error) {
    console.error(" Trend Analiz Hatası:", error.message);
    return [];
  }
};



// 24 saatte konuşulan konular
export const extractChannelDailySummary = async (messages = []) => {
  if (!messages.length) {
    return {
      title: "Son 24 Saat Özeti",
      items: [
        "Bu kanalda son 24 saat içinde analiz edilebilecek mesaj bulunamadı.",
      ],
      mentions: 0,
      hot: false,
    };
  }

  const combinedText = messages
    .map((message, index) => `${index + 1}. ${message}`)
    .join("\n");

  const prompt = `
Sen bir yazılım topluluğu veri analistisin.

Aşağıdaki mesajlar belirli bir kanal içinde son 24 saatte yazılmıştır.
Görevin bu mesajlara göre kanalda son 24 saatte ne konuşulduğunu kısa ve anlaşılır maddeler halinde özetlemektir.

SADECE geçerli JSON object döndür.
Markdown kullanma.
Açıklama yazma.
Kod bloğu kullanma.
JSON dışında hiçbir metin yazma.

JSON formatı birebir şöyle olmalı:
{
  "title": "Son 24 Saat Özeti",
  "items": [
    "İlk özet maddesi.",
    "İkinci özet maddesi.",
    "Üçüncü özet maddesi."
  ],
  "mentions": 0,
  "hot": false
}

Kurallar:
- Kanal adı yazma.
- title alanı "Son 24 Saat Özeti" olsun.
- content alanı kullanma, özetleri sadece items array içinde döndür.
- items alanı 2-4 maddelik kısa bir liste olsun.
- Her madde tek cümle olsun.
- Her madde teknik olarak anlamlı ve sade olsun.
- Günaydın, teşekkürler, selam gibi teknik olmayan mesajları yoksay.
- İçerik azsa items içine 1 açıklayıcı madde yaz.
- mentions mesaj sayısına yakın sayısal değer olsun.
- hot boolean olsun.

MESAJLAR:
${combinedText}
`;

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 500,
      },
    });

    const raw = result.response.text().trim();

    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const jsonStart = cleaned.indexOf("{");
    const jsonEnd = cleaned.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      console.error(" Gemini JSON object döndürmedi:", cleaned);

      return {
        title: "Son 24 Saat Özeti",
        items: ["Bu kanal için son 24 saat özeti şu anda oluşturulamadı."],
        mentions: messages.length,
        hot: false,
      };
    }

    const jsonText = cleaned.slice(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonText);

    const items = Array.isArray(parsed.items)
      ? parsed.items
          .map((item) => String(item || "").trim())
          .filter(Boolean)
      : parsed.content
        ? [String(parsed.content).trim()]
        : parsed.summary
          ? [String(parsed.summary).trim()]
          : ["Bu kanalda son 24 saate ait özet oluşturuldu."];

    return {
      title: parsed.title || "Son 24 Saat Özeti",
      items,
      mentions: Number(parsed.mentions || messages.length || 0),
      hot: Boolean(parsed.hot),
    };
  } catch (error) {
    console.error(" Kanal 24 saat özet hatası:", error.message);

    return {
      title: "Son 24 Saat Özeti",
      items: ["Bu kanal için son 24 saat özeti şu anda alınamıyor."],
      mentions: messages.length,
      hot: false,
    };
  }
};
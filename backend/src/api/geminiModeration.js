// backend/api/geminiModeration.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // .env

const model = genAI.getGenerativeModel({ model: "modeli yazıcaz" }); //modeli yazıcaz  .ENV YE api yazılacak
yazıcaz
export const checkContentModeration = async (post) => {
  const prompt = `
Bir sosyal medya moderatörüsün. Gönderi içeriklerini değerlendiriyorsun. Aşağıdaki kurallara uymayan içerikleri tespit et:

- Küfür, argo, hakaret, cinsellik
- Nefret söylemi, şiddet, spam
- Türkçe yaygın argo örnekleri: amk, aq, oç, orospu, mal, aptal, salak, siktir, vb.

Eğer gönderi uygunsa sadece "1" yaz.
Eğer gönderi uygunsuzsa sadece "0" yaz.

Gönderi: "${post}"
`;

  const result = await model.generateContent(prompt);
  const output = await result.response.text();
  return output.trim(); // "0" veya "1"
};

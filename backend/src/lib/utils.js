// ? mevcut kod bloğunu yeniden kullanabileceğimiz genel amaçlı bir yardımcı sınıf
import jwt from 'jsonwebtoken';
export const generateToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d', // 7 gün geçerli token
  });
  // Cookie'ye token'ı yazma
  res.cookie('jwt', token, {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 gün
    httpOnly: true, //Cookie, sadece HTTP istekleriyle erişilebilir, JavaScript ile erişilemez.
    sameSite: 'strict', // Cookie, sadece HTTPS üzerinden gönderilir (geliştirme ortamı dışında)
    secure: process.env.NODE_ENV !== 'development',
  });

  return token;
};
// ? mevcut kod bloğunu yeniden kullanabileceğimiz genel amaçlı bir yardımcı sınıf

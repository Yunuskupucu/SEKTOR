// utils/generateToken.js
import jwt from 'jsonwebtoken';

export const generateToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  const isProd = process.env.NODE_ENV === 'production';

  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',                         // ← logout ile eşleşecek
    secure: isProd,                    // PROD: true, DEV: false
    sameSite: isProd ? 'none' : 'lax', // farklı origin’li prod’da 'none' zorunlu
    // domain: isProd ? '.alanadın.com' : undefined, // gerekiyorsa
  });

  return token;
};

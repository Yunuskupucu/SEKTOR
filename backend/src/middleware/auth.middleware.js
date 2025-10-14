import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt; // cookie-parser kurulu olmalı
    if (!token) {
      return res.status(401).json({ message: 'Yetkisiz erişim' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET); // throws on invalid/expired
    } catch (err) {
      // Token geçersiz veya süresi dolmuş → 401 + cookie temizle
      // DEV/LAX
      res.clearCookie('jwt', { httpOnly: true, path: '/', sameSite: 'lax',  secure: false });
      // PROD/NONE
      res.clearCookie('jwt', { httpOnly: true, path: '/', sameSite: 'none', secure: true  });

      const code = err?.name === 'TokenExpiredError' ? 401 : 401;
      return res.status(code).json({ message: 'Yetkisiz erişim' });
    }

    // Hem {id} hem {uid} payload'ını destekle
    const userId = decoded.id ?? decoded.uid;
    if (!userId) {
      return res.status(401).json({ message: 'Yetkisiz erişim' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      // 404 yerine 401 dönmek guard akışı için daha pratiktir
      return res.status(401).json({ message: 'Yetkisiz erişim' });
    }

    req.user = user;
    res.setHeader('Cache-Control', 'no-store'); // korumalı yanıtlar cache'lenmesin
    return next();
  } catch (error) {
    // Buraya gerçekten beklenmeyen durumlar düşmeli
    console.log('Error in protectRoute middleware:', error);
    return res.status(401).json({ message: 'Yetkisiz erişim' });
  }
};

export default protectRoute;
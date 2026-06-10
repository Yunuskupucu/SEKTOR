import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt; 
    if (!token) {
      return res.status(401).json({ message: 'Yetkisiz erişim' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {

      res.clearCookie('jwt', { httpOnly: true, path: '/', sameSite: 'lax',  secure: false });

      res.clearCookie('jwt', { httpOnly: true, path: '/', sameSite: 'none', secure: true  });

      const code = err?.name === 'TokenExpiredError' ? 401 : 401;
      return res.status(code).json({ message: 'Yetkisiz erişim' });
    }


    const userId = decoded.id ?? decoded.uid;
    if (!userId) {
      return res.status(401).json({ message: 'Yetkisiz erişim' });
    }

    const user = await User.findByPk(userId);
    if (!user) {

      return res.status(401).json({ message: 'Yetkisiz erişim' });
    }

    req.user = user;
    res.setHeader('Cache-Control', 'no-store'); 
    return next();
  } catch (error) {

    console.log('Error in protectRoute middleware:', error);
    return res.status(401).json({ message: 'Yetkisiz erişim' });
  }
};


export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) {
      req.user = undefined;
      return next();
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      req.user = undefined;
      return next();
    }

    const userId = decoded.id ?? decoded.uid;
    if (!userId) {
      req.user = undefined;
      return next();
    }

    const user = await User.findByPk(userId);
    req.user = user || undefined;
    return next();
  } catch (error) {
    console.log('Error in optionalAuth middleware:', error);
    req.user = undefined;
    return next();
  }
};

export default protectRoute;
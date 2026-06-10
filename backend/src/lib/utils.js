import jwt from 'jsonwebtoken';

export const generateToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  const isProd = process.env.NODE_ENV === 'production';

  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',                        
    secure: isProd,                    
    sameSite: isProd ? 'none' : 'lax', // farklı origin’li prod’da 'none' zorunlu
   
  });

  return token;
};

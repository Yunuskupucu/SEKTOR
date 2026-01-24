import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';
import { uploadBufferToCloudinary } from '../lib/uploadToCloudinary.js';

export const register = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: 'Tüm alanları doldurunuz' });
    }

    if (password.length < 6 || password.length > 20) {
      return res.status(400).json({ message: 'Şifre 6-20 karakter arasında olmalıdır' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email kullanılmaktadır' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      profile_picture_url: null,
      github: null,
      linkedin: null,
      bio: null,
    });

    generateToken(newUser.id, res);

    res.status(201).json({
      id: newUser.id,
      fullname: newUser.fullname,
      email: newUser.email,
      profile_picture_url: newUser.profile_picture_url,
    });
  } catch (error) {
    console.error('Error in register controller:', error.message);
    res.status(500).json({
      message: 'Kullanıcı oluşturulurken hata oluştu',
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email ve şifre gereklidir' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Kullanıcı bulunamadı' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Hatalı şifre' });
    }

    generateToken(user.id, res);

    res.status(200).json({
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      profile_picture_url: user.profile_picture_url,
    });
  } catch (error) {
    console.error('Error in login controller:', error.message);
    res.status(500).json({
      message: 'Giriş yapılırken hata oluştu',
      error: error.message,
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie('jwt', { httpOnly: true, path: '/', sameSite: 'lax', secure: false });

  res.clearCookie('jwt', { httpOnly: true, path: '/', sameSite: 'none', secure: true });

  res.set('Cache-Control', 'no-store');
  return res.status(200).json({ message: 'Çıkış yapıldı' });
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, github, linkedin, bio } = req.body;
    const id = req.user.id;

    const [updatedRows] = await User.update(
      { fullname, email, github, linkedin, bio },
      { where: { id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    const updatedUser = await User.findByPk(id, {
      attributes: ['fullname', 'email', 'github', 'linkedin', 'bio', 'profile_picture_url'],
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error in updateProfile controller:', error.message);
    res.status(500).json({
      message: 'Profil güncellenirken hata oluştu',
      error: error.message,
    });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const file = req.file;
    const id = req.user.id;

    if (!file) {
      return res.status(400).json({ message: 'Dosya yüklenmedi' });
    }
    if (!file.buffer) {
      // memoryStorage devreye girmemişse burada yakalanır
      return res
        .status(400)
        .json({ message: 'Sunucu dosyayı belleğe alamadı (multer memoryStorage gerekli)' });
    }
    if (!/^image\//.test(file.mimetype)) {
      return res.status(400).json({ message: 'Sadece görsel yükleyebilirsiniz.' });
    }

    // Buffer → Cloudinary
    const uploadResponse = await uploadBufferToCloudinary(file.buffer, file.originalname, {
      folder: `profile_pictures/${id}`,
      forceImage: true,
      eager: [{ width: 500, height: 500, crop: 'limit' }],
    });

    if (!uploadResponse.secure_url) {
      return res.status(500).json({ message: 'Resim yüklenemedi' });
    }

    const [updatedRows] = await User.update(
      { profile_picture_url: uploadResponse.secure_url },
      { where: { id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.status(200).json({ avatar: uploadResponse.secure_url });
  } catch (error) {
    console.error('❌ Profil resmi yüklenemedi:', error);
    res.status(500).json({
      message: 'Profil resmi güncellenirken hata oluştu',
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const id = req.user.id;

    const user = await User.findByPk(id, {
      attributes: [
        'id',
        'fullname',
        'email',
        'profile_picture_url',
        'github',
        'linkedin',
        'bio',
        ['created_at', 'createdAt'], // Sequelize'de alias kullanımı
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    // 'createdAt' tarih formatını düzenliyoruz
    const formattedUser = {
      ...user.toJSON(),
      createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null, // ISO formatında tarihi döndürüyoruz
    };

    res.status(200).json(formattedUser); // Düzenlenmiş veriyi döndürüyoruz
  } catch (error) {
    console.error('Error in getProfile controller:', error.message);
    res.status(500).json({
      message: 'Profil bilgileri getirilirken hata oluştu',
      error: error.message,
    });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error('Error in checkAuth controller:', error.message);
    res.status(500).json({
      message: 'Kimlik doğrulama sırasında hata oluştu',
      error: error.message,
    });
  }
};
//profil görüntüleme için public
export const getPublicProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: [
        'id',
        'fullname',
        'email',
        'profile_picture_url',
        'github',
        'linkedin',
        'bio',
        'created_at',
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        profile_picture_url: user.profile_picture_url,
        github: user.github,
        linkedin: user.linkedin,
        bio: user.bio,
        createdAt: user.created_at ? new Date(user.created_at).toISOString() : null,
      },
    });
  } catch (error) {
    console.error('Error in getPublicProfileById:', error.message);
    return res.status(500).json({
      message: 'Profil bilgileri getirilirken hata oluştu',
      error: error.message,
    });
  }
};

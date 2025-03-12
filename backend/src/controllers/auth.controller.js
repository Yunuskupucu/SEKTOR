import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

export const register = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: 'Tüm alanları doldurunuz' });
    }

    if (password.length < 6 || password.length > 20) {
      return res
        .status(400)
        .json({ message: 'Şifre 6-20 karakter arasında olmalıdır' });
    }

    const emailUser = await User.findOne({ where: { email } });
    if (emailUser) {
      return res.status(400).json({ message: 'Email kullanılmaktadır' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      profile_picture_url: null,
      github: null,
      linkedin: null,
      bio: null,
    });

    if (newUser) {
      generateToken(newUser.id, res);
      await newUser.save();
      res.status(201).json({
        id: newUser.id,
        fullname: newUser.fullname,
        email: newUser.email,
        profile_picture_url: newUser.profile_picture_url,
      });
    } else {
      res.status(400).json({ message: 'Kullanıcı oluşturulamadı' });
    }
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

    let user = await User.findOne({ where: { email } });
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
    res
      .status(500)
      .json({ message: 'Giriş yapılırken hata oluştu', error: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: 'Başarıyla çıkış yapıldı' });
  } catch (error) {
    console.log('Error in logout controller: ', error.message);
    res
      .status(500)
      .json({ message: 'Çıkış yapılırken hata oluştu', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, profile_picture_url, github, linkedin, bio } =
      req.body;
    const id = req.user.id;

    const updateData = {
      fullname,
      email,
      github,
      linkedin,
      bio,
      updatedAt: new Date(),
    };

        // Eğer profil resmi varsa Cloudinary'ye yükleme işlemi yapılır
        if (profile_picture_url) {
            const uploadResponse = await cloudinary.uploader.upload(profile_picture_url, {
                folder: "profile_pictures", // Cloudinary'de klasör belirtebilirsin
                transformation: [{ width: 500, height: 500, crop: "limit" }],
            });

      if (!uploadResponse || !uploadResponse.secure_url) {
        return res
          .status(500)
          .json({ message: 'Profil resmi yüklenirken hata oluştu' });
      }

      updateData.profile_picture_url = uploadResponse.secure_url;
    }
    //find by id and update ????
    const updatedUser = await User.update(updateData, {
      where: { id },
      returning: true,
      plain: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

        res.status(200).json(updatedUser[1]); // Güncellenmiş kullanıcıyı döndürür.
    } catch (error) {
        console.log("Error in updateProfile controller: ", error.message);
        res.status(500).json({ message: 'Profil güncellenirken hata oluştu', error: error.message });
    }
  res.status(200).json(updatedUser[1]); // Güncellenmiş kullanıcıyı döndürür.
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log('Error in checkAuth controller: ', error.message);
    res.status(500).json({
      message: 'Kimlik doğrulama sırasında hata oluştu',
      error: error.message,
    });
  }
};

export const updateAvatar = async (req, res) => {
    try {
        const file = req.file;
        const id = req.user.id;

        if (!file) {
            return res.status(400).json({ message: "Dosya yüklenmedi" });
        }

        const uploadResponse = await cloudinary.uploader.upload(file.path, {
            folder: "profile_pictures", // Cloudinary'de klasör belirtme
            transformation: [{ width: 500, height: 500, crop: "limit" }],
        });

        if (!uploadResponse || !uploadResponse.secure_url) {
            return res.status(500).json({ message: "Profil resmi yüklenirken hata oluştu" });
        }

        const updatedUser = await User.update(
            { profile_picture_url: uploadResponse.secure_url },
            { where: { id }, returning: true, plain: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        }

        res.status(200).json({ avatar: uploadResponse.secure_url });
    } catch (error) {
        console.log("Error in updateAvatar controller: ", error.message);
        res.status(500).json({ message: 'Profil resmi güncellenirken hata oluştu', error: error.message });
    }
};
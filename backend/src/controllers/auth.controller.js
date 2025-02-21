import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';
import cloudinary from "cloudinary";



export const signup = async (req, res) => {
    const { fullname,  email, password } = req.body;
    try {
        if (!fullname || !email || !password) {
            return res.status(400).send("Tüm alanları doldurunuz");
        }

        if (password.length < 6 || password.length > 20) {
            return res.status(400).send("Şifre 6-20 karakter arasında olmalıdır");
        }

        const emailUser = await User.findOne({ where: { email } });
        if (emailUser) {
            return res.status(400).send("Email kullanılmaktadır");
        }

     
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await User.create({
            fullname,
            
            email,
            password,
            profile_picture_url: null, // Varsayılan olarak boş bırakabilirsiniz
            github: null, // Varsayılan olarak boş bırakabilirsiniz
            linkedin: null, // Varsayılan olarak boş bırakabilirsiniz
            bio: null, // Varsayılan olarak boş bırakabilirsiniz
        });

        if (newUser) {
            // Token oluştur ve cookie'ye yaz
            generateToken(newUser.id, res);
            await newUser.save();
            res.status(201).json({
                id: newUser.id,
                fullname: newUser.fullname,
                github: newUser.github,
                linkedin: newUser.linkedin,
                bio: newUser.bio,
                email: newUser.email,
                profile_picture_url: newUser.profile_picture_url,
            });
        } else {
            res.status(400).json("Kullanıcı oluşturulamadı");
        }
    } catch (error) {
        console.log("Error in signup controller: ", error.message);
        res.status(500).json({ message: 'Kullanıcı oluşturulurken hata oluştu', error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email|| !password) {
            return res.status(400).json("Email ve şifre gereklidir");
        }

        let user = await User.findOne({ where: { email} });


        if (!user) {
            return res.status(400).json("Kullanıcı bulunamadı");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json("Hatalı şifre");
        }
        //! burda kaldım

        generateToken(user.id, res);
        res.status(200).json({
            id: user.id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            profile_picture_url: user.profile_picture_url,
        });
    } catch (error) {
        console.log("Error in login controller: ", error.message);
        res.status(500).json({ message: 'Giriş yapılırken hata oluştu', error: error.message });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Başarıyla çıkış yapıldı" });
    } catch (error) {
        console.log("Error in logout controller: ", error.message);
        res.status(500).json({ message: 'Çıkış yapılırken hata oluştu', error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profile_picture_url } = req.body;
        const id = req.user.id;

        if (!profile_picture_url) {
            return res.status(400).json("Profil resmi ekleyiniz");
        }

        const uploadResponse = await cloudinary.uploader.upload(profile_picture_url);
        const updatedUser = await User.findByPk(id);

        if (!updatedUser) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        }

        updatedUser.profile_picture_url = uploadResponse.secure_url;
        await updatedUser.save();

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in updateProfile controller: ", error.message);
        res.status(500).json({ message: 'Profil güncellenirken hata oluştu', error: error.message });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller: ", error.message);
        res.status(500).json({ message: 'Kimlik doğrulama sırasında hata oluştu', error: error.message });
    }
};
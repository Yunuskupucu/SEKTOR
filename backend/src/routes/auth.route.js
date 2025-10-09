import express from 'express';
import {
  login,
  logout,
  register,
  checkAuth,
  getProfile,
  updateProfile,
  updateAvatar,
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import upload from "../middleware/uploadMiddleware.js";
import passport from "../lib/passport.js";
import { generateToken } from "../lib/utils.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/check', protectRoute, checkAuth);

router.get('/profile', protectRoute, getProfile);
router.put('/profile', protectRoute, updateProfile);

router.post(
  "/avatar",
  protectRoute,
  (req, res, next) => {
    upload.single("avatar")(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ message: "Dosya boyutu sınırı aşıldı (10MB)." });
        }
        return res.status(400).json({ message: err.message || "Yükleme hatası" });
      }
      next();
    });
  },
  updateAvatar
);

/* ============= OAuth: Google ============= */
router.get("/google", passport.authenticate("google", { scope:["profile","email"], session:false }));
router.get("/google/callback",
  passport.authenticate("google", { session:false, failureRedirect: "http://localhost:5173/login" }),
  (req,res)=>{ generateToken(req.user.id, res); return res.redirect("http://localhost:5173/"); }
);

/* ============= OAuth: GitHub ============= */
router.get("/github", passport.authenticate("github", { scope:["user:email"], session:false }));
router.get("/github/callback",
  passport.authenticate("github", { session:false, failureRedirect: "http://localhost:5173/login" }),
  (req,res)=>{ generateToken(req.user.id, res); return res.redirect("http://localhost:5173/"); }
);

export default router;
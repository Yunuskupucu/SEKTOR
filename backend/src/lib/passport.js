
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.model.js"; 

dotenv.config();

/* Zorunlu password alanı için OAuth hesaplarına dummy hash üretimi */
const issueDummyPassword = async () => {
  const rnd = Math.random().toString(36).slice(2) + Date.now().toString(36);
  return bcrypt.hash(rnd, 10);
};

/* Aynı email varsa onu kullan; yoksa yeni oluştur. provider alanlarını set et. */
const findOrCreateOAuthUser = async ({
  provider,
  providerId,
  email,
  fullname,
  avatar,
  githubUrl,
}) => {
  let user = null;

  if (email) {
    user = await User.findOne({ where: { email } });
  }

  if (!user) {
    const dummyPassword = await issueDummyPassword();
    user = await User.create({
      fullname: fullname || email || "Kullanıcı",
      email: email || `${provider}_${providerId}@noemail.local`,
      password: dummyPassword,
      profile_picture_url: avatar || null,
      github: githubUrl || null,
      linkedin: null,
      bio: null,
      provider,                 // "google" | "github"
      provider_id: providerId,  // provider'ın verdiği id
    });
  } else {
    const patch = {};
    if (user.provider !== provider) patch.provider = provider;
    if (!user.provider_id) patch.provider_id = providerId;
    if (avatar && !user.profile_picture_url) patch.profile_picture_url = avatar;
    if (githubUrl && !user.github) patch.github = githubUrl;
    if (fullname && user.fullname !== fullname) patch.fullname = fullname;

    if (Object.keys(patch).length) {
      await User.update(patch, { where: { id: user.id } });
      user = await User.findByPk(user.id);
    }
  }

  return user;
};
console.log("DEBUG BACKEND_URL:", process.env.BACKEND_URL);
console.log("DEBUG GITHUB_CALLBACK_PATH:", process.env.GITHUB_CALLBACK_PATH);
console.log("DEBUG GOOGLE_CALLBACK_PATH:", process.env.GOOGLE_CALLBACK_PATH);
// Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,           
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}${process.env.GOOGLE_CALLBACK_PATH}`, // http://localhost:5001/api/auth/google/callback
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || null;
        const fullname = profile.displayName || null;
        const avatar = profile.photos?.[0]?.value || null;

        const user = await findOrCreateOAuthUser({
          provider: "google",
          providerId: profile.id,
          email,
          fullname,
          avatar,
          githubUrl: null,
        });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Github
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,            // GitHub OAuth App
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}${process.env.GITHUB_CALLBACK_PATH}`, // http://localhost:5001/api/auth/github/callback
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // GitHub e-posta private olabilir
        const primaryEmail =
          (profile.emails || []).find((e) => e.primary)?.value ||
          profile.emails?.[0]?.value ||
          null;

        const fullname = profile.displayName || profile.username || null;
        const avatar = profile.photos?.[0]?.value || null;
        const githubUrl = profile.profileUrl || profile._json?.html_url || null;

        const user = await findOrCreateOAuthUser({
          provider: "github",
          providerId: profile.id,
          email: primaryEmail,
          fullname,
          avatar,
          githubUrl,
        });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);


export default passport;

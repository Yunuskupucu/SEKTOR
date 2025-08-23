import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPath = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Türkçe karakterleri sadeleştir, özel karakterleri kaldır
const sanitize = (s) =>
  s.normalize("NFD")                // UTF-8 normalize
   .replace(/[\u0300-\u036f]/g, "") // aksanları sil
   .replace(/[^a-zA-Z0-9._-]/g, "-"); // sadece ASCII bırak

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    const base = path.basename(file.originalname, ext);
    const safeBase = sanitize(base);
    cb(null, `${safeBase}-${Date.now()}${ext.toLowerCase()}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
  ];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Sadece .jpg, .png, .gif, .webp ve .pdf dosyaları kabul edilir."), false);
};

const upload = multer({ storage, fileFilter });
export default upload;

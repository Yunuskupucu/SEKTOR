import multer from "multer";

const allowed = new Set([
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "application/pdf",
]);

const fileFilter = (req, file, cb) => {
  if (allowed.has(file.mimetype)) return cb(null, true);
  cb(new Error("Yalnızca JPG, PNG, GIF, WEBP ve PDF kabul edilir."), false);
};

const upload = multer({
  storage: multer.memoryStorage(),           // ✔ buffer
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },    // 10MB
});

export default upload;

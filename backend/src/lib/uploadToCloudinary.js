import cloudinary from "./cloudinary.js";
import streamifier from "streamifier";

const sanitize = (s) =>
  (s || "file").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "");

export function uploadBufferToCloudinary(fileBuffer, originalName, {
  folder = "sektor/uploads",
  forceImage = false,     // avatar gibi sadece görsel
  eager = null,           // eager thumbs istiyorsan
} = {}) {
  const base = sanitize(originalName?.replace(/\.[^.]+$/, "") || "file");
  const public_id = `${base}-${Date.now()}`;
  const isPdf = /\.pdf$/i.test(originalName || "");
  const resource_type = forceImage ? "image" : (isPdf ? "raw" : "auto");

  return new Promise((resolve, reject) => {
    const cld = cloudinary.uploader.upload_stream(
      { folder, public_id, resource_type, eager },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(fileBuffer).pipe(cld);
  });
}

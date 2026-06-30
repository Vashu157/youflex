import { v2 as cloudinary } from "cloudinary";
import { Readable } from "node:stream";

let isConfigured = false;

function ensureConfig() {
  if (isConfigured) {
    return cloudinary;
  }

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Missing Cloudinary environment variables");
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });

  isConfigured = true;
  return cloudinary;
}

export function uploadBufferToCloudinary(buffer, options = {}) {
  const client = ensureConfig();

  return new Promise((resolve, reject) => {
    const uploadStream = client.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });

    Readable.from(buffer).pipe(uploadStream);
  });
}

// middlewares/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";

// Ensure uploads folder exists
const uploadDir = "./uploads/images";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: async (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}`);

    // const outputPath = path.join(
    //   uploadDir,
    //   `${file.fieldname}-${uniqueSuffix}`
    // );

    // // Compress and convert image using sharp
    // try {
    //   await sharp(file.buffer)
    //     .resize(800)
    //     .webp({ quality: 80 }) // Convert to WebP with 80% quality
    //     .toFile(outputPath);

    //   cb(null, `${file.fieldname}-${uniqueSuffix}.webp`);
    // } catch (err) {
    //   cb(err);
    // }
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
}).array("images", 10);

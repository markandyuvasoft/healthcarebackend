import multer from "multer";
import path from "path";

// Multer storage configuration
const imageUpload = multer.diskStorage({
  destination: "public/upload",
  filename: function (req, file, cb) {
    // Get the original file extension
    const ext = path.extname(file.originalname);

    // Get the base name without extension
    const baseName = path.basename(file.originalname, ext);

    // Sanitize the base name: replace spaces with underscores and remove special characters
    const sanitizedBaseName = baseName
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9_-]/g, ""); // Remove special characters

    // Construct the new filename
    const uniqueSuffix = Date.now();
    const newFileName = `${uniqueSuffix}-${sanitizedBaseName}${ext}`;

    cb(null, newFileName);
  },
});

// File filter to allow specific file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|pdf|mp4|mov|avi/;
  const mimeType = allowedTypes.test(file.mimetype);

  if (mimeType) {
    return cb(null, true);
  } else {
    return cb(
      new Error(
        "Invalid file type. Only .png, .jpg, .jpeg, .pdf, .mp4, .mov, .avi are allowed."
      )
    );
  }
};

// Export the configured multer instance
export const upload = multer({
  storage: imageUpload,
  fileFilter: fileFilter,
});

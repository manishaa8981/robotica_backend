const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

// Acceptable mime types for image and video
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
];

const pdfMimeTypes = ["application/pdf"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    const uniqueName = `${uuidv4()}.${ext}`;
    cb(null, uniqueName);
  }
});

// file filter
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed!"), false);
  }
};

// PDF filter
const pdfFileFilter = (req, file, cb) => {
  if (pdfMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

const uploadAll = multer({ storage }); // no fileFilter

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 200 * 1024 * 1024 }, 
});

const uploadPDF = multer({
  storage,
  fileFilter: pdfFileFilter,
});

module.exports = {
  upload,
  uploadAll,
  uploadPDF
};
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDirectory = path.join(__dirname, "..", "public", "uploads", "products");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDirectory),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const basename = path
      .basename(file.originalname, extension)
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "product";

    callback(null, `${basename}-${Date.now()}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new Error("Only image files are allowed."));
    }

    callback(null, true);
  }
});

const uploadProductImage = (req, res, next) => {
  upload.single("thumbnail")(req, res, (error) => {
    if (!error) {
      return next();
    }

    const message = error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE"
      ? "Image must be 5 MB or smaller."
      : error.message;
    req.flash("error", message || "Unable to upload image.");
    res.redirect(req.get("Referrer") || "/admin/product/create");
  });
};

module.exports = uploadProductImage;

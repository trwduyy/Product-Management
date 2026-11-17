const multer = require("multer");
const { uploadImage, deleteImage } = require("../helpers/cloudinary");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new Error("Only image files are allowed."));
    }

    callback(null, true);
  }
});

const uploadProductImage = (req, res, next) => {
  upload.single("thumbnail")(req, res, async (error) => {
    if (error) {
      const message = error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE"
        ? "Image must be 5 MB or smaller."
        : error.message;
      req.flash("error", message || "Unable to upload image.");
      return res.redirect(req.get("Referrer") || "/admin/product/create");
    }

    if (!req.file) {
      return next();
    }

    try {
      const result = await uploadImage(req.file.buffer);
      req.cloudinaryImage = {
        url: result.secure_url,
        publicId: result.public_id
      };
      next();
    } catch (uploadError) {
      console.error("Unable to upload product image to Cloudinary:", uploadError);
      req.flash("error", "Unable to upload image.");
      res.redirect(req.get("Referrer") || "/admin/product/create");
    }
  });
};

uploadProductImage.deleteUploadedImage = async (req) => {
  if (req.cloudinaryImage) {
    await deleteImage(req.cloudinaryImage.publicId);
  }
};

module.exports = uploadProductImage;

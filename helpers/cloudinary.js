const { v2: cloudinary } = require("cloudinary");

cloudinary.config();

const uploadImage = (buffer, options = {}) => new Promise((resolve, reject) => {
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: "product-management/products",
      resource_type: "image",
      ...options
    },
    (error, result) => {
      if (error) {
        return reject(error);
      }

      resolve(result);
    }
  );

  uploadStream.end(buffer);
});

const deleteImage = async (publicId) => {
  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image"
  });
};

module.exports = {
  uploadImage,
  deleteImage
};

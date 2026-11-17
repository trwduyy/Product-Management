const Product = require("../../models/product.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const { createUniqueSlug } = require("../../helpers/slug");
const validateProductInput = require("../../helpers/validateProduct");
const uploadProductImage = require("../../middlewares/upload");
const { deleteImage } = require("../../helpers/cloudinary");

module.exports.index = async (req, res) => {

  const filterStatus = filterStatusHelper(req.query);

  const find = {
    deleted: false
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  const search = searchHelper(req.query);

  if (search.regex) {
    find.title = search.regex;
  }

  // Pagination
  const countProducts = await Product.countDocuments(find);

  const objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4
    },
    req.query,
    countProducts
  );
  // End Pagination

  const products = await Product.find(find)
    .sort({ position: "desc" })
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.render("admin/pages/product/index", {
    pageTitle: "Product Management",
    products: products,
    filterStatus: filterStatus,
    keyword: search.keyword,
    pagination: objectPagination
  });
};

// [GET] /admin/product/detail/:id
module.exports.detail = async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    deleted: false
  });

  if (!product) {
    return res.status(404).send("Product not found");
  }

  product.newPrice = (
    product.price -
    (product.price * product.discountPercentage) / 100
  ).toFixed(2);

  res.render("admin/pages/product/detail", {
    pageTitle: product.title,
    product
  });
};

// [PATCH] /admin/product/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status });

  req.flash("success", "Status updated successfully!");

  res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/product`);
};

// [PATCH] /admin/product/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids ? req.body.ids.split(",").map((id) => id.trim()) : [];

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash("success", `Updated status for ${ids.length} products successfully!`);
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash("success", `Updated status for ${ids.length} products successfully!`);
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedAt: new Date()
        }
      );
      req.flash("success", `Deleted ${ids.length} products successfully!`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({ _id: id }, { position: position });
      }
      req.flash("success", `Updated position for ${ids.length} products successfully!`);
      break;
    default:
      break;
  }

  res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/product`);
};

// [DELETE] /admin/product/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedAt: new Date()
    }
  );

  req.flash("success", "Product deleted successfully!");

  res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/product`);
};

// [GET] /admin/product/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/product/create", {
    pageTitle: "Add New Product",
    formData: {},
    formAction: `${systemConfig.prefixAdmin}/product/create`,
    formTitle: "Add New Product",
    submitText: "Create",
    isEdit: false
  });
};

// [POST] /admin/product/create
module.exports.createPost = async (req, res) => {
  const { values, errors } = validateProductInput(req.body);

  if (errors.length > 0) {
    await uploadProductImage.deleteUploadedImage(req);
    req.flash("error", errors.join(" "));
    return res.status(400).render("admin/pages/product/create", {
      pageTitle: "Add New Product",
      formData: req.body,
      formAction: `${systemConfig.prefixAdmin}/product/create`,
      formTitle: "Add New Product",
      submitText: "Create",
      isEdit: false
    });
  }

  if (values.position === null) {
    const countProducts = await Product.countDocuments();
    values.position = countProducts + 1;
  }

  const product = new Product({
    ...values,
    slug: await createUniqueSlug(Product, values.title),
    thumbnail: req.cloudinaryImage ? req.cloudinaryImage.url : req.body.thumbnail,
    thumbnailPublicId: req.cloudinaryImage ? req.cloudinaryImage.publicId : undefined
  });
  try {
    await product.save();
  } catch (error) {
    await uploadProductImage.deleteUploadedImage(req);
    throw error;
  }

  req.flash("success", "Product created successfully!");

  res.redirect(`${systemConfig.prefixAdmin}/product`);
};

// [GET] /admin/product/edit/:id
module.exports.edit = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, deleted: false });

  if (!product) {
    return res.status(404).send("Product not found");
  }

  res.render("admin/pages/product/create", {
    pageTitle: "Edit Product",
    formData: product,
    formAction: `${systemConfig.prefixAdmin}/product/edit/${product.id}`,
    formTitle: "Edit Product",
    submitText: "Save Changes",
    currentThumbnail: product.thumbnail,
    isEdit: true
  });
};

// [PATCH] /admin/product/edit/:id
module.exports.editPatch = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, deleted: false });

  if (!product) {
    await uploadProductImage.deleteUploadedImage(req);
    return res.status(404).send("Product not found");
  }

  const { values, errors } = validateProductInput(req.body);
  if (errors.length > 0) {
    await uploadProductImage.deleteUploadedImage(req);
    req.flash("error", errors.join(" "));
    return res.status(400).render("admin/pages/product/create", {
      pageTitle: "Edit Product",
      formData: req.body,
      formAction: `${systemConfig.prefixAdmin}/product/edit/${product.id}`,
      formTitle: "Edit Product",
      submitText: "Save Changes",
      currentThumbnail: product.thumbnail,
      isEdit: true
    });
  }

  if (values.position === null) {
    values.position = product.position;
  }

  const previousThumbnail = product.thumbnail;
  const previousThumbnailPublicId = product.thumbnailPublicId;
  product.set({
    ...values,
    slug: await createUniqueSlug(Product, values.title, product.id),
    thumbnail: req.cloudinaryImage ? req.cloudinaryImage.url : previousThumbnail,
    thumbnailPublicId: req.cloudinaryImage
      ? req.cloudinaryImage.publicId
      : previousThumbnailPublicId
  });
  try {
    await product.save();
  } catch (error) {
    await uploadProductImage.deleteUploadedImage(req);
    throw error;
  }

  if (req.cloudinaryImage && previousThumbnailPublicId) {
    await deleteImage(previousThumbnailPublicId);
  }

  req.flash("success", "Product updated successfully!");
  res.redirect(`${systemConfig.prefixAdmin}/product`);
};

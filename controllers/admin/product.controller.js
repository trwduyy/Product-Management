const Product = require("../../models/product.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const { createUniqueSlug } = require("../../helpers/slug");

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
    pageTitle: "Add New Product"
  });
};

// [POST] /admin/product/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price) || 0;
  req.body.discountPercentage = parseInt(req.body.discountPercentage) || 0;
  req.body.stock = parseInt(req.body.stock) || 0;

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const product = new Product({
    ...req.body,
    slug: await createUniqueSlug(Product, req.body.title),
    thumbnail: req.file ? `/uploads/products/${req.file.filename}` : req.body.thumbnail
  });
  await product.save();

  req.flash("success", "Product created successfully!");

  res.redirect(`${systemConfig.prefixAdmin}/product`);
};

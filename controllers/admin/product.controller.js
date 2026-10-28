const Product = require("../../models/product.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

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

  res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/product`);
};

// [PATCH] /admin/product/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids ? req.body.ids.split(",").map((id) => id.trim()) : [];

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true
        }
      );
      break;
    default:
      break;
  }

  res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/product`);
};

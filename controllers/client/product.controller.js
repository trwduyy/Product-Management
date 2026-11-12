const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
  try {
    const products = await Product.find({
      deleted: false,
      status: "active"
    }).sort({ position: "desc" });

    const newProducts = products.map((item) => {
      item.newPrice = (item.price - (item.price * item.discountPercentage) / 100).toFixed(2);
      return item;
    });

    res.render("client/pages/product/index", {
      pageTitle: "Product Page",
      products: newProducts 
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách sản phẩm:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.detail = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      deleted: false,
      status: "active"
    });

    if (!product) {
      return res.status(404).send("Product not found");
    }

    product.newPrice = (product.price - (product.price * product.discountPercentage) / 100).toFixed(2);
    res.render("client/pages/product/detail", {
      pageTitle: product.title,
      product
    });
  } catch (error) {
    console.error("Error loading product:", error);
    res.status(500).send("Internal Server Error");
  }
};

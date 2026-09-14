const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
  try {
    const products = await Product.find({
      deleted: false,
      status: "active"
    });

    const newProducts = products.map((item) => {
      item.newPrice = (item.price - (item.price * item.discountPercentage) / 100).toFixed(2);
      return item;
    });

    res.render("client/pages/product/index", {
      title: "Product Page",
      products: newProducts 
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách sản phẩm:", error);
    res.status(500).send("Internal Server Error");
  }
};
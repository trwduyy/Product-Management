const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");

module.exports.index = async (req, res) => {

  filterStatus = filterStatusHelper(req.query);
  
  find = {
    deleted: false
  }

  if (req.query.status) {
    find.status = req.query.status;
  }

  search = searchHelper(req.query);

  if(search.regex){
    find.title = search.regex;
  }

  const products = await Product.find(find);

  res.render('admin/pages/product/index', {
    pageTitle: 'Product Management',
    products: products,
    filterStatus: filterStatus,
    keyword: search.keyword
  });
}
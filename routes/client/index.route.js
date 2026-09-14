const productRoute = require('./product.route');

const controller = require('../../controllers/client/home.controller');

module.exports = (app) => {
app.get("/", controller.index);

app.use("/product", productRoute);

// app.get("/product", (req, res) => {
//     res.render('client/pages/product/index', {
//       title: "Product Page"
//     })
//   });
};
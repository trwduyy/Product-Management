const express = require("express");
const methodOverride = require("method-override");
const database = require("./config/database");
require("dotenv").config();
const app = express();
const port = process.env.PORT;

database.connect();

const route = require("./routes/client/index.route");
const adminRoute = require("./routes/admin/index.route");
const systemConfig = require("./config/system");

app.set("views", "./views");
app.set("view engine", "pug");

app.use(methodOverride("_method"));

app.use(express.static("public"));

app.locals.prefixAdmin = systemConfig.prefixAdmin;

route(app);
adminRoute(app);

app.listen(port);
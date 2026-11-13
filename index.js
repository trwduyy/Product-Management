const express = require("express");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const database = require("./config/database");
require("dotenv").config();
const app = express();
const port = process.env.PORT;

database.connect();

const route = require("./routes/client/index.route");
const adminRoute = require("./routes/admin/index.route");
const systemConfig = require("./config/system");

// Flash
const sessionSecret = process.env.SESSION_SECRET || "KEY_RANDOM";
app.use(cookieParser(sessionSecret));
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));
app.use(flash());
// End Flash

app.set("views", "./views");
app.set("view engine", "pug");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

app.locals.prefixAdmin = systemConfig.prefixAdmin;

route(app);
adminRoute(app);

app.listen(port);

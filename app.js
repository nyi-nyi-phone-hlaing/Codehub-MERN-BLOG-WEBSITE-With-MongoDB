//* Core Modules
const path = require("path");

//* NPM packages
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

//* Local Imports
const postRoutes = require("./routes/post");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const timeAgo = require("./utils/timeAgo");
const User = require("./models/user");
const { isLogin } = require("./middleware/isLogin");
const isFollowing = require("./utils/isFollowing");
const formatNumber = require("./utils/formatNumber");
const isLiked = require("./utils/isLiked");
const isDisliked = require("./utils/isDisliked");

//* Initializing
const app = express();
const csrfProtect = csrf();
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

//* Template Engine Setup
app.set("view engine", "ejs");
app.set("views", "views");

//* Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    store,
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(csrfProtect);
app.use(flash());

app.use((req, res, next) => {
  app.locals.prevUrl = req.get("Referer") || "/";
  app.locals.isLogin = req.session.isLogin ? true : false;
  app.locals.csrfToken = req.csrfToken();
  if (req.session.isLogin) {
    app.locals.userInfo = req.session.userInfo;
    User.findById(req.session.userInfo._id)
      .select("_id username email profile_img followers following")
      .then((user) => {
        req.userInfo = user;
      });
  }
  next();
});

app.use(postRoutes);
app.use("/admin", isLogin, adminRoutes);
app.use(authRoutes);
app.use(userRoutes);

// Make the helper function available to EJS templates
app.locals.timeAgo = timeAgo;
app.locals.isFollowing = isFollowing;
app.locals.formatNumber = formatNumber;
app.locals.isLiked = isLiked;
app.locals.isDisliked = isDisliked;

app.all("*", (req, res) => {
  res.render("error/404", { url: req.url });
});

//* Server Setup
const port = process.env.PORT || 8081;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB!");
    app.listen(port);
  })
  .catch((err) => console.log(err));

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
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

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
const storageConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads");
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = `${uuidv4()}-${Date.now()}`;
    const name = file.originalname.split(".")[0];
    const fileType = file.originalname.split(".")[1];
    callback(null, `${name}-${uniqueSuffix}.${fileType}`);
  },
});

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

//* Template Engine Setup
app.set("view engine", "ejs");
app.set("views", "views");

//* Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: storageConfig }).single("image_url"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
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
app.use((err, req, res, next) => {
  res.render("error/500", { message: err.message });
});

//* Server Setup
const port = process.env.PORT || 8081;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB!");
    app.listen(port);
  })
  .catch((err) => {
    console.log("Can't connected to MongoDB!");
  });

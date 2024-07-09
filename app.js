//* Core Modules
const path = require("path");

//* NPM packages
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

//* Local Imports
const postRoutes = require("./routes/post");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const timeAgo = require("./utils/timeAgo");
const User = require("./models/user");

//* Initializing
const app = express();
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

app.use((req, res, next) => {
  app.locals.isLogin = req.session.isLogin ? true : false;
  app.locals.userInfo = req.session.userInfo ? req.session.userInfo : null;
  req.userInfo = req.session.userInfo;
  next();
});

app.use(postRoutes);
app.use("/admin", adminRoutes);
app.use(authRoutes);

// Make the helper function available to EJS templates
app.locals.timeAgo = timeAgo;

//* Server Setup
const port = process.env.PORT || 8081;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB!");
    app.listen(port);
  })
  .catch((err) => console.log(err));

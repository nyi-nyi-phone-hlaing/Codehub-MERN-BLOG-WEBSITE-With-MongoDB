//* Core Modules
const path = require("path");

//* NPM packages
const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");

//* Local Imports
const postRoutes = require("./routes/post");
const adminRoutes = require("./routes/admin");
const { mongodbConnector } = require("./utils/database");

//* Initializing
const app = express();

//* Template Engine Setup
app.set("view engine", "ejs");
app.set("views", "views");

//* Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(postRoutes);
app.use("/admin", adminRoutes);

//* Server Setup
const port = process.env.PORT || 8081;
app.listen(port, () => {
  mongodbConnector();
});

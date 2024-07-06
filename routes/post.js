//* NPM packages
const express = require("express");

//* Local Imports
const postControllers = require("../controllers/post");

//* Initializing
const router = express.Router();

//* Route Path
// Rendering Home Page
router.get("/", postControllers.renderHomePage);

// Rendering Post Details Page
router.get("/post-details/:id", postControllers.renderDetailsPage);

module.exports = router;

//* NPM packages
const express = require("express");

//* Local Imports
const postControllers = require("../controllers/post");

//* Initializing
const router = express.Router();

//* Route Path
// Rendering Create Page
router.get("/create-post", postControllers.renderCreatePage);

// Creating Post
router.post("/create-post", postControllers.createPost);

module.exports = router;

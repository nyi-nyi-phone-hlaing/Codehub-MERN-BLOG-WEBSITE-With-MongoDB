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

// Rendering Edit Page
router.get("/edit-post/:id", postControllers.renderEditPage);

// Editing Post
router.post("/edit-post", postControllers.editPost);

// Deleting Post
router.post("/delete-post/:id", postControllers.deletePost);

module.exports = router;

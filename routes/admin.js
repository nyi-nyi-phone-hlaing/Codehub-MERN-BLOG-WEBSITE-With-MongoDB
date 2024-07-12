//* NPM packages
const express = require("express");

//* Local Imports
const postControllers = require("../controllers/post");
const authControllers = require("../controllers/auth");
const userControllers = require("../controllers/user");

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

// Delete Account
router.post("/delete-account/:id", authControllers.deleteAccount);

// Rendering Profile Edit Page
router.get("/edit-personal-profile/:id", authControllers.renderProfileEditPage);

// Updating Profile
router.post("/update-profile", authControllers.updateProfile);

// Follow
router.post("/follow", userControllers.followUser);

// Unfollow
router.post("/unfollow", userControllers.unfollowUser);

module.exports = router;

//* NPM packages
const express = require("express");

//* Local Imports
const postControllers = require("../controllers/post");
const authControllers = require("../controllers/auth");
const userControllers = require("../controllers/user");
const {
  bioValidate,
  profileImgValidate,
  usernameFormatValidate,
} = require("../validators/user");
const {
  titleValidate,
  descriptionValidate,
  imageValidate,
} = require("../validators/post");

//* Initializing
const router = express.Router();

//* Route Path
// Rendering Create Page
router.get("/create-post", postControllers.renderCreatePage);

// Creating Post
router.post(
  "/create-post",
  titleValidate("title"),
  imageValidate("image_url"),
  descriptionValidate("description"),
  postControllers.createPost
);

// Rendering Edit Page
router.get("/edit-post/:id", postControllers.renderEditPage);

// Editing Post
router.post(
  "/edit-post",
  titleValidate("title"),
  imageValidate("image_url"),
  descriptionValidate("description"),
  postControllers.editPost
);

// Deleting Post
router.post("/delete-post/:id", postControllers.deletePost);

// Delete Account
router.post("/delete-account/:id", authControllers.deleteAccount);

// Rendering Profile Edit Page
router.get("/edit-personal-profile/:id", authControllers.renderProfileEditPage);

// Updating Profile
router.post(
  "/update-profile",
  usernameFormatValidate("username"),
  profileImgValidate("profile_img"),
  bioValidate("bio"),
  authControllers.updateProfile
);

// Follow
router.post("/follow", userControllers.followUser);

// Unfollow
router.post("/unfollow", userControllers.unfollowUser);

// Like
router.post("/like/:postId", postControllers.likePost);

// Dislike
router.post("/dislike/:postId", postControllers.dislikePost);

module.exports = router;

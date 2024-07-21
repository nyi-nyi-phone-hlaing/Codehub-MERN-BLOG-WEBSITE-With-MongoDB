const express = require("express");
const userControllers = require("../controllers/user");
const router = express.Router();

router.get("/view-followers/:id", userControllers.renderViewFollowersPage);

router.get("/view-following/:id", userControllers.renderViewFollowingPage);

//router.get("/search-user", userControllers.renderSearchUserPage);

router.get("/search-user", userControllers.searchUser);

module.exports = router;

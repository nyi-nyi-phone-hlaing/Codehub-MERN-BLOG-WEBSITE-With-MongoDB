const express = require("express");
const userControllers = require("../controllers/user");
const router = express.Router();

router.get("/view-followers/:id", userControllers.renderViewFollowersPage);

router.get("/view-following/:id", userControllers.renderViewFollowingPage);

module.exports = router;

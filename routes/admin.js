//* NPM packages
const express = require("express");

//* Local Imports
const postControllers = require("../controllers/post");

//* Initializing
const router = express.Router();

//* Route Path
router.get("/create-post", postControllers.renderCreatePage);

module.exports = router;

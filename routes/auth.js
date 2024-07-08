//* NPM packages
const express = require("express");

//* Local Imports
const authControllers = require("../controllers/auth");

//* Initializing
const router = express.Router();

// Rendering Login Page
router.get("/login", authControllers.renderLoginPage);

// Rendering SignUp Page
router.get("/signup", authControllers.renderSignUpPage);

// Login account
router.post("/login", authControllers.loginAccount);

// Signup account
router.post("/signup", authControllers.signupAccount);

module.exports = router;
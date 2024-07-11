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

// Logout account
router.post("/logout", authControllers.logoutAccount);

// View Profile
router.get("/profile/:id", authControllers.renderViewProfile);

// Rendering Reset Password Page
router.get("/reset-password", authControllers.renderResetPasswordPage);

// Request Reset Password Link
router.post("/reset-password", authControllers.requestResetPasswordLink);

// Rendering Feedback Page
router.get("/feedback", authControllers.renderFeedbackPage);

// Rendering Change New Password Page
router.get("/reset-password/:token", authControllers.changeNewPasswordPage);

// Updating Password
router.post("/update-password", authControllers.updatePassword);

module.exports = router;

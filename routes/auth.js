//* NPM packages
const express = require("express");

//* Local Imports
const authControllers = require("../controllers/auth");
const {
  usernameValidate,
  emailValidate,
  emailFormatValidate,
  passwordValidate,
  emailExistsValidate,
} = require("../validators/auth");

//* Initializing
const router = express.Router();

// Rendering Login Page
router.get("/login", authControllers.renderLoginPage);

// Rendering SignUp Page
router.get("/signup", authControllers.renderSignUpPage);

// Login account
router.post(
  "/login",
  emailFormatValidate("email"),
  emailExistsValidate("email", "Invalid email or password."),
  passwordValidate("password"),
  authControllers.loginAccount
);

// Signup account
router.post(
  "/signup",
  usernameValidate("username"),
  emailValidate("email"),
  passwordValidate("password"),
  authControllers.signupAccount
);

// Logout account
router.post("/logout", authControllers.logoutAccount);

// View Profile
router.get("/profile/:id", authControllers.renderViewProfile);

// Rendering Reset Password Page
router.get("/reset-password", authControllers.renderResetPasswordPage);

// Request Reset Password Link
router.post(
  "/reset-password",
  emailFormatValidate("email"),
  emailExistsValidate("email", "User not found with this email"),
  authControllers.requestResetPasswordLink
);

// Rendering Feedback Page
router.get("/feedback", authControllers.renderFeedbackPage);

// Rendering Change New Password Page
router.get("/reset-password/:token", authControllers.changeNewPasswordPage);

// Updating Password
router.post(
  "/update-password",
  passwordValidate("password"),
  authControllers.updatePassword
);

module.exports = router;

const { check, body } = require("express-validator");
const User = require("../models/user");

exports.bioValidate = (bio) => {
  return body(bio)
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 400 })
    .withMessage("Bio must be a maximum of 400 characters long.");
};

exports.profileImgValidate = (profile_img) => {
  return body(profile_img)
    .notEmpty()
    .withMessage("Profile Image URL cannot be empty.")
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage(
      "Profile Image URL must be a valid URL starting with http:// or https://"
    );
};

exports.usernameFormatValidate = (username) => {
  return body(username)
    .notEmpty()
    .withMessage("Username cannot be empty!")
    .isLength({ min: 6, max: 23 })
    .withMessage("Username must be between 6 and 23 characters long.")
    .custom((value, { req }) => {
      if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
        return Promise.reject(
          "Username can only contain letters, numbers, and spaces."
        );
      }
      return true;
    });
};

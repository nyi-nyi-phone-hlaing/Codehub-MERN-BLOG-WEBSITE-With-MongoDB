const { check, body } = require("express-validator");
const User = require("../models/user");

exports.usernameValidate = (username) => {
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
    })
    .custom((value, { req }) => {
      return User.findOne({ username: value }).then((user) => {
        if (user) {
          return Promise.reject("Username is already taken.");
        }
      });
    });
};

exports.emailValidate = (email) => {
  return body(email)
    .notEmpty()
    .withMessage("Email cannot be empty!")
    .isEmail()
    .withMessage("Please enter an valid email format.")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("Email is already taken.");
        }
        return true;
      });
    });
};

exports.emailFormatValidate = (email) => {
  return body(email)
    .notEmpty()
    .withMessage("Email cannot be empty!")
    .isEmail()
    .withMessage("Please enter an valid email format.");
};

exports.emailExistsValidate = (email, message) => {
  return body(email).custom((value, { req }) => {
    return User.findOne({ email: value }).then((user) => {
      if (!user) {
        return Promise.reject(message);
      }
      return true;
    });
  });
};

exports.passwordValidate = (password) => {
  return body(password)
    .notEmpty()
    .withMessage("Password cannot be empty.")
    .isLength({ min: 4, max: 16 })
    .withMessage("Password must be between 4 and 16 characters long.")
    .isAlphanumeric()
    .withMessage(
      "Password can only contain letters and numbers without spaces."
    );
};

// .optional()
//   .isURL({ protocols: ['http', 'https'], require_protocol: true })
//   .withMessage("Image URL must be a valid URL starting with http:// or https://");

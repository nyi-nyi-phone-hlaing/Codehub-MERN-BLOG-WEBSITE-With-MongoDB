const { check, body } = require("express-validator");

exports.titleValidate = (title) => {
  return body(title).trim().notEmpty().withMessage("Title cannot be empty!");
};

exports.imageValidate = (image_url) => {
  return body(image_url).custom((value, { req }) => {
    return true;
  });
};

exports.descriptionValidate = (description) => {
  return body(description)
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty!");
};

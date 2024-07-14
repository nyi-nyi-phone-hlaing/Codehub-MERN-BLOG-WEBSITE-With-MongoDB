const { check, body } = require("express-validator");

exports.titleValidate = (title) => {
  return body(title).trim().notEmpty().withMessage("Title cannot be empty!");
};

exports.imageURLValidate = (image_url) => {
  return body(image_url)
    .optional({ checkFalsy: true })
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage(
      "Image URL must be a valid URL starting with http:// or https://"
    );
};

exports.descriptionValidate = (description) => {
  return body(description)
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty!");
};

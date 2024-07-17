const { check, body } = require("express-validator");

exports.titleValidate = (title) => {
  return body(title).trim().notEmpty().withMessage("Title cannot be empty!");
};

exports.imageValidate = (image_url) => {
  //   .custom((value, { req }) => {
  //   if (!req.file) {
  //     return Promise.reject("Image is required!");
  //   }
  //   return true;
  // })

  return body(image_url).custom((value, { req }) => {
    return true;
    // const { mimetype } = req.file;
    // console.log(mimetype);
    // if (
    //   mimetype === "image/png" ||
    //   mimetype === "image/jpeg" ||
    //   mimetype === "image/jpg"
    // ) {
    //   return true;
    // }
    // return Promise.reject("Only .jpeg, .jpg and .png files are allowed!");
  });
};

exports.descriptionValidate = (description) => {
  return body(description)
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty!");
};

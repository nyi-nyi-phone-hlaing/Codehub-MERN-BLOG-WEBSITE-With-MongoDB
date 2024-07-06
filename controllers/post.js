const Post = require("../models/post");

exports.renderHomePage = (req, res) => {
  Post.find()
    .then((posts) => {
      res.render("home", { title: "Home Page", posts });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.renderCreatePage = (req, res) => {
  res.render("create-post", { title: "Create Post Page" });
};

exports.renderDetailsPage = (req, res) => {
  const { id } = req.params;
  Post.findById(id)
    .then((post) => {
      res.render("details", { title: post.title, post });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.renderEditPage = (req, res) => {
  const { id } = req.params;
  Post.findById(id)
    .then((post) => {
      res.render("edit-post", { title: post.title, post });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.createPost = (req, res) => {
  const { title, description, image_url } = req.body;
  const post = new Post(title, description, image_url);
  post
    .create()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.editPost = (req, res) => {
  const { _id, title, description, image_url } = req.body;
  const post = new Post(title, description, image_url);
  post
    .update(_id)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deletePost = (req, res) => {
  const { id } = req.params;
  Post.delete(id)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

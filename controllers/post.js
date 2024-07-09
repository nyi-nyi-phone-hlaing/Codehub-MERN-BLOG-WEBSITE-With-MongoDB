const Post = require("../models/post");

exports.renderHomePage = (req, res) => {
  Post.find()
    .sort({ createdAt: -1 })
    .populate("userId", "username")
    .select("title createdAt image_url")
    .then((posts) => {
      res.render("home", { title: "Home Page", posts });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.renderCreatePage = (req, res) => {
  res.render("create-post", {
    title: "Create Post Page",
  });
};

exports.renderDetailsPage = (req, res) => {
  const { id } = req.params;
  Post.findById(id)
    .populate("userId", "username")
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
  Post.create({ title, description, image_url, userId: req.session.userInfo })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.editPost = (req, res) => {
  const { _id, title, description, image_url } = req.body;

  Post.findById(_id)
    .then((post) => {
      post.title = title;
      post.description = description;
      post.image_url = image_url;
      return post.save();
    })
    .then((result) => {
      console.log("Post Updated!");
      res.redirect(`/post-details/${result._id}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deletePost = (req, res) => {
  const { id } = req.params;
  Post.findByIdAndDelete(id)
    .then(() => {
      console.log("Post Deleted!");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

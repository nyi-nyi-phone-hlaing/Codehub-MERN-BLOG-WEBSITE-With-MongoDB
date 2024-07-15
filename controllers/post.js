const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");

exports.renderHomePage = (req, res) => {
  Post.find()
    .sort({ createdAt: -1 })
    .populate("userId", "username")
    .select("title createdAt image_url like dislike")
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
    errorMsg: null,
    oldFormData: { title: "", image_url: "", description: "" },
  });
};

exports.renderDetailsPage = (req, res) => {
  const { id } = req.params;
  Post.findById(id)
    .populate("userId", "username profile_img")
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
    .select("_id title image_url description")
    .then((post) => {
      res.render("edit-post", { title: post.title, post, errorMsg: null });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.createPost = (req, res) => {
  const { title, description, image_url } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("create-post", {
      title: "Create Post Page",
      errorMsg: errors.array()[0].msg,
      oldFormData: { title, image_url, description },
    });
  }

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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("edit-post", {
      title,
      errorMsg: errors.array()[0].msg,
      post: { _id, title, image_url, description },
    });
  }
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

exports.likePost = (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;
  const prevUrl = req.get("Referer");

  Post.findById({ _id: postId })
    .then((post) => {
      if (!post) {
        return res.redirect(prevUrl);
      }
      if (!post.like.includes(userId)) {
        post.like.push(userId);
        if (post.dislike.includes(userId)) {
          post.dislike.pull(userId);
        }
      } else {
        post.like.pull(userId);
      }
      post
        .save()
        .then((_) => res.redirect(prevUrl))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.dislikePost = (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;
  const prevUrl = req.get("Referer");

  Post.findById({ _id: postId })
    .then((post) => {
      if (!post) {
        return res.redirect(prevUrl);
      }
      if (!post.dislike.includes(userId)) {
        post.dislike.push(userId);
        if (post.like.includes(userId)) {
          post.like.pull(userId);
        }
      } else {
        post.dislike.pull(userId);
      }
      post
        .save()
        .then((_) => res.redirect(prevUrl))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

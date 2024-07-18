const { validationResult } = require("express-validator");
const Post = require("../models/post");
const fileDelete = require("../utils/fileDelete");
const POST_PER_PAGE = 5;

exports.renderHomePage = (req, res, next) => {
  /** 
   * * total = 10
   * * per page = 5
   * * next page = -5 +5
   
   * * (pageNumber (?) - 1) * POST_PER_PAGE (5)
   * * page => 1 - 1 = 0
   * * per page => 0 * 5 = 0 (skip value)

   * * page => 2 - 1 = 1
   * * per page => 1 * 5 = 5 (skip value)

   * * page => 3 - 1 = 2
   * * per page => 2 * 5 = 10 (skip value)
    */

  const pageNumber = +req.query.page || 1;
  let totalPostCount;

  Post.find()
    .countDocuments()
    .then((totalPostNumber) => {
      totalPostCount = totalPostNumber;

      return Post.find()
        .sort({ createdAt: -1 })
        .populate("userId", "username")
        .skip((pageNumber - 1) * POST_PER_PAGE)
        .limit(POST_PER_PAGE)
        .select("title createdAt image_url like dislike");
    })
    .then((posts) => {
      if (pageNumber <= Math.ceil(totalPostCount / POST_PER_PAGE)) {
        res.render("home", {
          title: "Home Page",
          posts,
          currentPage: pageNumber,
          hasNextPage: pageNumber * POST_PER_PAGE < totalPostCount,
          hasPrevPage: pageNumber > 1,
          nextPage: pageNumber + 1,
          prevPage: pageNumber - 1,
          totalPage: Math.ceil(totalPostCount / POST_PER_PAGE),
        });
      } else {
        return res.render("error/500", {
          message: "No post avaliable in this page",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Internal Server Error");
      return next(error);
    });
};

exports.renderCreatePage = (req, res) => {
  res.render("create-post", {
    title: "Create Post Page",
    errorMsg: null,
    oldFormData: { title: "", image_url: "", description: "" },
  });
};

exports.renderDetailsPage = (req, res, next) => {
  const { id } = req.params;
  Post.findById(id)
    .populate("userId", "username profile_img")
    .then((post) => {
      res.render("details", { title: post.title, post });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Post not found with this id.");
      return next(error);
    });
};

exports.renderEditPage = (req, res, next) => {
  const { id } = req.params;
  Post.findById(id)
    .select("_id title image_url description")
    .then((post) => {
      res.render("edit-post", { title: post.title, post, errorMsg: null });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Post not found with this id.");
      return next(error);
    });
};

exports.createPost = (req, res, next) => {
  const { title, description } = req.body;
  const image = req.file;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("create-post", {
      title: "Create Post Page",
      errorMsg: errors.array()[0].msg,
      oldFormData: { title, description },
    });
  }

  if (image === undefined) {
    return res.render("create-post", {
      title: "Create Post Page",
      errorMsg: "Only .jpeg, .jpg and .png files are allowed!",
      oldFormData: { title, description },
    });
  }

  Post.create({
    title,
    description,
    image_url: image.path,
    userId: req.session.userInfo,
  })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Server Error when creating post.");
      return next(error);
    });
};

exports.editPost = (req, res, next) => {
  const { _id, title, description } = req.body;
  const image = req.file;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("edit-post", {
      title,
      errorMsg: errors.array()[0].msg,
      post: { _id, title, description },
    });
  }

  Post.findById(_id)
    .then((post) => {
      post.title = title;
      post.description = description;
      if (image) {
        fileDelete(post.image_url);
        post.image_url = image.path;
      }
      return post.save();
    })
    .then((result) => {
      res.redirect(`/post-details/${result._id}`);
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Post not found with this id.");
      return next(error);
    });
};

exports.deletePost = (req, res, next) => {
  const { id } = req.params;
  Post.findById(id)
    .then((post) => {
      if (!post) {
        return res.redirect("/");
      }
      fileDelete(post.image_url);
      return Post.deleteOne({ _id: id });
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Post not found with this id.");
      return next(error);
    });
};

exports.likePost = (req, res, next) => {
  const { postId } = req.params;
  const { userId } = req.body;
  const prevUrl = req.get("Referer");

  Post.findById(postId)
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
        .catch((err) => {
          console.log(err);
          const error = new Error("Server Error when like a post.");
          return next(error);
        });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Post not found with this id.");
      return next(error);
    });
};

exports.dislikePost = (req, res, next) => {
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
        .catch((err) => {
          console.log(err);
          const error = new Error("Server Error when dislike a post");
          return next(error);
        });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Post not found with this id.");
      return next(error);
    });
};

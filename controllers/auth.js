const crypto = require("crypto");
const User = require("../models/user");
const Post = require("../models/post");
const bcrypt = require("bcryptjs");
const mailSending = require("../utils/mailSending");
const saltRound = 10;
const { validationResult } = require("express-validator");

exports.renderResetPasswordPage = (req, res) => {
  res.render("auth/reset-password", {
    title: "Reset Password",
    errorMsg: null,
    oldFormData: { email: "" },
  });
};

exports.changeNewPasswordPage = (req, res, next) => {
  const { token } = req.params;

  User.findOne({ resetToken: token, tokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      if (user) {
        return res.render("auth/new-password", {
          title: "Change New Password",
          errorMsg: null,
          oldFormData: { password: "", confirmPassword: "" },
          resetToken: token,
          userId: user._id,
        });
      }
      res.redirect("/reset-password");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Check your token or token is expired!");
      return next(error);
    });
};

exports.renderFeedbackPage = (req, res) => {
  res.render("auth/feedback", { title: "Feedback" });
};

exports.renderViewProfile = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .select("_id username email profile_img bio followers following")
    .then((user) => {
      if (!user) {
        return res.redirect("/");
      }
      Post.find({ userId: id })
        .sort({ createdAt: -1 })
        .then((posts) => {
          res.render("profile", { title: user.username, user, posts });
        })
        .catch((err) => {
          console.log(err);
          const error = new Error(
            `Error when getting ${user.username}'s posts.`
          );
          return next(error);
        });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("User not found with this id.");
      return next(error);
    });
};

exports.renderProfileEditPage = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .select("_id username profile_img bio")
    .then((user) => {
      if (!user) {
        return res.redirect(`/profile/${id}`);
      }
      res.render("edit-profile", {
        title: user.username,
        user,
        errorMsg: null,
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("User not found with this id.");
      return next(error);
    });
};

exports.renderLoginPage = (req, res) => {
  res.render("auth/login", {
    title: "Login",
    errorMsg: null,
    oldFormData: { email: "", password: "" },
  });
};

exports.renderSignUpPage = (req, res) => {
  res.render("auth/signup", {
    title: "Sign Up",
    errorMsg: null,
    oldFormData: { username: "", email: "", password: "" },
  });
};

exports.loginAccount = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("auth/login", {
      title: "Login",
      errorMsg: errors.array()[0].msg,
      oldFormData: { email, password },
    });
  }

  User.findOne({ email })
    .then((user) => {
      return bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (!match) {
            return res.render("auth/login", {
              title: "Login",
              errorMsg: "Invalid email or password",
              oldFormData: { email, password },
            });
          }
          req.session.isLogin = true;
          req.session.userInfo = user;
          req.session.save((err) => {
            res.redirect("/");
            if (err) {
              console.log(err);
            }
          });
        })
        .catch((err) => {
          console.log(err);
          const error = new Error("Internal Server Error");
          return next(error);
        });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("User not found with this email.");
      return next(error);
    });
};

exports.signupAccount = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("auth/signup", {
      title: "Sign Up",
      errorMsg: errors.array()[0].msg,
      oldFormData: { username, email, password },
    });
  }

  User.findOne({ $or: [{ email }, { username }] })
    .then((user) => {
      return bcrypt
        .hash(password, saltRound)
        .then((hashPassword) => {
          return User.create({ username, email, password: hashPassword });
        })
        .then((_) => {
          res.redirect("/login");
          mailSending({
            to: email,
            subject: "Welcome to Dev Diaries!",
            text: "",
            html: `
            <div>
                <p>Hi ${username},</p>
                <p>Thank you for registering on Dev Diaries! We are thrilled to have you as a part of our community. </p>
                <p>You can now log in and start exploring our content, participating in discussions, and sharing your own development journey.</p>
                <p>Best regards,<br>The Dev Diaries Team</p>
            </div>
            `,
          });
        })
        .catch((err) => {
          console.log(err);
          const error = new Error("Internal Server Error");
          return next(error);
        });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Internal Server Error");
      return next(error);
    });
};

exports.logoutAccount = (req, res) => {
  req.session.destroy((_) => {
    res.redirect("/");
  });
};

exports.deleteAccount = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.redirect(`/profile/${id}`);
      }
      return Post.deleteMany({ userId: user._id })
        .then(() => {
          User.findByIdAndDelete(id);
        })
        .then(() => {
          return User.updateMany({
            $pull: { followers: user._id, following: user._id },
          });
        })
        .then(() => {
          return Post.updateMany({
            $pull: { like: user._id, dislike: user._id },
          });
        })
        .then(() => {
          // Call the logoutAccount function
          req.session.destroy((err) => {
            if (err) {
              console.log(err);
            }
            res.redirect("/");
          });
        });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("User not found with this id.");
      return next(error);
    });
};

exports.updateProfile = (req, res, next) => {
  const { id, username, bio } = req.body;
  const image = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("edit-profile", {
      title: username,
      user: { _id: id, username, bio },
      errorMsg: errors.array()[0].msg,
    });
  }

  if (image === undefined) {
    return res.render("edit-profile", {
      title: username,
      errorMsg: "Only .jpeg, .jpg and .png files are allowed!",
      user: { _id: id, username, bio },
    });
  }

  User.findById(id)
    .then((user) => {
      User.find({ _id: { $ne: id } }).then((users) => {
        let filterUsername = users.filter((u) => u.username === username);
        if (filterUsername.length) {
          return res.render("edit-profile", {
            title: username,
            user: { _id: id, username, bio },
            errorMsg: "Username is already taken.",
          });
        }
        user.username = username;
        if (image) {
          user.profile_img = image.path;
        }
        user.bio = bio.trim();
        user.save();
        req.session.userInfo = user;
        req.session.save((err) => {
          res.redirect(`/profile/${id}`);
          if (err) {
            console.log(err);
          }
        });
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("User not found with this id.");
      return next(error);
    });
};

exports.requestResetPasswordLink = (req, res, next) => {
  const { email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("auth/reset-password", {
      title: "Reset Password",
      errorMsg: errors.array()[0].msg,
      oldFormData: { email },
    });
  }

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset-password");
    }
    const token = buffer.toString("hex");
    User.findOne({ email })
      .then((user) => {
        user.resetToken = token;
        user.tokenExpiration = Date.now() + 300000;
        user.save();
        mailSending({
          to: email,
          subject: "Password Reset Request",
          text: "",
          html: `
            <div>
                <p>Dear ${user.name},</p>
                <p>We received a request to reset your password for your account associated with this email address. If you made this request, please click on the link below to reset your password:</p>
                <a href="http://localhost:8080/reset-password/${token}">Click here to reset your password</a>
                <p>This link will expire in 5 minutes for security purposes. If you did not request a password reset, please ignore this email, and your password will remain unchanged.</p>
                <p>Thank you, </br> The Dev Diaries Team</p>
                </br>
                <p>----</p>
                <p>Note: Do not reply to this email. This mailbox is not monitored.</p>
            </div>
            `,
        });
        return res.redirect("/feedback");
      })
      .catch((err) => {
        console.log(err);
        const error = new Error("User not found with this email.");
        return next(error);
      });
  });
};

exports.updatePassword = (req, res, next) => {
  const { password, confirmPassword, resetToken, userId } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("auth/new-password", {
      title: "Change New Password",
      errorMsg: errors.array()[0].msg,
      oldFormData: { password, confirmPassword },
      resetToken,
      userId,
    });
  }

  let resetUser;
  User.findOne({
    resetToken,
    tokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      if (password === confirmPassword) {
        resetUser = user;
        return bcrypt
          .hash(password, saltRound)
          .then((hashPassword) => {
            resetUser.password = hashPassword;
            resetUser.resetToken = undefined;
            resetUser.tokenExpiration = undefined;
            resetUser.save();
            res.redirect("/login");
          })
          .catch((err) => {
            console.log(err);
            const error = new Error("Internal Server Error.");
            return next(error);
          });
      }
      return res.render("auth/new-password", {
        title: "Change New Password",
        errorMsg: "Password doesn't match!",
        oldFormData: { password, confirmPassword },
        resetToken,
        userId,
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Internal Server Error");
      return next(error);
    });
};

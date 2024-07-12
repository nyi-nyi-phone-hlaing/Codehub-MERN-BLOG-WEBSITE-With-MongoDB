const crypto = require("crypto");
const User = require("../models/user");
const Post = require("../models/post");
const bcrypt = require("bcryptjs");
const mailSending = require("../utils/mailSending");
const saltRound = 10;

exports.renderResetPasswordPage = (req, res) => {
  let message = req.flash("error");
  if (message) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/reset-password", {
    title: "Reset Password",
    errorMsg: message,
  });
};

exports.changeNewPasswordPage = (req, res) => {
  const { token } = req.params;
  let message = req.flash("error");
  if (message) {
    message = message[0];
  } else {
    message = null;
  }

  User.findOne({ resetToken: token, tokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      if (user) {
        return res.render("auth/new-password", {
          title: "Change New Password",
          errorMsg: message,
          resetToken: token,
          userId: user._id,
        });
      }
      res.redirect("/reset-password");
    })
    .catch((err) => console.log(err));
};

exports.renderFeedbackPage = (req, res) => {
  res.render("auth/feedback", { title: "Feedback" });
};

exports.renderViewProfile = (req, res) => {
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
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.renderProfileEditPage = (req, res) => {
  const { id } = req.params;
  let message = req.flash("error");
  if (message) {
    message = message[0];
  } else {
    message = null;
  }
  User.findById(id)
    .select("_id username email profile_img bio")
    .then((user) => {
      if (!user) {
        return res.redirect(`/profile/${id}`);
      }
      res.render("edit-profile", {
        title: user.username,
        user,
        errorMsg: message,
      });
    })
    .catch((err) => console.log(err));
};

exports.renderLoginPage = (req, res) => {
  res.render("auth/login", {
    title: "Login",
    errorMsg: "",
    oldFormData: { email: "", password: "" },
  });
};

exports.renderSignUpPage = (req, res) => {
  res.render("auth/signup", { title: "Sign Up", errorMsg: req.flash("error") });
};

exports.loginAccount = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.render("auth/login", {
          title: "Login",
          errorMsg: "Invalid email or password",
          oldFormData: { email, password },
        });
      }
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
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.signupAccount = (req, res) => {
  const { username, email, password } = req.body;
  User.findOne({ $or: [{ email }, { username }] })
    .then((user) => {
      if (user) {
        if (user.username === username) {
          req.flash("error", "Username is already taken");
        }

        if (user.email === email) {
          req.flash("error", "Email is already taken");
        }
        return res.redirect("/signup");
      }
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
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.logoutAccount = (req, res) => {
  req.session.destroy((_) => {
    res.redirect("/");
  });
};

exports.deleteAccount = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.redirect(`/profile/${id}`);
      }
      return Post.deleteMany({ userId: user._id })
        .then(() => User.findByIdAndDelete(id))
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
    .catch((err) => console.log(err));
};

exports.updateProfile = (req, res) => {
  const { id, username, profile_img, bio } = req.body;
  User.findById(id)
    .then((user) => {
      User.find({ _id: { $ne: id } }).then((users) => {
        let filterUsername = users.filter((u) => u.username === username);
        if (filterUsername.length) {
          console.log(filterUsername);
          req.flash("error", "Username is already taken");
          return res.redirect(`/admin/edit-personal-profile/${id}`);
        }
        user.username = username;
        user.profile_img = profile_img;
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
    });
};

exports.requestResetPasswordLink = (req, res) => {
  const { email } = req.body;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset-password");
    }
    const token = buffer.toString("hex");
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash("error", "Sorry, we couldn't find a user with this email.");
          return res.redirect("/reset-password");
        }
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
      .catch((err) => console.log(err));
  });
};

exports.updatePassword = (req, res) => {
  const { password, confirmPassword, resetToken, userId } = req.body;

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
          .catch((err) => console.log(err));
      }
      return res.redirect(`/reset-password/${resetToken}`);
    })
    .catch((err) => console.log(err));
};

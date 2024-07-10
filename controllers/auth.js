const User = require("../models/user");
const Post = require("../models/post");
const bcrypt = require("bcryptjs");
const mailSending = require("../utils/mailSending");
const saltRound = 10;

exports.renderViewProfile = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .select("_id username email")
    .then((user) => {
      if (!user) {
        return res.redirect("/");
      }
      res.render("profile", { title: user.username, user });
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
            subject: "Sign Up Successfully",
            text: "",
            html: `
            <div>
                <p>Hi ${username},</p>
                <p>Thank you for signing up for our Blog Website. We're excited to have you on board!</p>
                <p>If you have any questions, feel free to reply to this email or visit our <a href="${process.env.SENDER}">support page</a>.</p>
                <p>Best regards,<br>The Team</p>
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

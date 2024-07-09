const User = require("../models/user");
const bcrypt = require("bcryptjs");
const saltRound = 10;
exports.renderLoginPage = (req, res) => {
  res.render("auth/login", { title: "Login", errorMsg: null });
};

exports.renderSignUpPage = (req, res) => {
  res.render("auth/signup", { title: "Sign Up", errorMsg: null });
};

exports.loginAccount = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        console.log("Invalid email or password");
        return res.render("auth/login", {
          title: "Login",
          errorMsg: "Invalid email or password",
        });
      }
      return bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (!match) {
            console.log("Invalid email or password");
            return res.render("auth/login", {
              title: "Login",
              errorMsg: "Invalid email or password",
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
          return res.render("auth/signup", {
            title: "Sign Up",
            errorMsg: "Username is already taken.",
          });
        }

        if (user.email === email) {
          return res.render("auth/signup", {
            title: "Sign Up",
            errorMsg: "Email has already taken. Go to login page",
          });
        }
      }
      return bcrypt
        .hash(password, saltRound)
        .then((hashPassword) => {
          return User.create({ username, email, password: hashPassword });
        })
        .then((_) => {
          res.redirect("/login");
          console.log("Sign Up successfully");
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

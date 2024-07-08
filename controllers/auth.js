exports.renderLoginPage = (req, res) => {
  res.render("auth/login", { title: "Login" });
};

exports.renderSignUpPage = (req, res) => {
  res.render("auth/signup", { title: "Sign Up" });
};

exports.loginAccount = (req, res) => {
  req.session.isLogin = true;
  res.redirect("/");
};

exports.signupAccount = (req, res) => {};

exports.logoutAccount = (req, res) => {
  req.session.destroy((_) => {
    res.redirect("/");
  });
};

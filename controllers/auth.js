exports.renderLoginPage = (req, res) => {
  res.render("auth/login", { title: "Login" });
};

exports.renderSignUpPage = (req, res) => {
  res.render("auth/signup", { title: "Sign Up" });
};

exports.loginAccount = (req, res) => {
  res.setHeader("Set-Cookie", "isLogin=true");
  res.redirect("/");
};

exports.signupAccount = (req, res) => {};

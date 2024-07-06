exports.renderHomePage = (req, res) => {
  res.render("home", { title: "Home Page" });
};

exports.renderCreatePage = (req, res) => {
  res.render("create-post", { title: "Create Post Page" });
};

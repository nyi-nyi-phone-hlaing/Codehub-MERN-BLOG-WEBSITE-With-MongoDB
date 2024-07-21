exports.isPremiumUser = (req, res, next) => {
  if (!req.session.userInfo.premium) {
    return res.redirect(`/admin/premium`);
  }
  next();
};

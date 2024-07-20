exports.isPremiumUser = (req, res, next) => {
  if (!req.session.userInfo.premium) {
    return res.redirect(`/profile/${req.session.userInfo._id}`);
  }
  next();
};

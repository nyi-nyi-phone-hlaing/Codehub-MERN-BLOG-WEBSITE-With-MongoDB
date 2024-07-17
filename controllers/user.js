const User = require("../models/user");

exports.renderSearchUserPage = (req, res) => {
  res.render("search-user", {
    title: "Explore World",
    users: [],
    oldSearchQuery: "",
  });
};

exports.renderViewFollowersPage = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.redirect(`/profile/${id}`);
      }

      const followersPromises = user.followers.map((follower) => {
        return User.findById(follower)
          .select("_id username email profile_img followers following")
          .then((user) => {
            return user;
          });
      });

      return Promise.all(followersPromises).then((followers) => {
        res.render("view-followers", {
          title: `${user.username}'s followers`,
          user,
          followers,
        });
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("User not found with this id.");
      return next(error);
    });
};

exports.renderViewFollowingPage = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.redirect(`/profile/${id}`);
      }

      const followeingPromises = user.following.map((followed) => {
        return User.findById(followed)
          .select("_id username email profile_img followers following")
          .then((user) => {
            return user;
          });
      });

      return Promise.all(followeingPromises).then((following) => {
        res.render("view-following", {
          title: `${user.username}'s following`,
          user,
          following,
        });
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("User not found with this id.");
      return next(error);
    });
};

exports.followUser = (req, res, next) => {
  const { userId, followId } = req.body;
  let prevUrl = req.get("Referer");
  let currentUser;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.redirect(prevUrl);
      }
      currentUser = user;
      return User.findById(followId);
    })
    .then((userToFollow) => {
      if (!userToFollow) {
        return res.redirect("/");
      }
      if (currentUser.following.includes(followId)) {
        console.log("Already following this user");
        return res.redirect(prevUrl);
      }

      currentUser.following.push(followId);
      userToFollow.followers.push(userId);

      Promise.all([currentUser.save(), userToFollow.save()])
        .then((_) => {
          req.session.userInfo = currentUser;
          return res.redirect(prevUrl);
        })
        .catch((err) => {
          console.log(err);
          const error = new Error("Internal Server Error");
          return next(error);
        });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("User not found with this id.");
      return next(error);
    });
};

exports.unfollowUser = (req, res, next) => {
  const { userId, unfollowId } = req.body;
  let currentUser;
  let prevUrl = req.get("Referer");

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.redirect(prevUrl);
      }
      currentUser = user;
      return User.findById(unfollowId);
    })
    .then((userToUnfollow) => {
      if (!userToUnfollow) {
        return res.redirect("/");
      }
      if (!currentUser.following.includes(unfollowId)) {
        console.log("Already unfollowing this user");
        return res.redirect(prevUrl);
      }

      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== unfollowId
      );
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (id) => id.toString() !== userId
      );

      Promise.all([currentUser.save(), userToUnfollow.save()]);
      req.session.userInfo = currentUser;
      return res.redirect(prevUrl);
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("User not found with this id.");
      return next(error);
    });
};

exports.searchUser = (req, res, next) => {
  const { search_query } = req.query;
  if (!req.query.search_query || req.query.search_query.trim() === "") {
    return res.redirect("/");
  }
  User.find()
    .select("_id username profile_img followers following")
    .then((users) => {
      let findResults = users.filter((user) => {
        if (req.session.isLogin) {
          return (
            user._id.toString() !== req.session.userInfo._id.toString() &&
            user.username.toLowerCase().includes(search_query.toLowerCase())
          );
        } else {
          return user.username
            .toLowerCase()
            .includes(search_query.toLowerCase());
        }
      });
      res.render("search-user", {
        title: "Explore World",
        users: findResults,
        searchQuery: search_query,
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Internal Server Error");
      return next(error);
    });
};

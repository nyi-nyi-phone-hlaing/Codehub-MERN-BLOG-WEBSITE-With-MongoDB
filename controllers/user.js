const User = require("../models/user");

exports.followUser = (req, res) => {
  const { userId, followId } = req.body;
  let currentUser;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.redirect(`/profile/${followId}`);
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
        return res.redirect(`/profile/${followId}`);
      }

      currentUser.following.push(followId);
      userToFollow.followers.push(userId);

      Promise.all([currentUser.save(), userToFollow.save()])
        .then((_) => {
          req.session.userInfo = currentUser;
          return res.redirect(`/profile/${followId}`);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.unfollowUser = (req, res) => {
  const { userId, unfollowId } = req.body;
  let currentUser;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.redirect(`/profile/${unfollowId}`);
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
        return res.redirect(`/profile/${unfollowId}`);
      }

      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== unfollowId
      );
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (id) => id.toString() !== userId
      );

      Promise.all([currentUser.save(), userToUnfollow.save()]);
      req.session.userInfo = currentUser;
      return res.redirect(`/profile/${unfollowId}`);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    });
};

exports.renderViewFollowersPage = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.redirect(`/profile/${id}`);
      }

      const followersPromises = user.followers.map((follower) => {
        return User.findById(follower)
          .select("_id username email profile_img followers")
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
    .catch((err) => console.log(err));
};

exports.renderViewFollowingPage = (req, res) => {
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
    .catch((err) => console.log(err));
};

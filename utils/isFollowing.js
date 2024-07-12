function isFollowing(currentUser, user) {
  return currentUser.following.some(
    (followedUserId) => followedUserId.toString() === user._id.toString()
  );
}
module.exports = isFollowing;

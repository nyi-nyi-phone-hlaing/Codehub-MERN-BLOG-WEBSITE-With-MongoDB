function isLiked(currentPost, user) {
  return currentPost.like.some(
    (likeUserId) => likeUserId.toString() === user._id.toString()
  );
}
module.exports = isLiked;

function isDisliked(currentPost, user) {
  return currentPost.dislike.some(
    (dislikeUserId) => dislikeUserId.toString() === user._id.toString()
  );
}
module.exports = isDisliked;

const deletePostForm = document.getElementById("deletePostForm");

// Function to confirm account deletion
deletePostForm.onsubmit = function (e) {
  if (
    !confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    )
  ) {
    e.preventDefault();
  }
};

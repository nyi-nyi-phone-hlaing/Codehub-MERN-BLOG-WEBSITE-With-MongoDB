const deleteAccountForm = document.getElementById("deleteAccountForm");

// Function to confirm account deletion
deleteAccountForm.onsubmit = function (e) {
  if (
    !confirm(
      "Are you sure you want to delete this account? This action cannot be undone."
    )
  ) {
    e.preventDefault();
  }
};

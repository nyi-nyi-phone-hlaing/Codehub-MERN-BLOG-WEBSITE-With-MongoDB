const togglePassword = document.querySelectorAll(".togglePassword");
const toggleMenuButton = document.getElementById("toggleMenuButton");
const deletePostForm = document.getElementById("deletePostForm");
const deleteAccountForm = document.getElementById("deleteAccountForm");

toggleMenuButton.onclick = function () {
  let menu = document.querySelector(".menu");
  const isActive = menu.classList.contains("active");
  if (isActive) {
    menu.classList.remove("active");
  } else {
    menu.classList.add("active");
  }
};

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

// Function to toggle the password visibility for multiple fields
togglePassword.forEach((button) => {
  button.addEventListener("click", function (e) {
    // Prevent form submission
    e.preventDefault();
    // Get the sibling password field
    const passwordField = this.previousElementSibling;
    // Toggle the type attribute
    const type =
      passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);
    // Toggle the button icon
    const icon = this.querySelector("i");
    if (type === "password") {
      icon.classList.add("fa-eye");
      icon.classList.remove("fa-eye-slash");
    } else {
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    }
  });
});

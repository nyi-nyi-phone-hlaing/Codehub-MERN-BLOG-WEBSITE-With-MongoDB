const togglePassword = document.querySelectorAll(".togglePassword");

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

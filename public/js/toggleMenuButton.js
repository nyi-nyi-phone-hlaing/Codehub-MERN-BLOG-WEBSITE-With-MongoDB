const toggleMenuButton = document.getElementById("toggleMenuButton");
toggleMenuButton.onclick = function () {
  let menu = document.querySelector(".menu");
  const isActive = menu.classList.contains("active");
  if (isActive) {
    menu.classList.remove("active");
  } else {
    menu.classList.add("active");
  }
};

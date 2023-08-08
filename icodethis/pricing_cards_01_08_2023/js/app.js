document.addEventListener("DOMContentLoaded", () => {
  const modeToggle = document.querySelector(".toggle");
  const body = document.body;

  modeToggle.addEventListener("change", () => {
    if (modeToggle.checked) {
      body.setAttribute("data-theme", "dark");
    } else {
      body.setAttribute("data-theme", "light");
    }
  });
});

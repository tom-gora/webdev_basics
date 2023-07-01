document.addEventListener("DOMContentLoaded", () => {
  let light_mode = localStorage.getItem("light_mode");
  const mode_toggle = document.querySelector("#mode-toggle");

  const enable_dark_mode = () => {
    document.body.classList.add("lightmode");
    localStorage.setItem("light_mode", "enabled");
  };

  const disable_dark_mode = () => {
    document.body.classList.remove("lightmode");
    localStorage.setItem("light_mode", "disabled");
  };

  const check_mode = () => {
    if (light_mode === "disabled") {
      disable_dark_mode();
      localStorage.setItem("light_mode", "disabled");
    } else {
      enable_dark_mode();
      localStorage.setItem("light_mode", "enabled");
    }
  };
  check_mode();

  const toggle_mode = () => {
    dark_mode = localStorage.getItem("light_mode");

    if (dark_mode === "enabled") {
      disable_dark_mode();
      localStorage.setItem("light_mode", "disabled");
    } else if (dark_mode === "disabled") {
      enable_dark_mode();
      localStorage.setItem("light_mode", "enabled");
    }
  };

  mode_toggle.addEventListener("click", () => {
    toggle_mode();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const buttons = new Array();
  const btnLight = document.getElementById("button-one-light");
  const btnDark = document.getElementById("button-one-dark");

  buttons.push(btnLight, btnDark);

  buttons.forEach((button) => {
    button.onmousemove = (e) => {
      const x = e.pageX - button.offsetLeft;
      const y = e.pageY - button.offsetTop;
      console.log(x, y);

      button.style.setProperty("--x", x + "px");
      button.style.setProperty("--y", y + "px");
    };
  });

  // TODO: Set radius on 2nd light with js (rx attr on rects in markup read from borderradius and set in place)
});

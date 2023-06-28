document.addEventListener("DOMContentLoaded", () => {
  // both of first buttons with "bubble up effect"

  const bubblingButtons = new Array();
  const bubblingBtnLight = document.getElementById("button-one-light");
  const bubblingBtnDark = document.getElementById("button-one-dark");

  bubblingButtons.push(bubblingBtnLight, bubblingBtnDark);

  bubblingButtons.forEach((button) => {
    button.onmousemove = (e) => {
      const x = e.pageX - button.offsetLeft;
      const y = e.pageY - button.offsetTop;

      button.style.setProperty("--x", x + "px");
      button.style.setProperty("--y", y + "px");
    };
  });

  // light button no2 with neon border

  const lightBtnTwo = document.querySelector("#button-two-light");

  const LB2radius = window
    .getComputedStyle(lightBtnTwo)
    .getPropertyValue("border-radius");

  const LB2svg = lightBtnTwo.querySelector("svg");
  const LB2rects = Array.from(LB2svg.children);

  LB2rects.forEach((rect) => {
    rect.setAttribute("rx", LB2radius);
  });

  // dark button no3

  const darkBtnThree = document.querySelector("#button-three-dark");
  const DB3hoverArea = document.querySelector("#button-three-dark-hover-area");
  const pointerToBorder = document.querySelector("#pointer-to-border");

  dot = (e) => {
    const rect = DB3hoverArea.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;
    pointerToBorder.style.setProperty("scale", 1);
    pointerToBorder.style.setProperty("left", x + "px");
    pointerToBorder.style.setProperty("top", y + "px");
    pointerToBorder.style.setProperty("width", "5px");
    pointerToBorder.style.setProperty("height", "5px");
    pointerToBorder.style.setProperty("border-radius", "50%");
    pointerToBorder.style.setProperty("background", "#aa4465");
    pointerToBorder.style.setProperty(
      "transition",
      "background 0s 500ms, scale 0s, width 500ms, height 500ms, border-radius 500ms"
    );
  };

  border = () => {
    pointerToBorder.style.setProperty("height", "6rem");
    pointerToBorder.style.setProperty("width", "20rem");
    pointerToBorder.style.setProperty("border-radius", "0.5rem");
    pointerToBorder.style.setProperty("scale", 1);
    pointerToBorder.style.setProperty("background", "transparent");
    pointerToBorder.style.setProperty("top", "50%");
    pointerToBorder.style.setProperty("left", "50%");
    pointerToBorder.style.setProperty("transform", "translate(-50%, -50%)");
    pointerToBorder.style.setProperty("border", "solid 3px #aa4465");
    pointerToBorder.style.setProperty(
      "transition",
      "height 500ms ease-in-out, width 500ms ease-in-out, border-radius 500ms ease-in-out, scale 0s, background 0s, top 500ms ease-in-out, left 500ms ease-in-out, transform 0s"
    );
  };

  // get the div to follow pointer
  DB3hoverArea.onmousemove = (e) => dot(e);

  // hide the div on leaving the area
  DB3hoverArea.onmouseleave = () => {
    pointerToBorder.style.setProperty("scale", 0);
  };

  darkBtnThree.onmouseenter = () => border();
});

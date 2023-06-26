document.addEventListener("DOMContentLoaded", function() {
  let colors = [];

  getColor = () => {
    var hue, saturation, lightness;
    hue = Math.floor(Math.random() * (360 - 0) + 0);
    saturation = "40";
    lightness = Math.floor(Math.random() * (75 - 65) + 65);

    return `hsl(${hue},${saturation}%,${lightness}%)`;
  };

  var cards = document.getElementsByClassName("card");
  const pastel_btn = document.getElementsByClassName("get-pastels")[0];

  pastel_btn.addEventListener("click", function() {
    redrawColors();
  });

  redrawColors = () => {
    colors = [];
    for (i = 0; i < 3; i++) {
      var color = getColor();
      colors.push(color);
    }

    for (i = 0; i < cards.length; i++) {
      var card = cards[i];
      card.style.backgroundColor = colors[i];
    }
  };
  redrawColors();
});

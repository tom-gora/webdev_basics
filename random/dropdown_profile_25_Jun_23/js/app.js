document.addEventListener("DOMContentLoaded", () => {
  const card = document.querySelector(".card");
  const toggle = card.querySelector(".toggle");

  toggle.onclick = () => {
    card.classList.toggle("visible");
    console.log(card, toggle);
  };
});

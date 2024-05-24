import * as cartFunctions from "./cart_functions.js";
const shippingCost = 20;
const loggedInID = sessionStorage.getItem("user_id");
const cartSidebar = document.querySelector("#cart-sidebar");
const inCartToggle = cartSidebar.querySelector(
  "#cart-sidebar-innner-close-btn"
);
const productsWrapper = cartSidebar.querySelector("#cart-products-wrapper");
const phoneCards = document.querySelectorAll(".phone-card");
const basketCounter = document.querySelector("#basket-counter");
const savedCardState = sessionStorage.getItem("cart_contents");
if (savedCardState === "no_cart") {
  basketCounter.classList.add("hidden");
}

phoneCards.forEach((phoneCard) => {
  const cardBtn = phoneCard.querySelector(".btn-neutral");
  const idToFetch = phoneCard.getAttribute("data-product-id");
  cardBtn.addEventListener("click", () =>
    cartFunctions.addProductFromPage(idToFetch, basketCounter, productsWrapper)
  );
  if (savedCardState !== "no_cart") {
    basketCounter.innerText = cartFunctions.getItemsCountTotal(
      JSON.parse(sessionStorage.getItem("cart_contents"))
    );
  }
});

inCartToggle.addEventListener("click", () => {
  inCartToggle.parentNode.classList.toggle("hidden");
  inCartToggle.parentNode.classList.toggle("animate-reverse");
});

loggedInID !== "no_id"
  ? cartFunctions.initCart(shippingCost, loggedInID, cartSidebar, basketCounter)
  : null;

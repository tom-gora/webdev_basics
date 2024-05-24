export const getProductData = async (client_request, product_id) => {
  const data = {
    client_request: client_request,
    product_id: product_id
  };
  const requestOpts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json, charset=utf-8"
    },
    body: JSON.stringify(data)
  };
  const url = "scripts/cart_functionality.php";
  return fetch(url, requestOpts)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.log(
        "There has been a problem with your fetch operation: " + error.message
      );
    });
};

export const deleteCartState = async (client_request, user_id) => {
  const data = {
    client_request: client_request,
    user_id: user_id
  };
  const requestOpts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json, charset=utf-8"
    },
    body: JSON.stringify(data)
  };
  const url = "scripts/cart_functionality.php";
  return fetch(url, requestOpts)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.log(
        "There has been a problem with your fetch operation: " + error.message
      );
    });
};

export const saveCartState = async (client_request, user_id, cart_state) => {
  const data = {
    client_request: client_request,
    user_id: user_id,
    cart_state: cart_state
  };
  const requestOpts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json, charset=utf-8"
    },
    body: JSON.stringify(data)
  };
  const url = "scripts/cart_functionality.php";
  return fetch(url, requestOpts)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.log(
        "There has been a problem with your fetch operation: " + error.message
      );
    });
};

export const getDataForCartInit = async (client_request, user_id) => {
  const data = {
    client_request: client_request,
    user_id: user_id
  };
  const requestOpts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json, charset=utf-8"
    },
    body: JSON.stringify(data)
  };
  const url = "scripts/cart_functionality.php";
  return fetch(url, requestOpts)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.log(
        "There has been a problem with your fetch operation: " + error.message
      );
    });
};

export const getCartProductHtml = async () => {
  const cartCardUrl = "html_components/cart_product_card.html";
  const response = await fetch(cartCardUrl);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.text();
};

export const updateCartPrices = (
  subtotalValue,
  shippingValue,
  subtotalDomTarget,
  shippingDomTarget,
  subtotalWithShippingDomTarget
) => {
  subtotalDomTarget.innerText = `£${subtotalValue.toFixed(2)}`;
  shippingDomTarget.innerText = `£${shippingValue.toFixed(2)}`;
  subtotalWithShippingDomTarget.innerText = `£${(subtotalValue + shippingValue).toFixed(2)}`;
};

export const getItemsCountTotal = (cartStateJson) => {
  if (cartStateJson === null) {
    return 0;
  }
  if (cartStateJson.products.length === 0) {
    return 0;
  }

  let itemsCountTotal = 0;
  cartStateJson.products.forEach((product) => {
    itemsCountTotal += parseInt(product.product_amount);
  });
  return itemsCountTotal;
};

export const removeItemCompletely = (product_id, cartStateJson) => {
  const newProducts = cartStateJson.products.filter(
    (product) => product.product_id != product_id
  );
  const newCartState = {
    ...cartStateJson,
    products: newProducts
  };
  return newCartState;
};

export const initCart = async (
  shippingCost,
  user_id,
  cartSidebar,
  basketCounter
) => {
  const client_request = "init_cart";

  const productsWrapper = cartSidebar.querySelector("#cart-products-wrapper");
  const subtotalTxt = cartSidebar.querySelector("#insert-subtotal");
  const shippingTxt = cartSidebar.querySelector("#insert-shipping");
  const subtotalWithShipping = cartSidebar.querySelector(
    "#insert-total-with-shipping"
  );
  try {
    const cardHtml = await getCartProductHtml();
    const cartData = await getDataForCartInit(client_request, user_id);
    console.log(cartData);
    const parser = new DOMParser();
    const parsedCard = parser.parseFromString(cardHtml, "text/html");
    if (cartData.order_contents === "no_cart") {
      sessionStorage.setItem("cart_contents", "no_cart");
      basketCounter.classList.add("hidden");
      updateCartPrices(0, 0, subtotalTxt, shippingTxt, subtotalWithShipping);
      return (productsWrapper.innerHTML =
        '<p class="text-lg text-bg-info pl-6">Your cart is empty</p>');
    } else {
      const orderContents = JSON.parse(cartData.order_contents);
      basketCounter.classList.remove("hidden");
      basketCounter.innerText = getItemsCountTotal(orderContents);
      sessionStorage.setItem("cart_contents", cartData.order_contents);
      let totalItems = 0;
      let subtotal = 0;

      const productPromises = orderContents.products.map((product) => {
        const productID = product.product_id;
        const client_request = "get_product_for_cart";
        const amount = parseInt(product.product_amount);
        totalItems = +amount;

        return getProductData(client_request, productID)
          .then((productData) => {
            const nextCard = parsedCard
              .querySelector(".cart-card")
              .cloneNode(true);
            const productPriceFloat = parseFloat(productData.product_price);
            subtotal += productPriceFloat * amount;

            // Update the cart card with product details
            nextCard
              .querySelector("img.cart-insert-img")
              .setAttribute(
                "src",
                `res/phones/${productData.product_img_path}`
              );
            nextCard.querySelector("h2.cart-insert-name").innerText =
              productData.product_name;
            nextCard.querySelector("p.cart-insert-price").innerText =
              `£${productData.product_price}`;
            nextCard.querySelector("input.cart-insert-amount").value = amount;
            nextCard.setAttribute("data-product-id", productID);
            productsWrapper.appendChild(nextCard);

            nextCard
              .querySelector("input.cart-insert-amount")
              .addEventListener("change", (e) => {
                const currentCartState = JSON.parse(
                  sessionStorage.getItem("cart_contents")
                );
                const oldAmount = currentCartState.products.find(
                  (product) => product.product_id === productID
                ).product_amount;
                const newAmount = parseInt(e.target.value);
                currentCartState.products.find(
                  (product) => product.product_id === productID
                ).product_amount = newAmount;
                saveCartState("save_cart_state", user_id, currentCartState);
                sessionStorage.setItem(
                  "cart_contents",
                  JSON.stringify(currentCartState)
                );

                const productPriceFloat = parseFloat(productData.product_price);
                const oldPerProductSubtotal = productPriceFloat * oldAmount;
                const newPerProductSubtotal = productPriceFloat * newAmount;
                const newSubtotal =
                  subtotal - oldPerProductSubtotal + newPerProductSubtotal;
                basketCounter.classList.remove("hidden");
                basketCounter.innerText = getItemsCountTotal(currentCartState);
                updateCartPrices(
                  newSubtotal,
                  shippingCost,
                  subtotalTxt,
                  shippingTxt,
                  subtotalWithShipping
                );
              });

            nextCard
              .querySelector(".remove-item-btn")
              .addEventListener("click", (e) => {
                e.preventDefault();
                const cardToRemove = e.target.closest(".cart-card");
                const idToRemove = cardToRemove.getAttribute("data-product-id");
                const currentCartState = JSON.parse(
                  sessionStorage.getItem("cart_contents")
                );
                if (currentCartState.products.length === 1) {
                  sessionStorage.setItem("cart_contents", "no_cart");
                  deleteCartState("delete_cart_state", user_id);
                  basketCounter.classList.add("hidden");
                  return (productsWrapper.innerHTML =
                    '<p class="text-lg text-bg-info pl-6">Your cart is empty</p>');
                }
                const newCartState = removeItemCompletely(
                  idToRemove,
                  currentCartState
                );
                saveCartState("save_cart_state", user_id, newCartState);
                sessionStorage.setItem(
                  "cart_contents",
                  JSON.stringify(newCartState)
                );
                basketCounter.innerText = getItemsCountTotal(newCartState);
                cardToRemove.remove();
              });
          })
          .catch((error) => {
            console.error("Error fetching product data:", error);
          });
      });
      Promise.all(productPromises)
        .then(() => {
          updateCartPrices(
            subtotal,
            shippingCost,
            subtotalTxt,
            shippingTxt,
            subtotalWithShipping
          );
        })
        .catch((error) => {
          console.error("Error processing products:", error);
        });
    }
  } catch (error) {
    console.error("Error initializing cart:", error);
  }
};

export const addProductFromPage = (
  product_id,
  basketCounter,
  productsWrapper
) => {
  const client_request = "get_product_for_cart";
  const user_id = sessionStorage.getItem("user_id");
  let productFound = false;
  let currentCartState = sessionStorage.getItem("cart_contents");
  if (currentCartState !== null && currentCartState !== "no_cart") {
    currentCartState = JSON.parse(currentCartState);
    productFound = false;
    currentCartState.products.forEach((product) => {
      if (product.product_id === parseInt(product_id)) {
        product.product_amount++;
        saveCartState("save_cart_state", user_id, currentCartState);
        sessionStorage.setItem(
          "cart_contents",
          JSON.stringify(currentCartState)
        );

        const inputToUpdate = document.querySelector(
          `.cart-card[data-product-id="${product_id}"]`
        );
        console.log(inputToUpdate);
        // .querySelector("input.cart-insert-amount");
        if (inputToUpdate) {
          inputToUpdate.value = product.product_amount;
        }
        productFound = true;
      }
    });
  }
  if (productFound) {
    return;
  }
  const promises = [
    getCartProductHtml(),
    getProductData(client_request, product_id)
  ];

  Promise.all(promises).then(([cardHtml, productData]) => {
    const parser = new DOMParser();
    const parsedCard = parser.parseFromString(cardHtml, "text/html");
    const cartCard = parsedCard.querySelector(".cart-card");
    if (currentCartState === "no_cart") {
      currentCartState = { products: [] };
    }
    const product = productData;
    cartCard
      .querySelector("img.cart-insert-img")
      .setAttribute("src", `res/phones/${product.product_img_path}`);
    cartCard.querySelector("h2.cart-insert-name").innerText =
      product.product_name;
    cartCard.querySelector("p.cart-insert-price").innerText =
      product.product_price;

    const newCartDataObject = {
      product_id: product.product_id,
      product_amount: 1
    };

    currentCartState.products.push(newCartDataObject);
    saveCartState("save_cart_state", user_id, currentCartState);
    sessionStorage.setItem("cart_contents", JSON.stringify(currentCartState));
    basketCounter.classList.remove("hidden");
    basketCounter.innerText = getItemsCountTotal(currentCartState);

    cartCard.setAttribute("data-product-id", product.product_id);
    //
    // cartCard.querySelector("input.cart-insert-amount").value++;
    // TODO: !!! pricing section update on product addition
    // two routes to be done, when item added to the empty cart,
    // and when items are in the cart already and there is a saved state
    //
    //
    //GET values for this function from the cart
    //         
    // updateCartPrices(
    //   currentSubtotal,
    //   shippingCost,
    //   subtotalTxt,
    //   shippingTxt,
    //   subtotalWithShipping
    // );

    cartCard
      .querySelector(".remove-item-btn")
      .addEventListener("click", (e) => {
        e.preventDefault();
        const cardToRemove = e.target.closest(".cart-card");
        const idToRemove = cardToRemove.getAttribute("data-product-id");
        const currentCartState = JSON.parse(
          sessionStorage.getItem("cart_contents")
        );
        if (currentCartState.products.length === 1) {
          sessionStorage.setItem("cart_contents", "no_cart");
          deleteCartState("delete_cart_state", user_id);
          basketCounter.classList.add("hidden");
          return (productsWrapper.innerHTML =
            '<p class="text-lg text-bg-info pl-6">Your cart is empty</p>');
        }
        const newCartState = removeItemCompletely(idToRemove, currentCartState);
        saveCartState("save_cart_state", user_id, newCartState);
        sessionStorage.setItem("cart_contents", JSON.stringify(newCartState));
        basketCounter.innerText = getItemsCountTotal(newCartState);
        cardToRemove.remove();
      });
    cartCard
      .querySelector("input.cart-insert-amount")
      .addEventListener("change", (e) => {
        const productID = cartCard.getAttribute("data-product-id");
        const currentCartState = sessionStorage.getItem("cart_contents");
        if (currentCartState === "no_cart") {
          currentCartState = { products: [] };
          currentCartState = JSON.parse(currentCartState);
        }
        const oldAmount = currentCartState.products.find(
          (product) => product.product_id === productID
        ).product_amount;
        const newAmount = parseInt(e.target.value);
        currentCartState.products.find(
          (product) => product.product_id === productID
        ).product_amount = newAmount;
        saveCartState("save_cart_state", user_id, currentCartState);
        sessionStorage.setItem(
          "cart_contents",
          JSON.stringify(currentCartState)
        );

        const productPriceFloat = parseFloat(productData.product_price);
        const oldPerProductSubtotal = productPriceFloat * oldAmount;
        const newPerProductSubtotal = productPriceFloat * newAmount;
        const currentSubtotal =
          subtotal - oldPerProductSubtotal + newPerProductSubtotal;
        subtotal = currentSubtotal;
        basketCounter.classList.remove("hidden");
        basketCounter.innerText = getItemsCountTotal(currentCartState);
        updateCartPrices(
          currentSubtotal,
          shippingCost,
          subtotalTxt,
          shippingTxt,
          subtotalWithShipping
        );
      });

    productsWrapper.innerText = "";
    productsWrapper.appendChild(cartCard);
  });
};

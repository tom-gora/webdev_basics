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
  shippingDomTarget.innerText = `£${shippingValue}`;
  subtotalWithShippingDomTarget.innerText = `£${(subtotalValue + shippingValue).toFixed(2)}`;
};

export const getItemsCountTotal = (cartStateJson) => {
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

export const initCart = (shippingCost, user_id, cartSidebar, basketCounter) => {
  const client_request = "init_cart";

  const productsWrapper = cartSidebar.querySelector("#cart-products-wrapper");
  const subtotalTxt = cartSidebar.querySelector("#insert-subtotal");
  const shippingTxt = cartSidebar.querySelector("#insert-shipping");
  const subtotalWithShipping = cartSidebar.querySelector(
    "#insert-total-with-shipping"
  );
  const promises = [
    getCartProductHtml(),
    getDataForCartInit(client_request, user_id)
  ];
  Promise.all(promises)
    .then(([cardHtml, cartData]) => {
      const entriesInCart = JSON.parse(cartData.order_contents).products.length;
      const parser = new DOMParser();
      const parsedCard = parser.parseFromString(cardHtml, "text/html");
      if (cartData.order_contents === "no_cart") {
        sessionStorage.setItem("cart_contents", "no_cart");
        return (productsWrapper.innerHTML =
          '<p class="text-lg text-bg-info pl-6">Your cart is empty</p>');
        basketCounter.classList.add("hidden");
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
              nextCard.dataset.productID = productID;

              // Append the modified cart card to the products wrapper
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

                  const productPriceFloat = parseFloat(
                    productData.product_price
                  );
                  const oldPerProductSubtotal = productPriceFloat * oldAmount;
                  const newPerProductSubtotal = productPriceFloat * newAmount;
                  const currentSubtotal =
                    subtotal - oldPerProductSubtotal + newPerProductSubtotal;
                  subtotal = currentSubtotal;
                  basketCounter.classList.remove("hidden");
                  basketCounter.innerText =
                    getItemsCountTotal(currentCartState);
                  updateCartPrices(
                    currentSubtotal,
                    shippingCost,
                    subtotalTxt,
                    shippingTxt,
                    subtotalWithShipping
                  );
                });

              nextCard
                .querySelector(".remove-item-btn")
                .addEventListener("click", (e) => {
                  const idToRemove = e.target.parentNode.dataset.productID;
                  const currentCartState = JSON.parse(
                    sessionStorage.getItem("cart_contents")
                  );
                  if (currentCartState.products.length === 1) {
                    sessionStorage.setItem("cart_contents", "no_cart");
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
                  e.target.parentNode.remove();
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
    })
    .catch((error) => {
      console.error("Error initializing cart:", error);
    });
};

export const addProductFromPage = (product_id) => {
  const client_request = "get_product_for_cart";
  const user_id = sessionStorage.getItem("user_id");
  const currentCartState = JSON.parse(sessionStorage.getItem("cart_contents"));
  let productFound = false;
  currentCartState.products.forEach((product) => {
    // TODO:
    if (product.product_id === parseInt(product_id)) {
      // "Do not append anything, increment product.product_amount, save updated json as newCartState, pass it to saveCartState, and set sessionStorage.
      // setItem(cart_contents, JSON.parse(newCartState)) then finally
      // cartToUpdate gonna be .cart-card[data-product-id="${product.product_id}"] and in this card find input.cart-insert-amount and it's value set to newCartState.products.find(product => product.product_id === product_id).product_amount this is just pseudocode notes to help me do the steps"
      product.product_amount++;
      cartFunctions.saveCartState("save_cart_state", user_id, currentCartState);
      sessionStorage.setItem("cart_contents", JSON.stringify(currentCartState));

      const inputToUpdate = document
        .querySelector(`.cart-card[data-product-i-d="${product.product_id}"]`)
        .querySelector("input.cart-insert-amount");
      if (inputToUpdate) {
        inputToUpdate.value = product.product_amount;
      }
      productFound = true;
    }
  });
  if (productFound) {
    return;
  }
  const promises = [
    cartFunctions.getCartProductHtml(),
    cartFunctions.getProductData(client_request, product_id)
  ];

  Promise.all(promises).then(([cardHtml, productData]) => {
    const parser = new DOMParser();
    const parsedCard = parser.parseFromString(cardHtml, "text/html");
    const cartCard = parsedCard.querySelector(".cart-card");
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
    cartFunctions.saveCartState("save_cart_state", user_id, currentCartState);
    sessionStorage.setItem("cart_contents", JSON.stringify(currentCartState));
    basketCounter.innerText =
      cartFunctions.getItemsCountTotal(currentCartState);
    productsWrapper.appendChild(cartCard);
  });
};

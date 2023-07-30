window.onload = () => {
  const toggles = document.querySelectorAll(".chevron-hint");
  const cards = document.querySelectorAll(".card");

  const addSizeMetadata = (elements) => {
    elements.forEach((element) => {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 600) {
        element.setAttribute("data-size", "large");
      } else {
        element.setAttribute("data-size", "small");
      }
    });
  };
  addSizeMetadata(cards);
  const handleResize = () => {
    addSizeMetadata(cards);
  };
  let wasLessThan600 = window.innerWidth < 600;

  window.addEventListener("resize", handleResize);

  const expandContent = (element) => {
    const parentCard = element.closest(".card");
    const parentFooter = element.parentElement;
    const cardThumbnail = parentCard.querySelector(".thumb");

    let cardSize = parentCard.getAttribute("data-size");
    let cardState = parentCard.getAttribute("aria-expanded");

    if (cardSize === "small" && cardState === "false") {
      parentCard.setAttribute("aria-expanded", "true");
      parentFooter.style.bottom = 0;
      element.style.transform = "rotate(180deg)";
    } else if (cardSize === "small" && cardState === "true") {
      parentCard.setAttribute("aria-expanded", "false");
      parentFooter.style.bottom = "-9rem";
      element.style.transform = "rotate(0deg)";
    } else if (cardSize === "large" && cardState === "false") {
      parentFooter.style.bottom = 0;
      parentCard.setAttribute("aria-expanded", "true");
      cardThumbnail.style.height = "25rem";
      element.style.transform = "rotate(0deg)";
    } else if (cardSize === "large" && cardState === "true") {
      parentFooter.style.bottom = 0;
      parentCard.setAttribute("aria-expanded", "false");
      cardThumbnail.style.height = 0;
      element.style.transform = "rotate(180deg)";
    }
  };

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      const clickedToggle = e.currentTarget;
      expandContent(clickedToggle);
    });
  });

  const resetOnResize = () => {
    console.log("crossed the breakpoint!");
    let cardsSize = cards[0].getAttribute("data-size");
    console.log(cardsSize);

    cards.forEach((card) => {
      card.setAttribute("aria-expanded", "false");
    });
  };

  const breakpointHandler = (mutationsList) => {
    resetOnResize;
  };

  const observer = new MutationObserver(breakpointHandler);

  cards.forEach((card) => {
    observer.observe(card, {
      attributes: true,
      attributeFilter: ["data-size"],
    });
  });
};

window.onload = () => {
  const navigation = document.querySelector(".links-navbar");
  const navigationToggle = navigation.querySelector(".toggle-navbar");
  const navigationIcon = navigationToggle.querySelector("ion-icon");

  const typewriter = document.querySelector(".typewriter h3");

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

  window.addEventListener("resize", handleResize);

  const expandContent = (element) => {
    const parentCard = element.closest(".card");
    const parentFooter = element.parentElement;
    const cardThumbnail = parentCard.querySelector(".thumb");

    let cardSize = parentCard.getAttribute("data-size");
    let cardState = parentCard.getAttribute("data-expanded");

    if (cardSize === "small" && cardState === "false") {
      parentCard.setAttribute("data-expanded", "true");
      parentCard.setAttribute("aria-expanded", "true");
      parentFooter.style.bottom = 0;
      element.style.transform = "rotate(180deg)";
    } else if (cardSize === "small" && cardState === "true") {
      parentCard.setAttribute("data-expanded", "false");
      parentCard.setAttribute("aria-expanded", "false");
      parentFooter.style.bottom = "-8rem";
      element.style.transform = "rotate(0deg)";
    } else if (cardSize === "large" && cardState === "false") {
      parentFooter.style.bottom = 0;
      parentCard.setAttribute("data-expanded", "true");
      parentCard.setAttribute("aria-expanded", "true");
      cardThumbnail.style.height = "25rem";
      element.style.transform = "rotate(0deg)";
    } else if (cardSize === "large" && cardState === "true") {
      parentFooter.style.bottom = 0;
      parentCard.setAttribute("data-expanded", "false");
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

  const resetCards = () => {
    location.reload();
  };
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "data-size" &&
        mutation.oldValue !== mutation.target.getAttribute("data-size")
      ) {
        resetCards();
      }
    }
  });

  const testedCard = cards[0];
  observer.observe(testedCard, {
    attributes: true,
    attributeFilter: ["data-size"],
    attributeOldValue: true, // Include the old value in the mutation object
  });

  const handleMobileNav = () => {
    const menuState = navigation.getAttribute("data-expanded");
    if (menuState === "false") {
      navigation.setAttribute("data-expanded", "true");
      navigationIcon.setAttribute("name", "close-circle");
    } else {
      navigation.setAttribute("data-expanded", "false");
      navigationIcon.setAttribute("name", "chevron-back-circle");
    }
  };

  navigationToggle.addEventListener("click", handleMobileNav);
  const animateTypewriter = () => {
    typewriter.setAttribute("data-animate", "true");
  };

  var typewriterObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting === true) animateTypewriter();
    },
    { threshold: [0.5] }
  );

  typewriterObserver.observe(typewriter);
};

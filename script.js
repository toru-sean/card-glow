document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const cardsContainer = document.querySelector(".cards-container");

  // Create cursor light
  const cursorLight = document.createElement("div");
  cursorLight.className = "cursor-light";
  document.body.appendChild(cursorLight);

  // Create initial set of cards
  function createCard(creature) {
    const card = document.createElement("div");
    card.className = "card";
    card.style.setProperty("--glow-color", creature.color);

    // Set random animation timings
    const glowDuration = 3 + Math.random() * 4; // Between 3 and 7 seconds
    const glowDelay = Math.random() * -5; // Random start time
    const flickerDuration = 2 + Math.random() * 3; // Between 2 and 5 seconds
    const flickerDelay = Math.random() * -5; // Random start time

    card.style.setProperty("--glow-duration", `${glowDuration}s`);
    card.style.setProperty("--glow-delay", `${glowDelay}s`);
    card.style.setProperty("--flicker-duration", `${flickerDuration}s`);
    card.style.setProperty("--flicker-delay", `${flickerDelay}s`);

    card.innerHTML = `<img class="card-image" src="${creature.image}" alt="${creature.name}">`;

    return card;
  }

  // Create three sets of cards for smooth infinite scroll
  function initializeCards() {
    // Clear existing cards
    cardsContainer.innerHTML = "";

    // Create three sets of cards
    for (let i = 0; i < 3; i++) {
      creatures.forEach((creature) => {
        const card = createCard(creature);
        cardsContainer.appendChild(card);
      });
    }
  }

  initializeCards();

  // Handle cursor movement
  document.addEventListener("mousemove", (e) => {
    cursorLight.style.left = `${e.clientX}px`;
    cursorLight.style.top = `${e.clientY}px`;
  });

  // Infinite scroll animation
  let scrollPosition = 0;
  const scrollSpeed = 0.5;
  const cardWidth =
    creatures.length *
    (parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--card-width"
      )
    ) +
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--card-spacing"
        )
      ));

  function animate() {
    scrollPosition += scrollSpeed;

    // Reset position when middle set of cards is fully visible
    if (scrollPosition >= cardWidth) {
      scrollPosition = 0;
    }

    cardsContainer.style.transform = `translateX(-${scrollPosition}px)`;
    requestAnimationFrame(animate);
  }

  animate();
});

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

    // Add hover effects
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      card.style.boxShadow = `0 0 30px ${creature.color}`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
      card.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.3)";
    });

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

    // Update card lighting based on cursor position
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.sqrt(
        Math.pow(e.clientX - (rect.left + rect.width / 2), 2) +
          Math.pow(e.clientY - (rect.top + rect.height / 2), 2)
      );

      const intensity = Math.max(0, 1 - distance / 500);
      card.style.setProperty("--glow-intensity", intensity);
    });
  });

  // Handle touch events for mobile
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  document.addEventListener("touchmove", (e) => {
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;

    const deltaX = touchX - touchStartX;
    const deltaY = touchY - touchStartY;

    cardsContainer.style.transform = `translateX(${deltaX}px) translateY(${deltaY}px)`;
  });

  document.addEventListener("touchend", () => {
    cardsContainer.style.transform = "translateX(0) translateY(0)";
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

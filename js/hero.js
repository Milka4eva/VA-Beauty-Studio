// HERO slideshow (auto + dots + swipe)
(() => {
  const slidesWrap = document.getElementById("heroSlides");
  const dotsWrap = document.getElementById("heroDots");
  if (!slidesWrap || !dotsWrap) return;

  const slides = Array.from(slidesWrap.querySelectorAll(".hero-slide"));
  const dots = Array.from(dotsWrap.querySelectorAll(".hero-dot"));
  if (!slides.length || slides.length !== dots.length) return;

  let index = 0;
  const INTERVAL = 6000;
  let timer = null;

  const show = (i) => {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle("is-active", k === index));
    dots.forEach((d, k) => d.classList.toggle("is-active", k === index));
  };

  const start = () => {
    stop();
    timer = setInterval(() => show(index + 1), INTERVAL);
  };

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  // dots click
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      show(i);
      start();
    });
  });

  // swipe
  let startX = 0;
  let startY = 0;
  let dragging = false;

  const THRESHOLD = 40; // px
  const RESTRAIN = 80;  // max vertical movement allowed

  const onStart = (x, y) => {
    startX = x;
    startY = y;
    dragging = true;
    stop(); // stop auto while swiping
  };

  const onEnd = (x, y) => {
    if (!dragging) return;
    dragging = false;

    const dx = x - startX;
    const dy = y - startY;

    // if mostly vertical movement -> treat as scroll
    if (Math.abs(dy) > RESTRAIN) {
      start();
      return;
    }

    if (Math.abs(dx) > THRESHOLD) {
      if (dx < 0) show(index + 1); // swipe left -> next
      else show(index - 1);        // swipe right -> prev
    }

    start();
  };

  // Touch
  slidesWrap.addEventListener(
    "touchstart",
    (e) => {
      const t = e.touches[0];
      onStart(t.clientX, t.clientY);
    },
    { passive: true }
  );

  slidesWrap.addEventListener(
    "touchend",
    (e) => {
      const t = e.changedTouches[0];
      onEnd(t.clientX, t.clientY);
    },
    { passive: true }
  );

  // Mouse (desktop testing)
  slidesWrap.addEventListener("mousedown", (e) => {
    onStart(e.clientX, e.clientY);
  });

  window.addEventListener("mouseup", (e) => {
    onEnd(e.clientX, e.clientY);
  });

  // init
  show(0);
  start();
})();
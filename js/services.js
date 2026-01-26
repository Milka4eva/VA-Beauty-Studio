// Services carousel (arrows + swipe/drag) — NO DOTS, NO AUTOPLAY
(() => {
  const viewport = document.getElementById("svcViewport");
  const track = document.getElementById("svcTrack");
  if (!viewport || !track) return;

  const cards = Array.from(track.children);
  if (!cards.length) return;

  const btnPrev = document.querySelector(".svc-arrow--left");
  const btnNext = document.querySelector(".svc-arrow--right");

  const GAP = 16; // должен совпадать с gap в CSS (.svc-track)
  let index = 0;
  let cardW = 0;
  let maxIndex = 0;

  // drag state
  let isDown = false;
  let startX = 0;
  let currentX = 0;
  let startTranslate = 0;
  let translateX = 0;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const setTransition = (on) => {
    track.style.transition = on ? "transform 380ms cubic-bezier(.2,.8,.2,1)" : "none";
  };

  const snapTo = (i, animate = true) => {
    index = clamp(i, 0, maxIndex);
    translateX = -index * cardW;
    setTransition(animate);
    track.style.transform = `translateX(${translateX}px)`;
  };

  const measure = () => {
    const first = cards[0].getBoundingClientRect();
    cardW = first.width + GAP;

    const vw = viewport.getBoundingClientRect().width;
    const visible = Math.max(1, Math.round(vw / cardW)); // обычно 2
    maxIndex = Math.max(0, cards.length - visible);

    index = clamp(index, 0, maxIndex);
    snapTo(index, false);
  };

  // arrows
  btnPrev?.addEventListener("click", () => snapTo(index - 1, true));
  btnNext?.addEventListener("click", () => snapTo(index + 1, true));

  // drag helpers
  const getX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

  const onDown = (e) => {
    isDown = true;
    startX = getX(e);
    currentX = startX;
    startTranslate = translateX;
    setTransition(false);
  };

  const onMove = (e) => {
    if (!isDown) return;
    currentX = getX(e);
    const dx = currentX - startX;

    let next = startTranslate + dx;
    const min = -maxIndex * cardW;
    const max = 0;

    // resistance on edges
    if (next > max) next = max + (next - max) * 0.25;
    if (next < min) next = min + (next - min) * 0.25;

    track.style.transform = `translateX(${next}px)`;
  };

  const onUp = () => {
    if (!isDown) return;
    isDown = false;

    const dx = currentX - startX;
    const threshold = Math.min(70, cardW * 0.22);

    if (dx < -threshold) snapTo(index + 1, true);
    else if (dx > threshold) snapTo(index - 1, true);
    else snapTo(index, true);
  };

  // Touch
  viewport.addEventListener("touchstart", onDown, { passive: true });
  viewport.addEventListener("touchmove", onMove, { passive: true });
  viewport.addEventListener("touchend", onUp);

  // Mouse (desktop testing)
  viewport.addEventListener("mousedown", onDown);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);

  window.addEventListener("resize", measure);

  // init
  measure();
})();
// Reviews bubbles reveal on scroll
(() => {
  const bubbles = document.querySelectorAll(".bubble");
  if (!bubbles.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  bubbles.forEach((b, i) => {
    b.style.transitionDelay = `${Math.min(i * 80, 280)}ms`;
    io.observe(b);
  });
})();
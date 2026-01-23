(() => {
  // ===== Burger dropdown =====
  const burgerBtn = document.getElementById("burgerBtn");
  const burgerMenu = document.getElementById("burgerMenu");

  const openBurger = () => {
    if (!burgerMenu) return;
    burgerMenu.hidden = false;
    burgerBtn?.setAttribute("aria-expanded", "true");
  };

  const closeBurger = () => {
    if (!burgerMenu) return;
    burgerMenu.hidden = true;
    burgerBtn?.setAttribute("aria-expanded", "false");
  };

  burgerBtn?.addEventListener("click", () => {
    if (!burgerMenu) return;
    burgerMenu.hidden ? openBurger() : closeBurger();
  });

  // Close burger when clicking outside
  document.addEventListener("click", (e) => {
    if (!burgerMenu || burgerMenu.hidden) return;
    const t = e.target;
    if (!t) return;
    if (burgerMenu.contains(t) || burgerBtn?.contains(t)) return;
    closeBurger();
  });

  // Close burger on link click (anchors)
  document.querySelectorAll("[data-menu-close]").forEach((el) => {
    el.addEventListener("click", () => closeBurger());
  });

  // ===== Modal (Contact Form) =====
  const modal = document.getElementById("contactModal");
  const openModalBtns = document.querySelectorAll("[data-open-modal]");
  const closeModalEls = document.querySelectorAll("[data-close-modal]");

  const openModal = () => {
    if (!modal) return;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  openModalBtns.forEach((btn) => btn.addEventListener("click", openModal));
  closeModalEls.forEach((el) => el.addEventListener("click", closeModal));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeBurger();
      if (modal && !modal.hidden) closeModal();
    }
  });

  // Prevent clicks inside panel from closing (backdrop has handler)
  modal?.querySelector(".modal__panel")?.addEventListener("click", (e) => e.stopPropagation());

  // Demo submit
  const form = document.getElementById("bookingForm");
  const status = document.getElementById("formStatus");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (status) status.textContent = "Enviado (demo). Luego conectamos WhatsApp / email.";
    form.reset();
  });

  // ===== Services slider arrows =====
  const track = document.getElementById("servicesTrack");
  const prev = document.getElementById("prevService");
  const next = document.getElementById("nextService");

  const scrollByCard = (dir) => {
    if (!track) return;
    const card = track.querySelector(".service-card");
    const cardW = card ? card.getBoundingClientRect().width : 260;
    track.scrollBy({ left: dir * (cardW + 14), behavior: "smooth" });
  };

  prev?.addEventListener("click", () => scrollByCard(-1));
  next?.addEventListener("click", () => scrollByCard(1));
})();

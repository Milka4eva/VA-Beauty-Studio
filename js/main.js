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

  // Real submit via FormSubmit (AJAX) + status
  const form = document.getElementById("bookingForm");
  const status = document.getElementById("formStatus");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.action) {
      if (status) status.textContent = "Error: no hay action en el formulario.";
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');

    try {
      if (submitBtn) submitBtn.disabled = true;
      if (status) status.textContent = "Enviando…";

      const fd = new FormData(form);

      const res = await fetch(form.action, {
        method: "POST",
        body: fd,
        headers: { "Accept": "application/json" }
      });

      if (res.ok) {
        if (status) status.textContent = "✅ Gracias! Hemos recibido tu solicitud.";
        form.reset();

        // обновим плейсхолдеры/оверлеи, если нужно
        document.querySelectorAll(".mselect").forEach((wrap) => {
          const sel = wrap.querySelector("select");
          const ph = wrap.querySelector("[data-placeholder]");
          if (sel && ph) ph.classList.toggle("is-hidden", sel.value !== "");
        });

        const dateWrap = document.querySelector(".mdate");
        if (dateWrap) {
          const dateInput = dateWrap.querySelector("#dateField");
          const datePh = dateWrap.querySelector("[data-date-placeholder]");
          if (dateInput && datePh) datePh.classList.toggle("is-hidden", !!dateInput.value);
        }

        // закрыть модалку через небольшую паузу
        setTimeout(() => {
          if (typeof closeModal === "function") closeModal();
          if (status) status.textContent = "";
        }, 1400);
      } else {
        if (status) status.textContent = "❌ Error al enviar. Inténtalo de nuevo.";
      }
    } catch (err) {
      if (status) status.textContent = "❌ Error de conexión. Inténtalo de nuevo.";
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
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

  // ===== Date: default today + min today + block Sunday =====
  const dateField = document.getElementById("dateField");
  const dateWarning = document.getElementById("dateWarning");
  const submitBtn = document.querySelector(".msubmit");

  const toISODate = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const checkSunday = () => {
    if (!dateField) return;

    const val = dateField.value;
    if (!val) return;

    const selected = new Date(val + "T00:00:00");
    const isSunday = selected.getDay() === 0; // Sunday = 0

    if (dateWarning) dateWarning.hidden = !isSunday;
    if (submitBtn) submitBtn.disabled = isSunday;

    if (submitBtn) {
      submitBtn.style.opacity = isSunday ? "0.5" : "1";
      submitBtn.style.cursor = isSunday ? "not-allowed" : "pointer";
    }
  };

  if (dateField) {
    const today = new Date();
    const iso = toISODate(today);

    dateField.min = iso;

    checkSunday();
    dateField.addEventListener("change", checkSunday);
  }

  // ===== Gold placeholder overlays for selects + date =====
  const bindSelectPlaceholder = (wrap) => {
    const sel = wrap.querySelector("select");
    const ph = wrap.querySelector("[data-placeholder]");
    if (!sel || !ph) return;

    const update = () => {
      ph.classList.toggle("is-hidden", sel.value !== "");
    };

    update();
    sel.addEventListener("change", update);
  };

  document.querySelectorAll(".mselect").forEach(bindSelectPlaceholder);

  // Date placeholder overlay
  const dateWrap = document.querySelector(".mdate");
  if (dateWrap) {
    const dateInput = dateWrap.querySelector("#dateField");
    const datePh = dateWrap.querySelector("[data-date-placeholder]");
    const updDate = () => {
      if (!dateInput || !datePh) return;
      datePh.classList.toggle("is-hidden", !!dateInput.value);
    };
    updDate();
    dateInput?.addEventListener("change", updDate);
  }
})();

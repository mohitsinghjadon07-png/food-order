// Progressive UX refinements for Maison Rouge.
(() => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.querySelector(".desktop-nav");
  const overlay = document.getElementById("overlay");
  const searchPanel = document.getElementById("searchPanel");
  const cartDrawer = document.getElementById("cartDrawer");
  const orderModal = document.getElementById("orderModal");

  // Add-to-bag persistence: the original app remains the source of cart behaviour.
  try {
    const originalUpdateCart = window.updateCart;
    // app.js keeps cart in a closure, so persist by observing its visible count and
    // rehydrate through the existing add buttons on the next visit.
    const saved = JSON.parse(localStorage.getItem("maisonRougeCart") || "{}");
    Object.entries(saved).forEach(([id, qty]) => {
      const addButton = document.querySelector(`[data-add="${id}"]`);
      if (addButton && Number.isInteger(qty) && qty > 0) {
        for (let i = 0; i < Math.min(qty, 20); i++) addButton.click();
      }
    });
    if (Object.keys(saved).length) document.getElementById("closeCart")?.click();
    const persistCart = () => {
      const rows = [...document.querySelectorAll(".cart-row")];
      const snapshot = {};
      rows.forEach(row => {
        const minus = row.querySelector("[data-qty]");
        const id = minus?.dataset.qty;
        const qty = Number(row.querySelector(".qty span")?.textContent || 0);
        if (id && qty > 0) snapshot[id] = qty;
      });
      localStorage.setItem("maisonRougeCart", JSON.stringify(snapshot));
    };
    document.getElementById("cartItems")?.addEventListener("click", () => setTimeout(persistCart, 0));
    document.getElementById("menuGrid")?.addEventListener("click", () => setTimeout(persistCart, 0));
    document.getElementById("placeOrder")?.addEventListener("click", () => localStorage.removeItem("maisonRougeCart"));
  } catch (e) {
    console.warn("Cart persistence is unavailable in this browser.", e);
  }

  // Mobile navigation now opens as a real dropdown and closes after selection.
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("mobile-open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("mobile-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }));

  // Subtle sticky-header treatment.
  const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 18);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Scroll reveals, with a graceful fallback for older browsers.
  const revealTargets = document.querySelectorAll(
    ".intro-strip, .section-heading, .toolbar, .dish-card, .editorial-image, .editorial-copy, .promise-grid article, .footer-top"
  );
  revealTargets.forEach(el => el.classList.add("reveal"));
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add("is-visible"));
  }

  // Keyboard dismissal and reliable modal/backdrop behaviour.
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    searchPanel?.classList.remove("open");
    nav?.classList.remove("mobile-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (cartDrawer?.classList.contains("open")) {
      document.getElementById("closeCart")?.click();
    }
    if (orderModal?.classList.contains("show")) {
      document.getElementById("closeOrder")?.click();
    }
  });
  overlay?.addEventListener("click", () => {
    if (orderModal?.classList.contains("show")) {
      orderModal.classList.remove("show");
      overlay.classList.remove("show");
    }
  });

  // Helpful confirmation when a dish is added (without interrupting the cart).
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);
  let toastTimer;
  document.getElementById("menuGrid")?.addEventListener("click", event => {
    if (!event.target.closest("[data-add]")) return;
    const card = event.target.closest(".dish-card");
    const dishName = card?.querySelector(".dish-name")?.textContent || "Your selection";
    toast.textContent = `${dishName} added to your bag`;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  });
})();

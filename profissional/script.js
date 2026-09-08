(() => {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Header
  const header = document.getElementById("site-header");
  const toggle = document.getElementById("menu-toggle");
  const onScrollHeader = () => {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  if (toggle && header) {
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
    header.querySelectorAll(".nav-mobile a").forEach((a) => {
      a.addEventListener("click", () => header.classList.remove("open"));
    });
  }

  // Reveal on scroll (single IntersectionObserver)
  const revealEls = document.querySelectorAll("[data-reveal],[data-reveal-mask]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // Hero parallax — single shared rAF ticker, only while hero is visible
  const heroBg = document.getElementById("hero-bg");
  const hero = document.querySelector(".hero");
  if (heroBg && hero && !reduceMotion) {
    let ticking = false;
    let heroVisible = true;
    const update = () => {
      ticking = false;
      if (!heroVisible) return;
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / window.innerHeight));
      heroBg.style.transform = `translateY(${progress * 60}px) scale(${1 + progress * 0.08})`;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        heroVisible = entries[0].isIntersecting;
      }).observe(hero);
    }
    update();
  }

  // Menu tabs
  const tabs = document.querySelectorAll(".menu-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
      tab.setAttribute("aria-selected", "true");
      document.querySelectorAll(".menu-panel").forEach((p) => {
        p.classList.remove("is-active");
        p.hidden = true;
      });
      const panel = document.getElementById(tab.getAttribute("aria-controls"));
      if (panel) {
        panel.classList.add("is-active");
        panel.hidden = false;
      }
    });
  });

  // FAQ accordion
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove("open");
          openItem.querySelector(".faq-q").setAttribute("aria-expanded", "false");
          openItem.querySelector(".faq-a").style.maxHeight = null;
        }
      });
      item.classList.toggle("open", !isOpen);
      q.setAttribute("aria-expanded", String(!isOpen));
      a.style.maxHeight = isOpen ? null : a.scrollHeight + "px";
    });
  });

  // Reserva -> WhatsApp
  const form = document.getElementById("reserva-form");
  const WHATSAPP_NUMBER = "5511432101980";
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const nome = (data.get("nome") || "").toString().trim();
      const pessoas = (data.get("pessoas") || "").toString().trim();
      const dataDesejada = (data.get("data") || "").toString().trim();
      const horario = (data.get("horario") || "").toString().trim();
      const mensagem = (data.get("mensagem") || "").toString().trim();

      const linhas = [
        `Olá! Gostaria de reservar uma mesa na Forno Nobile.`,
        `Nome: ${nome}`,
        `Pessoas: ${pessoas}`,
        `Data: ${dataDesejada}`,
        `Horário: ${horario}`,
      ];
      if (mensagem) linhas.push(`Observação: ${mensagem}`);

      const texto = encodeURIComponent(linhas.join("\n"));
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`, "_blank", "noopener");
    });
  }
})();

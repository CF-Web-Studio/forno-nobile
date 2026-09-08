(() => {
  "use strict";

  // Menu mobile
  const header = document.getElementById("site-header");
  const toggle = document.getElementById("menu-toggle");
  if (toggle && header) {
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
    header.querySelectorAll(".nav-mobile a").forEach((a) => {
      a.addEventListener("click", () => {
        header.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Reveal on scroll
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll("[data-reveal]");
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
      const mensagem = (data.get("mensagem") || "").toString().trim();

      const linhas = [
        `Olá! Gostaria de reservar uma mesa na Forno Nobile.`,
        `Nome: ${nome}`,
        `Pessoas: ${pessoas}`,
        `Data: ${dataDesejada}`,
      ];
      if (mensagem) linhas.push(`Observação: ${mensagem}`);

      const texto = encodeURIComponent(linhas.join("\n"));
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`, "_blank", "noopener");
    });
  }
})();

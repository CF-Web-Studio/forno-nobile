import { useCallback, useState } from "react";
import { BRAND } from "../shared/brand";
import { useScrolled, useBodyScrollLock, useEscape, anchorHandler } from "../shared/ui";

const NAV = [
  { href: "#mais-pedidas", label: "Mais pedidas" },
  { href: "#cardapio", label: "Cardápio" },
  { href: "#sobre", label: "Sobre" },
  { href: "#galeria", label: "Galeria" },
  { href: "#visitar", label: "Visitar" },
];

function Mark() {
  return (
    <svg viewBox="0 0 48 48" width="34" height="34" aria-hidden="true">
      <circle cx="24" cy="24" r="21" fill="none" stroke="var(--color-terra)" stroke-width="2.5" />
      <circle cx="24" cy="24" r="13" fill="none" stroke="currentColor" stroke-width="1.5" />
    </svg>
  );
}

export function Header() {
  const scrolled = useScrolled(40);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useBodyScrollLock(open);
  useEscape(open, close);

  return (
    <header
      className={`site-header${scrolled || open ? " is-solid" : ""}`}
      data-open={open || undefined}
    >
      <div className="wrap site-header__bar">
        <a
          href="#topo"
          className="brand"
          onClick={anchorHandler("#topo", { offset: 0 })}
          aria-label="Forno Nobile — início"
        >
          <Mark />
          <span className="brand__name">
            {BRAND.name}
            <small>Pizza napolitana</small>
          </span>
        </a>

        <nav aria-label="Navegação principal" className="nav-desktop">
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={anchorHandler(item.href)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__cta">
          <a
            className="btn"
            href="#reserva"
            onClick={anchorHandler("#reserva")}
          >
            Reservar
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="nav-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="nav-mobile" id="nav-mobile" hidden={!open}>
        <ul>
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={anchorHandler(item.href, { onDone: close })}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              className="btn"
              href="#reserva"
              onClick={anchorHandler("#reserva", { onDone: close })}
            >
              Reservar mesa
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}

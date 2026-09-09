import { useCallback, useState } from "react";
import { BRAND } from "../shared/brand";
import { useScrolled, useBodyScrollLock, useEscape, anchorHandler } from "../shared/ui";

const NAV = [
  { href: "#materia", label: "Matéria" },
  { href: "#exploded", label: "Montagem" },
  { href: "#fogo", label: "Fogo" },
  { href: "#sabores", label: "Sabores" },
  { href: "#reservas", label: "Reservas" },
];

export function Header() {
  const scrolled = useScrolled(60);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useBodyScrollLock(open);
  useEscape(open, close);

  return (
    <header className={`m-header${scrolled || open ? " is-solid" : ""}`} data-open={open || undefined}>
      <div className="wrap m-header__bar">
        <a href="#topo" className="m-brand" onClick={anchorHandler("#topo", { offset: 0 })} aria-label="Forno Nobile — início">
          <svg viewBox="0 0 48 48" width="30" height="30" aria-hidden="true">
            <circle cx="24" cy="24" r="21" fill="none" stroke="var(--color-ember)" strokeWidth="2.5" />
            <circle cx="24" cy="24" r="11" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
          {BRAND.name}
        </a>

        <nav className="m-nav" aria-label="Navegação principal">
          <ul>
            {NAV.map((i) => (
              <li key={i.href}>
                <a href={i.href} onClick={anchorHandler(i.href)}>{i.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="m-header__cta">
          <a className="btn" href="#reservas" onClick={anchorHandler("#reservas")}>
            Reservar
          </a>
          <button
            type="button"
            className="m-burger"
            aria-expanded={open}
            aria-controls="m-drawer"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className="m-drawer" id="m-drawer" hidden={!open}>
        <ul>
          {NAV.map((i) => (
            <li key={i.href}>
              <a href={i.href} onClick={anchorHandler(i.href, { onDone: close })}>{i.label}</a>
            </li>
          ))}
          <li>
            <a className="btn" href="#reservas" onClick={anchorHandler("#reservas", { onDone: close })}>
              Reservar mesa
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}

import { useCallback, useState } from "react";
import { BRAND } from "../shared/brand";
import { useScrolled, useBodyScrollLock, useEscape, anchorHandler } from "../shared/ui";
import { MagneticButton } from "../shared/components/MagneticButton";

const NAV = [
  { href: "#manifesto", label: "Manifesto" },
  { href: "#processo", label: "Processo" },
  { href: "#produtos", label: "Cardápio" },
  { href: "#galeria", label: "Galeria" },
  { href: "#reservas", label: "Reservas" },
];

export function Header() {
  const scrolled = useScrolled(48);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useBodyScrollLock(open);
  useEscape(open, close);

  return (
    <header className={`p-header${scrolled || open ? " is-solid" : ""}`} data-open={open || undefined}>
      <div className="wrap p-header__bar">
        <a href="#topo" className="p-brand" onClick={anchorHandler("#topo", { offset: 0 })} aria-label="Forno Nobile — início">
          <svg viewBox="0 0 48 48" width="32" height="32" aria-hidden="true">
            <circle cx="24" cy="24" r="21" fill="none" stroke="var(--color-gold)" strokeWidth="2.5" />
            <circle cx="24" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="1.25" />
          </svg>
          <span className="p-brand__name">{BRAND.name}</span>
        </a>

        <nav className="p-nav" aria-label="Navegação principal">
          <ul>
            {NAV.map((i) => (
              <li key={i.href}>
                <a href={i.href} onClick={anchorHandler(i.href)}>{i.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-header__cta">
          <MagneticButton className="btn" href="#reservas" onClick={anchorHandler("#reservas")}>
            Reservar mesa
          </MagneticButton>
          <button
            type="button"
            className="p-burger"
            aria-expanded={open}
            aria-controls="p-drawer"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className="p-drawer" id="p-drawer" hidden={!open}>
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

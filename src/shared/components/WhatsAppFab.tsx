import { whatsappLink } from "../brand";

/** Botão flutuante de WhatsApp — link wa.me, sem API, sem chave. */
export function WhatsAppFab({
  message = "Olá! Gostaria de fazer uma reserva na Forno Nobile.",
  className = "",
}: {
  message?: string;
  className?: string;
}) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Forno Nobile no WhatsApp"
      className={className}
      style={{
        position: "fixed",
        right: "clamp(1rem, 3vw, 2rem)",
        bottom: "clamp(1rem, 3vw, 2rem)",
        zIndex: 60,
        width: 56,
        height: 56,
        display: "grid",
        placeItems: "center",
        borderRadius: 999,
        background: "#1fa855",
        color: "#fff",
        boxShadow: "0 10px 30px -8px rgba(0,0,0,.35)",
      }}
    >
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.36a9.86 9.86 0 004.62 1.16h.01c5.46 0 9.9-4.45 9.9-9.9C21.95 6.45 17.5 2 12.04 2zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.36-.5.06-1.08.28-3.6-.75-3.03-1.25-4.98-4.32-5.13-4.53-.15-.2-1.22-1.62-1.22-3.1 0-1.47.77-2.19 1.05-2.49.27-.29.6-.36.8-.36.2 0 .4 0 .58.01.18.01.44-.07.68.52.25.6.85 2.07.92 2.22.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.36 1.46.3.15.47.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.27.1 1.73.82 2.02.97.3.15.5.22.57.35.07.13.07.75-.17 1.43z" />
      </svg>
    </a>
  );
}

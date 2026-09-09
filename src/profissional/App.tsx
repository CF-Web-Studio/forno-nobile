import { useSmoothScroll } from "../shared/motion/hooks";
import { WhatsAppFab } from "../shared/components/WhatsAppFab";
import { Header } from "./Header";
import {
  Hero,
  Manifesto,
  Storytelling,
  Produtos,
  Campanha,
  ProcessoVideo,
  Galeria,
  Reserva,
  Footer,
} from "./sections";

export function App() {
  useSmoothScroll();

  return (
    <>
      <a className="skip-link" href="#produtos">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Manifesto />
        <Storytelling />
        <ProcessoVideo />
        <Produtos />
        <Campanha />
        <Galeria />
        <Reserva />
      </main>
      <Footer />
      <WhatsAppFab message="Olá! Gostaria de reservar uma mesa na Forno Nobile." />
    </>
  );
}

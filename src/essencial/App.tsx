import { useSmoothScroll } from "../shared/motion/hooks";
import { WhatsAppFab } from "../shared/components/WhatsAppFab";
import { Header } from "./Header";
import {
  Hero,
  MaisPedidas,
  Cardapio,
  Sobre,
  Galeria,
  Visitar,
  Reserva,
  Footer,
} from "./sections";

export function App() {
  useSmoothScroll();

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <MaisPedidas />
        <Cardapio />
        <Sobre />
        <Galeria />
        <Visitar />
        <Reserva />
      </main>
      <Footer />
      <WhatsAppFab message="Olá! Gostaria de reservar uma mesa na Forno Nobile." />
    </>
  );
}

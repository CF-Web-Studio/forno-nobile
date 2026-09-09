import { useSmoothScroll } from "../shared/motion/hooks";
import { WhatsAppFab } from "../shared/components/WhatsAppFab";
import { Header } from "./Header";
import { Assembly } from "./Assembly";
import { Materia, Fogo, Produto, Sabores, Final, Footer } from "./sections";
import { HeroV3 } from "./HeroV3";

export function App() {
  useSmoothScroll();

  return (
    <>
      <a className="skip-link" href="#sabores">
        Pular para o cardápio
      </a>
      <Header />
      <main id="conteudo">
        <HeroV3 />
        <Materia />
        <Assembly />
        <Fogo />
        <Produto />
        <Sabores />
        <Final />
      </main>
      <Footer />
      <WhatsAppFab message="Olá! Gostaria de reservar uma mesa na Forno Nobile." />
    </>
  );
}

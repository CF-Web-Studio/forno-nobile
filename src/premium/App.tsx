import { useSmoothScroll } from "../shared/motion/hooks";
import { WhatsAppFab } from "../shared/components/WhatsAppFab";
import { Header } from "./Header";
import { Exploded } from "./Exploded";
import { Hero, Materia, Fogo, Produto, Sabores, Final, Footer } from "./sections";

export function App() {
  useSmoothScroll();

  return (
    <>
      <a className="skip-link" href="#sabores">
        Pular para o cardápio
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Materia />
        <Exploded />
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

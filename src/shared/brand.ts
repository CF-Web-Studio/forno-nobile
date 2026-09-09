// Forno Nobile — marca FICTÍCIA usada como demonstração da CF Web Studio.
// Nenhum dado abaixo corresponde a estabelecimento real.

export const BRAND = {
  name: "Forno Nobile",
  tagline: "Pizza napolitana no forno a lenha",
  city: "São Paulo / SP",
  address: "Rua das Oliveiras, 128 — Vila das Oliveiras",
  mapsQuery: "Rua+das+Oliveiras+128+Sao+Paulo",
  email: "contato@fornonobile.com.br",
  phoneDisplay: "(11) 4321-0198",
  whatsapp: "5511432101980",
  instagram: "fornonobile",
  hours: [
    { d: "Terça a sexta", h: "18h30 – 23h" },
    { d: "Sábado", h: "12h – 23h" },
    { d: "Domingo", h: "12h – 22h" },
    { d: "Segunda", h: "Fechado" },
  ],
} as const;

export const STUDIO = {
  name: "CF Web Studio",
  url: "https://cf-web-studio.github.io/",
} as const;

/** Monta um link wa.me com a mensagem já codificada (sem API, sem chave). */
export function whatsappLink(message: string): string {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${BRAND.mapsQuery}`;

export type MenuItem = {
  name: string;
  price: string;
  desc: string;
  veg?: boolean;
};

export const MENU: MenuItem[] = [
  {
    name: "Margherita",
    price: "R$ 48",
    desc: "Molho de tomate, muçarela fior di latte, manjericão fresco, azeite extravirgem.",
    veg: true,
  },
  {
    name: "Diavola",
    price: "R$ 54",
    desc: "Molho de tomate, muçarela, calabresa picante, pimenta biquinho.",
  },
  {
    name: "Quattro Formaggi",
    price: "R$ 59",
    desc: "Muçarela, gorgonzola, parmesão e provolone, finalizada com mel.",
    veg: true,
  },
  {
    name: "Prosciutto e Funghi",
    price: "R$ 62",
    desc: "Molho de tomate, muçarela, presunto parma, cogumelos frescos salteados.",
  },
  {
    name: "Marinara",
    price: "R$ 42",
    desc: "Molho de tomate, alho laminado, orégano, azeite — sem queijo, a mais tradicional.",
    veg: true,
  },
  {
    name: "Napoli",
    price: "R$ 55",
    desc: "Molho de tomate, muçarela de búfala, anchova, alcaparras, orégano.",
  },
];

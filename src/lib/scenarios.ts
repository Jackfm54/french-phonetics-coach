import type { AccentId } from "@/lib/accents";

export type CEFR = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type Scenario = {
  id: string;
  title: string;
  emoji: string;
  level: CEFR;
  accent: AccentId;
  role: string; // Rol del tutor IA
  goal: string; // Objetivo del alumno
  opener: string; // Primera línea del NPC en francés
  vocab: string[]; // Léxico clave sugerido
  hints: string[]; // Pistas en español
};

export const SCENARIOS: Scenario[] = [
  {
    id: "cafe-paris",
    title: "Comander en un café de París",
    emoji: "☕",
    level: "A1",
    accent: "fr_parisien",
    role: "Serveur d'un café parisien de quartier, sympathique mais pressé.",
    goal: "Saluda, pide una bebida y algo dulce, pregunta el precio y paga.",
    opener: "Bonjour ! Installez-vous. Qu'est-ce que je vous sers ?",
    vocab: ["un café", "un croissant", "une addition", "s'il vous plaît", "l'addition"],
    hints: [
      "Empieza con « Bonjour »",
      "Usa « je voudrais… » para pedir",
      "Pregunta « ça fait combien ? »",
    ],
  },
  {
    id: "boulangerie",
    title: "En la boulangerie",
    emoji: "🥖",
    level: "A1",
    accent: "fr_standard",
    role: "Boulangère aimable qui vend du pain et des viennoiseries.",
    goal: "Compra pan, dos croissants y pregunta si tienen pain au chocolat.",
    opener: "Bonjour, madame/monsieur ! Qu'est-ce qu'il vous faut aujourd'hui ?",
    vocab: ["une baguette", "un pain au chocolat", "combien ça coûte", "je prends"],
    hints: ["Cantidad: « deux croissants »", "Pregunta educadamente con « est-ce que… »"],
  },
  {
    id: "aeroport-checkin",
    title: "Check-in en el aeropuerto",
    emoji: "✈️",
    level: "A2",
    accent: "fr_standard",
    role: "Agent d'enregistrement Air France à Roissy CDG, poli et efficace.",
    goal: "Presenta tu pasaporte, factura una maleta y pide asiento de ventana.",
    opener: "Bonjour, votre passeport et votre billet, s'il vous plaît.",
    vocab: ["une valise", "une place côté hublot", "la porte d'embarquement", "un vol"],
    hints: ["« Voici mon passeport »", "« Je préfère une place côté hublot »"],
  },
  {
    id: "hotel-reservation",
    title: "Reservar hotel por teléfono",
    emoji: "🏨",
    level: "A2",
    accent: "fr_standard",
    role: "Réceptionniste d'un hôtel 3 étoiles à Lyon.",
    goal: "Reserva una habitación doble para dos noches con desayuno.",
    opener: "Hôtel des Voyageurs, bonjour. En quoi puis-je vous aider ?",
    vocab: ["une chambre double", "deux nuits", "le petit-déjeuner", "réserver"],
    hints: ["Fechas: « du 12 au 14 juin »", "« Est-ce que le petit-déjeuner est inclus ? »"],
  },
  {
    id: "medecin",
    title: "Consulta con el médico",
    emoji: "🩺",
    level: "B1",
    accent: "fr_standard",
    role: "Médecin généraliste, à l'écoute et méthodique.",
    goal: "Describe tus síntomas (fiebre, dolor de garganta) y pide una receta.",
    opener: "Bonjour, asseyez-vous. Alors, qu'est-ce qui vous amène aujourd'hui ?",
    vocab: ["j'ai mal à…", "de la fièvre", "une ordonnance", "depuis trois jours"],
    hints: ["Ubica el dolor: « j'ai mal à la gorge »", "Duración: « depuis… »"],
  },
  {
    id: "entretien-embauche",
    title: "Entrevista de trabajo",
    emoji: "💼",
    level: "B2",
    accent: "fr_standard",
    role: "Recruteuse RH d'une startup tech à Paris. Questions précises et suivies de relances.",
    goal: "Preséntate, explica tu experiencia y por qué te interesa el puesto.",
    opener:
      "Bonjour, merci d'être venu(e). Pour commencer, pouvez-vous vous présenter en quelques minutes ?",
    vocab: ["mon parcours", "mes compétences", "un défi", "une équipe"],
    hints: ["Estructura: formación → experiencia → motivación", "Ejemplos concretos con « par exemple »"],
  },
  {
    id: "location-appart",
    title: "Visita de apartamento en alquiler",
    emoji: "🏠",
    level: "B1",
    accent: "fr_parisien",
    role: "Propriétaire d'un studio à louer dans le 11ème arrondissement de Paris.",
    goal: "Pregunta por el precio, cargas, contrato y si acepta estudiantes extranjeros.",
    opener: "Bonjour, entrez ! Voilà, c'est un studio de 22 mètres carrés, très lumineux.",
    vocab: ["le loyer", "les charges", "la caution", "un garant"],
    hints: ["« Quel est le montant des charges ? »", "« Acceptez-vous un garant à l'étranger ? »"],
  },
  {
    id: "quebec-cafe",
    title: "Café en Montréal",
    emoji: "🍁",
    level: "A2",
    accent: "qc_quebecois",
    role: "Barista d'un café du Plateau Mont-Royal à Montréal, décontracté(e).",
    goal: "Pide un café con leche y una galleta, adapta el oído al acento quebequés.",
    opener: "Allô ! Bienvenue. Qu'est-ce que je te sers à matin ?",
    vocab: ["un latte", "un biscuit", "à emporter", "bienvenue"],
    hints: ["Tuteo natural en Quebec", "« C'est combien ? »"],
  },
  {
    id: "debat-c1",
    title: "Debate: ecología en la ciudad",
    emoji: "🌱",
    level: "C1",
    accent: "fr_standard",
    role: "Animatrice de débat qui pose des questions provocantes et relance avec des contre-arguments.",
    goal: "Defiende una postura sobre coches en el centro de la ciudad con argumentos y ejemplos.",
    opener:
      "Bien, entrons dans le vif du sujet : faut-il interdire totalement les voitures en centre-ville ? Quelle est votre position et pourquoi ?",
    vocab: ["à mon avis", "en revanche", "par ailleurs", "force est de constater"],
    hints: ["Estructura tesis-argumento-ejemplo", "Conectores lógicos"],
  },
  {
    id: "urgence-c2",
    title: "Reclamación formal a un servicio",
    emoji: "📞",
    level: "C2",
    accent: "fr_standard",
    role: "Responsable service client d'une compagnie ferroviaire, courtois mais procédurier.",
    goal: "Reclama por un tren cancelado, exige reembolso y usa registro formal.",
    opener:
      "Service clientèle, bonjour. Je vous écoute, quel est le motif exact de votre appel ?",
    vocab: ["je tiens à signaler", "un dédommagement", "conformément à", "faire valoir mes droits"],
    hints: ["Registro formal, usa condicional de cortesía", "Cita hechos con fecha y hora"],
  },
];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

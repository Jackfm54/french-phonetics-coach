/**
 * Simulacros de COMPRENSIÓN ORAL (TCF / DELF / DALF).
 * Cada tarea = un audio en francés + preguntas de opción múltiple.
 * El audio se genera on-demand con TTS (openai/gpt-4o-mini-tts) vía /api/tts.
 */

export type ListeningQuestion = {
  id: string;
  question: string; // en francés
  options: string[]; // 3-4 opciones
  correctIndex: number;
  hintEs?: string; // pista en español (opcional, mostrada tras responder)
};

export type ListeningTask = {
  id: string;
  title: string;
  /** Instrucciones cortas en francés. */
  instruction: string;
  /** Texto que se convierte a audio (guion en francés). */
  script: string;
  /** Voz sugerida: "alloy" | "nova" | "shimmer" | "echo" | "onyx" | "fable" */
  voice?: "alloy" | "nova" | "shimmer" | "echo" | "onyx" | "fable";
  /** 0.7 - 1.2 */
  speed?: number;
  questions: ListeningQuestion[];
};

export type ListeningExam = {
  id: string;
  code: string; // "TCF Canada", "DELF A2", etc.
  name: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  description: string;
  tasks: ListeningTask[];
};

export const listeningExams: ListeningExam[] = [
  /* ─────────── A1 ─────────── */
  {
    id: "delf-a1-comprehension",
    code: "DELF A1",
    name: "Compréhension orale — DELF A1",
    level: "A1",
    description:
      "Mensajes cortos: se presenta, pregunta la hora, escucha una dirección. Ideal para principiantes.",
    tasks: [
      {
        id: "a1-t1",
        title: "Message sur répondeur",
        instruction: "Écoutez le message et répondez aux questions.",
        script:
          "Bonjour, c'est Marie. Je t'appelle pour dire que je ne peux pas venir au restaurant ce soir. Je suis malade. On peut se voir demain à midi ? Rappelle-moi. Bisous.",
        voice: "nova",
        speed: 0.95,
        questions: [
          {
            id: "q1",
            question: "Qui appelle ?",
            options: ["Marc", "Marie", "Mathilde"],
            correctIndex: 1,
          },
          {
            id: "q2",
            question: "Pourquoi elle ne vient pas ?",
            options: ["Elle travaille", "Elle est malade", "Elle est en voyage"],
            correctIndex: 1,
          },
          {
            id: "q3",
            question: "Quand veut-elle se voir ?",
            options: ["Demain matin", "Demain à midi", "Ce soir"],
            correctIndex: 1,
          },
        ],
      },
      {
        id: "a1-t2",
        title: "À la boulangerie",
        instruction: "Écoutez la conversation et répondez.",
        script:
          "— Bonjour madame, je voudrais une baguette et deux croissants, s'il vous plaît. — Voilà. Ça fait quatre euros cinquante. — Voici cinq euros. — Merci, et cinquante centimes de retour. Bonne journée !",
        voice: "shimmer",
        speed: 0.95,
        questions: [
          {
            id: "q1",
            question: "Qu'est-ce que le client achète ?",
            options: [
              "Une baguette et un croissant",
              "Une baguette et deux croissants",
              "Deux baguettes",
            ],
            correctIndex: 1,
          },
          {
            id: "q2",
            question: "Combien ça coûte ?",
            options: ["4,50 €", "5,00 €", "5,50 €"],
            correctIndex: 0,
          },
        ],
      },
    ],
  },

  /* ─────────── A2 ─────────── */
  {
    id: "delf-a2-comprehension",
    code: "DELF A2",
    name: "Compréhension orale — DELF A2",
    level: "A2",
    description:
      "Anuncios en la estación, mensajes con instrucciones cotidianas, conversaciones familiares.",
    tasks: [
      {
        id: "a2-t1",
        title: "Annonce en gare",
        instruction: "Écoutez l'annonce et répondez.",
        script:
          "Mesdames et messieurs, votre attention s'il vous plaît. Le train numéro huit mille cinq cent trente-deux à destination de Lyon Part-Dieu, prévu à quatorze heures vingt, partira avec un retard de quinze minutes. Nous vous prions de nous excuser pour la gêne occasionnée.",
        voice: "onyx",
        speed: 0.95,
        questions: [
          {
            id: "q1",
            question: "Où va le train ?",
            options: ["Paris", "Lyon", "Marseille"],
            correctIndex: 1,
          },
          {
            id: "q2",
            question: "Quel est le problème ?",
            options: [
              "Le train est annulé",
              "Le train a 15 minutes de retard",
              "Le train a changé de quai",
            ],
            correctIndex: 1,
          },
          {
            id: "q3",
            question: "À quelle heure le train devait partir ?",
            options: ["14h20", "14h15", "15h20"],
            correctIndex: 0,
          },
        ],
      },
    ],
  },

  /* ─────────── B1 ─────────── */
  {
    id: "delf-b1-comprehension",
    code: "DELF B1",
    name: "Compréhension orale — DELF B1",
    level: "B1",
    description:
      "Interviews cortas, boletines de radio, conversaciones sobre temas de la vida diaria.",
    tasks: [
      {
        id: "b1-t1",
        title: "Interview radio — bénévolat",
        instruction: "Écoutez l'interview et répondez.",
        script:
          "— Bonjour Camille, vous êtes bénévole dans une association qui aide les personnes âgées. Pouvez-vous nous expliquer ce que vous faites ? — Oui, bien sûr. Deux fois par semaine, je rends visite à des personnes seules dans mon quartier. On discute, on prend un café, parfois je les aide à faire leurs courses ou à remplir des papiers administratifs. — Et qu'est-ce qui vous a motivée à commencer ? — Après mes études, j'avais du temps libre et je voulais faire quelque chose d'utile. Le contact humain me manquait aussi.",
        voice: "shimmer",
        speed: 1.0,
        questions: [
          {
            id: "q1",
            question: "Combien de fois par semaine Camille visite-t-elle les personnes âgées ?",
            options: ["Une fois", "Deux fois", "Trois fois"],
            correctIndex: 1,
          },
          {
            id: "q2",
            question: "Que fait-elle avec les personnes qu'elle visite ?",
            options: [
              "Seulement discuter",
              "Discuter, boire un café et parfois aider aux courses",
              "Faire le ménage chez elles",
            ],
            correctIndex: 1,
          },
          {
            id: "q3",
            question: "Pourquoi a-t-elle commencé ?",
            options: [
              "Pour gagner de l'argent",
              "Pour son travail",
              "Elle avait du temps libre et voulait être utile",
            ],
            correctIndex: 2,
          },
        ],
      },
    ],
  },

  /* ─────────── B2 ─────────── */
  {
    id: "delf-b2-comprehension",
    code: "DELF B2",
    name: "Compréhension orale — DELF B2",
    level: "B2",
    description:
      "Reportajes, debates y discursos con argumentos matizados. Nivel intermedio alto.",
    tasks: [
      {
        id: "b2-t1",
        title: "Reportage — télétravail",
        instruction: "Écoutez le reportage et répondez.",
        script:
          "Le télétravail s'est massivement développé depuis la pandémie et transforme profondément le monde du travail. Selon une récente étude de l'INSEE, près de 40% des salariés français bénéficient aujourd'hui d'au moins un jour de télétravail par semaine, contre seulement 7% avant 2020. Si les employés apprécient la flexibilité et l'économie de temps de transport, les employeurs, eux, s'inquiètent d'une possible baisse de la cohésion d'équipe et d'une communication moins fluide. Certaines entreprises reviennent d'ailleurs à un modèle hybride, imposant deux ou trois jours de présence obligatoire au bureau.",
        voice: "onyx",
        speed: 1.0,
        questions: [
          {
            id: "q1",
            question: "Quel pourcentage de salariés télétravaillent aujourd'hui ?",
            options: ["7%", "environ 40%", "près de 70%"],
            correctIndex: 1,
          },
          {
            id: "q2",
            question: "Qu'apprécient les employés dans le télétravail ?",
            options: [
              "Un meilleur salaire",
              "La flexibilité et l'économie de temps de transport",
              "Plus de responsabilités",
            ],
            correctIndex: 1,
          },
          {
            id: "q3",
            question: "Qu'est-ce qui inquiète les employeurs ?",
            options: [
              "Le coût des équipements",
              "La baisse de la cohésion d'équipe et la communication",
              "Le respect des horaires",
            ],
            correctIndex: 1,
          },
          {
            id: "q4",
            question: "Que font certaines entreprises ?",
            options: [
              "Elles suppriment le télétravail",
              "Elles imposent un modèle 100% à distance",
              "Elles imposent un modèle hybride avec présence obligatoire",
            ],
            correctIndex: 2,
          },
        ],
      },
    ],
  },

  /* ─────────── C1 ─────────── */
  {
    id: "dalf-c1-comprehension",
    code: "DALF C1",
    name: "Compréhension orale — DALF C1",
    level: "C1",
    description:
      "Conférences, débats académicos y análisis complejos. Vocabulario especializado.",
    tasks: [
      {
        id: "c1-t1",
        title: "Conférence — intelligence artificielle",
        instruction: "Écoutez la conférence et répondez.",
        script:
          "L'intelligence artificielle générative bouleverse aujourd'hui de nombreux secteurs, mais elle soulève également des questions éthiques fondamentales. D'un côté, ces technologies promettent d'augmenter considérablement la productivité, d'accélérer la recherche scientifique et de démocratiser l'accès à l'expertise. De l'autre, elles interrogent notre rapport à la vérité, puisqu'elles peuvent produire des contenus faux d'une extrême vraisemblance, et menacent potentiellement des millions d'emplois qualifiés. La véritable question n'est donc plus de savoir si nous devons utiliser ces outils, mais comment encadrer leur usage sans étouffer l'innovation. L'Union européenne a proposé un cadre réglementaire ambitieux, l'AI Act, qui classe les usages selon leur niveau de risque.",
        voice: "onyx",
        speed: 1.0,
        questions: [
          {
            id: "q1",
            question: "Selon la conférence, quelle est la véritable question posée par l'IA ?",
            options: [
              "S'il faut interdire ces outils",
              "Comment encadrer leur usage sans étouffer l'innovation",
              "Qui doit financer la recherche",
            ],
            correctIndex: 1,
          },
          {
            id: "q2",
            question: "Quels risques mentionne la conférence ?",
            options: [
              "Uniquement des risques économiques",
              "La production de contenus faux crédibles et la menace sur les emplois qualifiés",
              "Aucun risque important",
            ],
            correctIndex: 1,
          },
          {
            id: "q3",
            question: "Que fait l'Union européenne ?",
            options: [
              "Elle interdit l'IA générative",
              "Elle propose l'AI Act, un cadre réglementaire par niveau de risque",
              "Elle n'a pas encore de position",
            ],
            correctIndex: 1,
          },
        ],
      },
    ],
  },

  /* ─────────── C2 ─────────── */
  {
    id: "dalf-c2-comprehension",
    code: "DALF C2",
    name: "Compréhension orale — DALF C2",
    level: "C2",
    description:
      "Debates de expertos, análisis literarios y filosóficos. Nivel de dominio.",
    tasks: [
      {
        id: "c2-t1",
        title: "Débat — culture et mondialisation",
        instruction: "Écoutez le débat et répondez.",
        script:
          "La mondialisation culturelle est souvent présentée comme une menace pour la diversité, notamment à travers l'hégémonie supposée des industries anglo-saxonnes. Or, cette vision mérite d'être nuancée. Si Hollywood ou les plateformes de streaming diffusent effectivement une esthétique dominante, on observe simultanément un mouvement inverse : jamais autant de séries coréennes, de films iraniens ou de musiques latino-américaines n'ont conquis d'audiences mondiales. La mondialisation, loin d'être un rouleau compresseur uniforme, fonctionne comme un carrefour où les influences se croisent, se réinterprètent et se recomposent. Le véritable enjeu n'est peut-être pas la préservation d'une pureté culturelle illusoire, mais la capacité des créateurs locaux à négocier leur place dans ces flux transnationaux.",
        voice: "shimmer",
        speed: 1.05,
        questions: [
          {
            id: "q1",
            question: "Quelle est la position centrale de l'intervenant ?",
            options: [
              "La mondialisation détruit toutes les cultures locales",
              "La mondialisation est un carrefour d'influences, non un rouleau compresseur",
              "Il faut protéger les cultures nationales par la loi",
            ],
            correctIndex: 1,
          },
          {
            id: "q2",
            question: "Quel exemple contredit l'hégémonie anglo-saxonne ?",
            options: [
              "Le succès mondial des séries coréennes, films iraniens et musiques latino-américaines",
              "L'exportation du cinéma français",
              "La disparition d'Hollywood",
            ],
            correctIndex: 0,
          },
          {
            id: "q3",
            question: "Quel est, selon lui, le véritable enjeu ?",
            options: [
              "La préservation d'une pureté culturelle",
              "L'interdiction des plateformes étrangères",
              "La capacité des créateurs locaux à négocier leur place dans les flux transnationaux",
            ],
            correctIndex: 2,
          },
        ],
      },
    ],
  },
];

export function getListeningExam(id: string): ListeningExam | undefined {
  return listeningExams.find((e) => e.id === id);
}

/**
 * Preguntas complementarias por tarea, para garantizar
 * mínimo 5 preguntas por cada ejercicio de comprensión oral.
 * Se fusionan con las preguntas base en tiempo de ejecución.
 */
import type { ListeningQuestion } from "./listening-exams";

type Extras = Record<string, ListeningQuestion[]>;

export const EXTRA_QUESTIONS: Extras = {
  /* ─────────── A1 ─────────── */
  "a1-t1": [
    { id: "qx1", question: "Quel type de message est-ce ?", options: ["Un e-mail", "Un message vocal", "Une lettre"], correctIndex: 1 },
    { id: "qx2", question: "Marie propose de se voir…", options: ["Chez elle", "Au restaurant", "À une nouvelle date"], correctIndex: 2 },
  ],
  "a1-t2": [
    { id: "qx1", question: "Où se passe la scène ?", options: ["Dans une pharmacie", "Dans une boulangerie", "Au marché"], correctIndex: 1 },
    { id: "qx2", question: "Combien de croissants ?", options: ["Un", "Deux", "Trois"], correctIndex: 1 },
    { id: "qx3", question: "Combien rend-on au client ?", options: ["50 centimes", "1 euro", "Rien"], correctIndex: 0 },
  ],
  "a1-t3": [
    { id: "qx1", question: "Quel âge a-t-il ?", options: ["20 ans", "25 ans", "30 ans"], correctIndex: 1 },
    { id: "qx2", question: "Quelle est sa nationalité ?", options: ["Belge", "Française", "Suisse"], correctIndex: 1 },
  ],
  "a1-t4": [
    { id: "qx1", question: "Où se passe la scène ?", options: ["Au restaurant", "Au café", "À l'hôtel"], correctIndex: 1 },
    { id: "qx2", question: "Combien de boissons commande le client ?", options: ["Une", "Deux", "Trois"], correctIndex: 1 },
    { id: "qx3", question: "Il commande…", options: ["Un thé", "Un chocolat", "Un jus d'orange"], correctIndex: 2 },
  ],
  "a1-t5": [
    { id: "qx1", question: "Qui appelle ?", options: ["Julie", "Thomas", "Le dentiste"], correctIndex: 1 },
    { id: "qx2", question: "Que doit faire Julie ?", options: ["Oublier", "Ne pas oublier le rendez-vous", "Rappeler le dentiste"], correctIndex: 1 },
  ],
  "a1-t6": [
    { id: "qx1", question: "Dans quelle ville ?", options: ["Lyon", "Paris", "Marseille"], correctIndex: 1 },
    { id: "qx2", question: "Température aujourd'hui ?", options: ["8°C", "15°C", "20°C"], correctIndex: 0 },
    { id: "qx3", question: "Demain il fera…", options: ["Froid", "Beau", "Il pleuvra"], correctIndex: 1 },
  ],
  "a1-t7": [
    { id: "qx1", question: "La pharmacie est à côté de…", options: ["La poste", "La boulangerie", "L'école"], correctIndex: 1 },
    { id: "qx2", question: "Il faut d'abord aller…", options: ["Tout droit", "À droite", "Reculer"], correctIndex: 0 },
  ],
  "a1-t8": [
    { id: "qx1", question: "Comment s'appelle la mère ?", options: ["Léa", "Sophie", "Marie"], correctIndex: 1 },
    { id: "qx2", question: "Comment s'appelle le père ?", options: ["Jean", "Paul", "Pierre"], correctIndex: 0 },
  ],
  "a1-t9": [
    { id: "qx1", question: "À quel nom la réservation ?", options: ["Dumont", "Dupont", "Durand"], correctIndex: 1 },
    { id: "qx2", question: "Type de chambre ?", options: ["Simple", "Double", "Suite"], correctIndex: 1 },
  ],
  "a1-t10": [
    { id: "qx1", question: "Qui est invité ?", options: ["Léa", "Léo", "Louis"], correctIndex: 1 },
    { id: "qx2", question: "Où a lieu la fête ?", options: ["Au restaurant", "Chez elle/lui", "Dans un bar"], correctIndex: 1 },
  ],

  /* ─────────── A2 ─────────── */
  "a2-t1": [
    { id: "qx1", question: "Numéro du train ?", options: ["8532", "8523", "8352"], correctIndex: 0 },
    { id: "qx2", question: "Le message s'excuse-t-il ?", options: ["Oui", "Non", "On ne sait pas"], correctIndex: 0 },
  ],
  "a2-t2": [
    { id: "qx1", question: "Quel type de film ?", options: ["Américain", "Français", "Espagnol"], correctIndex: 1 },
    { id: "qx2", question: "Quand doit-il rappeler ?", options: ["Le matin", "L'après-midi", "Ce soir"], correctIndex: 2 },
  ],
  "a2-t3": [
    { id: "qx1", question: "Quel est le symptôme principal ?", options: ["Mal au ventre", "Mal à la tête et fatigue", "Douleur au dos"], correctIndex: 1 },
    { id: "qx2", question: "Que va prescrire le médecin ?", options: ["Du repos seulement", "Des médicaments", "Une opération"], correctIndex: 1 },
  ],
  "a2-t4": [
    { id: "qx1", question: "Sur quel produit -20% ?", options: ["Fruits", "Poulet", "Papeterie"], correctIndex: 2 },
    { id: "qx2", question: "Nom du supermarché ?", options: ["Superprix", "Superplus", "Supermax"], correctIndex: 0 },
  ],
  "a2-t5": [
    { id: "qx1", question: "Quelle classe ?", options: ["Première", "Seconde", "Business"], correctIndex: 1 },
    { id: "qx2", question: "Type de train ?", options: ["TER", "TGV", "Intercités"], correctIndex: 1 },
  ],
  "a2-t6": [
    { id: "qx1", question: "Comment sera le sud samedi ?", options: ["Pluvieux", "Ensoleillé", "Nuageux"], correctIndex: 1 },
    { id: "qx2", question: "Temps général du week-end ?", options: ["Stable", "Variable", "Chaud"], correctIndex: 1 },
  ],
  "a2-t7": [
    { id: "qx1", question: "Quelle classe part en voyage ?", options: ["5e B", "6e B", "3e B"], correctIndex: 1 },
    { id: "qx2", question: "Ce qui est inclus dans le prix ?", options: ["Repas seulement", "Transport et hébergement", "Rien"], correctIndex: 1 },
  ],
  "a2-t8": [
    { id: "qx1", question: "Surface de l'appartement ?", options: ["30 m²", "40 m²", "50 m²"], correctIndex: 1 },
    { id: "qx2", question: "Y a-t-il un ascenseur ?", options: ["Oui", "Non", "On ne sait pas"], correctIndex: 0 },
  ],
  "a2-t9": [
    { id: "qx1", question: "Depuis quand aime-t-il cuisiner ?", options: ["Depuis l'adolescence", "Depuis l'enfance", "Depuis peu"], correctIndex: 1 },
    { id: "qx2", question: "Que fait-il aujourd'hui ?", options: ["Il enseigne", "Il a son restaurant", "Il est apprenti"], correctIndex: 1 },
  ],
  "a2-t10": [
    { id: "qx1", question: "Comment s'appelle l'enfant ?", options: ["Louis", "Lucas", "Léo"], correctIndex: 1 },
    { id: "qx2", question: "Couleur de ses cheveux ?", options: ["Blonds", "Bruns", "Roux"], correctIndex: 1 },
  ],

  /* ─────────── B1 ─────────── */
  "b1-t1": [
    { id: "qx1", question: "Public aidé par Camille ?", options: ["Enfants", "Personnes âgées seules", "Sans-abri"], correctIndex: 1 },
    { id: "qx2", question: "Où intervient-elle ?", options: ["Dans un hôpital", "Dans son quartier", "En ligne"], correctIndex: 1 },
  ],
  "b1-t2": [
    { id: "qx1", question: "Fréquence des trains aux heures de pointe ?", options: ["Un sur deux", "Un sur trois", "Un sur cinq"], correctIndex: 1 },
    { id: "qx2", question: "Durée de la perturbation ?", options: ["Toute la journée", "Une heure", "Le soir seulement"], correctIndex: 0 },
  ],
  "b1-t3": [
    { id: "qx1", question: "Dans quelle ville a-t-il étudié ?", options: ["Paris", "Lyon", "Bordeaux"], correctIndex: 1 },
    { id: "qx2", question: "Recommande-t-il cette expérience ?", options: ["Oui, à tout le monde", "Non", "Seulement à certains"], correctIndex: 0 },
  ],
  "b1-t4": [
    { id: "qx1", question: "Qui consomme du bio ?", options: ["Peu de gens", "De plus en plus de familles", "Seulement les riches"], correctIndex: 1 },
    { id: "qx2", question: "Source des chiffres ?", options: ["Une association", "Une étude récente", "Un blog"], correctIndex: 1 },
  ],
  "b1-t5": [
    { id: "qx1", question: "Que préfère l'homme ?", options: ["La mer", "Visiter des villes", "La montagne"], correctIndex: 1 },
    { id: "qx2", question: "Décision finale ?", options: ["Ils réservent la Corse", "Ils vont réfléchir", "Ils annulent"], correctIndex: 1 },
  ],
  "b1-t6": [
    { id: "qx1", question: "Combien de langues proposées ?", options: ["2", "3", "4"], correctIndex: 2 },
    { id: "qx2", question: "Durée hebdomadaire des cours ?", options: ["1h", "2h", "3h"], correctIndex: 1 },
  ],
  "b1-t7": [
    { id: "qx1", question: "Sport pratiqué ?", options: ["Cyclisme", "Marathon", "Natation"], correctIndex: 1 },
    { id: "qx2", question: "Que surveille-t-il en plus de l'entraînement ?", options: ["Rien", "Alimentation et sommeil", "Ses vêtements"], correctIndex: 1 },
  ],
  "b1-t8": [
    { id: "qx1", question: "Part du loyer sur le salaire ?", options: ["1/4", "1/3", "1/2"], correctIndex: 2 },
    { id: "qx2", question: "Un avantage cité ?", options: ["Aucun", "Éviter la solitude", "Plus d'espace"], correctIndex: 1 },
  ],
  "b1-t9": [
    { id: "qx1", question: "Ancien jour de la réunion ?", options: ["Mercredi", "Jeudi", "Vendredi"], correctIndex: 1 },
    { id: "qx2", question: "Dans quelle salle ?", options: ["A", "B", "C"], correctIndex: 1 },
  ],
  "b1-t10": [
    { id: "qx1", question: "Combien d'habitudes conseillées ?", options: ["Deux", "Plusieurs", "Une seule"], correctIndex: 1 },
    { id: "qx2", question: "Activité physique conseillée ?", options: ["Jamais", "Dans la journée", "Seulement le soir"], correctIndex: 1 },
  ],

  /* ─────────── B2 ─────────── */
  "b2-t1": [
    { id: "qx1", question: "Chiffre du télétravail avant 2020 ?", options: ["7%", "20%", "40%"], correctIndex: 0 },
    { id: "qx2", question: "Source des chiffres ?", options: ["INSEE", "INSERM", "OCDE"], correctIndex: 0 },
  ],
  "b2-t2": [
    { id: "qx1", question: "Extraction des métaux : conditions sociales ?", options: ["Bonnes", "Préoccupantes", "Inconnues"], correctIndex: 1 },
    { id: "qx2", question: "Sur la durée de vie, la voiture électrique est…", options: ["Pire", "Équivalente", "Globalement meilleure"], correctIndex: 2 },
  ],
  "b2-t3": [
    { id: "qx1", question: "Auteure du roman ?", options: ["Léa Marchand", "Léa Martin", "Léna Marchand"], correctIndex: 0 },
    { id: "qx2", question: "Selon les partisans, la lenteur…", options: ["Nuit", "Fait la force du livre", "Est un défaut"], correctIndex: 1 },
  ],
  "b2-t4": [
    { id: "qx1", question: "Délai de reprise du poids ?", options: ["6 mois", "2 ans", "5 ans"], correctIndex: 1 },
    { id: "qx2", question: "Un produit à réduire ?", options: ["Les légumes", "Les produits ultra-transformés", "Le pain complet"], correctIndex: 1 },
  ],
  "b2-t5": [
    { id: "qx1", question: "Évolution de la crise ?", options: ["Elle s'atténue", "Elle s'aggrave", "Elle est résolue"], correctIndex: 1 },
    { id: "qx2", question: "Que fait le parc privé ?", options: ["Il baisse", "Il explose", "Il stagne"], correctIndex: 1 },
  ],
  "b2-t6": [
    { id: "qx1", question: "L'expérimentation suscite…", options: ["Rejet unanime", "Un intérêt croissant", "L'indifférence"], correctIndex: 1 },
    { id: "qx2", question: "Un secteur adapté ?", options: ["Santé", "Bureau/IT", "Hôtellerie"], correctIndex: 1 },
  ],
  "b2-t7": [
    { id: "qx1", question: "Faut-il densifier ou étaler ?", options: ["Étaler", "Densifier", "Ni l'un ni l'autre"], correctIndex: 1 },
    { id: "qx2", question: "Que faire de l'existant ?", options: ["Démolir", "Rénover", "Abandonner"], correctIndex: 1 },
  ],
  "b2-t8": [
    { id: "qx1", question: "Que valorisent les algorithmes ?", options: ["La vérification", "L'émotion", "Les textes longs"], correctIndex: 1 },
    { id: "qx2", question: "Quel réseau est cité ?", options: ["Facebook", "TikTok", "LinkedIn"], correctIndex: 1 },
  ],
  "b2-t9": [
    { id: "qx1", question: "Que cherchent les villes saturées ?", options: ["Plus de touristes", "Limiter les arrivées", "Rien"], correctIndex: 1 },
    { id: "qx2", question: "Le slow tourism privilégie…", options: ["Beaucoup de destinations", "Séjours plus longs et contact local", "Voyages express"], correctIndex: 1 },
  ],
  "b2-t10": [
    { id: "qx1", question: "Cible commerciale actuelle ?", options: ["Supermarchés", "Restauration rapide en France", "Écoles"], correctIndex: 1 },
    { id: "qx2", question: "Horizon pour la parité de prix ?", options: ["1 an", "3 ans", "10 ans"], correctIndex: 1 },
  ],

  /* ─────────── C1 ─────────── */
  "c1-t1": [
    { id: "qx1", question: "L'AI Act classe les usages selon…", options: ["Leur coût", "Leur niveau de risque", "Leur popularité"], correctIndex: 1 },
    { id: "qx2", question: "Promesses de l'IA ?", options: ["Aucune", "Productivité, recherche, accès à l'expertise", "Loisirs seulement"], correctIndex: 1 },
  ],
  "c1-t2": [
    { id: "qx1", question: "Sujet du débat ?", options: ["Sélection à l'université", "Frais d'inscription", "Bourses étudiantes"], correctIndex: 0 },
    { id: "qx2", question: "Public défavorisé selon les opposants ?", options: ["Élèves de milieux modestes", "Étudiants étrangers", "Adultes"], correctIndex: 0 },
  ],
  "c1-t3": [
    { id: "qx1", question: "Autre grande crise environnementale ?", options: ["Le climat", "L'urbanisme", "Le tourisme"], correctIndex: 0 },
    { id: "qx2", question: "Idée reçue contredite ?", options: ["Enjeu purement esthétique", "Enjeu réel et vital", "Aucune"], correctIndex: 0 },
  ],
  "c1-t4": [
    { id: "qx1", question: "Qui capte une partie du public ?", options: ["Les théâtres", "Les plateformes", "La radio"], correctIndex: 1 },
    { id: "qx2", question: "Qui domine les box-offices ?", options: ["Les films français", "Les grosses productions américaines", "Les films indiens"], correctIndex: 1 },
  ],
  "c1-t5": [
    { id: "qx1", question: "Coût cité du burn-out ?", options: ["Uniquement humain", "Humain et économique", "Uniquement économique"], correctIndex: 1 },
    { id: "qx2", question: "Exemple de dispositif superficiel ?", options: ["Réforme salariale", "Cellules d'écoute, ateliers bien-être", "Réduction du temps de travail"], correctIndex: 1 },
  ],
  "c1-t6": [
    { id: "qx1", question: "Langues régionales citées ?", options: ["Breton, occitan, corse", "Alsacien, basque, catalan", "Aucune"], correctIndex: 0 },
    { id: "qx2", question: "Les écoles bilingues…", options: ["Baissent les résultats", "Obtiennent de bons résultats", "N'existent plus"], correctIndex: 1 },
  ],
  "c1-t7": [
    { id: "qx1", question: "Facteur conjoncturel cité ?", options: ["Tensions géopolitiques", "Vieillissement", "Transition écologique"], correctIndex: 0 },
    { id: "qx2", question: "Facteur structurel cité ?", options: ["Rupture ponctuelle", "Vieillissement démographique", "Grève ponctuelle"], correctIndex: 1 },
  ],
  "c1-t8": [
    { id: "qx1", question: "Anciennement, les musées étaient…", options: ["Des lieux de spectacle", "Des sanctuaires du savoir", "Inexistants"], correctIndex: 1 },
    { id: "qx2", question: "Les conservateurs sont…", options: ["Unanimes", "Divisés", "Absents du débat"], correctIndex: 1 },
  ],
  "c1-t9": [
    { id: "qx1", question: "Contrainte principale ?", options: ["Nourrir sans détruire la planète", "Réduire la population", "Coloniser Mars"], correctIndex: 0 },
    { id: "qx2", question: "Y a-t-il une solution unique ?", options: ["Oui", "Non, un bouquet combiné", "On ne sait pas"], correctIndex: 1 },
  ],
  "c1-t10": [
    { id: "qx1", question: "Qui doit désormais assumer des choix ?", options: ["Les fédérations", "Les spectateurs", "Les commentateurs"], correctIndex: 0 },
    { id: "qx2", question: "L'opinion publique est…", options: ["Passive", "De plus en plus mobilisée", "Muette"], correctIndex: 1 },
  ],

  /* ─────────── C2 ─────────── */
  "c2-t1": [
    { id: "qx1", question: "Vision critiquée ?", options: ["La diversité mondiale", "L'hégémonie anglo-saxonne uniforme", "Le cinéma national"], correctIndex: 1 },
    { id: "qx2", question: "Le locuteur défend…", options: ["Une pureté culturelle", "Une négociation dans les flux", "Un repli national"], correctIndex: 1 },
  ],
  "c2-t2": [
    { id: "qx1", question: "Proust déploie…", options: ["Une intrigue policière", "Une conscience qui se cherche", "Un manifeste"], correctIndex: 1 },
    { id: "qx2", question: "Ses phrases se caractérisent par…", options: ["La brièveté", "Des circonvolutions", "Le silence"], correctIndex: 1 },
  ],
  "c2-t3": [
    { id: "qx1", question: "Que sont les bulles algorithmiques ?", options: ["Un espace public élargi et fragmenté", "Une utopie réalisée", "Un mythe"], correctIndex: 0 },
    { id: "qx2", question: "Mesure évoquée ?", options: ["Régulation des plateformes", "Interdiction totale d'internet", "Suppression des médias"], correctIndex: 0 },
  ],
  "c2-t4": [
    { id: "qx1", question: "Le temps chronologique est…", options: ["Qualitatif", "Mesurable, comptable", "Sacré"], correctIndex: 1 },
    { id: "qx2", question: "La technologie a…", options: ["Ralenti le temps", "Aggravé l'accélération", "Aucun effet"], correctIndex: 1 },
  ],
  "c2-t5": [
    { id: "qx1", question: "La bascule est-elle seulement technologique ?", options: ["Oui", "Non, aussi crise de confiance", "Uniquement politique"], correctIndex: 1 },
    { id: "qx2", question: "Que suffit-il de faire selon l'auteur ?", options: ["Uniquement pédagogie", "Interroger les asymétries de pouvoir aussi", "Rien"], correctIndex: 1 },
  ],
  "c2-t6": [
    { id: "qx1", question: "Exemples de mesures efficaces ?", options: ["Restrictions, régulation, fiscalité carbone", "Publicité verte", "Sensibilisation seule"], correctIndex: 0 },
    { id: "qx2", question: "Ce qui est ancré culturellement ?", options: ["Le collectivisme", "La liberté individuelle", "L'ascétisme"], correctIndex: 1 },
  ],
  "c2-t7": [
    { id: "qx1", question: "Rôle du geste spectaculaire ?", options: ["Habitat social", "Stratégie de marque territoriale", "Écologie"], correctIndex: 1 },
    { id: "qx2", question: "Ce que produit l'architecture discrète ?", options: ["Des icônes", "Des lieux à vivre", "Des ruines"], correctIndex: 1 },
  ],
  "c2-t8": [
    { id: "qx1", question: "Bassins cités ?", options: ["Nil, Mékong, Tigre-Euphrate", "Rhin, Danube, Volga", "Amazone, Congo, Yangzi"], correctIndex: 0 },
    { id: "qx2", question: "Statut ancien de la coopération ?", options: ["Idéal fragile", "Réalité établie", "Impossible"], correctIndex: 0 },
  ],
  "c2-t9": [
    { id: "qx1", question: "Ruptures historiques citées ?", options: ["Photographie, cinéma, numérique", "Radio, télévision, DVD", "Aucune"], correctIndex: 0 },
    { id: "qx2", question: "Après la panique initiale, ces techniques…", options: ["Ont disparu", "Ont renouvelé les langages", "Ont été interdites"], correctIndex: 1 },
  ],
  "c2-t10": [
    { id: "qx1", question: "Reproche fait à l'universalisme ?", options: ["Ancrage historique européen", "Trop récent", "Trop pauvre"], correctIndex: 0 },
    { id: "qx2", question: "Renoncer à tout universel reviendrait à…", options: ["Instaurer la paix", "Laisser le champ aux relations de force", "Résoudre les conflits"], correctIndex: 1 },
  ],
};

export function withExtraQuestions<T extends { id: string; questions: ListeningQuestion[] }>(
  task: T,
  minCount = 5,
): T {
  const extras = EXTRA_QUESTIONS[task.id] ?? [];
  if (!extras.length) return task;
  const merged = [...task.questions];
  const existingIds = new Set(merged.map((q) => q.id));
  for (const q of extras) {
    if (merged.length >= minCount && merged.length >= task.questions.length + 2) break;
    const id = existingIds.has(q.id) ? `${q.id}-x` : q.id;
    merged.push({ ...q, id });
    existingIds.add(id);
    if (merged.length >= Math.max(minCount, task.questions.length + extras.length)) break;
  }
  return { ...task, questions: merged };
}

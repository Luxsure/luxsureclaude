export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type LessonType =
  | "theory"
  | "practice"
  | "interactive"
  | "project"
  | "battle";

export const LESSON_TYPE_ICON: Record<LessonType, string> = {
  theory: "📖",
  practice: "⚡",
  interactive: "🎮",
  project: "🛠️",
  battle: "⚔️",
};

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  content: string;
  quiz?: QuizQuestion[];
  xp?: number;
  type?: LessonType;
}

export interface ModuleBadge {
  title: string;
  icon: string;
}

export interface Module {
  id: string;
  title: string;
  icon?: string;
  badge?: ModuleBadge;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  duration: string;
  lessonsCount: number;
  icon: string;
  color: string;
  tags: string[];
  modules: Module[];
  levelNumber?: number;
  finalBadge?: ModuleBadge;
}

export const courses: Course[] = [
  {
    id: "fundamentals-of-ai",
    title: "Fondamentaux de l'IA",
    description:
      "Comprenez les bases de l'intelligence artificielle, du machine learning et du deep learning.",
    longDescription:
      "Ce cours vous plonge dans les fondations de l'IA moderne. Vous découvrirez comment les machines apprennent à partir de données, les différents types d'apprentissage et les applications concrètes qui transforment notre quotidien.",
    level: "Débutant",
    duration: "4h",
    lessonsCount: 8,
    icon: "🧠",
    color: "from-blue-500 to-cyan-500",
    tags: ["IA", "Machine Learning", "Deep Learning"],
    modules: [
      {
        id: "intro-ai",
        title: "Introduction à l'IA",
        lessons: [
          {
            id: "what-is-ai",
            title: "Qu'est-ce que l'Intelligence Artificielle ?",
            duration: "15 min",
            content: `# Qu'est-ce que l'Intelligence Artificielle ?

L'**intelligence artificielle** (IA) désigne la capacité d'une machine à reproduire des comportements liés à l'intelligence humaine : raisonnement, apprentissage, perception, créativité.

## Les 3 types d'IA

### 1. IA Faible (Narrow AI)
C'est l'IA que nous utilisons aujourd'hui. Elle excelle dans **une tâche spécifique** :
- Reconnaissance d'images
- Traduction automatique
- Recommandations Netflix

### 2. IA Générale (AGI)
Une IA qui pourrait effectuer **n'importe quelle tâche intellectuelle** qu'un humain peut faire. Elle n'existe pas encore.

### 3. Super Intelligence
Une IA qui **surpasserait** l'intelligence humaine dans tous les domaines. C'est encore de la science-fiction.

## Pourquoi l'IA explose maintenant ?

Trois facteurs convergent :
- **Données** : Internet génère des quantités massives de données d'entraînement
- **Puissance de calcul** : Les GPU permettent d'entraîner des modèles complexes
- **Algorithmes** : Les avancées en deep learning ont révolutionné le domaine

> 💡 **À retenir** : L'IA n'est pas magique. C'est des mathématiques, des données et beaucoup de calcul.`,
            quiz: [
              {
                id: "q1-what-is-ai",
                question:
                  "Quel type d'IA utilisez-vous quand vous parlez à un assistant vocal ?",
                options: [
                  "IA Faible (Narrow AI)",
                  "IA Générale (AGI)",
                  "Super Intelligence",
                  "Aucune de ces réponses",
                ],
                correctIndex: 0,
                explanation:
                  "Les assistants vocaux sont des exemples d'IA faible : ils sont spécialisés dans la compréhension et la génération de langage naturel, mais ne peuvent pas effectuer d'autres tâches intellectuelles.",
              },
              {
                id: "q2-what-is-ai",
                question:
                  "Quel facteur N'est PAS une raison de l'essor récent de l'IA ?",
                options: [
                  "L'augmentation des données disponibles",
                  "La puissance des GPU",
                  "La découverte de la conscience artificielle",
                  "Les progrès en deep learning",
                ],
                correctIndex: 2,
                explanation:
                  "La conscience artificielle n'a pas été découverte. Les trois facteurs clés sont : les données massives, la puissance de calcul (GPU) et les avancées algorithmiques.",
              },
            ],
          },
          {
            id: "history-of-ai",
            title: "Brève histoire de l'IA",
            duration: "12 min",
            content: `# Brève histoire de l'Intelligence Artificielle

## Les débuts (1950-1970)

### 1950 — Le test de Turing
Alan Turing propose un test pour déterminer si une machine peut "penser". Si un humain ne peut pas distinguer les réponses d'une machine de celles d'un humain, la machine passe le test.

### 1956 — Naissance officielle
Le terme **"Intelligence Artificielle"** est inventé lors de la conférence de Dartmouth par John McCarthy.

### 1960s — L'âge d'or
Les premiers programmes d'IA résolvent des problèmes mathématiques et jouent aux échecs. L'optimisme est à son comble.

## L'hiver de l'IA (1970-1990)

Les promesses ne se concrétisent pas. Les financements s'effondrent. On appelle cette période **"l'hiver de l'IA"**.

## La renaissance (1990-2010)

- **1997** : Deep Blue (IBM) bat Garry Kasparov aux échecs
- **2000s** : Le Machine Learning statistique progresse
- **2006** : Geoffrey Hinton relance le Deep Learning

## L'ère moderne (2010-aujourd'hui)

- **2012** : AlexNet révolutionne la vision par ordinateur
- **2016** : AlphaGo bat le champion du monde de Go
- **2022** : ChatGPT démocratise les LLM
- **2024+** : Les modèles multimodaux et les agents IA

> 💡 L'IA a connu des cycles d'enthousiasme et de déception. La période actuelle est portée par des résultats concrets et massifs.`,
            quiz: [
              {
                id: "q1-history",
                question: "En quelle année le terme 'Intelligence Artificielle' a-t-il été inventé ?",
                options: ["1950", "1956", "1969", "1997"],
                correctIndex: 1,
                explanation:
                  "Le terme a été inventé en 1956 lors de la conférence de Dartmouth par John McCarthy.",
              },
            ],
          },
        ],
      },
      {
        id: "machine-learning",
        title: "Machine Learning",
        lessons: [
          {
            id: "ml-basics",
            title: "Les bases du Machine Learning",
            duration: "20 min",
            content: `# Les bases du Machine Learning

Le **Machine Learning** (apprentissage automatique) est une branche de l'IA où les machines apprennent à partir de **données** plutôt que d'être explicitement programmées.

## Le paradigme ML

\`\`\`
Programmation classique : Règles + Données → Résultat
Machine Learning :        Données + Résultats → Règles (Modèle)
\`\`\`

## Les 3 types d'apprentissage

### Apprentissage supervisé
On fournit des **exemples étiquetés** au modèle :
- Classification : "Ce mail est spam / pas spam"
- Régression : "Le prix de cette maison sera X €"

### Apprentissage non supervisé
Le modèle trouve des **structures cachées** dans les données :
- Clustering : Regrouper des clients similaires
- Réduction de dimension : Simplifier des données complexes

### Apprentissage par renforcement
Le modèle apprend par **essai-erreur** avec un système de récompenses :
- Jeux vidéo, robotique, stratégie

## Le processus ML

1. **Collecter** les données
2. **Préparer** et nettoyer les données
3. **Choisir** un algorithme
4. **Entraîner** le modèle
5. **Évaluer** les performances
6. **Déployer** en production

> 💡 La qualité du modèle dépend avant tout de la **qualité des données**.`,
            quiz: [
              {
                id: "q1-ml",
                question:
                  "Quel type d'apprentissage utilise des exemples étiquetés ?",
                options: [
                  "Apprentissage supervisé",
                  "Apprentissage non supervisé",
                  "Apprentissage par renforcement",
                  "Apprentissage semi-supervisé",
                ],
                correctIndex: 0,
                explanation:
                  "L'apprentissage supervisé utilise des données étiquetées (input + output attendu) pour apprendre à faire des prédictions.",
              },
              {
                id: "q2-ml",
                question:
                  "Quelle est la première étape du processus ML ?",
                options: [
                  "Choisir un algorithme",
                  "Entraîner le modèle",
                  "Collecter les données",
                  "Évaluer les performances",
                ],
                correctIndex: 2,
                explanation:
                  "Tout commence par la collecte des données. Sans données de qualité, aucun modèle ne peut être entraîné correctement.",
              },
            ],
          },
          {
            id: "deep-learning-intro",
            title: "Introduction au Deep Learning",
            duration: "18 min",
            content: `# Introduction au Deep Learning

Le **Deep Learning** est un sous-ensemble du Machine Learning qui utilise des **réseaux de neurones artificiels** avec de nombreuses couches (d'où "deep" = profond).

## Comment fonctionne un réseau de neurones ?

Un réseau de neurones est inspiré du cerveau humain :

1. **Couche d'entrée** : Reçoit les données (pixels, mots, nombres)
2. **Couches cachées** : Transforment progressivement les données
3. **Couche de sortie** : Produit le résultat (classification, prédiction)

Chaque connexion a un **poids** qui est ajusté pendant l'entraînement.

## Pourquoi le Deep Learning est-il si puissant ?

- Il peut apprendre des **représentations hiérarchiques** des données
- Il fonctionne avec des données brutes (images, texte, audio)
- Plus de données = meilleures performances (contrairement au ML classique)

## Les architectures clés

| Architecture | Usage | Exemple |
|---|---|---|
| **CNN** | Vision | Reconnaissance faciale |
| **RNN/LSTM** | Séquences | Traduction automatique |
| **Transformer** | Langage & plus | ChatGPT, DALL-E |
| **GAN** | Génération | Deepfakes, art IA |

## Transformers : la révolution

L'architecture **Transformer** (2017) a tout changé :
- Mécanisme d'**attention** pour comprendre le contexte
- Parallélisation massive de l'entraînement
- Base de GPT, BERT, Claude, Gemini...

> 💡 Le Deep Learning nécessite beaucoup de données et de puissance de calcul, mais ses résultats sont spectaculaires.`,
          },
        ],
      },
      {
        id: "prompt-engineering",
        title: "Prompt Engineering",
        lessons: [
          {
            id: "prompt-basics",
            title: "L'art du prompt",
            duration: "15 min",
            content: `# L'art du Prompt Engineering

Le **prompt engineering** est la compétence clé pour tirer le meilleur parti des modèles de langage (LLM).

## Qu'est-ce qu'un prompt ?

Un **prompt** est l'instruction que vous donnez à un modèle d'IA. La qualité de la réponse dépend directement de la qualité du prompt.

## Les 5 principes d'un bon prompt

### 1. Soyez spécifique
❌ "Parle-moi du marketing"
✅ "Donne-moi 5 stratégies de marketing digital pour une startup SaaS B2B avec un budget de 5000€/mois"

### 2. Donnez du contexte
❌ "Écris un email"
✅ "Tu es un responsable commercial. Écris un email de relance poli à un prospect qui n'a pas répondu depuis 2 semaines."

### 3. Définissez le format
❌ "Explique React"
✅ "Explique React en 3 paragraphes : introduction, avantages principaux, cas d'usage concrets"

### 4. Utilisez des exemples (few-shot)
Montrez à l'IA ce que vous attendez avec 1-2 exemples avant votre requête.

### 5. Itérez
Le premier prompt est rarement parfait. Affinez progressivement.

## Techniques avancées

- **Chain of Thought** : "Réfléchis étape par étape"
- **Role playing** : "Tu es un expert en..."
- **Contraintes** : "En maximum 100 mots, sans jargon technique"

> 💡 Le prompt engineering est une compétence qui se développe avec la pratique. Expérimentez !`,
            quiz: [
              {
                id: "q1-prompt",
                question: "Quel principe est le PLUS important pour un bon prompt ?",
                options: [
                  "Être spécifique",
                  "Utiliser des majuscules",
                  "Écrire le plus long possible",
                  "Toujours dire 'merci'",
                ],
                correctIndex: 0,
                explanation:
                  "La spécificité est cruciale. Plus votre prompt est précis, plus la réponse sera pertinente et utile.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ai-for-business",
    title: "L'IA pour le Business",
    description:
      "Apprenez à intégrer l'IA dans votre stratégie d'entreprise et à automatiser vos processus.",
    longDescription:
      "Découvrez comment les entreprises utilisent l'IA pour gagner en productivité, prendre de meilleures décisions et créer de la valeur. De l'automatisation au service client, explorez les cas d'usage concrets.",
    level: "Intermédiaire",
    duration: "6h",
    lessonsCount: 12,
    icon: "💼",
    color: "from-purple-500 to-pink-500",
    tags: ["Business", "Automatisation", "Stratégie"],
    modules: [
      {
        id: "ai-strategy",
        title: "Stratégie IA en entreprise",
        lessons: [
          {
            id: "ai-use-cases",
            title: "Cas d'usage de l'IA en entreprise",
            duration: "20 min",
            content: `# Cas d'usage de l'IA en entreprise

## Les domaines d'application

### Service Client
- **Chatbots intelligents** : Répondre aux questions 24/7
- **Analyse de sentiment** : Détecter la satisfaction client
- **Routage intelligent** : Diriger vers le bon agent

### Marketing & Ventes
- **Personnalisation** : Recommandations produits sur mesure
- **Scoring leads** : Prioriser les prospects les plus prometteurs
- **Génération de contenu** : Créer des emails, posts, visuels

### Opérations
- **Prévision de demande** : Optimiser les stocks
- **Maintenance prédictive** : Anticiper les pannes
- **Automatisation RPA** : Éliminer les tâches répétitives

### RH & Recrutement
- **Screening de CV** : Filtrer les candidatures
- **Analyse de compétences** : Cartographier les talents
- **Formation personnalisée** : Adapter les parcours

## ROI typique de l'IA

| Domaine | Gain moyen | Délai |
|---|---|---|
| Service client | -30% coûts | 3-6 mois |
| Marketing | +20% conversion | 2-4 mois |
| Opérations | -25% inefficacités | 6-12 mois |

> 💡 Commencez par les "quick wins" : des projets à faible risque avec un ROI rapide.`,
          },
        ],
      },
    ],
  },
  {
    id: "generative-ai-mastery",
    title: "Maîtriser l'IA Générative",
    description:
      "De DALL-E à Claude, maîtrisez les outils d'IA générative pour créer du contenu de qualité.",
    longDescription:
      "Plongez dans l'univers de l'IA générative. Apprenez à utiliser les LLM, les générateurs d'images et les outils audio/vidéo pour booster votre créativité et votre productivité.",
    level: "Intermédiaire",
    duration: "5h",
    lessonsCount: 10,
    icon: "✨",
    color: "from-orange-500 to-red-500",
    tags: ["IA Générative", "LLM", "Créativité"],
    modules: [
      {
        id: "llm-mastery",
        title: "Maîtriser les LLM",
        lessons: [
          {
            id: "understanding-llm",
            title: "Comprendre les LLM",
            duration: "18 min",
            content: `# Comprendre les Large Language Models (LLM)

## Qu'est-ce qu'un LLM ?

Un **Large Language Model** est un modèle d'IA entraîné sur d'immenses quantités de texte pour comprendre et générer du langage naturel.

## Comment fonctionnent-ils ?

1. **Pré-entraînement** : Le modèle lit des milliards de textes et apprend les patterns du langage
2. **Fine-tuning** : On l'affine sur des tâches spécifiques
3. **RLHF** : On l'aligne avec les préférences humaines

## Les principaux LLM

| Modèle | Créateur | Points forts |
|---|---|---|
| **Claude** | Anthropic | Raisonnement, sécurité |
| **GPT-4** | OpenAI | Polyvalence |
| **Gemini** | Google | Multimodal |
| **Llama** | Meta | Open source |
| **Mistral** | Mistral AI | Performance/coût |

## Limites des LLM

- **Hallucinations** : Ils peuvent inventer des informations
- **Biais** : Ils reflètent les biais de leurs données d'entraînement
- **Fenêtre de contexte** : Ils ont une mémoire limitée
- **Pas de raisonnement causal** : Ils reconnaissent des patterns

> 💡 Les LLM sont des outils puissants mais imparfaits. Vérifiez toujours les informations critiques.`,
          },
        ],
      },
    ],
  },
  {
    id: "ai-ethics-safety",
    title: "Éthique et Sécurité de l'IA",
    description:
      "Comprenez les enjeux éthiques, les biais algorithmiques et la gouvernance de l'IA.",
    longDescription:
      "Un cours essentiel sur les questions éthiques soulevées par l'IA : biais, vie privée, transparence, impact sociétal et réglementation. Devenez un utilisateur responsable de l'IA.",
    level: "Débutant",
    duration: "3h",
    lessonsCount: 6,
    icon: "⚖️",
    color: "from-green-500 to-teal-500",
    tags: ["Éthique", "Biais", "Régulation"],
    modules: [
      {
        id: "ethics-basics",
        title: "Les fondamentaux de l'éthique IA",
        lessons: [
          {
            id: "bias-in-ai",
            title: "Les biais dans l'IA",
            duration: "15 min",
            content: `# Les biais dans l'Intelligence Artificielle

## Qu'est-ce qu'un biais algorithmique ?

Un **biais algorithmique** se produit quand un système d'IA produit des résultats systématiquement injustes pour certains groupes de personnes.

## Sources de biais

### 1. Biais dans les données
- Données d'entraînement non représentatives
- Données historiques reflétant des discriminations passées
- Sous-représentation de certains groupes

### 2. Biais de conception
- Choix de features discriminants
- Objectifs d'optimisation mal définis
- Absence de diversité dans les équipes

### 3. Biais d'utilisation
- Interprétation incorrecte des résultats
- Application dans des contextes inappropriés

## Exemples concrets

- **Recrutement** : Amazon a dû abandonner un outil IA qui discriminait les femmes
- **Justice** : COMPAS surestimait le risque de récidive pour les personnes noires
- **Santé** : Des algorithmes allouaient moins de soins aux patients noirs

## Comment lutter contre les biais ?

1. **Audit régulier** des modèles sur différents groupes
2. **Diversité** dans les équipes de développement
3. **Transparence** sur les données et méthodes
4. **Réglementation** (AI Act européen)

> 💡 L'IA ne fait qu'amplifier les biais existants dans nos données et nos sociétés. La vigilance est essentielle.`,
          },
        ],
      },
    ],
  },
];

export function getCourse(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}

export function getLesson(
  courseId: string,
  lessonId: string
): { course: Course; lesson: Lesson; moduleTitle: string } | undefined {
  const course = getCourse(courseId);
  if (!course) return undefined;
  for (const mod of course.modules) {
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (lesson) return { course, lesson, moduleTitle: mod.title };
  }
  return undefined;
}

export function getAllLessons(courseId: string): Lesson[] {
  const course = getCourse(courseId);
  if (!course) return [];
  return course.modules.flatMap((m) => m.lessons);
}

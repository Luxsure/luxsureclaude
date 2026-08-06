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
  {
    id: "ai-tools-ecosystem",
    title: "Outils & Écosystème IA",
    description:
      "Maîtrisez Claude, ChatGPT, Gemini, NotebookLM et Perplexity pour choisir le bon outil à chaque tâche.",
    longDescription:
      "Ce niveau vous fait explorer en profondeur les outils IA majeurs de l'écosystème 2026 : Claude, ChatGPT, Gemini, NotebookLM et Perplexity. Vous apprendrez leurs forces respectives et une matrice de décision pour choisir le bon outil selon le contexte, le budget et l'enjeu métier.",
    level: "Intermédiaire",
    duration: "4h",
    lessonsCount: 24,
    icon: "🛠️",
    color: "from-indigo-500 to-blue-500",
    tags: ["Outils IA", "Claude", "ChatGPT", "Gemini"],
    levelNumber: 4,
    finalBadge: { title: "Multi-Tool Master", icon: "⚖️" },
    modules: [
      {
        id: "tools-claude",
        title: "🤖 Claude : Maîtrise avancée",
        icon: "🤖",
        badge: { title: "Claude Expert", icon: "🤖" },
        lessons: [
          {
            id: "claude-projects-system-prompts",
            title: "Projects, System Prompts et contexte persistant",
            duration: "10 min",
            type: "theory",
            xp: 10,
            content: `## Pourquoi les Projects changent la donne

Les **Projects** de Claude permettent de regrouper des conversations autour d'un contexte partagé : documents de référence, instructions personnalisées et historique cohérent. Plutôt que de répéter le même contexte à chaque échange, vous le définissez une fois pour toutes.

## Construire un system prompt efficace

Un bon system prompt précise :
- Le rôle attendu de Claude (expert marketing, relecteur juridique, etc.)
- Le ton et le format de sortie souhaités
- Les contraintes métier (vocabulaire interdit, structure imposée)
- Les sources à privilégier parmi les documents joints

## Contexte persistant

Chaque nouvelle conversation dans un Project hérite automatiquement des fichiers et instructions déjà chargés. Cela évite les pertes de contexte et garantit une cohérence de réponse sur la durée, particulièrement utile pour un usage en équipe.

> 💡 Créez un Project dédié par client ou par projet récurrent : vous gagnerez un temps précieux sur le cadrage de chaque nouvelle conversation.`,
          },
          {
            id: "claude-artifacts",
            title: "Artifacts : créer des documents, code et visualisations",
            duration: "12 min",
            type: "practice",
            xp: 35,
            content: `## Que sont les Artifacts ?

Les **Artifacts** sont des espaces de travail séparés de la conversation où Claude génère du contenu autonome : code exécutable, documents structurés, diagrammes ou visualisations interactives. Contrairement à une réponse classique, un Artifact reste éditable et consultable indépendamment du fil de discussion.

## Cas d'usage concrets

- **Code** : composants React, scripts Python, pages HTML complètes testables en direct
- **Documents** : rapports longs, tableaux de bord Markdown, présentations structurées
- **Visualisations** : graphiques SVG, diagrammes Mermaid, tableaux de données interactifs

## Bonnes pratiques

Demandez explicitement une itération sur un Artifact existant plutôt que de relancer une nouvelle génération : Claude conserve la structure et applique uniquement vos modifications, ce qui est bien plus rapide qu'une réécriture complète.

> 💡 Pour un prototype rapide, demandez un Artifact HTML autonome : vous obtenez un rendu visuel immédiat, sans configuration.`,
          },
          {
            id: "claude-long-documents",
            title: "Claude pour l'analyse de documents longs (100K+ tokens)",
            duration: "10 min",
            type: "practice",
            xp: 35,
            content: `## Une fenêtre de contexte hors norme

Claude peut traiter des documents dépassant 100 000 tokens en une seule requête, soit l'équivalent de plusieurs centaines de pages. Cela permet d'analyser un rapport annuel complet, un contrat multi-annexes ou plusieurs études en parallèle sans découpage manuel.

## Méthode d'analyse efficace

1. Chargez le document complet plutôt que des extraits fragmentés
2. Demandez d'abord un résumé structuré pour valider la compréhension globale
3. Posez ensuite des questions précises en référençant les sections identifiées
4. Demandez des citations exactes pour vérifier chaque affirmation

## Limites à connaître

Même avec un grand contexte, la précision peut légèrement diminuer sur les informations situées au milieu d'un document très long. Segmentez si la fiabilité est critique (contrats juridiques, données financières).

> 💡 Demandez toujours à Claude de citer la source exacte de ses réponses : cela réduit fortement le risque d'erreur d'interprétation.`,
          },
          {
            id: "claude-battle-chatgpt",
            title: "Battle : Claude vs ChatGPT sur 5 cas métier",
            duration: "15 min",
            type: "battle",
            xp: 50,
            content: `## Le principe du battle

Ce module compare Claude et ChatGPT sur cinq situations professionnelles réelles : rédaction juridique, analyse de données, code, synthèse documentaire et brainstorming créatif. L'objectif n'est pas de désigner un vainqueur absolu, mais d'identifier les forces respectives de chaque outil.

## Grille de comparaison

| Cas métier | Point fort observé |
|---|---|
| Rédaction juridique | Claude : nuance et prudence |
| Code complexe | Les deux performent, styles différents |
| Analyse de données | ChatGPT : Code Interpreter intégré |
| Synthèse longue | Claude : gestion du contexte étendu |
| Brainstorming créatif | ChatGPT : diversité des idées |

## Ce qu'il faut retenir

Aucun outil n'est universellement supérieur : le bon choix dépend de la tâche, du volume de contexte et du niveau de fiabilité exigé.

> 💡 Testez systématiquement le même prompt sur les deux outils avant d'adopter un usage récurrent en entreprise.`,
          },
        ],
      },
      {
        id: "tools-chatgpt",
        title: "💬 ChatGPT & GPT Store : L'écosystème OpenAI",
        icon: "💬",
        badge: { title: "GPT Expert", icon: "💬" },
        lessons: [
          {
            id: "chatgpt-custom-gpts",
            title: "Custom GPTs : créer un assistant spécialisé",
            duration: "12 min",
            type: "theory",
            xp: 10,
            content: `## Qu'est-ce qu'un Custom GPT ?

Un Custom GPT est une version personnalisée de ChatGPT configurée pour une tâche récurrente : instructions spécifiques, base de connaissances propre et actions externes optionnelles. Il se crée sans code, via le configurateur intégré.

## Les éléments clés d'un bon Custom GPT

- **Nom et description** clairs pour guider l'usage
- **Instructions** détaillant le rôle, le ton et les limites
- **Base de connaissances** : fichiers de référence uploadés
- **Actions** : connexions à des API externes si nécessaire
- **Conversation starters** pour guider les premiers usages

## Cas d'usage typiques

Un Custom GPT est idéal pour standardiser une tâche répétée en équipe : relecture de CV, génération de comptes-rendus selon un gabarit fixe, ou assistant support client basé sur une documentation interne.

> 💡 Limitez la base de connaissances aux documents réellement utiles : trop de fichiers dilue la pertinence des réponses.`,
          },
          {
            id: "chatgpt-gpt-store",
            title: "GPT Store : explorer et configurer les meilleurs GPTs",
            duration: "8 min",
            type: "interactive",
            xp: 10,
            content: `## Explorer le GPT Store

Le GPT Store référence des milliers de Custom GPTs créés par la communauté et par des entreprises partenaires, classés par catégorie : productivité, écriture, programmation, éducation, style de vie.

## Comment évaluer un GPT avant de l'utiliser

- Consultez le nombre de conversations et les avis
- Vérifiez le nom du créateur (vérifié ou non)
- Lisez la description pour confirmer le périmètre exact
- Testez avec une question simple avant un usage critique

## Configurer ses favoris

Épinglez les GPTs utilisés régulièrement pour y accéder en un clic depuis la barre latérale, plutôt que de les rechercher à chaque session.

## Vigilance

Certains GPTs tiers demandent l'accès à des données externes via des actions : vérifiez toujours quelles informations sont partagées avant validation.

> 💡 Avant d'adopter un GPT métier en entreprise, testez-le sur un cas non sensible pour valider sa fiabilité.`,
          },
          {
            id: "chatgpt-canvas-code-interpreter",
            title: "Canvas & Code Interpreter pour l'analyse de données",
            duration: "12 min",
            type: "practice",
            xp: 35,
            content: `## Canvas : un espace de travail collaboratif

Canvas ouvre un panneau dédié à côté de la conversation pour rédiger et éditer du texte ou du code de façon itérative. Vous pouvez sélectionner un passage précis et demander une modification ciblée, sans réécrire tout le document.

## Code Interpreter pour l'analyse de données

Cette fonctionnalité permet d'uploader un fichier (CSV, Excel) et de demander directement des analyses : statistiques descriptives, graphiques, détection d'anomalies. ChatGPT exécute réellement du code Python en arrière-plan.

## Workflow recommandé

1. Uploadez le fichier de données
2. Demandez un aperçu et un nettoyage des valeurs manquantes
3. Posez des questions analytiques précises
4. Demandez une visualisation adaptée au message à transmettre

## Limites

Les fichiers volumineux ou les analyses nécessitant des bibliothèques spécifiques non disponibles dans l'environnement peuvent échouer silencieusement.

> 💡 Demandez toujours à voir le code généré avant de faire confiance aux résultats chiffrés produits.`,
          },
          {
            id: "chatgpt-dalle3",
            title: "Dall-E 3 dans ChatGPT : générer des visuels en conversation",
            duration: "10 min",
            type: "practice",
            xp: 35,
            content: `## Générer des visuels sans quitter la conversation

DALL-E 3 est intégré nativement à ChatGPT : il suffit de décrire l'image souhaitée en langage naturel pour obtenir un rendu, sans changer d'outil ni d'interface.

## Rédiger un bon prompt visuel

- Précisez le style (photo réaliste, illustration, flat design)
- Décrivez la composition et le cadrage
- Indiquez la palette de couleurs si elle est importante
- Mentionnez le contexte d'usage (bannière web, présentation, réseau social)

## Itérer efficacement

Contrairement à un outil de génération d'image autonome, ChatGPT permet de demander des ajustements en langage naturel sur l'image précédente : « rends le fond plus clair », « change la position du personnage ».

## Limite importante

DALL-E 3 reste imprécis sur le texte intégré à l'image et les visages récurrents d'un personnage d'une génération à l'autre.

> 💡 Décrivez toujours l'usage final de l'image : le modèle adapte automatiquement le style au contexte professionnel ou créatif.`,
          },
        ],
      },
      {
        id: "tools-gemini",
        title: "🔵 Gemini & Google AI Ecosystem",
        icon: "🔵",
        badge: { title: "Gemini Pro", icon: "🔵" },
        lessons: [
          {
            id: "gemini-deep-research",
            title: "Gemini Advanced : Deep Research et raisonnement étendu",
            duration: "10 min",
            type: "theory",
            xp: 10,
            content: `## Deep Research : la recherche autonome

Deep Research permet à Gemini Advanced d'explorer le web de façon autonome pendant plusieurs minutes, en consultant des dizaines de sources avant de produire un rapport structuré et sourcé sur un sujet donné.

## Quand l'utiliser

- Étude de marché ou veille concurrentielle approfondie
- Synthèse d'un sujet technique émergent
- Préparation d'un dossier nécessitant des sources multiples et récentes

## Raisonnement étendu

Le mode de raisonnement étendu de Gemini alloue davantage de temps de calcul avant de répondre, ce qui améliore la qualité sur les problèmes mathématiques, logiques ou de planification complexe.

## Différence avec une recherche classique

Une recherche web classique retourne des liens à explorer soi-même ; Deep Research produit directement une synthèse argumentée avec citations, proche d'un travail de recherche préliminaire.

> 💡 Réservez Deep Research aux sujets qui justifient plusieurs minutes d'attente : pour une question simple, une recherche standard suffit.`,
          },
          {
            id: "gemini-workspace",
            title: "Gemini dans Google Workspace (Docs, Sheets, Slides)",
            duration: "12 min",
            type: "theory",
            xp: 10,
            content: `## Gemini intégré à Google Workspace

Gemini s'intègre directement dans Docs, Sheets, Slides et Gmail, permettant de générer et modifier du contenu sans quitter l'application de travail habituelle.

## Usages par application

| Application | Usage principal |
|---|---|
| Docs | Rédaction, reformulation, résumé de document |
| Sheets | Formules, analyse de données, génération de tableaux |
| Slides | Création de présentations à partir d'un brief texte |
| Gmail | Rédaction et résumé de fils d'échange longs |

## Avantage clé

Comme Gemini a accès au contenu du document ouvert, il peut proposer des modifications contextualisées sans que vous ayez à recopier le contenu dans une conversation séparée.

## Point de vigilance

La qualité des réponses dans Sheets dépend fortement de la structure des données : des colonnes bien nommées améliorent nettement la pertinence des formules générées.

> 💡 Dans Sheets, décrivez le résultat attendu plutôt que la formule technique : Gemini traduit lui-même en syntaxe adaptée.`,
          },
          {
            id: "gemini-ai-studio",
            title: "Google AI Studio : tester et comparer les modèles",
            duration: "10 min",
            type: "practice",
            xp: 35,
            content: `## Google AI Studio, l'environnement de test

Google AI Studio est une interface gratuite permettant de tester les différents modèles Gemini (Flash, Pro) avec un contrôle fin des paramètres : température, longueur de réponse, system instructions.

## Comparer les modèles

- **Gemini Flash** : rapide et économique, idéal pour du volume
- **Gemini Pro** : raisonnement plus poussé pour les tâches complexes
- Testez le même prompt sur plusieurs modèles pour comparer qualité et latence

## Fonctionnalités utiles

AI Studio permet aussi de tester des entrées multimodales (image, audio, vidéo) et d'exporter directement le code d'intégration API correspondant à la configuration testée.

## Pour qui ?

Cet outil s'adresse autant aux non-développeurs souhaitant comparer des modèles avant un choix d'outil, qu'aux équipes techniques préparant une intégration API.

> 💡 Ajustez le paramètre de température à zéro pour des tâches factuelles, et plus haut pour des tâches créatives.`,
          },
          {
            id: "gemini-nano-banana-2",
            title: "Nano Banana 2 : génération d'images dans Gemini",
            duration: "10 min",
            type: "practice",
            xp: 35,
            content: `## Nano Banana 2 : génération d'images native

Nano Banana 2 est le modèle de génération et d'édition d'image intégré à Gemini, reconnu pour sa cohérence visuelle sur plusieurs générations successives et sa capacité à éditer une image existante par instruction textuelle.

## Points forts

- Conservation fidèle d'un personnage ou d'un style sur plusieurs images
- Édition ciblée : modifier un élément précis sans régénérer toute l'image
- Bonne gestion du texte intégré dans les visuels

## Workflow recommandé

1. Générez une première image de base
2. Affinez par itérations successives avec des instructions précises
3. Demandez des variantes en conservant les éléments validés

## Cas d'usage professionnels

Visuels marketing cohérents sur une campagne, mockups produits, illustrations pour présentation interne.

> 💡 Pour garder la cohérence d'un personnage ou d'un produit, réutilisez toujours l'image précédente comme référence plutôt que de repartir d'un prompt texte seul.`,
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

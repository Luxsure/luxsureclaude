-- Seed data: migrate the static course data to the database
-- Run AFTER schema.sql

-- ============================================================
-- COURSES
-- ============================================================
insert into public.courses (id, title, description, long_description, level, duration, icon, color, tags, "order", is_free) values
('fundamentals-of-ai', 'Fondamentaux de l''IA', 'Comprenez les bases de l''intelligence artificielle, du machine learning et du deep learning.', 'Ce cours vous plonge dans les fondations de l''IA moderne. Vous découvrirez comment les machines apprennent à partir de données, les différents types d''apprentissage et les applications concrètes qui transforment notre quotidien.', 'beginner', '4h', '🧠', 'from-blue-500 to-cyan-500', '{"IA","Machine Learning","Deep Learning"}', 1, true),
('ai-for-business', 'L''IA pour le Business', 'Apprenez à intégrer l''IA dans votre stratégie d''entreprise et à automatiser vos processus.', 'Découvrez comment les entreprises utilisent l''IA pour gagner en productivité, prendre de meilleures décisions et créer de la valeur.', 'intermediate', '6h', '💼', 'from-purple-500 to-pink-500', '{"Business","Automatisation","Stratégie"}', 2, true),
('generative-ai-mastery', 'Maîtriser l''IA Générative', 'De DALL-E à Claude, maîtrisez les outils d''IA générative pour créer du contenu de qualité.', 'Plongez dans l''univers de l''IA générative. Apprenez à utiliser les LLM, les générateurs d''images et les outils audio/vidéo.', 'intermediate', '5h', '✨', 'from-orange-500 to-red-500', '{"IA Générative","LLM","Créativité"}', 3, true),
('ai-ethics-safety', 'Éthique et Sécurité de l''IA', 'Comprenez les enjeux éthiques, les biais algorithmiques et la gouvernance de l''IA.', 'Un cours essentiel sur les questions éthiques soulevées par l''IA : biais, vie privée, transparence, impact sociétal et réglementation.', 'beginner', '3h', '⚖️', 'from-green-500 to-teal-500', '{"Éthique","Biais","Régulation"}', 4, true);

-- ============================================================
-- MODULES
-- ============================================================
insert into public.modules (id, course_id, title, "order") values
('intro-ai', 'fundamentals-of-ai', 'Introduction à l''IA', 1),
('machine-learning', 'fundamentals-of-ai', 'Machine Learning', 2),
('prompt-engineering', 'fundamentals-of-ai', 'Prompt Engineering', 3),
('ai-strategy', 'ai-for-business', 'Stratégie IA en entreprise', 1),
('llm-mastery', 'generative-ai-mastery', 'Maîtriser les LLM', 1),
('ethics-basics', 'ai-ethics-safety', 'Les fondamentaux de l''éthique IA', 1);

-- ============================================================
-- LESSONS (content_md truncated for seed — full content in app)
-- ============================================================
insert into public.lessons (id, module_id, title, duration, "order", is_free) values
('what-is-ai', 'intro-ai', 'Qu''est-ce que l''Intelligence Artificielle ?', '15 min', 1, true),
('history-of-ai', 'intro-ai', 'Brève histoire de l''IA', '12 min', 2, true),
('ml-basics', 'machine-learning', 'Les bases du Machine Learning', '20 min', 1, true),
('deep-learning-intro', 'machine-learning', 'Introduction au Deep Learning', '18 min', 2, true),
('prompt-basics', 'prompt-engineering', 'L''art du prompt', '15 min', 1, true),
('ai-use-cases', 'ai-strategy', 'Cas d''usage de l''IA en entreprise', '20 min', 1, true),
('understanding-llm', 'llm-mastery', 'Comprendre les LLM', '18 min', 1, true),
('bias-in-ai', 'ethics-basics', 'Les biais dans l''IA', '15 min', 1, true);

-- ============================================================
-- QUIZ QUESTIONS
-- ============================================================
insert into public.quiz_questions (id, lesson_id, question, options, correct_index, explanation, "order") values
('q1-what-is-ai', 'what-is-ai', 'Quel type d''IA utilisez-vous quand vous parlez à un assistant vocal ?', '{"IA Faible (Narrow AI)","IA Générale (AGI)","Super Intelligence","Aucune de ces réponses"}', 0, 'Les assistants vocaux sont des exemples d''IA faible : spécialisés dans une tâche.', 1),
('q2-what-is-ai', 'what-is-ai', 'Quel facteur N''est PAS une raison de l''essor récent de l''IA ?', '{"L''augmentation des données disponibles","La puissance des GPU","La découverte de la conscience artificielle","Les progrès en deep learning"}', 2, 'La conscience artificielle n''a pas été découverte.', 2),
('q1-history', 'history-of-ai', 'En quelle année le terme Intelligence Artificielle a-t-il été inventé ?', '{"1950","1956","1969","1997"}', 1, 'Inventé en 1956 lors de la conférence de Dartmouth.', 1),
('q1-ml', 'ml-basics', 'Quel type d''apprentissage utilise des exemples étiquetés ?', '{"Apprentissage supervisé","Apprentissage non supervisé","Apprentissage par renforcement","Apprentissage semi-supervisé"}', 0, 'L''apprentissage supervisé utilise des données étiquetées.', 1),
('q2-ml', 'ml-basics', 'Quelle est la première étape du processus ML ?', '{"Choisir un algorithme","Entraîner le modèle","Collecter les données","Évaluer les performances"}', 2, 'Tout commence par la collecte des données.', 2),
('q1-prompt', 'prompt-basics', 'Quel principe est le PLUS important pour un bon prompt ?', '{"Être spécifique","Utiliser des majuscules","Écrire le plus long possible","Toujours dire merci"}', 0, 'La spécificité est cruciale pour obtenir des réponses pertinentes.', 1);

-- ============================================================
-- BADGES
-- ============================================================
insert into public.badges (id, slug, title, description, icon, category, requirement_type, requirement_value) values
('first-lesson', 'first-lesson', 'Premier pas', 'Terminer votre première leçon', '🎯', 'course', 'lessons_completed', 1),
('five-lessons', 'five-lessons', 'Étudiant assidu', 'Terminer 5 leçons', '📚', 'course', 'lessons_completed', 5),
('ten-lessons', 'ten-lessons', 'Expert en herbe', 'Terminer 10 leçons', '🎓', 'course', 'lessons_completed', 10),
('first-course', 'first-course', 'Diplômé', 'Terminer un cours complet', '🏆', 'course', 'courses_completed', 1),
('perfect-quiz', 'perfect-quiz', 'Sans faute', 'Obtenir 100% à un quiz', '💯', 'quiz', 'perfect_quiz', 1),
('five-quizzes', 'five-quizzes', 'Quizmaster', 'Réussir 5 quiz', '🧪', 'quiz', 'quizzes_passed', 5),
('streak-3', 'streak-3', 'Régulier', '3 jours consécutifs', '🔥', 'streak', 'streak_days', 3),
('streak-7', 'streak-7', 'Marathonien', '7 jours consécutifs', '⚡', 'streak', 'streak_days', 7),
('streak-30', 'streak-30', 'Légende', '30 jours consécutifs', '👑', 'streak', 'streak_days', 30),
('ai-fluent', 'ai-fluent', 'AI Fluent', 'Terminer tous les cours', '🤖', 'special', 'all_courses_completed', 1);
-- ============================================================
-- COURSES — Levels 4-7
-- ============================================================
insert into public.courses (id, title, description, long_description, level, level_number, duration, icon, color, tags, "order", is_free) values
('ai-tools-ecosystem', 'Outils & Écosystème IA', 'Maîtrisez Claude, ChatGPT, Gemini, NotebookLM et Perplexity pour choisir le bon outil à chaque tâche.', 'Ce niveau vous fait explorer en profondeur les outils IA majeurs de l''écosystème 2026 : Claude, ChatGPT, Gemini, NotebookLM et Perplexity. Vous apprendrez leurs forces respectives et une matrice de décision pour choisir le bon outil selon le contexte, le budget et l''enjeu métier.', 'intermediate', 4, '4h', '🛠️', 'from-indigo-500 to-blue-500', '{"Outils IA","Claude","ChatGPT","Gemini"}', 5, true),
('visual-ai-creation', 'Création Visuelle IA', 'Générez images et vidéos professionnelles avec Nano Banana 2, Midjourney, Sora et Veo 3.', 'Plongez dans la génération visuelle IA de 2026 : images cohérentes avec Nano Banana 2 et Midjourney, vidéos avec Sora et Veo 3. Un niveau complet pour produire des visuels et vidéos de qualité professionnelle, du prompt au kit de campagne.', 'intermediate', 5, '4h', '🎨', 'from-pink-500 to-rose-500', '{"Images IA","Vidéo IA","Midjourney","Sora"}', 6, true),
('agents-automation', 'Agents & Automatisation', 'Configurez CLAUDE.md, connectez le MCP et automatisez vos workflows avec Claude Code et Cowork.', 'Apprenez à configurer votre IA avec CLAUDE.md et les Skills, à connecter Claude à vos outils via le protocole MCP, à coder avec Claude Code et Cowork, et à automatiser des workflows complets — le tout dans le respect de l''éthique et de la sécurité.', 'advanced', 6, '4h', '⚙️', 'from-cyan-500 to-teal-500', '{"MCP","Agents IA","CLAUDE.md","Automatisation"}', 7, true),
('professional-mastery', 'Maîtrise Professionnelle', 'Choisissez une spécialisation métier et décrochez la certification AI Fluent.', 'Le niveau final du curriculum : 8 spécialisations métier (créatif, business, code, éducation, luxe, marketing, productivité) et une certification finale AI Fluent avec portfolio, examen pratique et présentation.', 'advanced', 7, '7h', '💎', 'from-amber-500 to-yellow-500', '{"Spécialisation","Certification","Capstone"}', 8, true);

-- ============================================================
-- MODULES — Levels 4-7
-- ============================================================
insert into public.modules (id, course_id, title, icon, badge_title, badge_icon, "order") values
('tools-claude', 'ai-tools-ecosystem', '🤖 Claude : Maîtrise avancée', '🤖', 'Claude Expert', '🤖', 1),
('tools-chatgpt', 'ai-tools-ecosystem', '💬 ChatGPT & GPT Store : L''écosystème OpenAI', '💬', 'GPT Expert', '💬', 2),
('tools-gemini', 'ai-tools-ecosystem', '🔵 Gemini & Google AI Ecosystem', '🔵', 'Gemini Pro', '🔵', 3),
('tools-notebooklm', 'ai-tools-ecosystem', '📓 NotebookLM : Intelligence documentaire', '📓', 'Notebook Master', '📓', 4),
('tools-perplexity', 'ai-tools-ecosystem', '🔍 Perplexity : Recherche augmentée', '🔍', 'Research Pro', '🔍', 5),
('tools-choosing', 'ai-tools-ecosystem', '⚖️ Choisir le bon outil : Matrice décisionnelle', '⚖️', 'Multi-Tool Master', '⚖️', 6),
('visual-nano-banana', 'visual-ai-creation', '🍌 Nano Banana 2 & Gemini Image', '🍌', 'Banana Artist', '🍌', 1),
('visual-midjourney', 'visual-ai-creation', '🏙️ Midjourney : L''art du prompt visuel', '🏙️', 'Midjourney Master', '🏙️', 2),
('visual-sora', 'visual-ai-creation', '🎬 Sora (OpenAI) : Génération vidéo', '🎬', 'Video Creator', '🎬', 3),
('visual-veo', 'visual-ai-creation', '🎥 Veo (Google) & Flow : Vidéo Google', '🎥', 'Veo Director', '🎥', 4),
('visual-workflow', 'visual-ai-creation', '🖼️ Workflow Visuel Complet', '🖼️', 'Visual AI Creator', '🖼️', 5),
('agents-claude-md', 'agents-automation', '📝 CLAUDE.md & Skills : Configurer son IA', '📝', 'Config Master', '📝', 1),
('agents-mcp', 'agents-automation', '🔌 MCP : Le protocole universel de l''IA', '🔌', 'MCP Explorer', '🔌', 2),
('agents-claude-code', 'agents-automation', '🤖 Claude Code & Cowork : Coder avec l''IA', '🤖', 'AI Builder', '🤖', 3),
('agents-workflows', 'agents-automation', '⚡ Workflows d''automatisation IA', '⚡', 'Automation Pro', '⚡', 4),
('agents-ethics', 'agents-automation', '🛡️ Sécurité, éthique et gouvernance IA', '🛡️', 'AI Guardian', '🛡️', 5),
('spec-creative', 'professional-mastery', '🎨 Spéc. Créatif & Content', '🎨', 'Creative AI Master', '🎨', 1),
('spec-business', 'professional-mastery', '📊 Spéc. Business & Stratégie', '📊', 'Strategic AI Leader', '📊', 2),
('spec-code', 'professional-mastery', '💻 Spéc. Code & No-Code', '💻', 'AI Builder Pro', '💻', 3),
('spec-education', 'professional-mastery', '🎓 Spéc. Éducation & Formation', '🎓', 'AI Educator', '🎓', 4),
('spec-luxury', 'professional-mastery', '💎 Spéc. Luxe & Premium (Méthode Luxsure.ai)', '💎', 'Tech-Couture Certified', '💎', 5),
('spec-marketing', 'professional-mastery', '📱 Spéc. Marketing Digital', '📱', 'Marketing AI Pro', '📱', 6),
('spec-productivity', 'professional-mastery', '💼 Spéc. Productivité & Management', '💼', 'AI Power Manager', '💼', 7),
('spec-certification', 'professional-mastery', '🎯 Certification finale : AI Fluent', '🎯', 'AI Fluent ✨', '🎯', 8);

-- ============================================================
-- LESSONS — Levels 4-7 (content_md truncated for seed — full content in app)
-- ============================================================
insert into public.lessons (id, module_id, title, duration, xp, lesson_type, "order", is_free) values
('claude-projects-system-prompts', 'tools-claude', 'Projects, System Prompts et contexte persistant', '10 min', 10, 'theory', 1, true),
('claude-artifacts', 'tools-claude', 'Artifacts : créer des documents, code et visualisations', '12 min', 35, 'practice', 2, true),
('claude-long-documents', 'tools-claude', 'Claude pour l''analyse de documents longs (100K+ tokens)', '10 min', 35, 'practice', 3, true),
('claude-battle-chatgpt', 'tools-claude', 'Battle : Claude vs ChatGPT sur 5 cas métier', '15 min', 50, 'battle', 4, true),
('chatgpt-custom-gpts', 'tools-chatgpt', 'Custom GPTs : créer un assistant spécialisé', '12 min', 10, 'theory', 1, true),
('chatgpt-gpt-store', 'tools-chatgpt', 'GPT Store : explorer et configurer les meilleurs GPTs', '8 min', 10, 'interactive', 2, true),
('chatgpt-canvas-code-interpreter', 'tools-chatgpt', 'Canvas & Code Interpreter pour l''analyse de données', '12 min', 35, 'practice', 3, true),
('chatgpt-dalle3', 'tools-chatgpt', 'Dall-E 3 dans ChatGPT : générer des visuels en conversation', '10 min', 35, 'practice', 4, true),
('gemini-deep-research', 'tools-gemini', 'Gemini Advanced : Deep Research et raisonnement étendu', '10 min', 10, 'theory', 1, true),
('gemini-workspace', 'tools-gemini', 'Gemini dans Google Workspace (Docs, Sheets, Slides)', '12 min', 10, 'theory', 2, true),
('gemini-ai-studio', 'tools-gemini', 'Google AI Studio : tester et comparer les modèles', '10 min', 35, 'practice', 3, true),
('gemini-nano-banana-2', 'tools-gemini', 'Nano Banana 2 : génération d''images dans Gemini', '10 min', 35, 'practice', 4, true),
('notebooklm-sources', 'tools-notebooklm', 'Sources multiples : PDF, YouTube, Sites web, Audio', '10 min', 10, 'theory', 1, true),
('notebooklm-audio-overview', 'tools-notebooklm', 'Audio Overview : transformer des documents en podcast', '8 min', 10, 'theory', 2, true),
('notebooklm-cross-query', 'tools-notebooklm', 'Interrogation croisée : poser des questions à plusieurs sources', '10 min', 35, 'practice', 3, true),
('notebooklm-project-veille', 'tools-notebooklm', 'Projet : créer un notebook de veille sectorielle', '15 min', 50, 'project', 4, true),
('perplexity-search-modes', 'tools-perplexity', 'Perplexity Pro Search vs Quick Search vs Deep Research', '8 min', 10, 'interactive', 1, true),
('perplexity-spaces', 'tools-perplexity', 'Perplexity Spaces : organiser sa recherche collaborative', '10 min', 10, 'theory', 2, true),
('perplexity-veille-concurrentielle', 'tools-perplexity', 'Perplexity pour la veille concurrentielle automatique', '12 min', 35, 'practice', 3, true),
('perplexity-battle-google-chatgpt', 'tools-perplexity', 'Battle : Perplexity vs Google vs ChatGPT Search', '12 min', 50, 'battle', 4, true),
('choosing-matrix-outil-tache', 'tools-choosing', 'La matrice outil/tâche : quel LLM pour quel usage ?', '10 min', 10, 'interactive', 1, true),
('choosing-costs-pricing', 'tools-choosing', 'Coûts & pricing : optimiser son budget IA', '8 min', 10, 'interactive', 2, true),
('choosing-challenge-5-cas', 'tools-choosing', 'Challenge : résoudre 5 cas en choisissant le bon outil', '15 min', 50, 'battle', 3, true),
('choosing-quiz-final', 'tools-choosing', 'Quiz final Level 4', '8 min', 25, 'interactive', 4, true),
('nano-banana-prompting-fundamentals', 'visual-nano-banana', 'Fondamentaux du prompting visuel dans Gemini', '10 min', 10, 'theory', 1, true),
('nano-banana-resolutions-aspect-ratios', 'visual-nano-banana', 'Nano Banana 2 : résolutions, aspect ratios et contrôle créatif', '12 min', 35, 'practice', 2, true),
('nano-banana-subject-consistency', 'visual-nano-banana', 'Subject Consistency : maintenir des personnages cohérents', '10 min', 35, 'practice', 3, true),
('nano-banana-project-branding-series', 'visual-nano-banana', 'Projet : créer une série de 5 visuels cohérents pour un branding', '15 min', 50, 'project', 4, true),
('midjourney-syntax-parameters', 'visual-midjourney', 'Syntaxe Midjourney : paramètres, aspect, style, chaos', '12 min', 10, 'theory', 1, true),
('midjourney-styles-sref-describe', 'visual-midjourney', 'Styles artistiques et références : /describe et --sref', '10 min', 35, 'practice', 2, true),
('midjourney-workflows-pro', 'visual-midjourney', 'Workflows pro : mood boards, variations, upscale', '12 min', 35, 'practice', 3, true),
('midjourney-battle-dalle-nanobanana', 'visual-midjourney', 'Battle : Midjourney vs Nano Banana 2 vs DALL-E', '15 min', 50, 'battle', 4, true),
('sora-fundamentals-prompting', 'visual-sora', 'Fondamentaux de Sora : prompting vidéo efficace', '10 min', 10, 'theory', 1, true),
('sora-storyboarding', 'visual-sora', 'Storyboarding avec Sora : du script au clip', '12 min', 35, 'practice', 2, true),
('sora-parameters-duration-resolution', 'visual-sora', 'Paramètres : durée, résolution, style cinématographique', '10 min', 35, 'practice', 3, true),
('sora-project-teaser-15s', 'visual-sora', 'Projet : créer un teaser vidéo de 15 secondes', '20 min', 50, 'project', 4, true),
('veo3-fundamentals-google', 'visual-veo', 'Veo 3 : génération vidéo dans l''écosystème Google', '10 min', 10, 'theory', 1, true),
('flow-editor-ia-google', 'visual-veo', 'Flow : l''éditeur vidéo IA de Google (montage + génération)', '12 min', 10, 'theory', 2, true),
('battle-sora-vs-veo3', 'visual-veo', 'Battle : Sora vs Veo 3 — même brief, deux résultats', '15 min', 50, 'battle', 3, true),
('whisk-antigravity-image-to-video', 'visual-veo', 'Whisk & Antigravity : transformer des images en vidéo', '10 min', 35, 'practice', 4, true),
('workflow-choisir-outil-visuel', 'visual-workflow', 'Du brief au livrable : choisir le bon outil visuel', '10 min', 10, 'interactive', 1, true),
('workflow-retouche-inpainting-outpainting', 'visual-workflow', 'Retouche et édition IA : in-painting, outpainting, style transfer', '12 min', 35, 'practice', 2, true),
('workflow-projet-final-kit-campagne', 'visual-workflow', 'Projet final : créer un kit campagne (5 images + 1 vidéo)', '25 min', 75, 'project', 3, true),
('workflow-quiz-final-level5', 'visual-workflow', 'Quiz final Level 5', '8 min', 25, 'interactive', 4, true),
('claude-md-fichier-expert', 'agents-claude-md', 'CLAUDE.md : le fichier qui transforme Claude en expert', '10 min', 10, 'theory', 1, true),
('anatomie-claude-md-parfait', 'agents-claude-md', 'Anatomie d''un CLAUDE.md parfait (conventions, design system, règles)', '12 min', 35, 'practice', 2, true),
('skills-slash-commands', 'agents-claude-md', 'Skills & Slash Commands : créer des workflows répétables', '10 min', 10, 'theory', 3, true),
('projet-claude-md-personnel', 'agents-claude-md', 'Projet : écrire le CLAUDE.md de son propre projet', '15 min', 50, 'project', 4, true),
('mcp-usb-c-ia', 'agents-mcp', 'Qu''est-ce que le MCP ? Le « USB-C de l''IA »', '8 min', 10, 'interactive', 1, true),
('architecture-mcp', 'agents-mcp', 'Architecture MCP : clients, serveurs, outils, ressources', '10 min', 10, 'theory', 2, true),
('connecter-mcp-google-slack-github', 'agents-mcp', 'Connecter Claude à Google Drive, Slack, GitHub via MCP', '12 min', 35, 'theory', 3, true),
('installer-mcp-server', 'agents-mcp', 'Installer et configurer un MCP Server (démo pratique)', '15 min', 50, 'practice', 4, true),
('claude-code-prompt-to-project', 'agents-claude-code', 'Claude Code : du prompt au projet full-stack', '12 min', 10, 'theory', 1, true),
('cowork-automatiser-desktop', 'agents-claude-code', 'Cowork : automatiser ses tâches desktop sans coder', '10 min', 10, 'theory', 2, true),
('background-tasks-sub-agents', 'agents-claude-code', 'Background tasks, sub-agents et parallélisme', '10 min', 35, 'interactive', 3, true),
('projet-app-react-claude-code', 'agents-claude-code', 'Projet : créer une app React simple avec Claude Code', '20 min', 50, 'project', 4, true),
('make-com-ia-workflows', 'agents-workflows', 'Make.com + IA : automatiser des flux de travail', '12 min', 10, 'theory', 1, true),
('zapier-ai-actions', 'agents-workflows', 'Zapier AI Actions : connecter l''IA à 5000+ apps', '10 min', 10, 'theory', 2, true),
('pipelines-contenu-automatise', 'agents-workflows', 'Pipelines de contenu : de l''idée à la publication automatisée', '12 min', 35, 'practice', 3, true),
('projet-newsletter-automatisee', 'agents-workflows', 'Projet : automatiser une newsletter hebdo avec l''IA', '20 min', 50, 'project', 4, true),
('hallucinations-biais-limites-llm', 'agents-ethics', 'Hallucinations, biais et limites des LLMs', '10 min', 10, 'interactive', 1, true),
('confidentialite-donnees-ia', 'agents-ethics', 'Confidentialité des données : que partager, que protéger ?', '8 min', 10, 'interactive', 2, true),
('charte-usage-ia-entreprise', 'agents-ethics', 'Politiques IA en entreprise : rédiger une charte d''usage', '12 min', 35, 'practice', 3, true),
('quiz-final-level-6-ethique', 'agents-ethics', 'Quiz final Level 6 + Étude de cas éthique', '10 min', 25, 'interactive', 4, true),
('redaction-augmentee-blog-newsletter', 'spec-creative', 'Rédaction augmentée : blog, newsletter, copywriting', '12 min', 35, 'practice', 1, true),
('social-media-30-jours-1-heure', 'spec-creative', 'Social media : créer 30 jours de contenu en 1 heure', '15 min', 50, 'project', 2, true),
('strategie-contenu-calendrier-editorial', 'spec-creative', 'Stratégie de contenu IA : calendrier éditorial automatisé', '12 min', 35, 'practice', 3, true),
('capstone-campagne-content-complete', 'spec-creative', 'Capstone : lancer une campagne content complète', '25 min', 75, 'project', 4, true),
('analyse-marche-veille-strategique', 'spec-business', 'Analyse de marché et veille stratégique avec l''IA', '12 min', 35, 'practice', 1, true),
('business-plans-pitch-decks-ia', 'spec-business', 'Business plans et pitch decks générés par IA', '15 min', 50, 'project', 2, true),
('data-storytelling-analyse-rapport', 'spec-business', 'Data storytelling : de l''analyse au rapport', '12 min', 35, 'practice', 3, true),
('capstone-benchmark-sectoriel', 'spec-business', 'Capstone : produire un benchmark sectoriel complet', '25 min', 75, 'project', 4, true),
('prototyper-app-claude-code-lovable', 'spec-code', 'Prototyper une app avec Claude Code + Lovable', '15 min', 50, 'project', 1, true),
('automatisation-make-airtable-claude-api', 'spec-code', 'Automatisation avancée : Make + Airtable + Claude API', '12 min', 35, 'theory', 2, true),
('deployer-chatbot-custom-api-claude', 'spec-code', 'Déployer un chatbot custom avec l''API Claude', '15 min', 50, 'project', 3, true),
('capstone-mvp-fonctionnel', 'spec-code', 'Capstone : livrer un MVP fonctionnel', '30 min', 100, 'project', 4, true),
('supports-cours-ia-slides-exercices-evals', 'spec-education', 'Créer des supports de cours avec l''IA (slides, exercices, évals)', '12 min', 50, 'project', 1, true),
('notebooklm-enseignants-podcasts-pedagogiques', 'spec-education', 'NotebookLM pour les enseignants : podcasts pédagogiques', '10 min', 35, 'theory', 2, true),
('gamification-formation-parcours-engageant', 'spec-education', 'Gamification de la formation : concevoir un parcours engageant', '12 min', 35, 'interactive', 3, true),
('capstone-module-formation-ia-complet', 'spec-education', 'Capstone : concevoir un module de formation IA complet', '25 min', 75, 'project', 4, true),
('luxury-tone-writing', 'spec-luxury', 'Ton de marque luxe : écrire avec l''exigence du premium', '12 min', 35, 'practice', 1, true),
('luxury-ai-diagnostic', 'spec-luxury', 'Stratégie IA pour les maisons de luxe (diagnostic Luxsure.ai)', '10 min', 35, 'interactive', 2, true),
('luxury-visuals-midjourney', 'spec-luxury', 'Visuels luxe : Midjourney + Nano Banana pour le branding premium', '12 min', 35, 'practice', 3, true),
('luxury-capstone', 'spec-luxury', 'Capstone : présenter une stratégie IA pour une marque luxe', '25 min', 100, 'project', 4, true),
('marketing-seo-ai', 'spec-marketing', 'SEO augmenté : optimiser ses contenus avec l''IA', '12 min', 35, 'practice', 1, true),
('marketing-email-sequences', 'spec-marketing', 'Email marketing : séquences et personnalisation IA', '12 min', 50, 'project', 2, true),
('marketing-ads-creative', 'spec-marketing', 'Ads créatifs : générer des visuels et copies publicitaires', '12 min', 35, 'practice', 3, true),
('marketing-capstone', 'spec-marketing', 'Capstone : lancer une campagne marketing complète', '25 min', 75, 'project', 4, true),
('productivity-emails-synthesis', 'spec-productivity', 'Emails, comptes-rendus et synthèses en 2 minutes', '10 min', 35, 'practice', 1, true),
('productivity-project-management', 'spec-productivity', 'Gestion de projet augmentée : OKR, planning, suivi', '12 min', 50, 'project', 2, true),
('productivity-decision-assist', 'spec-productivity', 'Décision assistée : matrices, analyses et recommandations', '12 min', 35, 'practice', 3, true),
('productivity-capstone', 'spec-productivity', 'Capstone : automatiser le workflow d''une équipe de 10', '25 min', 75, 'project', 4, true),
('certification-portfolio', 'spec-certification', 'Portfolio IA : compiler ses meilleurs travaux', '15 min', 50, 'project', 1, true),
('certification-exam', 'spec-certification', 'Examen pratique : résoudre 5 cas en temps limité', '30 min', 100, 'battle', 2, true),
('certification-pitch', 'spec-certification', 'Présentation finale : pitcher sa maîtrise IA', '20 min', 75, 'project', 3, true),
('certification-ceremony', 'spec-certification', 'Cérémonie de badges + certificat LinkedIn vérifiable', '5 min', 50, 'interactive', 4, true);

-- ============================================================
-- QUIZ QUESTIONS — Levels 4-7
-- ============================================================
insert into public.quiz_questions (id, lesson_id, question, options, correct_index, explanation, "order") values
('quiz-final-l4-q1', 'choosing-quiz-final', 'Quel outil IA est spécifiquement conçu pour ancrer strictement ses réponses aux sources documentaires fournies, réduisant ainsi les hallucinations ?', '{"ChatGPT","NotebookLM","Perplexity","Gemini"}', 1, 'NotebookLM base exclusivement ses réponses sur les sources chargées par l''utilisateur, avec citation précise du passage d''origine, contrairement aux assistants généralistes qui puisent aussi dans leurs connaissances générales.', 1),
('quiz-final-l4-q2', 'choosing-quiz-final', 'Pour une recherche web nécessitant des sources récentes, vérifiables et systématiquement citées, quel outil est le plus adapté ?', '{"Claude","Perplexity","NotebookLM","Gemini Workspace"}', 1, 'Perplexity est spécialisé dans la recherche web augmentée avec citation systématique de sources récentes, alors que les autres outils cités sont davantage orientés génération de contenu ou analyse de documents déjà fournis par l''utilisateur.', 2),
('quiz-level5-q1', 'workflow-quiz-final-level5', 'Quel outil est spécifiquement reconnu pour sa fonctionnalité de Subject Consistency, permettant de garder un personnage identique sur plusieurs images ?', '{"Midjourney","Nano Banana 2","Sora","Veo 3"}', 1, 'Nano Banana 2 propose une fonctionnalité dédiée de Subject Consistency, essentielle pour créer des séries de visuels cohérents avec le même personnage ou produit.', 1),
('quiz-level5-q2', 'workflow-quiz-final-level5', 'Quel générateur vidéo se distingue par sa capacité à produire du son et des dialogues synchronisés nativement avec l''image ?', '{"Sora","Midjourney","Veo 3","Nano Banana 2"}', 2, 'Veo 3, développé par Google, génère du son ambiant et des dialogues synchronisés avec la vidéo, contrairement à Sora qui se concentre sur l''image en mouvement.', 2),
('quiz-level6-ethics-q1', 'quiz-final-level-6-ethique', 'Que signifie MCP et à quoi sert-il principalement ?', '{"Model Context Protocol : un protocole universel pour connecter une IA à des outils et données externes","Managed Cloud Platform : un service d''hébergement pour modèles IA","Multi-Channel Prompting : une technique pour envoyer plusieurs prompts en parallèle","Model Compression Package : une méthode pour réduire la taille des modèles"}', 0, 'MCP (Model Context Protocol) standardise la connexion entre une IA et des outils/ressources externes, évitant de coder une intégration sur-mesure pour chaque service.', 1),
('quiz-level6-ethics-q2', 'quiz-final-level-6-ethique', 'Dans l''étude de cas où une fiche produit contient une information fausse générée par l''IA, quelle pratique aurait le mieux évité l''incident ?', '{"Documenter le rôle de l''IA dans un CLAUDE.md, sans changer le processus de publication","Interdire totalement l''usage de l''IA dans l''entreprise","Intégrer une étape de relecture humaine obligatoire avant toute publication, comme le prévoit une charte d''usage IA","Augmenter la fréquence de publication pour compenser les erreurs occasionnelles"}', 2, 'Une charte d''usage IA bien conçue impose une validation humaine avant publication, ce qui aurait permis de détecter l''hallucination avant qu''elle n''atteigne le client.', 2),
('certification-ceremony-q1', 'certification-ceremony', 'Qu''est-ce qui distingue fondamentalement un agent IA autonome d''un simple prompt ponctuel ?', '{"Un agent utilise toujours un modèle plus puissant","Un agent peut enchaîner plusieurs actions, utiliser des outils et s''ajuster en fonction des résultats intermédiaires","Un agent ne nécessite aucune supervision humaine, contrairement à un prompt","Un agent produit uniquement du texte, jamais d''actions concrètes"}', 1, 'Un agent IA orchestre plusieurs étapes (raisonnement, appel d''outils, vérification) de façon autonome pour atteindre un objectif, alors qu''un prompt ponctuel produit une réponse unique sans boucle de décision.', 1),
('certification-ceremony-q2', 'certification-ceremony', 'Vous utilisez l''IA pour produire un rapport contenant une statistique dont vous n''êtes pas certain de l''exactitude. Quelle est la bonne pratique ?', '{"Publier le rapport tel quel : l''IA est fiable sur les données chiffrées","Retirer toute statistique par principe, même vérifiable","Vérifier la source de la statistique avant publication, ou la signaler explicitement comme non vérifiée","Demander à une autre IA de confirmer le chiffre, ce qui suffit à le valider"}', 2, 'Les modèles IA peuvent générer des informations plausibles mais inexactes (hallucinations). La responsabilité professionnelle impose de vérifier les sources ou d''indiquer clairement l''incertitude avant toute diffusion.', 2);

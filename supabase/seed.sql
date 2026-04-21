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

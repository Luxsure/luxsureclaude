package com.example.models

object SeedData {
    val categories = listOf(
        Category(
            id = "cat_1",
            name = "Hôtels & Palaces",
            slug = "palaces",
            description = "Palaces historiques et retraites ultraconfidentielles d'exception.",
            image = "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80"
        ),
        Category(
            id = "cat_2",
            name = "Gastronomie",
            slug = "gastronomy",
            description = "Tables triplement étoilées, cuisines d'auteur et secrets d'initiés.",
            image = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80"
        ),
        Category(
            id = "cat_3",
            name = "Spas & Bien-être",
            slug = "spas",
            description = "Thermes exclusifs, cliniques holistiques de pointe et sanctuaires sensoriels.",
            image = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
        ),
        Category(
            id = "cat_4",
            name = "Haute Joaillerie & Mode",
            slug = "fashion",
            description = "Ateliers historiques, salons de haute couture et manufactures d'art.",
            image = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
        )
    )

    val destinations = listOf(
        Destination(
            id = "dest_1",
            name = "Paris",
            slug = "paris",
            country = "France",
            description = "Le berceau mondial de la haute couture et de l'art de vivre d'exception.",
            image = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80"
        ),
        Destination(
            id = "dest_2",
            name = "Tokyo",
            slug = "tokyo",
            country = "Japon",
            description = "Une perfection minimaliste mariant traditions intemporelles et d'avant-garde.",
            image = "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=600&q=80"
        ),
        Destination(
            id = "dest_3",
            name = "Londres",
            slug = "london",
            country = "Royaume-Uni",
            description = "L'élégance sur mesure de Mayfair, entre clubs privés exclusifs et heritage britannique.",
            image = "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80"
        )
    )

    val initialAddresses = listOf(
        Address(
            id = "addr_1",
            title = "Ritz Paris",
            slug = "ritz-paris",
            status = "published",
            categorySlug = "palaces",
            destinationSlug = "paris",
            shortDescription = "La légende éternelle de la Place Vendôme, symbole absolu de l'élégance à la française et de la haute hôtellerie de luxe.",
            editorialNote = "Inégalé. Le Ritz Paris continue de définir l'art suprême du service palace : chaque suite raconte une histoire littéraire ou royale, le Hemingway Club distille une atmosphère envoûtante, et le nouveau jardin d'hiver sublime le thé de l'après-midi, sous l'égide de François Perret.",
            featuredImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
            gallery = listOf(
                "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80"
            ),
            address = "15 Place Vendôme, 75001 Paris",
            phone = "+33 1 43 16 30 30",
            email = "contact@ritzparis.com",
            websiteUrl = "https://www.ritzparis.com",
            reservationUrl = "https://www.ritzparis.com/fr/reservations",
            instagramUrl = "https://instagram.com/ritzparis",
            openingHours = "24h/24, 7j/7",
            priceLevel = "exceptional",
            editorRating = 5.0,
            bestFor = listOf("Palace", "Suite impériale", "Cocktails d'auteur au Hemingway"),
            signatureExperience = "Nuit dans la suite historique Coco Chanel avec service de majordome privé et rituel de soin personnalisé.",
            atmosphere = "Historique, somptueuse et intime.",
            tags = listOf("Palace", "Paris", "Vendôme", "Chanel", "Bar Hemingway", "Luxe éternel"),
            featured = true,
            lat = 48.8681,
            lng = 2.3294
        ),
        Address(
            id = "addr_2",
            title = "L'Ambroisie",
            slug = "l-ambroisie-paris",
            status = "published",
            categorySlug = "gastronomy",
            destinationSlug = "paris",
            shortDescription = "Le sanctuaire classique incontesté de Bernard Pacaud, niché sous les arcades royales de la prestigieuse Place des Vosges.",
            editorialNote = "Une perfection souveraine. L'Ambroisie est peut-être le dernier bastion de la très grande cuisine classique française. Pas d'esbroufe moléculaire ni de mise en scène ostentatoire, mais une maîtrise technique absolue. Le feuilleté de truffe fraîche 'Bel Humeur' et la tarte fine au chocolat amer sont des œuvres d'art impériales.",
            featuredImage = "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80",
            gallery = listOf(
                "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80"
            ),
            address = "9 Place des Vosges, 75004 Paris",
            phone = "+33 1 42 78 51 45",
            email = "contact@ambroisie.fr",
            websiteUrl = "https://www.ambroisie-paris.com",
            reservationUrl = "https://www.ambroisie-paris.com/contact/",
            instagramUrl = "https://instagram.com/lambroisie",
            openingHours = "Mardi au Samedi, Déjeuner et Dîner",
            priceLevel = "exceptional",
            editorRating = 4.9,
            bestFor = listOf("Haute Gastronomie, Dîner romantique"),
            signatureExperience = "La tarte fine sablée au chocolat amer et glace à la vanille Bourbon, un équilibre mémorable classé monument historique du palais.",
            atmosphere = "Feutrée, majestueuse et historique.",
            tags = listOf("Restaurant Étoilé", "Vosges", "Gastronomie", "Truffe", "Bernard Pacaud"),
            featured = true,
            lat = 48.8553,
            lng = 2.3653
        ),
        Address(
            id = "addr_3",
            title = "Aman Tokyo",
            slug = "aman-tokyo",
            status = "published",
            categorySlug = "palaces",
            destinationSlug = "tokyo",
            shortDescription = "Un sanctuaire zen suspendu au-dessus des gratte-ciels d'Otemachi, offrant un minimalisme architectural et une sérénité totale.",
            editorialNote = "Le sommet d'Otemachi. Aman Tokyo réussit la symbiose absolue entre le gigantisme urbain de Tokyo et la sérénité du bouddhisme zen. Son lobby cathédrale de 30 mètres de haut en papier washi est un chef-d'œuvre de lumière. Les chambres, dotées de baignoires furo traditionnelles en granite noir, offrent une vue vertigineuse sur le mont Fuji.",
            featuredImage = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
            gallery = listOf(
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"
            ),
            address = "The Otemachi Tower, 1-5-6 Otemachi, Chiyoda-ku, Tokyo 100-0004",
            phone = "+81 3 5224 3333",
            email = "amantokyo@aman.com",
            websiteUrl = "https://www.aman.com/hotels/aman-tokyo",
            reservationUrl = "https://www.aman.com/hotels/aman-tokyo/exclusive-offers",
            instagramUrl = "https://instagram.com/amantokyo",
            openingHours = "24h/24, 7j/7",
            priceLevel = "exceptional",
            editorRating = 5.0,
            bestFor = listOf("Sérénité zen", "Spa panoramique", "Vue panoramique sur le mont Fuji"),
            signatureExperience = "Bain rituel traditionnel Onsen face aux lumières de la mégalopole, suivi d'un massage Signature de 90 minutes aux herbes japonaises Kampo.",
            atmosphere = "Minimaliste, ultra-calme, luxueuse.",
            tags = listOf("Aman", "Tokyo", "Otemachi", "Zen", "Minimalisme", "Spa"),
            featured = true,
            lat = 35.6862,
            lng = 139.7651
        ),
        Address(
            id = "addr_4",
            title = "Spa Dior Cheval Blanc",
            slug = "spa-dior-cheval-blanc",
            status = "published",
            categorySlug = "spas",
            destinationSlug = "paris",
            shortDescription = "L'alliance suprême entre la haute couture Christian Dior et l'esprit des rives parisiennes de la Seine.",
            editorialNote = "Une perfection sensorielle. Au rez-de-jardin du nouveau palace Cheval Blanc, le Spa Dior est conçu comme un appartement parisien d'esthète. La piscine de 30 mètres, bordée d'un écran d'art numérique reproduisant les reflets de la Seine, est hypnotique. Les soins à la micro-huile de Rose de Granville livrent des résultats immédiats dans un cocon absolu.",
            featuredImage = "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=80",
            gallery = listOf(
                "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
            ),
            address = "8 Quai du Louvre, 75001 Paris",
            phone = "+33 1 79 35 12 12",
            email = "spa.paris@chevalblanc.com",
            websiteUrl = "https://www.chevalblanc.com/fr/maison/paris/spa-dior/",
            reservationUrl = "https://www.chevalblanc.com/fr/maison/paris/contact-and-access/",
            instagramUrl = "https://instagram.com/chevalblancparis",
            openingHours = "10h - 20h tous les jours",
            priceLevel = "luxury",
            editorRating = 4.8,
            bestFor = listOf("Soin du visage technologique", "Piscine d'exception Seine"),
            signatureExperience = "Le soin d'exception 'Dior Prestige L'Or Noir', associant techniques de modelage de pointe et pierres précieuses polies.",
            atmosphere = "Élégante, Haute Couture, apaisante.",
            tags = listOf("Spa", "Dior", "Paris", "Seine", "LVMH", "Soin Signature"),
            featured = false,
            lat = 48.8596,
            lng = 2.3421
        ),
        Address(
            id = "addr_5",
            title = "Cartier Place Vendôme",
            slug = "cartier-place-vendome",
            status = "published",
            categorySlug = "fashion",
            destinationSlug = "paris",
            shortDescription = "Le temple rénové de la Haute Joaillerie, mariant le patrimoine d'excellence du joaillier des rois et une vision artistique contemporaine.",
            editorialNote = "Le temple de la panthère. Entièrement restauré dans un souffle d'art contemporain sous de hauts plafonds aux verrières somptueuses, le 13 Paix ou le salon Vendôme propose une expérience extraordinaire. C'est ici que l'alliance de la lumière de l'or ciselé et du mystère de la panthère de Jeanne Toussaint s'exprime le plus somptueusement.",
            featuredImage = "https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?auto=format&fit=crop&w=1200&q=80",
            gallery = listOf(
                "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80"
            ),
            address = "23 Place Vendôme, 75001 Paris",
            phone = "+33 1 44 53 07 20",
            email = "vendome@cartier.com",
            websiteUrl = "https://www.cartier.com",
            reservationUrl = "https://www.cartier.com/fr-fr/boutique-rendez-vous",
            instagramUrl = "https://instagram.com/cartier",
            openingHours = "Lundi au Samedi, 11h - 19h",
            priceLevel = "exceptional",
            editorRating = 4.9,
            bestFor = listOf("Haute Joaillerie", "Pièces sur mesure d'exception"),
            signatureExperience = "Présentation privée de la collection 'Nature Sauvage' dans un salon en rotonde historique secret.",
            atmosphere = "Majestueuse, exclusive, historique.",
            tags = listOf("Boutique", "Vendôme", "Joaillerie", "Or", "Cartier"),
            featured = false,
            lat = 48.8683,
            lng = 2.3291
        ),
        Address(
            id = "addr_6",
            title = "The Connaught",
            slug = "the-connaught-london",
            status = "published",
            categorySlug = "palaces",
            destinationSlug = "london",
            shortDescription = "L'adresse Mayfair par excellence, mariant sens inné du sur-mesure britannique, collection d'art d'avant-garde et bars légendaires.",
            editorialNote = "L'aristocratie moderne. Le Connaught, à l'angle de Mount Street, est le chef-d'œuvre de l'hospitalité londonienne. De son monumental escalier d'acajou du XIXe siècle aux créations à bulles d'Agostino Perrone au 'Connaught Bar' (élu meilleur bar du monde), l'expérience y est inoubliable, chaleureuse et prodigieusement chic.",
            featuredImage = "https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1200&q=80",
            gallery = listOf(
                "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"
            ),
            address = "Carlos Place, Mayfair, London W1K 2AL",
            phone = "+44 20 7499 7070",
            email = "info@the-connaught.co.uk",
            websiteUrl = "https://www.the-connaught.co.uk",
            reservationUrl = "https://www.the-connaught.co.uk/booking",
            instagramUrl = "https://instagram.com/theconnaught",
            openingHours = "24h/24, 7j/7",
            priceLevel = "exceptional",
            editorRating = 4.9,
            bestFor = listOf("Mayfair Heritage", "Meilleurs Martini du Monde au Connaught Bar"),
            signatureExperience = "Dîner gastronomique orchestré par la cheffe triplement étoilée Hélène Darroze dans les salons d'art d'exception du palace.",
            atmosphere = "Chaleureuse, hautement britannique, artistique.",
            tags = listOf("Palace", "Londres", "Mayfair", "Connaught Bar", "Gastronomie"),
            featured = true,
            lat = 51.5101,
            lng = -0.1509
        )
    )
}

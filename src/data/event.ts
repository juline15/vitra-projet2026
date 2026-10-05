// Laisse src: '' tant que le média n'existe pas : un cadre en pointillés s'affiche.
// Mets tes fichiers dans /public, ex. public/visuels/affiche-1.jpg → '/visuels/affiche-1.jpg'

export const event = {
    heading: 'Le design prend une nouvelle forme',
    title: 'Vitra x Maxime Bellaunay',
    subtitle:
        "Inauguration du nouveau bâtiment du Vitra Design Museum et de l'exposition de Maxime Bellaunay",
    date: '20 sept. 2028- 17h à 21h',
    logo: '/vitraxmaxime.svg',
    teaser: { src: '/Intro_Vitra_texte_son.mp4', poster: '' },
    location: {
        name: 'Vitra Design Museum',
        address: 'Charles-Eames-Strasse 2',
        city: 'D–79576 Weil am Rhein',
        country: 'Allemagne',
        phone: '+49 (0)7621 702 3510',
    },
};

export const concept = {
    lead: "Repartir de l'exposition avec un fragment de son univers.",
    intro:
        "Le Vitra Design Museum inaugure son nouveau bâtiment et dévoile une exposition conçue autour du travail de Maxime Bellaunay. La soirée se déroule en deux temps et se prolonge bien après la visite, grâce à des objets imaginés pour l'occasion.",
    temps: [
        {
            title: 'Premier temps : avant-première privée',
            text: "Designers, artistes, professionnels de la culture, partenaires du musée et journalistes découvrent le bâtiment et l'exposition avant leur ouverture, au fil d'un parcours immersif accompagné et d'une prise de parole du designer.",
        },
        {
            title: 'Second temps : ouverture au public',
            text: "L'exposition ouvre ses portes à tous les visiteurs. Texte à compléter : date, horaires, modalités de réservation.",
        },
    ],
    popup: {
        title: 'Le pop-up store',
        text: "Au cœur de l'événement, une boutique éphémère présente deux objets dessinés par Maxime Bellaunay pour l'exposition. Plus qu'un produit dérivé : un souvenir à utiliser au quotidien.",
        objets: [
            {
                name: 'La gourde',
                text: 'Une gourde sculpturale : un objet de tous les jours, traité comme une pièce de design.',
                image: '/mockup_gourde1.webp',
            },
            {
                name: 'Le carnet',
                text: 'Une couverture texturée et des pages de formats et de matières différents.',
                image: '/mockup_carnet1.webp',
            },
        ],
    },
};

export const designer = {
    name: 'Maxime Bellaunay',
    portrait: '/maxime_bellaunay.webp',
    role: "Designer d'objets",
    bio: [
        'Ébéniste et sculpteur, Maxime Bellaunay raconte le paysage à travers son travail. En s’inspirant de celui-ci, il en extrait des matières, des couleurs et des textures, qu’il retranscrit dans ses créations : pièces de mobilier ou œuvres sculpturales.',
        "Dans une démarche empreinte de spontanéité, la matière influence le dessin de ses objets. En se laissant guider par les irrégularités de la roche, les motifs organiques du bois ou les subtilités du métal, il initie un dialogue instinctif avec ses matériaux, sculptant ainsi des paysages bruts et singuliers.",
    ],
    quote: 'Il réalise des pièces uniques et sur-mesure, façonnées au gré de ses voyages, entre la France et le Japon.',
};

export const visuels = {
    affiches: [
        { src: '/affiche_batiment2.webp', alt: 'Affiche évènement', caption: 'Affiche évènement' },
        { src: '/affiche_batiment3.webp', alt: 'Affiche évènement', caption: 'Affiche évènement' },
    ],
    videos: [
        { src: '', poster: '', alt: 'Vidéo annonce', caption: 'Annonce' },
        { src: '', poster: '', alt: 'Vidéo objets', caption: 'La gourde et le carnet' },
    ],
};

export const deroule = [
    {
        title: 'Avant-première privée',
        note: 'Sur invitation',
        steps: [
            { time: '18:30', title: 'Accueil des invités', text: 'Réception dans le nouveau bâtiment et remise du programme.' },
            { time: '19:00', title: 'Parcours immersif', text: "Découverte accompagnée du bâtiment et de l'exposition." },
            { time: '20:00', title: 'Prise de parole de Maxime Bellaunay', text: "Sa démarche et les intentions derrière l'exposition." },
            { time: '20:30', title: 'Ouverture du pop-up store', text: 'La gourde et le carnet, disponibles en avant-première.' },
            { time: '21:00', title: 'Cocktail', text: 'Fin de soirée libre dans les espaces du musée.' },
        ],
    },
    {
        title: 'Ouverture au public',
        note: 'Sans invitation',
        steps: [
            { time: '10:00', title: "Ouverture de l'exposition", text: "Accès au bâtiment, à l'exposition et au pop-up store." },
        ],
    },
];

export const batiment = {
    title: 'Le bâtiment',
    lead: 'Un bâtiment qui se lit comme un paysage : deux sommets, une faille de lumière.',
    text: [
        "Le nouveau bâtiment s'étire au ras du sol, puis s'élève en une courbe continue jusqu'à deux sommets, séparés par une faille vitrée qui fait entrer la lumière au cœur de l'exposition. Ses surfaces blanches et sans arête prolongent les architectures du Vitra Campus, des courbes de Frank Gehry à l'élan de la caserne de pompiers de Zaha Hadid : un objet de design que l'on parcourt avant même d'en franchir le seuil.",
    ],
    dessin: {
        src: '/dessin_batiment1.svg',
        alt: 'Dessin du nouveau bâtiment du Vitra Design Museum',
        caption: 'Dessin du bâtiment',
        ratio: 'aspect-[4/3]',
    },
    mockup: {
        src: 'mockup_batiment.webp',
        alt: 'Mockup du nouveau bâtiment intégré au Vitra Campus',
        caption: 'Projection du bâtiment (mockup)',
        ratio: 'aspect-[4/3]',
    },
};
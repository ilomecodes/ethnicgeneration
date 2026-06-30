export const stats = {
  sales: { value: "8 455 000 FCFA", change: "+550 000", positive: true },
  deliveries: { value: "1 243", change: "+38", positive: true },
  visits: { value: "23 789", change: "+20", positive: true },
  topProduct: { name: "Robe Kaba Wax Maxi", sales: 184 },
};

export const salesData = [18, 28, 22, 38, 42, 35, 58, 62, 55, 70, 78, 85];
export const salesDataPrev = [12, 18, 15, 25, 30, 22, 40, 45, 38, 52, 60, 65];
export const months = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];

export const visitData = [32000, 41000, 28000, 45000, 38000, 47000, 26000];
export const days = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

export const topProducts = [
  { id: 1, name: "Robe Kaba Wax Maxi", price: "59 000 FCFA", image: "/plate-women.png", sales: 184 },
  { id: 2, name: "Boubou Homme Brodé", price: "85 000 FCFA", image: "/plate-men.png", sales: 142 },
  { id: 3, name: "Ensemble Enfant Wax", price: "33 000 FCFA", image: "/plate-kids.png", sales: 97 },
  { id: 4, name: "Robe Patchwork Wax", price: "52 000 FCFA", image: "/plate-women.png", sales: 76 },
];

export const orders = [
  { id: "ORD-1024", customer: "Amina Koné",      product: "Robe Kaba Wax Maxi",   date: "28 Jun 2026", amount: "62 200 FCFA",  status: "Livré" },
  { id: "ORD-1023", customer: "Fatou Diallo",     product: "Boubou Homme Brodé",   date: "27 Jun 2026", amount: "88 200 FCFA",  status: "En cours" },
  { id: "ORD-1022", customer: "Mariama Bah",      product: "Ensemble Enfant Wax",  date: "26 Jun 2026", amount: "36 200 FCFA",  status: "Livré" },
  { id: "ORD-1021", customer: "Kadiatou Sow",     product: "Robe Patchwork Wax",   date: "25 Jun 2026", amount: "55 200 FCFA",  status: "Expédié" },
  { id: "ORD-1020", customer: "Aissatou Barry",   product: "Robe Kaba Wax Maxi",   date: "24 Jun 2026", amount: "62 200 FCFA",  status: "Livré" },
  { id: "ORD-1019", customer: "Mariam Traoré",    product: "Boubou Homme Brodé",   date: "23 Jun 2026", amount: "88 200 FCFA",  status: "Annulé" },
  { id: "ORD-1018", customer: "Hawa Camara",      product: "Ensemble Enfant Wax",  date: "22 Jun 2026", amount: "36 200 FCFA",  status: "Livré" },
  { id: "ORD-1017", customer: "Oumou Sidibé",     product: "Robe Patchwork Wax",   date: "21 Jun 2026", amount: "55 200 FCFA",  status: "En cours" },
];

export const orderDetails: Record<string, {
  customer: { name: string; email: string; phone: string; address: string };
  items: { name: string; size: string; qty: number; unitPrice: string; total: string; image: string }[];
  subtotal: string;
  shipping: string;
  total: string;
  status: string;
  date: string;
  timeline: { label: string; date: string; done: boolean }[];
  note: string;
}> = {
  "ORD-1024": {
    customer: { name: "Amina Koné", email: "amina.kone@email.com", phone: "+33 6 12 34 56 78", address: "12 rue des Fleurs, 75011 Paris, France" },
    items: [{ name: "Robe Kaba Wax Maxi", size: "M", qty: 1, unitPrice: "59 000 FCFA", total: "59 000 FCFA", image: "/plate-women.png" }],
    subtotal: "59 000 FCFA", shipping: "3 200 FCFA", total: "62 200 FCFA",
    status: "Livré", date: "28 Jun 2026",
    timeline: [
      { label: "Commande passée", date: "28 Jun · 09:14", done: true },
      { label: "Paiement confirmé", date: "28 Jun · 09:15", done: true },
      { label: "En préparation", date: "28 Jun · 11:30", done: true },
      { label: "Expédié", date: "29 Jun · 14:00", done: true },
      { label: "Livré", date: "30 Jun · 16:45", done: true },
    ],
    note: "",
  },
  "ORD-1023": {
    customer: { name: "Fatou Diallo", email: "fatou.diallo@email.com", phone: "+32 4 87 65 43 21", address: "Rue de la Loi 44, 1000 Bruxelles, Belgique" },
    items: [{ name: "Boubou Homme Brodé", size: "L", qty: 1, unitPrice: "85 000 FCFA", total: "85 000 FCFA", image: "/plate-men.png" }],
    subtotal: "85 000 FCFA", shipping: "3 200 FCFA", total: "88 200 FCFA",
    status: "En cours", date: "27 Jun 2026",
    timeline: [
      { label: "Commande passée", date: "27 Jun · 14:52", done: true },
      { label: "Paiement confirmé", date: "27 Jun · 14:53", done: true },
      { label: "En préparation", date: "27 Jun · 17:00", done: true },
      { label: "Expédié", date: "", done: false },
      { label: "Livré", date: "", done: false },
    ],
    note: "Client souhaite un emballage cadeau.",
  },
  "ORD-1022": {
    customer: { name: "Mariama Bah", email: "mariama.bah@email.com", phone: "+33 7 98 76 54 32", address: "5 allée des Roses, 69003 Lyon, France" },
    items: [{ name: "Ensemble Enfant Wax", size: "6 ans", qty: 1, unitPrice: "33 000 FCFA", total: "33 000 FCFA", image: "/plate-kids.png" }],
    subtotal: "33 000 FCFA", shipping: "3 200 FCFA", total: "36 200 FCFA",
    status: "Livré", date: "26 Jun 2026",
    timeline: [
      { label: "Commande passée", date: "26 Jun · 10:05", done: true },
      { label: "Paiement confirmé", date: "26 Jun · 10:06", done: true },
      { label: "En préparation", date: "26 Jun · 13:00", done: true },
      { label: "Expédié", date: "27 Jun · 09:30", done: true },
      { label: "Livré", date: "28 Jun · 12:00", done: true },
    ],
    note: "",
  },
  "ORD-1021": {
    customer: { name: "Kadiatou Sow", email: "kadiatou.sow@email.com", phone: "+1 514 555 0199", address: "3400 Rue Jean-Talon E, Montréal, QC H2A 1Y9, Canada" },
    items: [{ name: "Robe Patchwork Wax", size: "S", qty: 1, unitPrice: "52 000 FCFA", total: "52 000 FCFA", image: "/plate-women.png" }],
    subtotal: "52 000 FCFA", shipping: "3 200 FCFA", total: "55 200 FCFA",
    status: "Expédié", date: "25 Jun 2026",
    timeline: [
      { label: "Commande passée", date: "25 Jun · 18:22", done: true },
      { label: "Paiement confirmé", date: "25 Jun · 18:23", done: true },
      { label: "En préparation", date: "26 Jun · 09:00", done: true },
      { label: "Expédié", date: "27 Jun · 11:15", done: true },
      { label: "Livré", date: "", done: false },
    ],
    note: "",
  },
  "ORD-1020": {
    customer: { name: "Aissatou Barry", email: "aissatou.barry@email.com", phone: "+33 6 45 67 89 01", address: "28 avenue Victor Hugo, 13001 Marseille, France" },
    items: [{ name: "Robe Kaba Wax Maxi", size: "L", qty: 1, unitPrice: "59 000 FCFA", total: "59 000 FCFA", image: "/plate-women.png" }],
    subtotal: "59 000 FCFA", shipping: "3 200 FCFA", total: "62 200 FCFA",
    status: "Livré", date: "24 Jun 2026",
    timeline: [
      { label: "Commande passée", date: "24 Jun · 08:31", done: true },
      { label: "Paiement confirmé", date: "24 Jun · 08:32", done: true },
      { label: "En préparation", date: "24 Jun · 10:45", done: true },
      { label: "Expédié", date: "25 Jun · 13:00", done: true },
      { label: "Livré", date: "26 Jun · 15:20", done: true },
    ],
    note: "",
  },
  "ORD-1019": {
    customer: { name: "Mariam Traoré", email: "mariam.traore@email.com", phone: "+33 6 11 22 33 44", address: "7 rue du Marché, 67000 Strasbourg, France" },
    items: [{ name: "Boubou Homme Brodé", size: "XL", qty: 1, unitPrice: "85 000 FCFA", total: "85 000 FCFA", image: "/plate-men.png" }],
    subtotal: "85 000 FCFA", shipping: "3 200 FCFA", total: "88 200 FCFA",
    status: "Annulé", date: "23 Jun 2026",
    timeline: [
      { label: "Commande passée", date: "23 Jun · 21:10", done: true },
      { label: "Paiement confirmé", date: "23 Jun · 21:11", done: true },
      { label: "Annulé", date: "24 Jun · 08:00", done: true },
      { label: "Remboursement initié", date: "24 Jun · 08:05", done: true },
    ],
    note: "Annulé à la demande du client.",
  },
  "ORD-1018": {
    customer: { name: "Hawa Camara", email: "hawa.camara@email.com", phone: "+33 6 77 88 99 00", address: "19 boulevard Gambetta, 33000 Bordeaux, France" },
    items: [{ name: "Ensemble Enfant Wax", size: "8 ans", qty: 1, unitPrice: "33 000 FCFA", total: "33 000 FCFA", image: "/plate-kids.png" }],
    subtotal: "33 000 FCFA", shipping: "3 200 FCFA", total: "36 200 FCFA",
    status: "Livré", date: "22 Jun 2026",
    timeline: [
      { label: "Commande passée", date: "22 Jun · 11:40", done: true },
      { label: "Paiement confirmé", date: "22 Jun · 11:41", done: true },
      { label: "En préparation", date: "22 Jun · 14:00", done: true },
      { label: "Expédié", date: "23 Jun · 10:00", done: true },
      { label: "Livré", date: "24 Jun · 13:30", done: true },
    ],
    note: "",
  },
  "ORD-1017": {
    customer: { name: "Oumou Sidibé", email: "oumou.sidibe@email.com", phone: "+33 6 55 44 33 22", address: "42 rue Saint-Denis, 75001 Paris, France" },
    items: [{ name: "Robe Patchwork Wax", size: "M", qty: 1, unitPrice: "52 000 FCFA", total: "52 000 FCFA", image: "/plate-women.png" }],
    subtotal: "52 000 FCFA", shipping: "3 200 FCFA", total: "55 200 FCFA",
    status: "En cours", date: "21 Jun 2026",
    timeline: [
      { label: "Commande passée", date: "21 Jun · 16:05", done: true },
      { label: "Paiement confirmé", date: "21 Jun · 16:06", done: true },
      { label: "En préparation", date: "22 Jun · 09:00", done: true },
      { label: "Expédié", date: "", done: false },
      { label: "Livré", date: "", done: false },
    ],
    note: "",
  },
};

export const megaCategories = [
  {
    id: 1, name: "Femmes", slug: "femmes", image: "/plate-women.png", productCount: 48,
    subcategories: [
      { id: 101, name: "Kaba Africain", slug: "kaba-africain", productCount: 14 },
      { id: 102, name: "Robes Wax", slug: "robes-wax", productCount: 18 },
      { id: 103, name: "Ensembles", slug: "ensembles", productCount: 8 },
      { id: 104, name: "Tops & Blouses", slug: "tops-blouses", productCount: 8 },
    ],
  },
  {
    id: 2, name: "Hommes", slug: "hommes", image: "/plate-men.png", productCount: 32,
    subcategories: [
      { id: 201, name: "Boubou", slug: "boubou", productCount: 12 },
      { id: 202, name: "Chemises Wax", slug: "chemises-wax", productCount: 10 },
      { id: 203, name: "Ensembles Homme", slug: "ensembles-homme", productCount: 10 },
    ],
  },
  {
    id: 3, name: "Enfants", slug: "enfants", image: "/plate-kids.png", productCount: 24,
    subcategories: [
      { id: 301, name: "Robes Enfant", slug: "robes-enfant", productCount: 9 },
      { id: 302, name: "Ensembles Enfant", slug: "ensembles-enfant", productCount: 9 },
      { id: 303, name: "Costumes", slug: "costumes", productCount: 6 },
    ],
  },
  {
    id: 4, name: "Accessoires", slug: "accessoires", image: "/plate-women.png", productCount: 18,
    subcategories: [
      { id: 401, name: "Foulards & Turbans", slug: "foulards-turbans", productCount: 10 },
      { id: 402, name: "Sacs", slug: "sacs", productCount: 8 },
    ],
  },
];

export const customers = [
  { id: 1, name: "Amina Koné",       email: "amina.kone@email.com",       orders: 5,  spent: "270 000 FCFA",  joined: "Jan 2026", country: "France" },
  { id: 2, name: "Fatou Diallo",     email: "fatou.diallo@email.com",     orders: 3,  spent: "190 000 FCFA",  joined: "Fév 2026", country: "Belgique" },
  { id: 3, name: "Mariama Bah",      email: "mariama.bah@email.com",      orders: 8,  spent: "481 000 FCFA",  joined: "Jan 2026", country: "France" },
  { id: 4, name: "Kadiatou Sow",     email: "kadiatou.sow@email.com",     orders: 2,  spent: "105 000 FCFA",  joined: "Mar 2026", country: "Canada" },
  { id: 5, name: "Aissatou Barry",   email: "aissatou.barry@email.com",   orders: 6,  spent: "348 000 FCFA",  joined: "Jan 2026", country: "France" },
  { id: 6, name: "Mariam Traoré",    email: "mariam.traore@email.com",    orders: 1,  spent: "59 000 FCFA",   joined: "Jun 2026", country: "Suisse" },
  { id: 7, name: "Hawa Camara",      email: "hawa.camara@email.com",      orders: 4,  spent: "228 000 FCFA",  joined: "Avr 2026", country: "France" },
  { id: 8, name: "Oumou Sidibé",     email: "oumou.sidibe@email.com",     orders: 7,  spent: "421 000 FCFA",  joined: "Fév 2026", country: "France" },
  { id: 9, name: "Rokia Coulibaly",  email: "rokia.coulibaly@email.com",  orders: 3,  spent: "162 000 FCFA",  joined: "Mai 2026", country: "Côte d'Ivoire" },
  { id: 10, name: "Nene Keita",      email: "nene.keita@email.com",       orders: 11, spent: "646 000 FCFA",  joined: "Jan 2026", country: "France" },
];

export const waxMaterials = [
  { id: "w1",  name: "Indigo Royale",    color1: "#1B3A8C", color2: "#3259C4", active: true },
  { id: "w2",  name: "Jaune Fétiche",   color1: "#C4880A", color2: "#F5C13A", active: true },
  { id: "w3",  name: "Rouge Terre",     color1: "#7A1E00", color2: "#C43A1A", active: true },
  { id: "w4",  name: "Vert Savane",     color1: "#1E4A18", color2: "#3A7A30", active: true },
  { id: "w5",  name: "Noir Impérial",   color1: "#0D0D0D", color2: "#2A2A2A", active: true },
  { id: "w6",  name: "Corail Vivant",   color1: "#B84A2A", color2: "#E86845", active: true },
  { id: "w7",  name: "Orange Sahara",   color1: "#A85A00", color2: "#D48018", active: false },
  { id: "w8",  name: "Violet Nuit",     color1: "#2E0F5C", color2: "#5C3A9A", active: true },
  { id: "w9",  name: "Blanc Ivoire",    color1: "#D8D0B8", color2: "#F0E8D0", active: true },
  { id: "w10", name: "Caramel Atelier", color1: "#7A4E10", color2: "#B08A4A", active: true },
  { id: "w11", name: "Émeraude",        color1: "#094A2E", color2: "#187A4E", active: true },
  { id: "w12", name: "Ocre Antique",    color1: "#6E5010", color2: "#B08010", active: false },
];

export const pieceTypes = [
  { id: "robe-kaba",  name: "Robe Kaba",     desc: "Robe longue traditionnelle", active: true },
  { id: "boubou",     name: "Boubou",         desc: "Tenue ample cérémoniale",    active: true },
  { id: "ensemble",   name: "Ensemble",       desc: "Haut + bas assortis",        active: true },
  { id: "jupe",       name: "Jupe",           desc: "Jupe longue ou mi-longue",   active: true },
  { id: "haut",       name: "Haut / Blouse",  desc: "Haut taillé sur mesure",     active: true },
  { id: "autre",      name: "Autre",          desc: "Précisez dans vos notes",    active: true },
];

export const finitionOptions = {
  boutons: [
    { id: "bt1", name: "Boutons tissu assorti", active: true },
    { id: "bt2", name: "Boutons dorés",         active: true },
    { id: "bt3", name: "Boutons nacrés",        active: true },
    { id: "bt4", name: "Boutons plastique",     active: true },
    { id: "bt5", name: "Boutons personnalisés", active: false },
  ],
  cols: [
    { id: "c1", name: "Col rond",    active: true },
    { id: "c2", name: "Col V",       active: true },
    { id: "c3", name: "Col carré",   active: true },
    { id: "c4", name: "Col bateau",  active: true },
    { id: "c5", name: "Col chemise", active: true },
    { id: "c6", name: "Col Mao",     active: true },
    { id: "c7", name: "Col bardot",  active: true },
    { id: "c8", name: "Sans col",    active: true },
  ],
  manches: [
    { id: "m1", name: "Sans manches",      active: true },
    { id: "m2", name: "Manches courtes",   active: true },
    { id: "m3", name: "Mi-longues",        active: true },
    { id: "m4", name: "Manches longues",   active: true },
    { id: "m5", name: "Ballon",            active: true },
    { id: "m6", name: "Mancheron",         active: true },
    { id: "m7", name: "À volants",         active: false },
  ],
  doublures: [
    { id: "d1", name: "Sans doublure",     active: true },
    { id: "d2", name: "Doublure simple",   active: true },
    { id: "d3", name: "Double doublure",   active: true },
  ],
  poches: [
    { id: "p1", name: "Sans poches",               active: true },
    { id: "p2", name: "Poches latérales cachées",   active: true },
    { id: "p3", name: "Poches apparentes",          active: true },
  ],
};

export const surMesureRequests = [
  {
    id: "SM-001", customer: "Aminata Kouyaté", email: "aminata.kouyate@email.com", phone: "+33 6 11 22 33 44",
    piece: "Robe Kaba", wax: "Indigo Royale", silhouette: "Robe droite",
    col: "Col Mao", manches: "Sans manches", doublure: "Doublure simple", boutons: false, poches: "Poches latérales cachées",
    measurements: { poitrine: "92", taille: "72", hanches: "98", hauteur: "168", longueurPiece: "140", epaules: "38" },
    noMeasurements: false, inspirationImage: false,
    note: "J'aimerais une broderie dorée sur l'encolure.", status: "Devis envoyé",
    date: "25 Jun 2026", devis: "145 000 FCFA", acompte: "72 500 FCFA", acomptePaid: false, deadline: "20 Jul 2026",
  },
  {
    id: "SM-002", customer: "Rokia Touré", email: "rokia.toure@email.com", phone: "+32 4 98 76 54 32",
    piece: "Ensemble", wax: "Tissu personnel", silhouette: "Image importée",
    col: "Col V", manches: "Manches longues", doublure: "Sans doublure", boutons: true, typeBouton: "Boutons dorés", poches: "Sans poches",
    measurements: { poitrine: "88", taille: "68", hanches: "94", hauteur: "162" },
    noMeasurements: false, inspirationImage: true,
    note: "", status: "En production",
    date: "20 Jun 2026", devis: "195 000 FCFA", acompte: "97 500 FCFA", acomptePaid: true, deadline: "15 Jul 2026",
  },
  {
    id: "SM-003", customer: "Fatoumata Bah", email: "fatoumata.bah@email.com", phone: "+1 438 555 0177",
    piece: "Boubou", wax: "Caramel Atelier", silhouette: "Boubou ample",
    col: "Col rond", manches: "Manches longues", doublure: "Double doublure", boutons: false, poches: "Sans poches",
    measurements: {}, noMeasurements: true, inspirationImage: false,
    note: "Rendez-vous en atelier prévu le 5 juillet.", status: "Acompte reçu",
    date: "18 Jun 2026", devis: "165 000 FCFA", acompte: "82 500 FCFA", acomptePaid: true, deadline: "30 Jul 2026",
  },
  {
    id: "SM-004", customer: "Oumou Dramé", email: "oumou.drame@email.com", phone: "+41 78 123 45 67",
    piece: "Jupe", wax: "Violet Nuit", silhouette: "Sirène",
    col: "Sans col", manches: "Sans manches", doublure: "Doublure simple", boutons: false, poches: "Poches latérales cachées",
    measurements: { poitrine: "86", taille: "66", hanches: "92", hauteur: "165", longueurPiece: "100" },
    noMeasurements: false, inspirationImage: false,
    note: "", status: "Demande reçue",
    date: "28 Jun 2026", devis: null, acompte: null, acomptePaid: false, deadline: null,
  },
  {
    id: "SM-005", customer: "Kadja Koné", email: "kadja.kone@email.com", phone: "+33 7 55 44 33 22",
    piece: "Robe Kaba", wax: "Rouge Terre", silhouette: "Évasée / Trapèze",
    col: "Col bateau", manches: "Mancheron", doublure: "Double doublure", boutons: true, typeBouton: "Boutons tissu assorti", poches: "Poches apparentes",
    measurements: { poitrine: "95", taille: "78", hanches: "102", hauteur: "170", longueurPiece: "145" },
    noMeasurements: false, inspirationImage: false,
    note: "Besoin pour un mariage le 10 août, urgent.", status: "Prêt à expédier",
    date: "10 Jun 2026", devis: "155 000 FCFA", acompte: "77 500 FCFA", acomptePaid: true, deadline: "5 Aug 2026",
  },
  {
    id: "SM-006", customer: "Mariama Keita", email: "mariama.keita@email.com", phone: "+33 6 99 88 77 66",
    piece: "Haut / Blouse", wax: "Jaune Fétiche", silhouette: "Deux pièces",
    col: "Col chemise", manches: "Manches courtes", doublure: "Sans doublure", boutons: true, typeBouton: "Boutons nacrés", poches: "Sans poches",
    measurements: { poitrine: "90", taille: "70", hanches: "96", hauteur: "160" },
    noMeasurements: false, inspirationImage: false,
    note: "", status: "Livré",
    date: "5 Jun 2026", devis: "85 000 FCFA", acompte: "42 500 FCFA", acomptePaid: true, deadline: "30 Jun 2026",
  },
];

export const deliveryRates = [
  { id: 1, zone: "France métropolitaine", carrier: "Colissimo",   minWeight: 0, maxWeight: 2,  price: "3 200 FCFA",  delay: "2-3 jours" },
  { id: 2, zone: "France métropolitaine", carrier: "Colissimo",   minWeight: 2, maxWeight: 10, price: "4 500 FCFA",  delay: "2-3 jours" },
  { id: 3, zone: "Europe",               carrier: "DHL",          minWeight: 0, maxWeight: 2,  price: "8 500 FCFA",  delay: "4-6 jours" },
  { id: 4, zone: "Europe",               carrier: "DHL",          minWeight: 2, maxWeight: 10, price: "12 400 FCFA", delay: "4-6 jours" },
  { id: 5, zone: "International",        carrier: "DHL Express",  minWeight: 0, maxWeight: 2,  price: "16 300 FCFA", delay: "7-14 jours" },
  { id: 6, zone: "International",        carrier: "DHL Express",  minWeight: 2, maxWeight: 10, price: "22 900 FCFA", delay: "7-14 jours" },
];

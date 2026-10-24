// Catálogo de tours. Una sola fuente de verdad: el build genera las páginas en inglés y español.
//
// pricing.type:
//   person  → precio por adulto / niño
//   tiers   → grupos privados; cada rango tiene precio 'total' (por grupo) o 'person' (por persona)
//   package → el cliente elige un paquete; precio por persona
//   couple  → primera pareja + cada pareja adicional
//   free    → incluido con cualquier excursión
//
// Fotos: archivo dentro de src/photos. La primera es la portada.

export const categories = {
  islands: { en: 'Islands & beaches', es: 'Islas y playas' },
  sea: { en: 'Sea & diving', es: 'Mar y buceo' },
  adventure: { en: 'Adventure', es: 'Aventura' },
  culture: { en: 'Culture & cities', es: 'Cultura y ciudades' },
  private: { en: 'Private groups', es: 'Grupos privados' },
  night: { en: 'Nightlife', es: 'Vida nocturna' },
};

export const places = {
  'punta-cana': { name: 'Punta Cana', lon: -68.37, lat: 18.58 },
  saona: { name: 'Isla Saona', lon: -68.72, lat: 18.15 },
  catalina: { name: 'Isla Catalina', lon: -69.02, lat: 18.35, side: 'left' },
  samana: { name: 'Samaná', lon: -69.33, lat: 19.21 },
  haitises: { name: 'Los Haitises', lon: -69.62, lat: 19.03, side: 'left' },
  'santo-domingo': { name: 'Santo Domingo', lon: -69.89, lat: 18.47, side: 'left' },
  higuey: { name: 'Higüey', lon: -68.71, lat: 18.62, side: 'left' },
};

const fullDay = { en: 'Full day', es: 'Día completo' };
const halfDay = { en: 'Half day', es: 'Medio día' };
const night = { en: 'Evening', es: 'Noche' };

export const tours = [
  {
    slug: 'saona-vip-3-beaches',
    featured: true,
    cat: 'islands',
    place: 'saona',
    duration: { en: 'Full day · 6:00 a.m. – 7:00 p.m.', es: 'Día completo · 6:00 a. m. – 7:00 p. m.' },
    badge: { en: '#1 excursion in Punta Cana', es: 'La excursión #1 de Punta Cana' },
    title: { en: 'Saona Island VIP: 3 Beaches', es: 'Isla Saona VIP: 3 Playas' },
    tagline: {
      en: 'Three beaches, a fishing village, natural pools with starfish and a seafront buffet — all inclusive.',
      es: 'Tres playas, un pueblo de pescadores, piscinas naturales con estrellas de mar y buffet frente al mar, todo incluido.',
    },
    body: {
      en: [
        'Saona was chosen as a filming location for Pirates of the Caribbean — and once you see it, you’ll understand why. This VIP version visits three beaches instead of one, spending about 1 hour and 30 minutes at each, with plenty of time to swim, take photos and relax with no rush.',
        'You’ll stop at Flamingo Beach, have a buffet lunch in the fishing village of Mano Juan, look for sea turtles at the protected sanctuary, cross the Catuano Channel and the mangroves, and swim next to starfish in the natural pools. If there is sargassum or bad weather, that stop moves to Playa Abanico so you always get the best possible day.',
      ],
      es: [
        'Saona fue elegida para filmar Piratas del Caribe, y cuando la veas entenderás por qué. Esta versión VIP visita tres playas en vez de una, con aproximadamente 1 hora y 30 minutos en cada una: tiempo de sobra para bañarte, tomar fotos y disfrutar sin prisas.',
        'Pararás en la Playa de los Flamencos, almorzarás tipo buffet en el pueblo de pescadores de Mano Juan, buscarás tortugas en el santuario protegido, cruzarás el Canal de Catuano y los manglares, y nadarás junto a las estrellas de mar en las piscinas naturales. Si hay sargazo o mal clima, esa parada se hace en Playa Abanico para garantizarte siempre la mejor experiencia.',
      ],
    },
    highlights: {
      en: ['Three different beaches, about 1 h 30 min at each', 'Buffet lunch facing the sea in Mano Juan', 'Natural pools with starfish', 'Open bar with Brugal and Barceló rum'],
      es: ['Tres playas distintas, aprox. 1 h 30 min en cada una', 'Almuerzo buffet frente al mar en Mano Juan', 'Piscinas naturales con estrellas de mar', 'Barra libre con ron Brugal y Barceló'],
    },
    stops: {
      en: [
        ['Flamingo Beach', 'One of the most beautiful beaches on Saona.'],
        ['Mano Juan fishing village', 'Where the buffet lunch is served.'],
        ['Sea turtle sanctuary', 'You may see turtles if they are in the protected area that day. It is a sanctuary, not an aquarium, so sightings are not guaranteed.'],
        ['Playa del Canto', ''],
        ['Catuano Channel', 'Panoramic views.'],
        ['Protected mangroves', ''],
        ['Natural pools', 'Swim next to the starfish and watch them — touching them is not allowed.'],
      ],
      es: [
        ['Playa de los Flamencos', 'Una de las playas más hermosas de Saona.'],
        ['Pueblo de pescadores Mano Juan', 'Aquí se hace el almuerzo tipo buffet.'],
        ['Santuario de tortugas marinas', 'Podrás ver tortugas solo si ese día hay en la zona protegida. No es un acuario, es un santuario, así que no están garantizadas.'],
        ['Playa del Canto', ''],
        ['Canal de Catuano', 'Vista panorámica.'],
        ['Área protegida de los manglares', ''],
        ['Piscinas naturales', 'Nada junto a las estrellas de mar y obsérvalas (está prohibido tocarlas).'],
      ],
    },
    includes: {
      en: ['Transport from/to your hotel (selected hotels)', 'Catamaran or speedboat', 'National park entrance fees', 'Tropical fruit skewers', 'Snacks (tequeños and empanadas)', 'Alcoholic drinks (Brugal / Barceló rum)', 'Soft drinks, sodas and water', 'Trained national guide (English, Spanish, Portuguese, French)', 'Seafront buffet lunch and picadera'],
      es: ['Transporte desde/hacia tu hotel (hoteles seleccionados)', 'Motomarán o lancha rápida', 'Tasas de entrada al Parque Nacional', 'Brochetas de frutas tropicales', 'Snack (tequeños y empanadas)', 'Bebidas alcohólicas (Ron Brugal / Ron Barceló)', 'Refrescos, gaseosas y agua', 'Guía nacional capacitado (inglés, español, portugués y francés)', 'Almuerzo tipo buffet frente al mar y picadera'],
    },
    excludes: {
      en: ['Snorkel gear (not offered — bring your own if you want to snorkel)', 'Tips'],
      es: ['Equipo de snorkel (no lo ofrecemos: si deseas hacer snorkel, trae el tuyo)', 'Propinas'],
    },
    addons: {
      en: [
        ['Lobster & champagne with your lunch', '+$54 per adult · +$40 per child. Must be requested in advance.'],
        ['Presidente beer packs', 'Ask us for prices.'],
        ['Transport from Santo Domingo', 'Additional cost.'],
      ],
      es: [
        ['Langosta y champagne durante tu almuerzo', '+54 USD por adulto · +40 USD por niño. Debe solicitarse con anticipación.'],
        ['Packs de cervezas Presidente', 'Consúltanos precios.'],
        ['Transporte desde Santo Domingo', 'Tiene un costo adicional.'],
      ],
    },
    birthday: {
      en: 'Is it your birthday that day? Tell us when you book and celebrate with us — we have a special gift to make your day even more unforgettable.',
      es: '¿Cumples años ese día? Cuéntanoslo al reservar y celébralo con nosotros: tenemos un detalle especial de regalo para hacer tu día aún más inolvidable.',
    },
    schedule: {
      en: [['Pickup in Punta Cana', 'from 6:00 a.m.'], ['Pickup in Bayahibe', 'from 8:00 a.m.'], ['Exact pickup time', 'confirmed the day before, 6:00–7:00 p.m.'], ['Tour starts', '9:30–10:00 a.m.'], ['Back in Bayahibe', '5:00–6:00 p.m.'], ['Back at your hotel', '6:00–7:00 p.m.']],
      es: [['Recogida en Punta Cana', 'desde las 6:00 a. m.'], ['Recogida en Bayahibe', 'desde las 8:00 a. m.'], ['Hora exacta de recogida', 'se confirma el día anterior entre 6:00 y 7:00 p. m.'], ['Inicio del tour', '9:30 a 10:00 a. m.'], ['Regreso a Bayahibe', '5:00 a 6:00 p. m.'], ['Regreso a los hoteles', '6:00 a 7:00 p. m.']],
    },
    days: [1, 2, 3, 4, 5, 6], // lunes a sábado
    daysLabel: { en: 'Monday to Saturday', es: 'De lunes a sábado' },
    cancel: {
      en: 'Cancel before 5:00 p.m. the day before for a 75% refund (25% is non-refundable).',
      es: 'Cancela antes de las 5:00 p. m. del día anterior y recibes el 75% de reembolso (el 25% no es reembolsable).',
    },
    policies: {
      en: [
        ['Bookings', 'At least 1 day in advance. Same-day bookings are not possible.'],
        ['Confirmation', 'Required the day before, before 5:00 p.m. If you don’t confirm, you can’t join.'],
        ['Rescheduling', 'Only until 5:00 p.m. the day before.'],
        ['Cancellations', 'Before 5:00 p.m. the day before: 75% refund (25% is non-refundable).'],
        ['No-show', 'No refund if you don’t show up or don’t let us know in time (applies to full and partial absences).'],
        ['Payment', 'Minimum 25% deposit to book.'],
      ],
      es: [
        ['Reservas', 'Mínimo 1 día antes. No se reserva el mismo día.'],
        ['Confirmación', 'Obligatoria el día previo antes de las 5:00 p. m. Si no confirmas, no puedes ir.'],
        ['Reprogramación', 'Solo hasta las 5:00 p. m. del día anterior.'],
        ['Cancelaciones', 'Antes de las 5:00 p. m. del día anterior, reembolso del 75% (el 25% no es reembolsable).'],
        ['No-show', 'Sin reembolso si no te presentas o no avisas a tiempo (aplica a ausencias totales y parciales).'],
        ['Pago', 'Mínimo 25% para reservar.'],
      ],
    },
    restrictions: {
      en: ['Not suitable for pregnant women.', 'Not suitable for people with severe back, hip or knee pain.', 'Not suitable for wheelchair users.', 'Small bags only — no luggage (the crew may refuse boarding if you bring suitcases).', 'Don’t leave belongings on the boat or bus; the company is not responsible for loss or damage.'],
      es: ['No apta para embarazadas.', 'No apta para personas con dolores severos de espalda, cadera o rodilla.', 'No apta para personas en silla de ruedas.', 'Solo bolsos pequeños, nada de equipaje (el equipo puede negar el abordaje si llevas maletas).', 'No dejes pertenencias en la lancha ni en el autobús: la empresa no se hace responsable por pérdidas o daños.'],
    },
    childAges: '3–10',
    infants: { en: 'Babies (0–2) go free', es: 'Bebés (0–2) gratis' },
    photos: [
      { file: 'dominican-republic-1884286_1920.jpg', alt: { en: 'Wooden pier over turquoise water and a palm-lined beach', es: 'Muelle de madera sobre agua turquesa y playa con palmeras' } },
      { file: 'islacatalina1.jpg', alt: { en: 'White-sand beach with boats in crystal-clear water', es: 'Playa de arena blanca con lanchas en agua cristalina' } },
    ],
    pricing: { type: 'person', adult: 85, child: 45 },
  },
  {
    slug: 'saona-island',
    featured: true,
    cat: 'islands',
    place: 'saona',
    duration: fullDay,
    title: { en: 'Saona Island Classic', es: 'Isla Saona Clásica' },
    tagline: {
      en: 'Speedboat, natural pool and a lazy afternoon on the most famous beach in the Caribbean.',
      es: 'Lancha rápida, piscina natural y una tarde tranquila en la playa más famosa del Caribe.',
    },
    body: {
      en: [
        'Saona is the postcard you have seen a hundred times — and it is better in person. We pick you up at your hotel, drive to the coast with a bilingual guide and board a speedboat into the Parque Nacional del Este.',
        'Halfway across, the boat stops at a shallow natural pool where the water barely reaches your waist and starfish rest on the sand. Then it is beach time: a Dominican lunch, open bar and music on one of the island’s palm-lined beaches.',
      ],
      es: [
        'Saona es la postal que has visto cien veces, y en persona es mejor. Te recogemos en el hotel, viajamos a la costa con un guía bilingüe y subimos a una lancha rápida dentro del Parque Nacional del Este.',
        'A mitad de camino paramos en una piscina natural donde el agua apenas llega a la cintura y las estrellas de mar descansan en la arena. Después, playa: almuerzo dominicano, barra libre y música en una playa llena de palmeras.',
      ],
    },
    highlights: {
      en: ['Natural pool with starfish', 'Palm-fringed beach inside a national park', 'Dominican buffet lunch', 'Open bar and live entertainment'],
      es: ['Piscina natural con estrellas de mar', 'Playa de palmeras dentro de un parque nacional', 'Almuerzo buffet dominicano', 'Barra libre y animación'],
    },
    includes: {
      en: ['Round-trip hotel transport', 'Bilingual guide', 'Speedboat ride', 'Lunch', 'Drinks on board and at the beach'],
      es: ['Transporte ida y vuelta desde el hotel', 'Guía bilingüe', 'Paseo en lancha', 'Almuerzo', 'Bebidas a bordo y en la playa'],
    },
    excludes: {
      en: ['Photos and videos', 'Tips'],
      es: ['Fotos y videos', 'Propinas'],
    },
    photos: [
      { file: 'saona3.webp', alt: { en: 'White sand beach with palm trees on Saona Island', es: 'Playa de arena blanca con palmeras en Isla Saona' } },
      { file: '64809720e520e-islasaonaexcursionlanchaiway.jpg', alt: { en: 'Speedboat arriving at Saona Island', es: 'Lancha llegando a Isla Saona' } },
      { file: 'Saonabarco1.jpg', alt: { en: 'Guests on a boat heading to Saona', es: 'Turistas en lancha rumbo a Saona' } },
      { file: 'mejores-playas-republica-dominicana.webp', alt: { en: 'Turquoise water in the Dominican Republic', es: 'Agua turquesa en República Dominicana' } },
    ],
    pricing: { type: 'person', adult: 55, child: 30 },
  },
  {
    slug: 'saona-private-speedboat',
    featured: true,
    cat: 'private',
    place: 'saona',
    duration: fullDay,
    title: { en: 'Saona by Private Speedboat', es: 'Saona en Lancha Privada' },
    tagline: {
      en: 'Your own boat, your own pace. All-inclusive VIP day for groups of 6 to 20.',
      es: 'Tu propia lancha, a tu ritmo. Día VIP todo incluido para grupos de 6 a 20.',
    },
    body: {
      en: [
        'No crowds and no fixed schedule: the speedboat is only for your group. Your captain takes you to snorkel the reefs, stops at the natural pool for as long as you like and lands on Saona when the beach is quieter.',
        'Lunch is an all-inclusive buffet with unlimited drinks. Perfect for birthdays, families, bachelor parties and company trips.',
      ],
      es: [
        'Sin multitudes ni horario fijo: la lancha es solo para tu grupo. El capitán te lleva a hacer snorkel en los arrecifes, se queda en la piscina natural el tiempo que quieras y llega a Saona cuando la playa está más tranquila.',
        'El almuerzo es un buffet todo incluido con bebidas ilimitadas. Ideal para cumpleaños, familias, despedidas y viajes de empresa.',
      ],
    },
    highlights: {
      en: ['Private speedboat and captain', 'Snorkel stop on the reef', 'Flexible timing at the natural pool', 'All-inclusive buffet and open bar'],
      es: ['Lancha y capitán privados', 'Parada de snorkel en el arrecife', 'Tiempo flexible en la piscina natural', 'Buffet todo incluido y barra libre'],
    },
    includes: {
      en: ['Private round-trip transport', 'Private speedboat', 'Snorkel gear', 'Buffet lunch', 'Unlimited drinks'],
      es: ['Transporte privado ida y vuelta', 'Lancha privada', 'Equipo de snorkel', 'Almuerzo buffet', 'Bebidas ilimitadas'],
    },
    excludes: { en: ['Photos and videos', 'Tips'], es: ['Fotos y videos', 'Propinas'] },
    photos: [
      { file: 'Speed-boat-Punta-Cana.jpg', alt: { en: 'Speedboat cruising off Punta Cana', es: 'Lancha navegando frente a Punta Cana' } },
      { file: 'speedboat-private.avif', alt: { en: 'Private speedboat anchored in turquoise water', es: 'Lancha privada anclada en agua turquesa' } },
      { file: '83.jpg', alt: { en: 'Group enjoying the speedboat', es: 'Grupo disfrutando de la lancha' } },
      { file: 'private2.jpeg', alt: { en: 'Private boat at Saona Island', es: 'Bote privado en Isla Saona' } },
    ],
    pricing: {
      type: 'tiers',
      tiers: [
        { min: 6, max: 10, price: 1400, unit: 'total' },
        { min: 11, max: 15, price: 1900, unit: 'total' },
        { min: 16, max: 20, price: 2800, unit: 'total' },
      ],
    },
  },
  {
    slug: 'saona-private-party-boat',
    cat: 'private',
    place: 'saona',
    duration: fullDay,
    title: { en: 'Saona Private Party Boat (10–45 guests)', es: 'Saona en Bote Privado de Fiesta (10–45 personas)' },
    tagline: {
      en: 'One boat for your whole crew: music, drinks, tropical fruit and a day on Saona.',
      es: 'Un bote para todo tu grupo: música, bebidas, frutas tropicales y un día en Saona.',
    },
    body: {
      en: [
        'Built for big groups — weddings, reunions, incentive trips. Private ground transport brings everyone together, and a private boat with music and entertainment takes you to Saona.',
        'On board: open bar with alcoholic drinks and fresh tropical fruit. On the island: a local lunch and free time on the beach.',
      ],
      es: [
        'Pensado para grupos grandes: bodas, reencuentros, viajes de incentivo. El transporte privado reúne a todos y un bote privado con música y animación los lleva a Saona.',
        'A bordo: barra libre con bebidas alcohólicas y frutas tropicales. En la isla: almuerzo local y tiempo libre en la playa.',
      ],
    },
    highlights: {
      en: ['Private boat for up to 45 guests', 'On-board DJ music and entertainment', 'Open bar and tropical fruit', 'Local lunch on Saona'],
      es: ['Bote privado hasta 45 personas', 'Música y animación a bordo', 'Barra libre y frutas tropicales', 'Almuerzo local en Saona'],
    },
    includes: {
      en: ['Private ground transport', 'Expert guide', 'Private boat', 'Lunch', 'Alcoholic and soft drinks', 'Tropical fruit'],
      es: ['Transporte terrestre privado', 'Guía experto', 'Bote privado', 'Almuerzo', 'Bebidas con y sin alcohol', 'Frutas tropicales'],
    },
    excludes: { en: ['Photos and videos', 'Tips'], es: ['Fotos y videos', 'Propinas'] },
    photos: [
      { file: 'private1.jpeg', alt: { en: 'Large private boat at Saona Island', es: 'Bote privado grande en Isla Saona' } },
      { file: 'speed1.jpeg', alt: { en: 'Group on the private boat', es: 'Grupo en el bote privado' } },
      { file: 'speed2.jpeg', alt: { en: 'Boat sailing to Saona', es: 'Bote navegando hacia Saona' } },
      { file: 'speed3.jpeg', alt: { en: 'Guests enjoying the sea', es: 'Invitados disfrutando del mar' } },
    ],
    pricing: {
      type: 'tiers',
      tiers: [
        { min: 10, max: 20, price: 2600, unit: 'total' },
        { min: 21, max: 30, price: 3200, unit: 'total' },
        { min: 31, max: 45, price: 3700, unit: 'total' },
      ],
    },
  },
  {
    slug: 'catalina-snorkel',
    featured: true,
    cat: 'islands',
    place: 'catalina',
    duration: fullDay,
    title: { en: 'Catalina Island & Snorkel', es: 'Isla Catalina y Snorkel' },
    tagline: {
      en: 'Clear water, coral gardens full of fish and a quiet beach day.',
      es: 'Agua cristalina, jardines de coral llenos de peces y un día de playa tranquilo.',
    },
    body: {
      en: [
        'Catalina is the calmer, clearer sister of Saona. After a short boat ride from La Romana you will snorkel over coral gardens full of tropical fish — the visibility here is some of the best on the island.',
        'Then dry off on a white-sand beach, have lunch and a drink, and swim again whenever you want.',
      ],
      es: [
        'Catalina es la hermana más tranquila y cristalina de Saona. Tras un corto paseo en bote desde La Romana harás snorkel sobre jardines de coral llenos de peces tropicales; la visibilidad aquí es de las mejores del país.',
        'Luego sécate en una playa de arena blanca, almuerza, toma algo y vuelve al agua cuando quieras.',
      ],
    },
    highlights: {
      en: ['Snorkel over coral reef', 'Some of the clearest water in the country', 'Relaxed white-sand beach', 'Lunch and drinks'],
      es: ['Snorkel sobre arrecife de coral', 'De las aguas más claras del país', 'Playa de arena blanca y tranquila', 'Almuerzo y bebidas'],
    },
    includes: {
      en: ['Round-trip hotel transport', 'Guide', 'Boat ride', 'Snorkel gear', 'Lunch', 'Drinks'],
      es: ['Transporte ida y vuelta desde el hotel', 'Guía', 'Paseo en bote', 'Equipo de snorkel', 'Almuerzo', 'Bebidas'],
    },
    excludes: { en: ['Photos and videos', 'Tips'], es: ['Fotos y videos', 'Propinas'] },
    photos: [
      { file: 'Isla-Catalina2.jpg', alt: { en: 'Palm trees over turquoise water on Catalina Island', es: 'Palmeras sobre agua turquesa en Isla Catalina' } },
      { file: 'snorkel2.jpg', alt: { en: 'Snorkeler over the reef', es: 'Persona haciendo snorkel sobre el arrecife' } },
      { file: 'catalina3.jpg', alt: { en: 'Panoramic view of Catalina Island', es: 'Vista panorámica de Isla Catalina' } },
      { file: 'snorkel3.jpg', alt: { en: 'Tropical fish on the coral reef', es: 'Peces tropicales en el arrecife' } },
    ],
    pricing: { type: 'person', adult: 55, child: 30 },
  },
  {
    slug: 'catalina-diving',
    cat: 'sea',
    place: 'catalina',
    duration: fullDay,
    title: { en: 'Catalina Island Scuba Diving', es: 'Buceo en Isla Catalina' },
    tagline: {
      en: 'Dive the coral reefs of one of the Caribbean’s most protected marine areas.',
      es: 'Bucea en los arrecifes de una de las zonas marinas más protegidas del Caribe.',
    },
    body: {
      en: [
        'Comfortable transport to the port, a boat ride to Catalina and then you go under: coral walls, sea fans and schools of tropical fish in a protected marine area.',
        'Your dive is led by instructors who adapt to your level. Between dives, relax on the beach.',
      ],
      es: [
        'Transporte cómodo al puerto, paseo en bote a Catalina y luego, abajo: paredes de coral, abanicos de mar y cardúmenes de peces tropicales en una zona marina protegida.',
        'La inmersión la dirigen instructores que se adaptan a tu nivel. Entre inmersiones, descanso en la playa.',
      ],
    },
    highlights: {
      en: ['Guided dive on coral reefs', 'Protected marine area', 'Instructors for every level', 'Beach time between dives'],
      es: ['Inmersión guiada en arrecifes de coral', 'Zona marina protegida', 'Instructores para todos los niveles', 'Tiempo de playa entre inmersiones'],
    },
    includes: {
      en: ['Round-trip hotel transport', 'Boat ride', 'Diving equipment', 'Dive instructor', 'Lunch'],
      es: ['Transporte ida y vuelta desde el hotel', 'Paseo en bote', 'Equipo de buceo', 'Instructor de buceo', 'Almuerzo'],
    },
    excludes: { en: ['Underwater photos', 'Tips'], es: ['Fotos submarinas', 'Propinas'] },
    photos: [
      { file: 'buceoCatalina1.jpg', alt: { en: 'Diver exploring the reef at Catalina', es: 'Buzo explorando el arrecife en Catalina' } },
      { file: 'buceoCatalina2.webp', alt: { en: 'Coral and fish under water', es: 'Coral y peces bajo el agua' } },
      { file: 'buceoCatalina3.jpg', alt: { en: 'Divers descending', es: 'Buzos descendiendo' } },
    ],
    pricing: { type: 'person', adult: 110, child: 110 },
  },
  {
    slug: 'saona-diving',
    cat: 'sea',
    place: 'saona',
    duration: fullDay,
    title: { en: 'Saona Island & Scuba Diving', es: 'Isla Saona y Buceo' },
    tagline: {
      en: 'Combine Saona’s famous beach with a guided dive in crystal-clear water.',
      es: 'Combina la famosa playa de Saona con una inmersión guiada en agua cristalina.',
    },
    body: {
      en: ['The classic Saona day with an extra: a guided scuba dive on the way. Great for solo travellers, couples and dive groups.'],
      es: ['El día clásico en Saona con un extra: una inmersión guiada en el camino. Ideal para viajeros solos, parejas y grupos de buceo.'],
    },
    highlights: {
      en: ['Guided scuba dive', 'Saona beach time', 'Solo, couple and group rates'],
      es: ['Inmersión guiada', 'Tiempo de playa en Saona', 'Tarifas para uno, pareja y grupo'],
    },
    includes: {
      en: ['Round-trip hotel transport', 'Boat ride', 'Diving equipment', 'Dive guide', 'Lunch'],
      es: ['Transporte ida y vuelta desde el hotel', 'Paseo en bote', 'Equipo de buceo', 'Guía de buceo', 'Almuerzo'],
    },
    excludes: { en: ['Underwater photos', 'Tips'], es: ['Fotos submarinas', 'Propinas'] },
    photos: [
      { file: 'Saonadiving2.jpg', alt: { en: 'Diver among tropical fish', es: 'Buzo entre peces tropicales' } },
      { file: 'Saonadiving3.jpg', alt: { en: 'Divers under sunlight', es: 'Buzos bajo la luz del sol' } },
      { file: 'Saonadiving1.jpg', alt: { en: 'Diver adjusting mask', es: 'Buzo ajustando su máscara' } },
    ],
    pricing: {
      type: 'tiers',
      tiers: [
        { min: 1, max: 1, price: 150, unit: 'total' },
        { min: 2, max: 2, price: 200, unit: 'total' },
        { min: 3, max: 10, price: 120, unit: 'person' },
      ],
    },
  },
  {
    slug: 'samana-cayo-levantado',
    featured: true,
    cat: 'islands',
    place: 'samana',
    duration: fullDay,
    title: { en: 'Samaná: Cayo Levantado & El Limón Waterfall', es: 'Samaná: Cayo Levantado y Salto El Limón' },
    tagline: {
      en: 'An island beach, a jungle safari on horseback and a 40-metre waterfall in one day.',
      es: 'Una playa en un cayo, safari a caballo por la selva y una cascada de 40 metros en un solo día.',
    },
    body: {
      en: [
        'Samaná is the green, mountainous side of the Dominican Republic. Start at Cayo Levantado, a small island with a soft-sand beach in the middle of Samaná Bay.',
        'Then head inland on a safari and ride on horseback through the forest to El Limón Waterfall, where you can swim at the base of the falls. Lunch and drinks along the way.',
      ],
      es: [
        'Samaná es el lado verde y montañoso de República Dominicana. Empezamos en Cayo Levantado, una islita con playa de arena fina en medio de la bahía de Samaná.',
        'Luego safari tierra adentro y paseo a caballo por el bosque hasta el Salto El Limón, donde puedes bañarte al pie de la cascada. Almuerzo y bebidas en el camino.',
      ],
    },
    highlights: {
      en: ['Beach time on Cayo Levantado', 'Safari through the countryside', 'Horseback ride to El Limón', 'Swim under the waterfall'],
      es: ['Playa en Cayo Levantado', 'Safari por el campo', 'Paseo a caballo al Limón', 'Baño bajo la cascada'],
    },
    includes: {
      en: ['Round-trip hotel transport', 'Professional guide', 'Boat to Cayo Levantado', 'Horseback ride', 'Lunch', 'Drinks'],
      es: ['Transporte ida y vuelta desde el hotel', 'Guía profesional', 'Bote a Cayo Levantado', 'Paseo a caballo', 'Almuerzo', 'Bebidas'],
    },
    excludes: { en: ['Photos and videos', 'Tips'], es: ['Fotos y videos', 'Propinas'] },
    photos: [
      { file: 'cayo-levantado-samana.jpg', alt: { en: 'Cayo Levantado island in Samaná Bay', es: 'Cayo Levantado en la bahía de Samaná' } },
      { file: 'd6b8a9df-cbd0-461a-90b5-f7a9e87c8240.avif', alt: { en: 'El Limón Waterfall', es: 'Salto El Limón' } },
      { file: 'samanaisla2.jpg', alt: { en: 'Samaná coastline', es: 'Costa de Samaná' } },
      { file: 'samanaisla3.jpg', alt: { en: 'Beach in Samaná', es: 'Playa en Samaná' } },
    ],
    pricing: { type: 'person', adult: 80, child: 40 },
  },
  {
    slug: 'samana-whale-watching',
    cat: 'sea',
    place: 'samana',
    duration: fullDay,
    season: { en: 'Humpback whale season: mid-January to late March', es: 'Temporada de ballenas jorobadas: mediados de enero a finales de marzo' },
    title: { en: 'Samaná Whale Watching', es: 'Avistamiento de Ballenas en Samaná' },
    tagline: {
      en: 'Every winter thousands of humpback whales come to Samaná Bay to mate and give birth.',
      es: 'Cada invierno miles de ballenas jorobadas llegan a la bahía de Samaná para aparearse y dar a luz.',
    },
    body: {
      en: [
        'Samaná Bay is one of the best places on earth to see humpback whales. From the boat you can watch them breach, slap their tails and swim with their calves.',
        'This tour only runs during whale season. Message us to check dates before you book.',
      ],
      es: [
        'La bahía de Samaná es uno de los mejores lugares del mundo para ver ballenas jorobadas. Desde el bote las verás saltar, golpear el agua con la cola y nadar con sus crías.',
        'Este tour solo opera en temporada de ballenas. Escríbenos para confirmar fechas antes de reservar.',
      ],
    },
    highlights: {
      en: ['Humpback whales in the wild', 'Mothers with their calves', 'Responsible whale-watching boat', 'Samaná Bay scenery'],
      es: ['Ballenas jorobadas en libertad', 'Madres con sus crías', 'Bote de avistamiento responsable', 'Paisajes de la bahía de Samaná'],
    },
    includes: {
      en: ['Round-trip hotel transport', 'Guide', 'Whale-watching boat', 'Lunch'],
      es: ['Transporte ida y vuelta desde el hotel', 'Guía', 'Bote de avistamiento', 'Almuerzo'],
    },
    excludes: { en: ['Photos and videos', 'Tips'], es: ['Fotos y videos', 'Propinas'] },
    photos: [
      { file: 'ballena.jpeg', alt: { en: 'Humpback whale breaching in Samaná Bay', es: 'Ballena jorobada saltando en la bahía de Samaná' } },
      { file: 'ballenas-jorobadas-samana-01.webp', alt: { en: 'Whale tail above the water', es: 'Cola de ballena sobre el agua' } },
      { file: 'ballenas_samana.jpg', alt: { en: 'Whale watching boat in Samaná', es: 'Bote de avistamiento en Samaná' } },
    ],
    pricing: { type: 'person', adult: 100, child: 50 },
  },
  {
    slug: 'los-haitises',
    cat: 'islands',
    place: 'haitises',
    duration: fullDay,
    title: { en: 'Los Haitises National Park', es: 'Parque Nacional Los Haitises' },
    tagline: {
      en: 'Mangroves, limestone islets and ancient Taíno caves — plus El Limón Waterfall.',
      es: 'Manglares, islotes de piedra caliza y cuevas taínas, y además el Salto El Limón.',
    },
    body: {
      en: [
        'Los Haitises looks like nowhere else in the Caribbean: green limestone towers rise from the water, and the boat glides through mangrove channels full of birds.',
        'You will visit caves with Taíno rock art and finish at El Limón Waterfall for a swim in the jungle.',
      ],
      es: [
        'Los Haitises no se parece a ningún otro lugar del Caribe: torres verdes de piedra caliza salen del agua y el bote avanza por canales de manglar llenos de aves.',
        'Visitarás cuevas con arte rupestre taíno y terminarás en el Salto El Limón para bañarte en plena selva.',
      ],
    },
    highlights: {
      en: ['Boat ride through mangroves', 'Caves with Taíno rock art', 'Bird colonies and limestone islets', 'Swim at El Limón Waterfall'],
      es: ['Paseo en bote por manglares', 'Cuevas con arte rupestre taíno', 'Colonias de aves e islotes', 'Baño en el Salto El Limón'],
    },
    includes: {
      en: ['Round-trip hotel transport', 'Guide', 'Boat ride', 'National park entrance', 'Lunch'],
      es: ['Transporte ida y vuelta desde el hotel', 'Guía', 'Paseo en bote', 'Entrada al parque nacional', 'Almuerzo'],
    },
    excludes: { en: ['Photos and videos', 'Tips'], es: ['Fotos y videos', 'Propinas'] },
    photos: [
      { file: 'haitises2.webp', alt: { en: 'Limestone islets in Los Haitises', es: 'Islotes de piedra caliza en Los Haitises' } },
      { file: 'haitises1.webp', alt: { en: 'Boat in the mangroves', es: 'Bote entre los manglares' } },
      { file: 'Parque-Nacional-Los-Haitises.webp', alt: { en: 'Los Haitises National Park', es: 'Parque Nacional Los Haitises' } },
      { file: 'haitises3.webp', alt: { en: 'Cave entrance in Los Haitises', es: 'Entrada de una cueva en Los Haitises' } },
    ],
    pricing: { type: 'couple', first: 320, extra: 40 },
  },
  {
    slug: 'buggy-adventure',
    featured: true,
    cat: 'adventure',
    place: 'punta-cana',
    duration: halfDay,
    title: { en: 'Buggy Adventure', es: 'Aventura en Buggy' },
    tagline: {
      en: 'Drive your own buggy through mud trails, rivers and countryside villages.',
      es: 'Maneja tu propio buggy por caminos de lodo, ríos y pueblos del campo.',
    },
    body: {
      en: [
        'Get behind the wheel and follow your guide off-road through jungle trails, sugar-cane fields and river crossings. Expect to come back covered in mud and smiling.',
        'Stops include a typical Dominican house to taste coffee and cacao, and a cave or beach to cool off.',
      ],
      es: [
        'Ponte al volante y sigue a tu guía fuera de la carretera por senderos de selva, cañaverales y cruces de río. Prepárate para volver lleno de lodo y con una sonrisa.',
        'Las paradas incluyen una casa típica dominicana para probar café y cacao, y una cueva o playa para refrescarte.',
      ],
    },
    highlights: {
      en: ['Drive your own off-road buggy', 'River crossings and mud trails', 'Coffee and cacao tasting', 'Cave or beach stop'],
      es: ['Maneja tu propio buggy', 'Cruces de río y caminos de lodo', 'Degustación de café y cacao', 'Parada en cueva o playa'],
    },
    includes: {
      en: ['Round-trip hotel transport', 'Expert guide', 'Buggy and helmet', 'Tasting at a local house'],
      es: ['Transporte ida y vuelta desde el hotel', 'Guía experto', 'Buggy y casco', 'Degustación en casa local'],
    },
    excludes: { en: ['Bandana and goggles', 'Photos and videos', 'Tips'], es: ['Pañuelo y gafas', 'Fotos y videos', 'Propinas'] },
    photos: [
      { file: 'buggys22producto.webp', alt: { en: 'Buggies on a dirt trail', es: 'Buggies en un camino de tierra' } },
      { file: 'buggys2producto.webp', alt: { en: 'Buggy driving through mud', es: 'Buggy atravesando el lodo' } },
    ],
    pricing: { type: 'person', adult: 35, child: 35 },
  },
  {
    slug: 'polaris-rzr',
    cat: 'adventure',
    place: 'punta-cana',
    duration: halfDay,
    title: { en: 'Polaris RZR Off-Road', es: 'Polaris RZR Todoterreno' },
    tagline: {
      en: 'More power, more suspension, more fun. The premium way to go off-road.',
      es: 'Más potencia, más suspensión, más diversión. La forma premium de ir todoterreno.',
    },
    body: {
      en: ['Same trails as the buggy, in a Polaris RZR: a high-performance side-by-side built for jumps, rivers and rough terrain. Your guide leads the way through forests and hidden spots of the Dominican countryside.'],
      es: ['Los mismos senderos que el buggy, pero en un Polaris RZR: un vehículo de alto rendimiento hecho para saltos, ríos y terreno difícil. Tu guía te lleva por bosques y rincones escondidos del campo dominicano.'],
    },
    highlights: {
      en: ['High-performance Polaris RZR', 'Rough terrain and river crossings', 'Countryside and forest trails'],
      es: ['Polaris RZR de alto rendimiento', 'Terreno difícil y cruces de río', 'Senderos de campo y bosque'],
    },
    includes: {
      en: ['Round-trip hotel transport', 'Expert guide', 'Polaris RZR and helmet'],
      es: ['Transporte ida y vuelta desde el hotel', 'Guía experto', 'Polaris RZR y casco'],
    },
    excludes: { en: ['Photos and videos', 'Tips'], es: ['Fotos y videos', 'Propinas'] },
    photos: [
      { file: 'buggys3producto.webp', alt: { en: 'Polaris RZR on the trail', es: 'Polaris RZR en el sendero' } },
      { file: 'buggys1producto.webp', alt: { en: 'Off-road vehicles in the countryside', es: 'Vehículos todoterreno en el campo' } },
    ],
    pricing: { type: 'person', adult: 100, child: 100 },
  },
  {
    slug: 'hacienda-park-7-in-1',
    cat: 'adventure',
    place: 'punta-cana',
    duration: fullDay,
    title: { en: 'Hacienda Park 7-in-1 Adventure', es: 'Hacienda Park Aventura 7 en 1' },
    tagline: {
      en: 'Horseback, buggy safari, ziplines, river swim and lunch — all in one park.',
      es: 'Caballos, safari en buggy, tirolesas, baño en el río y almuerzo, todo en un solo parque.',
    },
    body: {
      en: [
        'The best value for families who want a bit of everything. Ride horses through the hills, drive a buggy safari and fly across the valley on ziplines.',
        'After a traditional lunch, cool off in the river and visit a typical house surrounded by plantations to learn how coffee and cacao are grown.',
      ],
      es: [
        'La mejor opción para familias que quieren un poco de todo. Monta a caballo por las colinas, maneja un safari en buggy y vuela sobre el valle en tirolesa.',
        'Después de un almuerzo típico, refréscate en el río y visita una casa típica entre plantaciones para aprender cómo se cultivan el café y el cacao.',
      ],
    },
    highlights: {
      en: ['Horseback ride', 'Buggy safari', 'Ziplines over the valley', 'River swim', 'Traditional lunch', 'Coffee and cacao plantation'],
      es: ['Paseo a caballo', 'Safari en buggy', 'Tirolesas sobre el valle', 'Baño en el río', 'Almuerzo típico', 'Plantación de café y cacao'],
    },
    includes: {
      en: ['Round-trip hotel transport', 'Dedicated guide', 'All 7 activities', 'Lunch'],
      es: ['Transporte ida y vuelta desde el hotel', 'Guía dedicado', 'Las 7 actividades', 'Almuerzo'],
    },
    excludes: { en: ['Photos and videos', 'Tips'], es: ['Fotos y videos', 'Propinas'] },
    photos: [
      { file: 'telesilla-hacienda-park.webp', alt: { en: 'Zipline over the green valley', es: 'Tirolesa sobre el valle verde' } },
      { file: 'hacienda1.webp', alt: { en: 'Horseback riding at Hacienda Park', es: 'Paseo a caballo en Hacienda Park' } },
      { file: 'hacienda2.jpg', alt: { en: 'Buggy safari in the park', es: 'Safari en buggy en el parque' } },
      { file: 'hacienda3.jpg', alt: { en: 'Hacienda Park landscape', es: 'Paisaje de Hacienda Park' } },
    ],
    pricing: { type: 'person', adult: 99, child: 99 },
  },
  {
    slug: 'swim-with-dolphins',
    cat: 'sea',
    place: 'punta-cana',
    duration: halfDay,
    title: { en: 'Swim with Dolphins', es: 'Nado con Delfines' },
    tagline: {
      en: 'Meet playful dolphins up close in the clear water of Punta Cana.',
      es: 'Conoce de cerca a delfines juguetones en el agua clara de Punta Cana.',
    },
    body: {
      en: ['Swim alongside dolphins under the guidance of trainers, feel their smooth skin and get a kiss or a handshake. An unforgettable moment for kids and adults alike.'],
      es: ['Nada junto a delfines con la guía de entrenadores, siente su piel suave y recibe un beso o un apretón de aleta. Un momento inolvidable para niños y adultos.'],
    },
    highlights: {
      en: ['Swim with dolphins', 'Guided by professional trainers', 'Great for families'],
      es: ['Nado con delfines', 'Guiado por entrenadores profesionales', 'Ideal para familias'],
    },
    includes: {
      en: ['Round-trip hotel transport', 'Dolphin swim program', 'Trainer supervision'],
      es: ['Transporte ida y vuelta desde el hotel', 'Programa de nado con delfines', 'Supervisión de entrenadores'],
    },
    excludes: { en: ['Photos and videos', 'Tips'], es: ['Fotos y videos', 'Propinas'] },
    photos: [
      { file: 'delfines2.jpg', alt: { en: 'Dolphin swimming next to a guest', es: 'Delfín nadando junto a una persona' } },
      { file: '638-2.jpg', alt: { en: 'Dolphin jumping out of the water', es: 'Delfín saltando fuera del agua' } },
      { file: 'delfines1.jpg', alt: { en: 'Dolphin close-up', es: 'Primer plano de un delfín' } },
      { file: 'delfines3.jpg', alt: { en: 'Guests with dolphins', es: 'Visitantes con delfines' } },
    ],
    pricing: { type: 'person', adult: 110, child: 110 },
  },
  {
    slug: 'titan-party-boat',
    cat: 'sea',
    place: 'punta-cana',
    duration: halfDay,
    title: { en: 'Titan Party Boat Punta Cana', es: 'Titan Party Boat Punta Cana' },
    tagline: {
      en: 'Music, open bar and swimming stops along the Punta Cana coast.',
      es: 'Música, barra libre y paradas para nadar por la costa de Punta Cana.',
    },
    body: {
      en: ['Sail along the coast of Punta Cana on a party boat with music, dancing and an open bar. The boat stops so you can swim and snorkel in the reef before heading back.'],
      es: ['Navega por la costa de Punta Cana en un barco de fiesta con música, baile y barra libre. El barco hace paradas para nadar y hacer snorkel en el arrecife antes de volver.'],
    },
    highlights: {
      en: ['Party boat with DJ music', 'Open bar', 'Swim and snorkel stop'],
      es: ['Barco de fiesta con música', 'Barra libre', 'Parada para nadar y snorkel'],
    },
    includes: {
      en: ['Round-trip hotel transport', 'Boat cruise', 'Open bar', 'Snorkel gear'],
      es: ['Transporte ida y vuelta desde el hotel', 'Paseo en barco', 'Barra libre', 'Equipo de snorkel'],
    },
    excludes: { en: ['Photos and videos', 'Tips'], es: ['Fotos y videos', 'Propinas'] },
    photos: [
      { file: 'TITAN.jpg', alt: { en: 'Titan party boat at sea', es: 'Barco de fiesta Titan en el mar' } },
      { file: 'Punta-Cana-Party-Boat-Tour.jpg', alt: { en: 'Guests dancing on the party boat', es: 'Invitados bailando en el barco' } },
    ],
    pricing: { type: 'person', adult: 55, child: 55 },
  },
  {
    slug: 'santo-domingo-colonial-city',
    featured: true,
    cat: 'culture',
    place: 'santo-domingo',
    duration: fullDay,
    title: { en: 'Santo Domingo Colonial City', es: 'Santo Domingo Ciudad Colonial' },
    tagline: {
      en: 'Walk the first city of the Americas: cathedral, Malecón and Colonial Zone.',
      es: 'Camina la primera ciudad de América: catedral, Malecón y Zona Colonial.',
    },
    body: {
      en: [
        'Santo Domingo was founded in 1496 and its Colonial Zone is a UNESCO World Heritage Site. With an expert guide you will walk cobbled streets to the Cathedral of Santa María la Menor, the oldest in the Americas.',
        'Drive along the Malecón by the sea, see the Presidential Palace and have lunch at a local restaurant.',
      ],
      es: [
        'Santo Domingo se fundó en 1496 y su Zona Colonial es Patrimonio de la Humanidad de la UNESCO. Con un guía experto caminarás calles empedradas hasta la Catedral de Santa María la Menor, la más antigua de América.',
        'Recorre el Malecón junto al mar, conoce el Palacio Nacional y almuerza en un restaurante local.',
      ],
    },
    highlights: {
      en: ['UNESCO Colonial Zone', 'First cathedral of the Americas', 'Malecón seafront', 'Presidential Palace', 'Local lunch'],
      es: ['Zona Colonial (UNESCO)', 'Primera catedral de América', 'Malecón', 'Palacio Nacional', 'Almuerzo local'],
    },
    includes: {
      en: ['Round-trip hotel transport', 'Expert guide', 'Lunch'],
      es: ['Transporte ida y vuelta desde el hotel', 'Guía experto', 'Almuerzo'],
    },
    excludes: { en: ['Museum entrance fees', 'Tips'], es: ['Entradas a museos', 'Propinas'] },
    photos: [
      { file: 'santo-domingo3.webp', alt: { en: 'Colonial Zone street in Santo Domingo', es: 'Calle de la Zona Colonial de Santo Domingo' } },
      { file: 'santo-domingo-tour-1.jpg', alt: { en: 'Historic building in Santo Domingo', es: 'Edificio histórico en Santo Domingo' } },
      { file: 'santo-domingo1.jpg', alt: { en: 'Alcázar de Colón', es: 'Alcázar de Colón' } },
      { file: 'santo-domingo2.jpg', alt: { en: 'Santo Domingo seafront', es: 'Malecón de Santo Domingo' } },
    ],
    pricing: { type: 'person', adult: 55, child: 30 },
  },
  {
    slug: 'higuey-private-city-tour',
    cat: 'culture',
    place: 'higuey',
    duration: halfDay,
    title: { en: 'Higüey Private City Tour', es: 'Tour Privado por Higüey' },
    tagline: {
      en: 'The Basilica of Altagracia, a real Dominican market and a home-style lunch.',
      es: 'La Basílica de la Altagracia, un mercado dominicano de verdad y un almuerzo casero.',
    },
    body: {
      en: [
        'A private, authentic look at the eastern Dominican Republic. Start at the Basilica of Our Lady of Altagracia, the country’s most important pilgrimage site, with its striking modern arch.',
        'Then walk through the public market among local produce and crafts, enjoy a traditional Dominican lunch and visit the historic centre.',
      ],
      es: [
        'Una mirada privada y auténtica al este dominicano. Empezamos en la Basílica de Nuestra Señora de la Altagracia, el santuario más importante del país, con su impresionante arco moderno.',
        'Luego caminamos por el mercado público entre productos y artesanías locales, almorzamos comida dominicana y visitamos el centro histórico.',
      ],
    },
    highlights: {
      en: ['Basilica of Altagracia', 'Local public market', 'Traditional Dominican lunch', 'Historic centre'],
      es: ['Basílica de la Altagracia', 'Mercado público', 'Almuerzo dominicano', 'Centro histórico'],
    },
    includes: {
      en: ['Private round-trip transport', 'Private guide', 'Lunch'],
      es: ['Transporte privado ida y vuelta', 'Guía privado', 'Almuerzo'],
    },
    excludes: { en: ['Purchases at the market', 'Tips'], es: ['Compras en el mercado', 'Propinas'] },
    photos: [
      { file: 'basilica.jpg', alt: { en: 'Basilica of Our Lady of Altagracia in Higüey', es: 'Basílica de Nuestra Señora de la Altagracia en Higüey' } },
      { file: 'higuey1.jpg', alt: { en: 'Higüey city', es: 'Ciudad de Higüey' } },
      { file: 'higuey2.jpg', alt: { en: 'Local market in Higüey', es: 'Mercado local en Higüey' } },
      { file: 'higuey4.jpg', alt: { en: 'Streets of Higüey', es: 'Calles de Higüey' } },
    ],
    pricing: {
      type: 'tiers',
      tiers: [
        { min: 2, max: 5, price: 130, unit: 'total' },
        { min: 6, max: 10, price: 180, unit: 'total' },
        { min: 11, max: 15, price: 220, unit: 'total' },
      ],
    },
  },
  {
    slug: 'coco-bongo',
    cat: 'night',
    place: 'punta-cana',
    duration: night,
    title: { en: 'Coco Bongo Punta Cana', es: 'Coco Bongo Punta Cana' },
    tagline: {
      en: 'The legendary show-and-party night: acrobats, live music and open bar.',
      es: 'La noche legendaria de show y fiesta: acróbatas, música en vivo y barra libre.',
    },
    body: {
      en: ['Coco Bongo is part concert, part circus, part nightclub. Pick your package — from general admission with open bar to Front Row VIP seats with premium drinks and fast entry.'],
      es: ['Coco Bongo es mitad concierto, mitad circo y mitad discoteca. Elige tu paquete: desde entrada general con barra libre hasta asientos Front Row VIP con bebidas premium y entrada rápida.'],
    },
    highlights: {
      en: ['World-famous live show', 'Open bar in every package', 'VIP and Front Row options'],
      es: ['Show en vivo famoso en todo el mundo', 'Barra libre en todos los paquetes', 'Opciones VIP y Front Row'],
    },
    includes: { en: ['Entrance', 'Open bar (by package)'], es: ['Entrada', 'Barra libre (según paquete)'] },
    excludes: { en: ['Hotel transport', 'Tips'], es: ['Transporte del hotel', 'Propinas'] },
    note: { en: 'Available Tuesday to Sunday.', es: 'Disponible de martes a domingo.' },
    photos: [
      { file: 'photographed-alain-strassberg.jpg', alt: { en: 'Acrobats performing at Coco Bongo', es: 'Acróbatas en el show de Coco Bongo' } },
      { file: 'cocobongo1.jpg', alt: { en: 'Coco Bongo stage and lights', es: 'Escenario y luces de Coco Bongo' } },
      { file: 'cocobongo3.webp', alt: { en: 'Crowd at Coco Bongo', es: 'Público en Coco Bongo' } },
    ],
    pricing: {
      type: 'package',
      noChildren: true,
      options: [
        { id: 'standard', price: 90, name: { en: 'Standard', es: 'Estándar' }, desc: { en: 'Entrance + open bar with domestic drinks', es: 'Entrada + barra libre nacional' } },
        { id: 'gold', price: 125, name: { en: 'Gold Member', es: 'Gold Member' }, desc: { en: 'Gold Member area + open bar (no seat)', es: 'Área Gold Member + barra libre (sin asiento)' } },
        { id: 'front-row', price: 190, name: { en: 'Front Row VIP', es: 'Front Row VIP' }, desc: { en: 'Best view, reserved seat, premium drinks, fast entry', es: 'Mejor vista, asiento reservado, bebidas premium, entrada rápida' } },
      ],
    },
  },
  {
    slug: 'shopping-tour',
    cat: 'culture',
    place: 'punta-cana',
    duration: halfDay,
    title: { en: 'Local Shopping Tour', es: 'Tour de Compras Local' },
    tagline: {
      en: 'Free with any excursion: cigars, larimar, cacao and handmade souvenirs.',
      es: 'Gratis con cualquier excursión: cigarros, larimar, cacao y recuerdos hechos a mano.',
    },
    body: {
      en: ['Your guide takes you to local markets and artisan shops to find authentic Dominican products — cigars, larimar jewellery, coffee, cacao, mamajuana and handmade crafts — and tells you the stories behind them.'],
      es: ['Tu guía te lleva a mercados y tiendas de artesanos para encontrar productos dominicanos auténticos —cigarros, joyas de larimar, café, cacao, mamajuana y artesanías— y te cuenta la historia detrás de cada uno.'],
    },
    highlights: {
      en: ['Authentic Dominican products', 'Meet local artisans', 'Free with any excursion'],
      es: ['Productos dominicanos auténticos', 'Conoce artesanos locales', 'Gratis con cualquier excursión'],
    },
    includes: { en: ['Transport', 'Guide'], es: ['Transporte', 'Guía'] },
    excludes: { en: ['Purchases'], es: ['Compras'] },
    photos: [
      { file: 'Mercado-Modelo-@conoce_rd-edited-scaled.jpg', alt: { en: 'Colourful Dominican dolls at a local market', es: 'Muñecas dominicanas de colores en un mercado' } },
      { file: 'shopping1.jpg', alt: { en: 'Souvenir shop', es: 'Tienda de recuerdos' } },
      { file: 'shopping2.webp', alt: { en: 'Handmade crafts', es: 'Artesanías hechas a mano' } },
      { file: 'shopping3.jpg', alt: { en: 'Local products', es: 'Productos locales' } },
    ],
    pricing: { type: 'free' },
  },
];

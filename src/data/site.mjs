// Datos de la empresa. Todo lo que diga VERIFICAR lo tiene que confirmar el dueño
// antes de publicar (ver PENDIENTES.md).
export const site = {
  name: 'Harmony Excursions',
  domain: 'https://harmonyexcursions.com',
  phone: '+1 809 251 4054',
  whatsapp: '18092514054',
  email: 'harmonyexcursions@outlook.com',
  base: { en: 'Punta Cana, Dominican Republic', es: 'Punta Cana, República Dominicana' },
  pickupZones: { en: 'Punta Cana, Bávaro, Cap Cana & Uvero Alto', es: 'Punta Cana, Bávaro, Cap Cana y Uvero Alto' }, // VERIFICAR
  hours: { en: 'Every day · 7:00 – 21:00', es: 'Todos los días · 7:00 – 21:00' }, // VERIFICAR
  childAges: '3–11', // VERIFICAR: rango de edad que paga precio de niño
  freeCancelHours: 24, // VERIFICAR: política de cancelación
  currency: 'USD',
  // Pon aquí los enlaces reales; si queda vacío, el icono no aparece.
  social: { instagram: '', facebook: '', tiktok: '', tripadvisor: 'https://www.tripadvisor.co.uk/Attraction_Review-g147293-d33283828-Reviews-Harmony_Excursions-Punta_Cana_La_Altagracia_Province_Dominican_Republic.html' },
  // Calificación en TripAdvisor. ACTUALIZAR a mano de vez en cuando (última revisión abajo).
  tripadvisor: {
    url: 'https://www.tripadvisor.co.uk/Attraction_Review-g147293-d33283828-Reviews-Harmony_Excursions-Punta_Cana_La_Altagracia_Province_Dominican_Republic.html',
    rating: 4.8,
    count: 31,
    rank: { en: '#194 of 976 boat tours & water sports in Punta Cana', es: '#194 de 976 tours en bote y deportes acuáticos en Punta Cana' },
    checked: '2026-10-16',
    // Código del widget oficial (tripadvisor.com/Widgets). Si lo pegas aquí, se muestra en la portada.
    widget: '',
  },
  founded: 2024,
};

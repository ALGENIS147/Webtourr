// Preguntas frecuentes y páginas legales.
// BORRADOR: el dueño debe revisar estas políticas (ver PENDIENTES.md). No son asesoría legal.
import { site } from './site.mjs';

const H = site.freeCancelHours;

export const faq = {
  en: [
    ['Do you pick us up at the hotel?', `Yes. Most experiences include round-trip transport from hotels in ${site.pickupZones.en}. After you book we send you the exact pickup time. If your hotel is elsewhere, write to us and we will tell you if we can reach it.`],
    ['How do I pay?', 'You do not pay anything online. You send a booking request, we confirm availability, and we agree the payment method with you on WhatsApp or by email.'],
    ['What is your cancellation policy?', `Cancel for free up to ${H} hours before the tour. If we cancel because of weather or safety, you can choose another date or get a full refund.`],
    ['Are prices per person?', 'Shared tours are priced per person, with a lower price for children. Private boats and private tours are priced per group. Every booking form shows the total before you send it.'],
    ['Can children join?', `Yes, on most tours. Children aged ${site.childAges} pay the child price. For diving and some adventure activities there are minimum ages — ask us.`],
    ['What should I bring?', 'Swimwear, a towel, reef-safe sunscreen, sunglasses, a hat and some cash for tips, photos and souvenirs.'],
    ['What if it rains?', 'Tropical showers are usually short and tours run as normal. If the sea or weather is unsafe, the captain or guide decides, and we will reschedule or refund you.'],
    ['Do you organise private groups and events?', 'Yes — private speedboats for 6 to 20 guests, party boats for up to 45, and private city tours. Tell us your group size and date.'],
  ],
  es: [
    ['¿Nos recogen en el hotel?', `Sí. La mayoría de las experiencias incluyen transporte ida y vuelta desde hoteles en ${site.pickupZones.es}. Al reservar te enviamos la hora exacta de recogida. Si tu hotel está en otra zona, escríbenos y te decimos si llegamos.`],
    ['¿Cómo se paga?', 'No pagas nada en línea. Envías una solicitud de reserva, confirmamos disponibilidad y acordamos contigo la forma de pago por WhatsApp o por correo.'],
    ['¿Cuál es la política de cancelación?', `Cancela gratis hasta ${H} horas antes del tour. Si nosotros cancelamos por clima o seguridad, puedes elegir otra fecha o recibir el reembolso completo.`],
    ['¿Los precios son por persona?', 'Los tours compartidos tienen precio por persona, con precio menor para niños. Los botes y tours privados tienen precio por grupo. Cada formulario muestra el total antes de enviarlo.'],
    ['¿Pueden ir niños?', `Sí, en la mayoría de los tours. Los niños de ${site.childAges} años pagan precio de niño. En buceo y algunas actividades de aventura hay edad mínima; pregúntanos.`],
    ['¿Qué debo llevar?', 'Traje de baño, toalla, protector solar apto para arrecifes, gafas de sol, gorra y algo de efectivo para propinas, fotos y recuerdos.'],
    ['¿Y si llueve?', 'Los aguaceros tropicales suelen ser cortos y los tours siguen normal. Si el mar o el clima no son seguros, decide el capitán o el guía, y cambiamos la fecha o devolvemos el dinero.'],
    ['¿Organizan grupos privados y eventos?', 'Sí: lanchas privadas para 6 a 20 personas, botes de fiesta hasta 45 y tours privados por la ciudad. Dinos cuántos son y la fecha.'],
  ],
};

// Cada página legal: [título, [ [subtítulo, párrafo], ... ]]
export const legal = {
  cancellation: {
    en: ['Cancellation & refund policy', [
      ['Cancellations by you', `You can cancel for free up to ${H} hours before the start of your experience. Cancellations made less than ${H} hours before, or no-shows, are not refundable.`],
      ['Changes', `You can change the date of your experience for free up to ${H} hours before, subject to availability.`],
      ['Cancellations by us', 'If we must cancel because of weather, sea conditions, safety or not enough participants, we will offer you another date or a full refund.'],
      ['Seasonal tours', 'Whale watching depends on the presence of whales in Samaná Bay. Sightings are very likely in season but cannot be guaranteed.'],
      ['How to cancel', `Write to us on WhatsApp (${site.phone}) or by email (${site.email}) with your booking reference.`],
    ]],
    es: ['Política de cancelación y reembolso', [
      ['Cancelaciones del cliente', `Puedes cancelar gratis hasta ${H} horas antes del inicio de la experiencia. Las cancelaciones con menos de ${H} horas o las ausencias no tienen reembolso.`],
      ['Cambios', `Puedes cambiar la fecha gratis hasta ${H} horas antes, según disponibilidad.`],
      ['Cancelaciones nuestras', 'Si debemos cancelar por clima, estado del mar, seguridad o falta de participantes, te ofrecemos otra fecha o el reembolso completo.'],
      ['Tours de temporada', 'El avistamiento de ballenas depende de su presencia en la bahía de Samaná. En temporada es muy probable verlas, pero no se puede garantizar.'],
      ['Cómo cancelar', `Escríbenos por WhatsApp (${site.phone}) o por correo (${site.email}) con tu número de referencia.`],
    ]],
  },
  terms: {
    en: ['Terms & conditions', [
      ['Who we are', `${site.name} is a tour operator based in ${site.base.en}. Contact: ${site.email}, ${site.phone}.`],
      ['Bookings', 'A booking is confirmed only when we confirm it in writing (WhatsApp or email). Sending a request through this website does not guarantee availability.'],
      ['Prices', 'All prices are in US dollars (USD) and include the items listed on each experience page. Items listed as “not included” are paid separately.'],
      ['Your responsibilities', 'Be ready at the pickup point on time, follow the instructions of guides and captains, and tell us in advance about any medical condition that may affect your participation.'],
      ['Changes to the itinerary', 'For safety or operational reasons, guides may change the order of stops or replace an activity with a similar one.'],
      ['Liability', 'Some activities involve physical effort and natural risks. You take part voluntarily and under your own responsibility, within the limits allowed by Dominican law.'],
      ['Law', 'These terms are governed by the laws of the Dominican Republic.'],
    ]],
    es: ['Términos y condiciones', [
      ['Quiénes somos', `${site.name} es un operador de tours con base en ${site.base.es}. Contacto: ${site.email}, ${site.phone}.`],
      ['Reservas', 'Una reserva queda confirmada solo cuando la confirmamos por escrito (WhatsApp o correo). Enviar una solicitud desde esta web no garantiza disponibilidad.'],
      ['Precios', 'Todos los precios están en dólares estadounidenses (USD) e incluyen lo indicado en cada experiencia. Lo marcado como “no incluye” se paga aparte.'],
      ['Tus responsabilidades', 'Estar a tiempo en el punto de recogida, seguir las indicaciones de guías y capitanes, e informarnos antes de cualquier condición médica que pueda afectar tu participación.'],
      ['Cambios en el itinerario', 'Por seguridad o motivos operativos, los guías pueden cambiar el orden de las paradas o reemplazar una actividad por otra similar.'],
      ['Responsabilidad', 'Algunas actividades implican esfuerzo físico y riesgos naturales. Participas de forma voluntaria y bajo tu responsabilidad, dentro de los límites de la ley dominicana.'],
      ['Ley aplicable', 'Estos términos se rigen por las leyes de la República Dominicana.'],
    ]],
  },
  privacy: {
    en: ['Privacy policy', [
      ['What we collect', 'This website does not use cookies, analytics or forms that store data on our side. When you send us a booking request, your message (name, hotel, dates, number of guests, contact) goes directly to our WhatsApp or email.'],
      ['Why we use it', 'Only to answer you, organise your experience and arrange your pickup.'],
      ['Who we share it with', 'Only with the suppliers needed to run your experience (for example, transport or boat operators). We never sell your data.'],
      ['How long we keep it', 'We keep booking messages for up to 24 months for accounting and customer service, then delete them.'],
      ['Your rights', `You can ask us to see, correct or delete your data at any time by writing to ${site.email}.`],
      ['Third parties', 'WhatsApp, email providers, Google Fonts and Open-Meteo (the live weather on our home page) have their own privacy policies.'],
    ]],
    es: ['Política de privacidad', [
      ['Qué datos recogemos', 'Esta web no usa cookies, analítica ni formularios que guarden datos. Cuando nos envías una solicitud, tu mensaje (nombre, hotel, fechas, personas, contacto) llega directo a nuestro WhatsApp o correo.'],
      ['Para qué los usamos', 'Solo para responderte, organizar tu experiencia y coordinar tu recogida.'],
      ['Con quién los compartimos', 'Solo con los proveedores necesarios para tu experiencia (por ejemplo, transporte u operadores de botes). Nunca vendemos tus datos.'],
      ['Cuánto tiempo los guardamos', 'Guardamos los mensajes de reserva hasta 24 meses por contabilidad y atención al cliente, y luego los borramos.'],
      ['Tus derechos', `Puedes pedirnos ver, corregir o borrar tus datos cuando quieras escribiendo a ${site.email}.`],
      ['Terceros', 'WhatsApp, los proveedores de correo, Google Fonts y Open-Meteo (el clima en vivo de la portada) tienen sus propias políticas de privacidad.'],
    ]],
  },
};

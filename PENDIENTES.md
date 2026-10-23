# Pendientes antes de publicar

El sitio está completo y funcionando. Estos datos los escribí yo a partir de la página vieja
o como texto estándar del sector: **revísalos tú**, porque son compromisos de tu empresa.
Todo se cambia en `src/data/` y luego `node src/build.mjs`.

## 1. Datos de la empresa — `src/data/site.mjs`
- [ ] Horario de atención (puse "Todos los días · 7:00 – 21:00").
- [ ] Zonas de recogida (puse Punta Cana, Bávaro, Cap Cana y Uvero Alto).
- [ ] Edad que paga precio de niño (puse 3–11; la página vieja decía "6 and 8").
- [ ] Horas de cancelación gratis (puse 24 h).
- [ ] Enlaces reales de Instagram, Facebook, TikTok y TripAdvisor (hoy están vacíos y no se muestran).

## 2. Políticas — `src/data/pages.mjs`
Son un **borrador**, no asesoría legal:
- [ ] Política de cancelación y reembolso.
- [ ] Términos y condiciones.
- [ ] Política de privacidad (dice que guardan los mensajes 24 meses).
- [ ] Preguntas frecuentes (sobre todo "¿Cómo se paga?").

## 3. Precios — `src/data/tours.mjs`
Confirmados por el dueño (16-oct-2026), por persona: Saona $55, Catalina snorkel $55, Santo Domingo $55, Samaná $80.
- [ ] Precio de **niño** en esos cuatro (siguen en $30, $30, $30 y $40).

Pendientes de la página vieja:
- [ ] **Higüey privado**: $130 / $180 / $220. ¿Es precio por grupo o por persona? Puse **por grupo**.
- [ ] **Saona + buceo**: 1 persona $150, 2 personas $200, grupo $120. Puse el grupo como **$120 por persona (3–10)**.
- [ ] **Los Haitises**: la página vieja cobraba $320 la primera pareja y **$40** cada pareja extra. Lo dejé igual; parece muy barato.
- [ ] **Hacienda Park**: la página vieja sumaba $99 extra a cada reserva (parece un error). Puse $99 por persona.
- [ ] **Titan Boat**: había un "precio adicional" de $10 sin explicar. Puse $55 por persona.
- [ ] **Bote privado de fiesta**: el título viejo decía "10 a 60 personas", pero los precios llegan a 45. Puse 10–45.
- [ ] Niños: en Buggy, Polaris, Delfines, Hacienda y Buceo los niños pagaban igual que los adultos.

## 4. Textos de cada tour — `src/data/tours.mjs`
Varias descripciones viejas estaban copiadas de otro tour (el Titan Boat y Catalina decían "Polaris").
Reescribí todas. Confirma especialmente:
- [ ] **Duración** de cada tour (puse día completo / medio día / noche).
- [ ] Lo que **incluye** y **no incluye** cada tour.
- [ ] Buggy: degustación de café y cacao, y parada en cueva o playa.
- [ ] Titan Boat: parada para nadar y hacer snorkel.
- [ ] Delfines: que sea nado con entrenadores.
- [ ] Coco Bongo: días disponibles (martes a domingo) y si incluye transporte.

## 4b. Isla Saona VIP: 3 Playas (agregada el 23-oct-2026 con tu texto)
- [ ] Su política es distinta a la general: **75 % de reembolso** cancelando antes de las 5 p. m. del día anterior
      y **depósito del 25 %**. La web en general dice "cancelación gratis hasta 24 h". Decide si unificas las políticas;
      mientras tanto, la página de este tour muestra su propia política.
- [ ] El texto dice que Saona fue elegida para filmar *Piratas del Caribe*: confirma que quieres mantener esa frase.
- [ ] Fotos: usé el muelle con palmeras y la playa con lanchas (ninguna estaba en otro tour). Cámbialas por fotos reales de este tour cuando las tengas.

## 5. TripAdvisor — `src/data/site.mjs`
- [ ] La calificación (4.8) y el número de reseñas (31) se escriben a mano: actualízalos cada mes.
- [ ] Opcional: genera el widget oficial en tripadvisor.com/Widgets y pega el código en `tripadvisor.widget`.
      Así las reseñas se muestran solas en la portada.

## 6. Fotos
- [ ] Algunas fotos parecen bajadas de internet (bancos de imágenes, otras agencias).
      Para una empresa seria hay que usar **fotos propias** o con licencia. Reemplázalas en `src/photos/`.
- [ ] La foto de la lancha privada (`speedboat-private.avif`) es muy pequeña (378 px). Mejor una más grande.

## 7. Para competir en serio (siguiente fase)
- [ ] Perfil de **Google Business** y **TripAdvisor**, y luego mostrar reseñas reales en la web.
- [ ] Pago en línea o depósito (Stripe, PayPal o un sistema de reservas como FareHarbor / Bókun).
- [ ] Analítica respetuosa (Plausible o Google Analytics con aviso de cookies).
- [ ] Licencia de turismo / RNC visible en el pie de página.

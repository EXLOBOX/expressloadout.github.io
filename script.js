// Traducción dinámica Express Loadout - script.js
// Traduce ES <-> EN en todas las páginas principales

const translations = {
  es: {
    'welcome-title': 'Haz tus importaciones de forma económica, rápida y sencilla con nosotros servicio honestos, confiables y de calidad',
    'description': 'Ofrecemos servicios de mensajería, compras e importaciones de carga desde China o USA hasta Panamá cubriendo todo el proceso logístico puerta a puerta, hasta tu negocio, oficina o hogar.',
    'locker-form-title': 'Solicita tu Casillero',
    'locker-form-description': 'Haz clic en el siguiente enlace para solicitar tu casillero en USA o China.',
    'locker-form-link': 'Solicita tu casillero',
    'whatsapp-button-call': '📱 Escríbenos por WhatsApp',
    'services-title': 'Nuestros Servicios',
    'service1': '🛒 Compras',
    'service11': 'Compras por internet sin necesidad de tener tarjeta de crédito. Te asesoramos y asistimos gratis, sin costos adicionales por manejo.',
    'service2': '📦 Casillero',
    'service22': 'Te damos una dirección en USA o China para que recibas tus compras, sobres, paquetes o importaciones hasta Panamá.',
    'service3': '🚢 Freight Marítimo',
    'service33': 'Traemos tu carga marítima desde China o USA desde 20 lbs mínimo, tú eliges el peso. Nosotros la llevamos hasta tu hogar o negocio.',
    'service4': '✈️ Freight Aéreo',
    'service44': 'Carga o paquetería aérea desde Estados Unidos hasta Panamá, sin costos por manejo ni cargos ocultos, con tarifa baja.',
    'service5': '🤝 Importaciones',
    'service55': 'Traemos compras al por mayor, asesorándote y gestionando todo el proceso logístico, desde selección del proveedor, negociación, hasta la entrega final en Panamá.',
    'service6': '🚚 Servicios de recogida',
    'service66': 'Se recoge su carga o envío en el lugar requerido para su transporte a nuestras bodegas a importar posteriormente.',
    'form_title': 'Solicita tu Casillero',
    'form_description': 'Llena este formulario para registrarte y solicitar tu casillero en USA o China.',
    'name': 'Nombre y Apellido',
    'email': 'Correo Electrónico',
    'phone': 'Número de Celular (WhatsApp)',
    'id': 'Número de Identificación o RUC',
    'submit': 'Solicitar Casillero',
    'testimonials-title': 'Clientes Felices',
    'testimonial1-text': '“Con Express Loadout importé desde China sin complicaciones 10 reformers para mi gimnacio de pilates. Fueron rápidos, honestos, transparentes y hasta me ayudaron a subir toda la carga a mi negocio en un segundo piso. ¡Recomendados!”',
    'testimonial1-author': '– Adriana S., Dueña de negocios',
    'testimonial2-text': '“Necesitaba comprar unos equipos en Amazon y ellos se encargaron de todo. Muy profesionales y atentos principalmente el joven Jonathan muy diligente.”',
    'testimonial2-author': '– Jennifer Rodriguez., Emprendedora',
    'testimonial3-text': '“Usé su casillero en USA y recibí todo en mi casa no solo Panamá, hasta Boquete Chiriqui sin costos ocultos. Excelente servicio.”',
    'testimonial3-author': '– Lena E., Cliente frecuente',
    'contact-title': 'Contacto',
    'contact-whatsapp': '📱 WhatsApp: +507 6521-0278',
    'contact-email': '📧 Email: exlo@expressloadout.com',
    'contact-instagram': '📸 Instagram',
    'contact-facebook': '📘 Facebook',
    'footer': '© 2025 Express Loadout',
    'thanks-title': '¡Gracias por tu registro!',
    'thanks-desc': 'Hemos recibido tu solicitud de casillero.<br>Pronto nos pondremos en contacto contigo para darte la bienvenida y los siguientes pasos.',
    'back-home': 'Volver al inicio',
    // Tiendas
    'nav-stores': 'Tiendas',
    'stores-title': 'Algunas de las tiendas',
    'recommended': 'Productos recomendados',
    'other-products': 'Otros productos',
    // Tiendas - store names
    'store-amazon': 'Amazon',
    'store-ebay': 'Ebay',
    'store-temu': 'TEMU',
    'store-aliexpress': 'Aliexpress',
    'store-shein': 'SHEIN',
    'store-rockauto': 'RockAuto',
    'store-wayfair': 'WayFair',
    'store-taobao': 'Taobao',
    'store-sephora': 'SEPHORA',
    'store-romwe': 'ROWme',
    'store-alibaba': 'alibaba',
    'store-madeinchina': 'MadeInChina',
    // Tiendas - product names
    'prod-echodot': 'Echo Dot 4ta Gen',
    'prod-switch': 'Nintendo Switch',
    'prod-kindle': 'Kindle Paperwhite'
  },
  en: {
    'welcome-title': 'Make your imports economical, fast and easy with us — honest, reliable and quality service',
    'description': 'We offer courier, shopping and cargo import services from China or the USA to Panama covering the entire door-to-door logistics process, to your business, office or home.',
    'locker-form-title': 'Request your PO-box',
    'locker-form-description': 'Click the link below to request your PO-box in the USA or China.',
    'locker-form-link': 'Request your locker',
    'whatsapp-button-call': '📱 Write us on WhatsApp',
    'services-title': 'Our Services',
    'service1': '🛒 Shopping',
    'service11': 'Online shopping without needing a credit card. We advise and assist you for free, with no extra handling fees.',
    'service2': '📦 Locker',
    'service22': 'We provide you with a USA or China address to receive your purchases, letters, packages, or imports to Panama.',
    'service3': '🚢 Ocean Freight',
    'service33': 'We bring your ocean freight from China or the USA starting at 20 lbs minimum, you choose the weight. We deliver it to your home or business.',
    'service4': '✈️ Air Freight',
    'service44': 'Air cargo or packages from the United States to Panama, with no handling fees or hidden charges, at a low rate.',
    'service5': '🤝 Imports',
    'service55': 'We bring wholesale purchases, advising and managing the entire logistics process, from supplier selection, negotiation, to final delivery in Panama.',
    'service6': '🚚 Pickup Services',
    'service66': 'We pick up your cargo or shipment at the required location for transport to our warehouses for later import.',
    'form_title': 'Request Your Locker',
    'form_description': 'Fill out this form to register and request your locker in the USA or China.',
    'name': 'Full Name',
    'email': 'Email Address',
    'phone': 'Phone Number (WhatsApp)',
    'id': 'ID or RUC Number',
    'submit': 'Request Locker',
    'testimonials-title': 'Happy Clients',
    'testimonial1-text': '“With Express Loadout I imported 10 reformers for my pilates studio from China without complications. They were fast, honest, transparent and even helped me carry all the cargo to my business on a second floor. Highly recommended!”',
    'testimonial1-author': '– Adriana S., Business Owner',
    'testimonial2-text': '“I needed to buy some equipment on Amazon and they took care of everything. Very professional and attentive, especially Jonathan who was very diligent.”',
    'testimonial2-author': '– Jennifer Rodriguez, Entrepreneur',
    'testimonial3-text': '“I used their USA locker and received everything at my house, not just in Panama, but even in Boquete, Chiriqui with no hidden costs. Excellent service.”',
    'testimonial3-author': '– Lena E., Frequent customer',
    'contact-title': 'Contact',
    'contact-whatsapp': '📱 WhatsApp: +507 6521-0278',
    'contact-email': '📧 Email: exlo@expressloadout.com',
    'contact-instagram': '📸 Instagram',
    'contact-facebook': '📘 Facebook',
    'footer': '© 2025 Express Loadout',
    'thanks-title': 'Thank you for your registration!',
    'thanks-desc': 'We have received your locker request.<br>We will contact you soon to welcome you and explain the next steps.',
    'back-home': 'Back to home',
    // Tiendas
    'nav-stores': 'Stores',
    'stores-title': 'Some of the stores',
    'recommended': 'Recommended products',
    'other-products': 'Other products',
    // Tiendas - store names
    'store-amazon': 'Amazon',
    'store-ebay': 'Ebay',
    'store-temu': 'TEMU',
    'store-aliexpress': 'Aliexpress',
    'store-shein': 'SHEIN',
    'store-rockauto': 'RockAuto',
    'store-wayfair': 'WayFair',
    'store-taobao': 'Taobao',
    'store-sephora': 'SEPHORA',
    'store-romwe': 'ROWme',
    'store-alibaba': 'alibaba',
    'store-madeinchina': 'MadeInChina',
    // Tiendas - product names
    'prod-echodot': 'Echo Dot 4th Gen',
    'prod-switch': 'Nintendo Switch',
    'prod-kindle': 'Kindle Paperwhite'
  }
};

function setLanguage(lang) {
  var ids = Object.keys(translations[lang]);
  for (var i = 0; i < ids.length; i++) {
    var el = document.getElementById(ids[i]);
    if (el && translations[lang][ids[i]] !== undefined) {
      if (ids[i] === 'thanks-desc') {
        el.innerHTML = translations[lang][ids[i]];
      } else {
        el.textContent = translations[lang][ids[i]];
      }
    }
  }
  // Tiendas: translate store names
  var storeKeys = [
    'store-amazon','store-ebay','store-temu','store-aliexpress','store-shein','store-rockauto','store-wayfair','store-taobao','store-sephora','store-romwe','store-alibaba','store-madeinchina'
  ];
  var storeEls = document.querySelectorAll('.trans-store-name');
  storeEls.forEach(function(el, idx) {
    if (translations[lang][storeKeys[idx]]) {
      el.textContent = translations[lang][storeKeys[idx]];
    }
  });
  // Tiendas: translate product names in carousel
  var prodKeys = ['prod-echodot','prod-switch','prod-kindle'];
  var prodEls = document.querySelectorAll('.trans-product-name');
  prodEls.forEach(function(el, idx) {
    if (translations[lang][prodKeys[idx]]) {
      el.textContent = translations[lang][prodKeys[idx]];
    }
  });
}

function setLangFromSelector(lang) {
  localStorage.setItem('lang', lang);
  setLanguage(lang);
}

document.addEventListener('DOMContentLoaded', function() {
  var lang = localStorage.getItem('lang') || 'es';
  setLanguage(lang);
});

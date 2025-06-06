const texts = {
  es: {
    title: "Express Loadout",
    welcomeTitle: "Haz tus importaciones de forma económica, rápida y sencilla con nosotros servicio honestos, confiables y de calidad",
    description: "Ofrecemos servicios de mensajería, compras e importaciones de carga desde China o USA hasta Panamá cubriendo todo el proceso logístico puerta a puerta, hasta tu negocio, oficina o hogar.",
    lockerFormTitle: "Solicita tu Casillero",
    lockerFormDescription: "Haz clic en el siguiente enlace para solicitar tu casillero en USA o China.",
    lockerFormLink: "Solicita tu casillero",
    whatsappButtonCall: "📱 Escríbenos por WhatsApp",
    servicesTitle: "Nuestros Servicios",
    service1: "🛒 Comprasss",
    service11: "Compras por internet sin necesidad de tener tarjeta de crédito. Te asesoramos y asistimos gratis, sin costos adicionales por manejo.",
    service2: "📦 Casillero",
    service22: "Te damos una dirección en USA o China para que recibas tus compras, sobres, paquetes o importaciones hasta Panamá.",
    service3: "🚢 Freight Marítimo",
    service33: "Traemos tu carga marítima desde China o USA desde 20 lbs mínimo, tú eliges el peso. Nosotros la llevamos hasta tu hogar o negocio.",
    service4: "✈️ Freight Aéreo",
    service44: "Carga o paquetería aérea desde Estados Unidos hasta Panamá, sin costos por manejo ni cargos ocultos, con tarifa baja.",
    contact: "Contáctanos",
    form_title: "Solicita tu Casillero",
    form_description: "Llena este formulario para registrarte y solicitar tu casillero en USA o China.",
    name: "Nombre y Apellido",
    email: "Correo Electrónico",
    phone: "Número de Celular (WhatsApp)",
    id: "Número de Identificación o RUC",
    submit: "Solicitar Casillero",
    contactTitle: "Contacto",
    contactWhatsapp: "📱 WhatsApp: +507 6521-0278",
    contactEmail: "📧 Email: exlo@expressloadout.com",
    contactInstagram: "📸 Instagram",
    contactFacebook: "📘 Facebook",
    contactList: {
      whatsapp: "WhatsApp: ",
      email: "Email: ",
      instagram: "Instagram: ",
      facebook: "Facebook: ",
      title: "Solicita tu Casillero"
    },
    footer: "© 2025 Express Loadout",
    testimonialsTitle: "Clientes Felices",
    testimonial1Text: "“Con Express Loadout importé desde China sin complicaciones 10 reformers para mi gimnacio de pilates. Fueron rápidos, honestos, transparentes y hasta me ayudaron a subir toda la carga a mi negocio en un segundo piso. ¡Recomendados!”",
    testimonial1Author: "– Adriana S., Dueña de negocios",
    testimonial2Text: "“Necesitaba comprar unos equipos en Amazon y ellos se encargaron de todo. Muy profesionales y atentos principalmente el joven Jonathan muy diligente.”",
    testimonial2Author: "– Jennifer Rodriguez., Emprendedora",
    testimonial3Text: "“Usé su casillero en USA y recibí todo en mi casa no solo Panamá, hasta Boquete Chiriqui sin costos ocultos. Excelente servicio.”",
    testimonial3Author: "– Lena E., Cliente frecuente"
  },
  en: {
    title: "Express Loadout",
    welcomeTitle: "Make your imports economical, fast and easy with us — honest, reliable and quality service",
    description: "We offer courier, shopping and cargo import services from China or the USA to Panama covering the entire door-to-door logistics process, to your business, office or home.",
    lockerFormTitle: "Request your PO-box",
    lockerFormDescription: "Click the link below to request your PO-box in the USA or China.",
    lockerFormLink: "Request your locker",
    whatsappButtonCall: "📱 Write us on WhatsApp",
    servicesTitle: "Our Services",
    service1: "🛒 Shoppinggg",
    service11: "Online shopping without needing a credit card. We advise and assist you for free, with no extra handling fees.",
    service2: "📦 Locker",
    service22: "We provide you with a USA or China address to receive your purchases, letters, packages, or imports to Panama.",
    service3: "🚢 Ocean Freight",
    service33: "We bring your ocean freight from China or the USA starting at 20 lbs minimum, you choose the weight. We deliver it to your home or business.",
    service4: "✈️ Air Freight",
    service44: "Air cargo or packages from the United States to Panama, with no handling fees or hidden charges, at a low rate.",
    contact: "Contact Us",
    form_title: "Request Your Locker",
    form_description: "Fill out this form to register and request your locker in the USA or China.",
    name: "Full Name",
    email: "Email Address",
    phone: "Phone Number (WhatsApp)",
    id: "ID or RUC Number",
    submit: "Request Locker",
    contactTitle: "Contactttt",
    contactWhatsapp: "📱 WhatsApp: +507 6521-0278",
    contactEmail: "📧 Email: exlo@expressloadout.com",
    contactInstagram: "📸 Instagram",
    contactFacebook: "📘 Facebook",
    contactList: {
      whatsapp: "WhatsApp: ",
      email: "Email: ",
      instagram: "Instagram: ",
      facebook: "Facebook: ",
      title: "Request Your Locker"
    },
    footer: "© 2025 Express Loadout",
    testimonialsTitle: "Happy Clients",
    testimonial1Text: "“With Express Loadout I imported 10 reformers for my pilates studio from China without complications. They were fast, honest, transparent and even helped me carry all the cargo to my business on a second floor. Highly recommended!”",
    testimonial1Author: "– Adriana S., Business Owner",
    testimonial2Text: "“I needed to buy some equipment on Amazon and they took care of everything. Very professional and attentive, especially Jonathan who was very diligent.”",
    testimonial2Author: "– Jennifer Rodriguez, Entrepreneur",
    testimonial3Text: "“I used their USA locker and received everything at my house, not just in Panama, but even in Boquete, Chiriqui with no hidden costs. Excellent service.”",
    testimonial3Author: "– Lena E., Frequent customer"
  }
};

function setLanguage(lang) {
  document.getElementById('title').textContent = texts[lang].title;
  document.getElementById('welcome-title').textContent = texts[lang].welcomeTitle;
  document.getElementById('description').textContent = texts[lang].description;
  document.getElementById('locker-form-title').textContent = texts[lang].lockerFormTitle;
  document.getElementById('locker-form-description').textContent = texts[lang].lockerFormDescription;
  document.getElementById('locker-form-link').textContent = texts[lang].lockerFormLink;
  document.getElementById('whatsapp-button-call').textContent = texts[lang].whatsappButtonCall;
  document.getElementById('services-title').textContent = texts[lang].servicesTitle;

  // Servicios principales
  const serviceKeys = ['service1', 'service2', 'service3', 'service4'];
  const servicesUl = document.querySelector('main section:nth-of-type(2) ul');
  if (servicesUl) {
    servicesUl.innerHTML = '';
    serviceKeys.forEach(key => {
      const li = document.createElement('li');
      li.textContent = texts[lang][key];
      servicesUl.appendChild(li);
    });
  }

  // Título de contacto
  const contactTitle = document.querySelector('main section:nth-of-type(3) h3');
  if (contactTitle) {
    contactTitle.textContent = texts[lang].contactTitle;
  }

  // Footer
  const footer = document.querySelector('footer p');
  if (footer) {
    footer.textContent = texts[lang].footer;
  }

  // Formulario
  const formKeys = ['form_title', 'form_description', 'name', 'email', 'phone', 'id', 'submit'];
  formKeys.forEach(key => {
    const el = document.getElementById(key);
    if (el) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = texts[lang][key];
      } else if (el.tagName === 'BUTTON') {
        el.textContent = texts[lang][key];
      } else {
        el.textContent = texts[lang][key];
      }
    }
  });

  document.getElementById('testimonials-title').textContent = texts[lang].testimonialsTitle;
  document.getElementById('testimonial1-text').textContent = texts[lang].testimonial1Text;
  document.getElementById('testimonial1-author').textContent = texts[lang].testimonial1Author;
  document.getElementById('testimonial2-text').textContent = texts[lang].testimonial2Text;
  document.getElementById('testimonial2-author').textContent = texts[lang].testimonial2Author;
  document.getElementById('testimonial3-text').textContent = texts[lang].testimonial3Text;
  document.getElementById('testimonial3-author').textContent = texts[lang].testimonial3Author;

  // Enlaces de contacto
  document.getElementById('contact-title').textContent = texts[lang].contactTitle;
  document.getElementById('contact-whatsapp').textContent = texts[lang].contactWhatsapp;
  document.getElementById('contact-email').textContent = texts[lang].contactEmail;
  document.getElementById('contact-instagram').textContent = texts[lang].contactInstagram;
  document.getElementById('contact-facebook').textContent = texts[lang].contactFacebook;
}

// Idioma por defecto
setLanguage('es');

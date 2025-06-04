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
    servicesList: [
      "Compras: compras por internet sin necesidad de tener tarjeta de crédito (lo compramos por ti), te asesoramos y asistimos totalmente gratis (sin costos adicionales por manejo al recibir tus compras).",
      "Casillero: Brindamos un espacio físico en USA y también en China, para que puedas recibir todo lo que quieras enviar a Panamá, desde sobres, correspondencias, compras, encomiendas, importaciones, etc.",
      "Freight Marítimo: traemos tu carga marítima pesada desde Estados Unidos o China hasta Panamá, desde 20 lbs mínimo (tú eliges el peso máximo), nosotros lo traemos hasta donde tú elijas.",
      "Freight Aéreo: traemos tu carga o paquetería aérea desde Estados Unidos hasta Panamá, sin costos por manejo, sin cargos sorpresa a una tarifa tan ridícula."
    ],
    contactTitle: "Contacto",
    contactList: {
      whatsapp: "WhatsApp: ",
      email: "Email: ",
      instagram: "Instagram: ",
      facebook: "Facebook: "
    },
    footer: "© 2025 Express Loadout"
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
    servicesList: [
      "Shopping: Online purchases without the need for a credit card (we buy it for you), we advise and assist you totally free (no additional handling fees upon receiving your purchases).",
      "Locker: We provide a physical space in the USA and also in China, so you can receive anything you want to send to Panama, from envelopes, correspondence, purchases, parcels, imports, etc.",
      "Sea Freight: We bring your heavy sea cargo from the United States or China to Panama, minimum 20 lbs (you choose the maximum weight), we bring it wherever you want.",
      "Air Freight: We bring your air cargo or parcels from the United States to Panama, no handling fees, no surprise charges at a ridiculously low rate."
    ],
    contactTitle: "Contact",
    contactList: {
      whatsapp: "WhatsApp: ",
      email: "Email: ",
      instagram: "Instagram: ",
      facebook: "Facebook: "
    },
    footer: "© 2025 Express Loadout"
  }
};

const translations = {
  es: {
    title: "Bienvenido",
    description: "Haz tus importaciones de forma económica, rápida y sencilla con nosotros: servicios honestos, confiables y de calidad.",
    services_title: "Nuestros Servicios",
    service1: "online shoppin.",
    service11: "Compras por internet sin necesidad de tener tarjeta de crédito. Lo compramos por ti y te asesoramos gratis.",
    service2: "PO-Box.",
    service22: "Casillero en USA y China para recibir tus compras e importaciones desde sobres hasta carga.",
    service3: "Ocean Freight",
    service33: "Freight Marítimo desde USA o China hasta Panamá desde 20 lbs. Tú eliges el peso máximo.",
    service4: "Air Freight",
    service44: "Freight Aéreo sin costos por manejo ni cargos sorpresa. Tarifas competitivas.",
    contact: "Contáctanos",
    form_title: "Solicita tu Casillero",
    form_description: "Llena este formulario para registrarte y solicitar tu casillero en USA o China.",
    name: "Nombre y Apellido",
    email: "Correo Electrónico",
    phone: "Número de Celular (WhatsApp)",
    id: "Número de Identificación o RUC",
    submit: "Solicitar Casillero"
  },
  en: {
    title: "Welcome",
    description: "Make your imports economical, fast, and simple with us: honest, reliable, and quality service.",
    services_title: "Our Services",
    service1: "online shoppin.",
    service11: "Online purchases without needing a credit card. We buy for you and provide free assistance.",
    service2: "PO-Box.",
    service22: "Locker in USA and China to receive your purchases and imports from letters to cargo.",
    service3: "Ocean Freight",
    service33: "Maritime Freight from USA or China to Panama starting at 20 lbs. You choose the max weight.",
    service4: "Air Freight",
    service44: "Air Freight with no handling fees or hidden charges. Ridiculously low rates.",
    contact: "Contact Us",
    form_title: "Request Your Locker",
    form_description: "Fill out this form to register and request your locker in the USA or China.",
    name: "Full Name",
    email: "Email Address",
    phone: "Phone Number (WhatsApp)",
    id: "ID or RUC Number",
    submit: "Request Locker"
  }
}

function setLanguage(lang) {
  document.getElementById('title').textContent = texts[lang].title;
  document.getElementById('welcome-title').textContent = texts[lang].welcomeTitle;
  document.getElementById('description').textContent = texts[lang].description;
  document.getElementById('locker-form-title').textContent = texts[lang].lockerFormTitle;
  document.getElementById('locker-form-description').textContent = texts[lang].lockerFormDescription;
  document.getElementById('locker-form-link').textContent = texts[lang].lockerFormLink;
  document.getElementById('whatsapp-button-call').textContent = texts[lang].whatsappButtonCall;
  document.getElementById('services-title').textContent = texts[lang].servicesTitle;

  const servicesUl = document.querySelector('main section:nth-of-type(2) ul');
  servicesUl.innerHTML = '';
  texts[lang].servicesList.forEach(service => {
    const li = document.createElement('li');
    li.textContent = service;
    servicesUl.appendChild(li);
  });

  // Contact section titles and links remain in Spanish, but we can translate the section title
  document.querySelector('main section:nth-of-type(3) h3').textContent = texts[lang].contactTitle;

  // Contact list labels stay the same but if you want to translate them, uncomment below and add translations
  /*
  const contactItems = document.querySelectorAll('main section:nth-of-type(3) ul li');
  contactItems[0].innerHTML = texts[lang].contactList.whatsapp + '<a href="https://wa.me/50765210278" target="_blank">+507 6521 0278</a>';
  contactItems[1].innerHTML = texts[lang].contactList.email + '<a href="mailto:exlo@expressloadout.com">exlo@expressloadout.com</a>';
  contactItems[2].innerHTML = texts[lang].contactList.instagram + '<a href="https://www.instagram.com/expressloadout" target="_blank">expressloadout</a>';
  contactItems[3].innerHTML = texts[lang].contactList.facebook + '<a href="https://www.facebook.com/ExpressLoadout/" target="_blank">ExpressLoadout</a>';
  */

function setLanguage(lang) {
  document.getElementById("title").textContent = translations[lang].title;
  document.getElementById("description").textContent = translations[lang].description;

  // Si tienes secciones con IDs como services_title, service1, etc., las traducimos:
  const keys = [
    "services_title", "service1", "service2", "service3", "service4",
    "contact", "form_title", "form_description", "name", "email", "phone", "id", "submit"
  ];
  keys.forEach(key => {
    const el = document.getElementById(key);
    if (el) {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = translations[lang][key];
      } else if (el.tagName === "BUTTON") {
        el.textContent = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });
}
  document.querySelector('footer p').textContent = texts[lang].footer;
}

// Set default language to Spanish
setLanguage('es');

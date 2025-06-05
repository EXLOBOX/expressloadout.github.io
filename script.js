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
    service1: "Compras.",
    service11: "Compras por internet sin necesidad de tener tarjeta de crédito. Lo compramos por ti y te asesoramos gratis.",
    service2: "Casillero.",
    service22: "Casillero en USA y China para recibir tus compras e importaciones desde sobres hasta carga.",
    service3: "Freight Marítimo",
    service33: "Freight Marítimo desde USA o China hasta Panamá desde 20 lbs. Tú eliges el peso máximo.",
    service4: "Freight Aéreo",
    service44: "Freight Aéreo sin costos por manejo ni cargos sorpresa. Tarifas competitivas.",
    contact: "Contáctanos",
    form_title: "Solicita tu Casillero",
    form_description: "Llena este formulario para registrarte y solicitar tu casillero en USA o China.",
    name: "Nombre y Apellido",
    email: "Correo Electrónico",
    phone: "Número de Celular (WhatsApp)",
    id: "Número de Identificación o RUC",
    submit: "Solicitar Casillero",
    contactTitle: "Contacto",
    contactList: {
      whatsapp: "WhatsApp: ",
      email: "Email: ",
      instagram: "Instagram: ",
      facebook: "Facebook: ",
      title: "Solicita tu Casillero",
      
  description: "Llena este formulario para registrarte y solicitar tu casillero en USA o China.",
  name: "Nombre y Apellido",
  email: "Correo Electrónico",
  phone: "Número de Celular (WhatsApp)",
  id: "Número de Identificación o RUC",
  submit: "Solicitar Casillero"
      
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
    submit: "Request Locker",
    contactTitle: "Contact",
    contactList: {
      whatsapp: "WhatsApp: ",
      email: "Email: ",
      instagram: "Instagram: ",
      facebook: "Facebook: ",
       title: "Request Your Locker",
      
  description: "Fill out this form to register and request your locker in the USA or China.",
  name: "Full Name",
  email: "Email Address",
  phone: "Phone Number (WhatsApp)",
  id: "ID or RUC Number",
  submit: "Request Locker"
      
    },
    footer: "© 2025 Express Loadout"
  }
};

const translations = {
  es: {
  
    description: "Haz tus importaciones de forma económica, rápida y sencilla con nosotros: servicios honestos, confiables y de calidad.",
    services_title: "Nuestros Servicios",
    
  },
  en: {
    title: "Welcome",
    description: "Make your imports economical, fast, and simple with us: honest, reliable, and quality service.",
    services_title: "Our Services",
    
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

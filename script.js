const texts = {
  es: {
    title: "Express Loadout",
    welcomeTitle: "Haz tus importaciones de forma económica, rápida y sencilla con nosotros servicio honestos, confiables y de calidad",
    description: "Ofrecemos servicios de mensajería, compras e importaciones de carga desde China o USA hasta Panamá cubriendo todo el proceso logístico puerta a puerta, hasta tu negocio, oficina o hogar.",
    lockerForm: "Solicita tu Casillero",
    services: "Servicios",
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
    lockerForm: "Request your PO-box",
    services: "Services",
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

function setLanguage(lang) {
  document.getElementById('title').textContent = texts[lang].title;
  document.getElementById('welcome-title').textContent = texts[lang].welcomeTitle;
  document.getElementById('description').textContent = texts[lang].description;
  document.getElementById('locker-form-title').textContent = texts[lang].lockerFormTitle;
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

  document.querySelector('footer p').textContent = texts[lang].footer;
}

// Set default language to Spanish
setLanguage('es');

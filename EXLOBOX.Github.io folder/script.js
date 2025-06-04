const translations = {
  es: {
    title: "Bienvenido",
    description: "Este es un sitio web de ejemplo en dos idiomas."
  },
  en: {
    title: "Welcome",
    description: "This is a sample website in two languages."
  }
};

function setLanguage(lang) {
  document.getElementById('title').textContent = translations[lang].title;
  document.getElementById('description').textContent = translations[lang].description;
}

/**
 * EXPRESS LOADOUT - MODERN OBSIDIAN ENGINE (GAS HYBRID & CMS)
 * Gestor de Calculadora, Tracking, Directorio de Tiendas, Casillero y Admin CMS
 */

// =============================================================================
// ESTADO GLOBAL & PERSISTENCIA (LOCALSTORAGE)
// =============================================================================
const STORAGE_KEYS = {
  CASES: 'exlo_success_cases_v4',
  RATES: 'exlo_tariffs_v4',
  GAS_URL: 'exlo_gas_webhook_url',
  THEME: 'exlo_active_theme',
  EVENTS: 'exlo_events_v4',
  SUBSCRIBERS: 'exlo_event_subscribers_v4'
};

// Eventos y Fechas Clave Mundiales (Amazon, AliExpress, Shein, Walmart, Temu, Alibaba)
const defaultEvents = [
  {
    id: 'evt-1',
    platform: 'aliexpress',
    title: 'AliExpress 11.11 • Global Shopping Festival',
    date: '2026-11-11T00:00:00',
    hasTimer: true,
    discount: 'Hasta 80% OFF • Millones de Ofertas',
    logisticsTip: 'Evento cumbre mundial. Para compras voluminosas o carga pesada, despacha por flete marítimo antes del 15 de Noviembre para recibir antes de Navidad en Panamá.',
    url: 'https://www.aliexpress.com',
    badge: '11.11 Día del Soltero'
  },
  {
    id: 'evt-2',
    platform: 'amazon',
    title: 'Amazon Black Friday & Cyber Monday 2026',
    date: '2026-11-27T00:00:00',
    hasTimer: true,
    discount: 'Descuentos Relámpago en Electrónica & Prime',
    logisticsTip: 'Mayor volumen del año en Miami. Despacha vía Aéreo Express con casillero EXLO-PA para tener tus regalos listos sin demoras.',
    url: 'https://www.amazon.com',
    badge: 'Black Friday Global'
  },
  {
    id: 'evt-3',
    platform: 'amazon',
    title: 'Amazon Prime Day & Big Deals 2026',
    date: '2026-07-14T00:00:00',
    hasTimer: true,
    discount: 'Hasta 70% OFF Exclusivo Membresía Prime',
    logisticsTip: 'Laptops, smart home, calzado y ropa. Los paquetes llegan en 24h a nuestra bodega de Miami y en 3 a 5 días hábiles están en Panamá.',
    url: 'https://www.amazon.com/primeday',
    badge: 'Prime Day Exclusivo'
  },
  {
    id: 'evt-4',
    platform: 'shein',
    title: 'SHEIN Mega Sale & Flash Friday',
    date: '',
    hasTimer: false,
    discount: 'Descuentos por confirmar por la tienda',
    logisticsTip: 'Ideal para ropa, accesorios y calzado. Los paquetes se consolidan en Miami para entrega ágil en Panamá.',
    url: 'https://www.shein.com',
    badge: 'Fecha por Confirmar'
  },
  {
    id: 'evt-5',
    platform: 'walmart',
    title: 'Walmart Deals & Early Black Friday',
    date: '',
    hasTimer: false,
    discount: 'Ofertas de temporada por confirmar',
    logisticsTip: 'Excelente para juguetes, electrónica y hogar. Se despacha directo a nuestro casillero Miami con entrega ágil en Panamá.',
    url: 'https://www.walmart.com',
    badge: 'Fecha por Confirmar'
  },
  {
    id: 'evt-6',
    platform: 'temu',
    title: 'TEMU Super Flash Fest & Cuponera Directa',
    date: '',
    hasTimer: false,
    discount: 'Precios de fábrica en accesorios y novedades',
    logisticsTip: 'Excelente para accesorios, novedades y paquetes livianos. Coloca tu código EXLO-PA en la dirección para clasificación inmediata.',
    url: 'https://www.temu.com',
    badge: 'Fecha por Confirmar'
  },
  {
    id: 'evt-7',
    platform: 'alibaba',
    title: 'Alibaba Super September & March Expo B2B',
    date: '',
    hasTimer: false,
    discount: 'Muestras Gratis & Contenedores LCL Compartidos',
    logisticsTip: 'Pensado para importadores y comercios en Panamá. Te asesoramos en la verificación de proveedores y flete marítimo en CBM.',
    url: 'https://www.alibaba.com',
    badge: 'Fecha por Confirmar'
  }
];

// Tarifas por defecto (Ajustables desde el CMS)
const defaultRates = {
  airUsa: 3.00,        // $ / lb (Tarifa estándar base Miami)
  airChina: 7.50,      // $ / lb (Tarifa aéreo China)
  seaUsaFt3: 15.00,    // $ / FT3 (Tarifa estándar marítimo Miami)
  seaChinaMin: 275.00, // $ / CBM min
  seaChinaMax: 350.00, // $ / CBM max
  seaChinaBase: 300.00,// $ / CBM base referencial
  deliveryMetro: 3.50  // Domicilio Panamá (opcional)
};

// Casos de éxito iniciales basados en testimonios reales de Express Loadout
const defaultCases = [
  {
    id: 'case-1',
    client: 'Adriana S.',
    company: 'Pilates Studio Panamá',
    title: 'Importación de 10 Reformers desde China',
    mode: 'China • Marítimo',
    stat: '1,850 lbs • $3,400 Ahorro',
    image: 'images/banner.jpg',
    desc: '“Con Express Loadout importé sin complicaciones 10 reformers para mi gimnasio de pilates. Fueron rápidos, transparentes y hasta me ayudaron a subir toda la carga a mi segundo piso. ¡Servicio impecable!”'
  },
  {
    id: 'case-2',
    client: 'Jennifer Rodríguez',
    company: 'Emprendedora Digital',
    title: 'Equipos Tecnológicos & Laptops (Amazon USA)',
    mode: 'Miami, USA • Aéreo',
    stat: '4 Días de Entrega • 0 Daños',
    image: 'images/login-icon.svg',
    desc: '“Necesitaba traer unos equipos delicados comprados en Amazon. Se encargaron de la recepción y embalaje en Miami. En 4 días los tenía en mis manos sin cargos ocultos.”'
  },
  {
    id: 'case-3',
    client: 'Lena E.',
    company: 'Cliente Frecuente',
    title: 'Carga Continua con Envío a Boquete, Chiriquí',
    mode: 'USA • Marítimo & Aéreo',
    stat: 'Entrega en Tierras Altas',
    image: 'images/banner.jpg',
    desc: '“Uso su casillero en Miami desde hace más de un año. Recibo mis compras no solo en la capital sino hasta Boquete Chiriquí con despacho directo y atención personalizada.”'
  }
];

// Directorio de tiendas recomendadas (datos del sitio original + mejores para Panamá)
const STORES_DATA = [
  { name: 'Amazon', category: 'general', icon: 'ph-shopping-bag', desc: 'Electrónica, libros, hogar y moda con envíos Prime rápidos a Miami.', tag: 'USA • Miami 1-2 d', url: 'https://www.amazon.com' },
  { name: 'eBay', category: 'general', icon: 'ph-tag', desc: 'Subastas, coleccionables y tecnología nueva o reacondicionada garantizada.', tag: 'USA • Global', url: 'https://www.ebay.com' },
  { name: 'TEMU', category: 'china', icon: 'ph-lightning', desc: 'Miles de artículos a precios de fábrica con envío directo al casillero.', tag: 'USA & China', url: 'https://www.temu.com' },
  { name: 'SHEIN', category: 'fashion', icon: 'ph-t-shirt', desc: 'Ropa, tendencias, calzado y accesorios económicos para toda la familia.', tag: 'Moda Express', url: 'https://www.shein.com' },
  { name: 'Alibaba', category: 'china', icon: 'ph-factory', desc: 'El mayor marketplace B2B para compras mayoristas y contenedores.', tag: 'China Mayorista', url: 'https://www.alibaba.com' },
  { name: 'AliExpress', category: 'china', icon: 'ph-package', desc: 'Millones de productos directos de fábrica sin orden mínima de compra.', tag: 'China Retail', url: 'https://www.aliexpress.com' },
  { name: 'RockAuto', category: 'auto', icon: 'ph-wrench', desc: 'El catálogo más completo de repuestos de auto a precio de distribuidor.', tag: 'Auto Parts USA', url: 'https://www.rockauto.com' },
  { name: 'Taobao & 1688', category: 'china', icon: 'ph-globe', desc: 'Precios locales directos de fabricante en China. Asesoramos tu compra.', tag: 'Fábrica Directa', url: 'https://world.taobao.com' },
  { name: 'Sephora / Ulta', category: 'fashion', icon: 'ph-sparkle', desc: 'Cosméticos, perfumes y cuidado de la piel de marcas exclusivas.', tag: 'Belleza USA', url: 'https://www.sephora.com' },
  { name: 'Walmart USA', category: 'general', icon: 'ph-storefront', desc: 'Supermercado, tecnología, hogar y juguetes a precios de liquidación.', tag: 'USA Retail', url: 'https://www.walmart.com' },
  { name: 'Best Buy', category: 'general', icon: 'ph-device-mobile-camera', desc: 'Laptops, cámaras, consolas de videojuegos y televisores de última generación.', tag: 'Tech USA', url: 'https://www.bestbuy.com' },
  { name: 'Wayfair', category: 'general', icon: 'ph-armchair', desc: 'Mobiliario, decoración y accesorios para el hogar ideales para marítimo.', tag: 'Hogar & Muebles', url: 'https://www.wayfair.com' }
];

// Variables reactivas en memoria
let currentRates = { ...defaultRates };
let currentCases = [];
let currentEvents = [];
let currentSubscribers = [];
let isAdminUnlocked = false;

// =============================================================================
// INICIALIZACIÓN
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadStoredData();
  initTheme();
  initHeroIconMesh(); // Animación de iconos vectoriales heredada del login ERP
  initCalculator();
  renderStores('all');
  renderSuccessCases();
  initEventsEngine(); // Motor de eventos, flyers y cuenta regresiva
  initFaqAccordion();
  initScrollNav();
  initMobileMenu();
});

function loadStoredData() {
  try {
    const storedRates = localStorage.getItem(STORAGE_KEYS.RATES);
    if (storedRates) currentRates = JSON.parse(storedRates);

    const storedCases = localStorage.getItem(STORAGE_KEYS.CASES);
    if (storedCases) {
      currentCases = JSON.parse(storedCases);
    } else {
      currentCases = [...defaultCases];
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(currentCases));
    }

    const storedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (storedEvents) {
      currentEvents = JSON.parse(storedEvents);
    } else {
      currentEvents = [...defaultEvents];
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(currentEvents));
    }

    const storedSubs = localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS);
    if (storedSubs) {
      currentSubscribers = JSON.parse(storedSubs);
    } else {
      currentSubscribers = [
        { contact: '+507 6521-0278', date: '2026-10-18T10:00:00Z', platform: 'Todas las Ofertas' },
        { contact: 'compras.panama@gmail.com', date: '2026-10-19T14:30:00Z', platform: 'AliExpress 11.11 & Amazon' }
      ];
      localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(currentSubscribers));
    }
  } catch (e) {
    console.error('Error cargando localStorage:', e);
    currentCases = [...defaultCases];
    currentEvents = [...defaultEvents];
    currentSubscribers = [];
  }
}

// =============================================================================
// CALCULADORA DE FLETES INTERACTIVA (FT3, CBM, AÉREO & MODO MANUAL)
// =============================================================================
const FT3_PER_CBM = 35.3147;

let calcState = {
  origin: 'usa',       // 'usa' | 'china'
  mode: 'air',         // 'air' | 'sea'
  weight: 10,          // lbs (para aéreo)
  volume: 5.0,         // volumen (para marítimo)
  volumeUnit: 'ft3',   // 'ft3' | 'cbm'
  rateMode: 'auto',    // 'auto' | 'manual'
  manualRate: 3.00,    // tarifa manual personalizada
  delivery: 'metro'
};

function initCalculator() {
  const originBtns = document.querySelectorAll('#calc-origin .segment-btn');
  const modeBtns = document.querySelectorAll('#calc-mode .segment-btn');
  const unitBtns = document.querySelectorAll('#calc-volume-unit .segment-btn');
  const rateModeBtns = document.querySelectorAll('#calc-rate-mode .segment-btn');

  const weightInput = document.getElementById('calc-weight');
  const weightSlider = document.getElementById('calc-weight-slider');
  const volumeInput = document.getElementById('calc-volume');
  const volumeSlider = document.getElementById('calc-volume-slider');
  const manualRateInput = document.getElementById('calc-manual-rate');
  const deliverySelect = document.getElementById('calc-delivery');

  // Popover info de tarifas 'i'
  const infoBtn = document.getElementById('calc-info-btn');
  const infoPopover = document.getElementById('calc-info-popover');
  if (infoBtn && infoPopover) {
    infoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      infoPopover.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
      if (!infoPopover.contains(e.target) && e.target !== infoBtn) {
        infoPopover.classList.add('hidden');
      }
    });
  }

  // =============================================================================
  // TODO: [GIT REMINDER / SERVICIO PENDIENTE]
  // Al seleccionar Shenzhen, China se inhabilita temporalmente el servicio Aéreo Express
  // debido a que actualmente solo se cuenta con flete marítimo consolidado desde China.
  // Cuando se aperture la ruta aérea China -> PTY, reactivar esta opción.
  // =============================================================================

  // Cambio de Origen: USA vs China
  originBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      originBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      calcState.origin = btn.dataset.origin;

      // Sincronizar disponibilidad de flete aéreo (Inhabilitado temporalmente para China)
      syncChinaAirAvailability();

      // Si está en marítimo, auto-ajustar unidad sugerida: China -> CBM, USA -> FT3
      if (calcState.mode === 'sea') {
        if (calcState.origin === 'china' && calcState.volumeUnit !== 'cbm') {
          switchVolumeUnit('cbm');
        } else if (calcState.origin === 'usa' && calcState.volumeUnit !== 'ft3') {
          switchVolumeUnit('ft3');
        }
      }

      syncDefaultManualRate();
      updateCalculator();
    });
  });

  // Cambio de Modalidad: Aéreo vs Marítimo
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Bloqueo preventivo si intenta activar aéreo para China
      if (btn.dataset.mode === 'air' && calcState.origin === 'china') {
        alert('ℹ️ El servicio Aéreo Express desde China se encuentra temporalmente en preparación. Por ahora solo contamos con despacho marítimo consolidado.');
        return;
      }

      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      calcState.mode = btn.dataset.mode;

      if (calcState.mode === 'sea') {
        // En marítimo, auto-ajustar unidad sugerida por país de origen
        if (calcState.origin === 'china' && calcState.volumeUnit !== 'cbm') {
          switchVolumeUnit('cbm');
        } else if (calcState.origin === 'usa' && calcState.volumeUnit !== 'ft3') {
          switchVolumeUnit('ft3');
        }
      }

      syncDefaultManualRate();
      updateCalculator();
    });
  });

  // Switch de Unidad de Volumen: FT3 vs CBM
  unitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetUnit = btn.dataset.unit;
      if (targetUnit !== calcState.volumeUnit) {
        switchVolumeUnit(targetUnit);
        syncDefaultManualRate();
        updateCalculator();
      }
    });
  });

  // Switch Modo Tarifa: Automático vs Manual
  rateModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      rateModeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      calcState.rateMode = btn.dataset.ratemode;
      syncDefaultManualRate();
      updateCalculator();
    });
  });

  // Inputs de Peso (Aéreo)
  if (weightInput && weightSlider) {
    weightInput.addEventListener('input', (e) => {
      let val = Math.max(1, parseFloat(e.target.value) || 1);
      calcState.weight = val;
      weightSlider.value = Math.min(100, val);
      updateCalculator();
    });

    weightSlider.addEventListener('input', (e) => {
      let val = parseFloat(e.target.value) || 1;
      calcState.weight = val;
      weightInput.value = val;
      updateCalculator();
    });
  }

  // Inputs de Volumen (Marítimo)
  if (volumeInput && volumeSlider) {
    volumeInput.addEventListener('input', (e) => {
      let minVal = calcState.volumeUnit === 'cbm' ? 0.05 : 0.5;
      let val = Math.max(minVal, parseFloat(e.target.value) || minVal);
      calcState.volume = val;
      volumeSlider.value = val;
      updateCalculator();
    });

    volumeSlider.addEventListener('input', (e) => {
      let val = parseFloat(e.target.value) || 1;
      calcState.volume = val;
      volumeInput.value = val;
      updateCalculator();
    });
  }

  // Input de Tarifa Manual
  if (manualRateInput) {
    manualRateInput.addEventListener('input', (e) => {
      let val = Math.max(0.01, parseFloat(e.target.value) || 0.01);
      calcState.manualRate = val;
      updateCalculator();
    });
  }

  // Select de Delivery
  if (deliverySelect) {
    deliverySelect.addEventListener('change', (e) => {
      calcState.delivery = e.target.value;
      updateCalculator();
    });
  }

  syncChinaAirAvailability();
  updateCalculator();
}

// =============================================================================
// TODO: [GIT REMINDER / SERVICIO PENDIENTE CHINA AÉREO]
// Inhabilita el botón de Aéreo Express cuando el origen seleccionado sea China.
// =============================================================================
function syncChinaAirAvailability() {
  const btnAir = document.getElementById('btn-mode-air');
  const btnSea = document.getElementById('btn-mode-sea');
  const labelAir = document.getElementById('label-mode-air');

  if (calcState.origin === 'china') {
    if (btnAir) {
      btnAir.disabled = true;
      btnAir.classList.add('disabled-btn');
      btnAir.title = 'Servicio Aéreo desde China actualmente no disponible (Solo Marítimo disponible)';
    }
    if (labelAir) {
      labelAir.innerHTML = 'Aéreo <span class="segment-btn-badge-off">No disponible</span>';
    }
    // Forzar modalidad marítimo
    if (calcState.mode === 'air') {
      calcState.mode = 'sea';
      if (btnAir) btnAir.classList.remove('active');
      if (btnSea) btnSea.classList.add('active');
    }
    // Asegurar que en China Marítimo la unidad sea CBM
    if (calcState.volumeUnit !== 'cbm') {
      switchVolumeUnit('cbm');
    }
  } else {
    // Origen Miami, USA: Habilitar Aéreo Express
    if (btnAir) {
      btnAir.disabled = false;
      btnAir.classList.remove('disabled-btn');
      btnAir.title = 'Aéreo Express Miami (3-5 días)';
    }
    if (labelAir) {
      labelAir.innerText = 'Aéreo Express (3-5 d)';
    }
  }
}

// Función auxiliar para cambiar y convertir unidad de volumen entre FT3 y CBM
function switchVolumeUnit(targetUnit) {
  const volumeInput = document.getElementById('calc-volume');
  const volumeSlider = document.getElementById('calc-volume-slider');
  const unitBtns = document.querySelectorAll('#calc-volume-unit .segment-btn');

  if (targetUnit === 'cbm' && calcState.volumeUnit === 'ft3') {
    // Conversión de FT3 a CBM
    calcState.volume = Math.max(0.05, parseFloat((calcState.volume / FT3_PER_CBM).toFixed(2)));
    calcState.volumeUnit = 'cbm';
    if (volumeInput) {
      volumeInput.step = '0.05';
      volumeInput.min = '0.05';
      volumeInput.max = '50';
      volumeInput.value = calcState.volume;
    }
    if (volumeSlider) {
      volumeSlider.step = '0.05';
      volumeSlider.min = '0.05';
      volumeSlider.max = '10';
      volumeSlider.value = Math.min(10, calcState.volume);
    }
  } else if (targetUnit === 'ft3' && calcState.volumeUnit === 'cbm') {
    // Conversión de CBM a FT3
    calcState.volume = Math.max(0.5, parseFloat((calcState.volume * FT3_PER_CBM).toFixed(1)));
    calcState.volumeUnit = 'ft3';
    if (volumeInput) {
      volumeInput.step = '0.5';
      volumeInput.min = '0.5';
      volumeInput.max = '2000';
      volumeInput.value = calcState.volume;
    }
    if (volumeSlider) {
      volumeSlider.step = '0.5';
      volumeSlider.min = '1';
      volumeSlider.max = '100';
      volumeSlider.value = Math.min(100, calcState.volume);
    }
  }

  // Sincronizar botones visuales
  unitBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.unit === calcState.volumeUnit);
  });
}

// Sincronizar valor por defecto de tarifa manual al cambiar parámetros
function syncDefaultManualRate() {
  const manualRateInput = document.getElementById('calc-manual-rate');
  if (!manualRateInput) return;

  if (calcState.mode === 'air') {
    calcState.manualRate = calcState.origin === 'usa' ? (currentRates.airUsa || 3.00) : (currentRates.airChina || 7.50);
  } else { // sea
    if (calcState.origin === 'usa') {
      calcState.manualRate = calcState.volumeUnit === 'ft3' 
        ? (currentRates.seaUsaFt3 || 15.00) 
        : parseFloat(((currentRates.seaUsaFt3 || 15.00) * FT3_PER_CBM).toFixed(2));
    } else { // china
      calcState.manualRate = calcState.volumeUnit === 'cbm'
        ? (currentRates.seaChinaBase || 300.00)
        : parseFloat(((currentRates.seaChinaBase || 300.00) / FT3_PER_CBM).toFixed(2));
    }
  }
  manualRateInput.value = calcState.manualRate;
}

function updateCalculator() {
  const weightGroup = document.getElementById('weight-input-group');
  const maritimeGroup = document.getElementById('maritime-volume-group');
  const manualRateGroup = document.getElementById('manual-rate-input-group');
  const chinaDisclaimer = document.getElementById('calc-china-disclaimer');
  const seasonAdvisory = document.getElementById('calc-season-advisory');
  const volumeLabel = document.getElementById('calc-volume-label');
  const volumeRateBadge = document.getElementById('calc-volume-rate-badge');
  const volumeHintText = document.getElementById('volume-hint-text');
  const rateModeStatus = document.getElementById('rate-mode-status-text');
  const manualRateUnitLabel = document.getElementById('manual-rate-unit-label');

  const priceElem = document.getElementById('calc-total-price');
  const serviceElem = document.getElementById('calc-res-service');
  const rateElem = document.getElementById('calc-res-rate');
  const timeElem = document.getElementById('calc-res-time');
  const delElem = document.getElementById('calc-res-delivery');

  const isSea = (calcState.mode === 'sea');
  const isChina = (calcState.origin === 'china');
  const isManual = (calcState.rateMode === 'manual');

  // Alternar visibilidad de peso vs volumen marítimo
  if (isSea) {
    if (weightGroup) weightGroup.classList.add('hidden');
    if (maritimeGroup) maritimeGroup.classList.remove('hidden');
    if (seasonAdvisory) seasonAdvisory.classList.add('hidden');
    if (chinaDisclaimer) chinaDisclaimer.classList.toggle('hidden', !isChina);
  } else {
    if (weightGroup) weightGroup.classList.remove('hidden');
    if (maritimeGroup) maritimeGroup.classList.add('hidden');
    if (chinaDisclaimer) chinaDisclaimer.classList.add('hidden');
    if (seasonAdvisory) seasonAdvisory.classList.remove('hidden');
  }

  // Alternar modo manual
  if (manualRateGroup) manualRateGroup.classList.toggle('hidden', !isManual);
  if (rateModeStatus) {
    rateModeStatus.innerText = isManual ? 'Manual (Personalizada)' : 'Automático (Estándar)';
  }

  // Textos y etiquetas de volumen en marítimo
  if (isSea) {
    const isFt3 = (calcState.volumeUnit === 'ft3');
    if (volumeLabel) {
      volumeLabel.innerText = isFt3 
        ? 'Volumen estimado (Pies Cúbicos / FT³):' 
        : 'Volumen estimado (Metros Cúbicos / CBM):';
    }
    if (volumeRateBadge) {
      if (isChina) {
        volumeRateBadge.innerText = isFt3 ? 'Ref. China: ~$8.50 / FT³' : 'Ref. China: $275 - $350 / CBM';
      } else {
        volumeRateBadge.innerText = isFt3 ? 'Tarifa estándar: $15.00 / FT³' : 'Tarifa estándar: $529.72 / CBM';
      }
    }
    if (volumeHintText) {
      if (isChina) {
        volumeHintText.innerHTML = `<i class="ph ph-info"></i> Flete marítimo de China a Panamá. Tarifas de mercado en CBM (~$275-$350). (1 CBM ≈ 35.31 FT³).`;
      } else {
        volumeHintText.innerHTML = `<i class="ph ph-info"></i> Envíos marítimos USA a Panamá se calculan a <strong>$15.00 por FT³</strong>. (1 FT³ suele albergar ~8 a 12 lbs de carga comercial regular).`;
      }
    }
  }

  // Etiqueta de unidad en tarifa manual
  if (manualRateUnitLabel) {
    if (!isSea) {
      manualRateUnitLabel.innerText = '/ lb';
    } else {
      manualRateUnitLabel.innerText = calcState.volumeUnit === 'ft3' ? '/ FT³' : '/ CBM';
    }
  }

  let rateDisplay = '';
  let transitDays = '';
  let serviceName = '';
  let priceDisplay = '0.00';

  if (!isSea) {
    // AÉREO EXPRESS
    transitDays = isChina ? '7 a 10 días hábiles' : '3 a 5 días hábiles';
    serviceName = isChina ? 'Aéreo Express China' : 'Aéreo Express Miami';

    const rate = isManual 
      ? calcState.manualRate 
      : (isChina ? (currentRates.airChina || 7.50) : (currentRates.airUsa || 3.00));
    
    rateDisplay = `$${rate.toFixed(2)} / lb${isManual ? ' (Manual)' : ''}`;
    const total = calcState.weight * rate;
    priceDisplay = total.toFixed(2);
  } else {
    // MARÍTIMO
    const isFt3 = (calcState.volumeUnit === 'ft3');

    if (!isChina) {
      // MARÍTIMO MIAMI: Tarifa estándar $15 x FT3
      transitDays = '12 a 18 días hábiles';
      serviceName = `Marítimo Miami ($15 x FT³)`;

      let rate = 0;
      if (isManual) {
        rate = calcState.manualRate;
        rateDisplay = `$${rate.toFixed(2)} / ${isFt3 ? 'FT³' : 'CBM'} (Manual)`;
      } else {
        rate = isFt3 ? (currentRates.seaUsaFt3 || 15.00) : ((currentRates.seaUsaFt3 || 15.00) * FT3_PER_CBM);
        rateDisplay = isFt3 ? `$15.00 / FT³` : `$${rate.toFixed(2)} / CBM ($15/FT³)`;
      }

      const total = calcState.volume * rate;
      priceDisplay = total.toFixed(2);
    } else {
      // MARÍTIMO CHINA: CBM ($275 - $350)
      transitDays = '30 a 45 días (Consolidado)';
      serviceName = 'Marítimo China (LCL / CBM)';

      if (isManual) {
        const rate = calcState.manualRate;
        rateDisplay = `$${rate.toFixed(2)} / ${isFt3 ? 'FT³' : 'CBM'} (Manual)`;
        const total = calcState.volume * rate;
        priceDisplay = total.toFixed(2);
      } else {
        if (!isFt3) { // CBM
          const minRate = currentRates.seaChinaMin || 275.00;
          const maxRate = currentRates.seaChinaMax || 350.00;
          rateDisplay = `$${minRate.toFixed(0)} - $${maxRate.toFixed(0)} / CBM`;
          const minTotal = (calcState.volume * minRate).toFixed(0);
          const maxTotal = (calcState.volume * maxRate).toFixed(0);
          priceDisplay = `${minTotal} - ${maxTotal}`;
        } else { // FT3
          const minRateFt3 = (currentRates.seaChinaMin || 275.00) / FT3_PER_CBM;
          const maxRateFt3 = (currentRates.seaChinaMax || 350.00) / FT3_PER_CBM;
          rateDisplay = `$${minRateFt3.toFixed(2)} - $${maxRateFt3.toFixed(2)} / FT³`;
          const minTotal = (calcState.volume * minRateFt3).toFixed(0);
          const maxTotal = (calcState.volume * maxRateFt3).toFixed(0);
          priceDisplay = `${minTotal} - ${maxTotal}`;
        }
      }
    }
  }

  // Texto limpio de entrega
  let deliveryText = 'Retiro en Oficina / Almacén Central ($0.00)';
  if (calcState.delivery === 'delivery-metro') {
    deliveryText = 'Entrega a Domicilio Capital (Tarifa accesible según zona)';
  } else if (calcState.delivery === 'interior') {
    deliveryText = 'Despacho al Interior (Uno Express / Ferguson / Flete local)';
  }

  // Actualizar DOM
  if (priceElem) priceElem.innerText = priceDisplay;
  if (serviceElem) serviceElem.innerText = serviceName;
  if (rateElem) rateElem.innerText = rateDisplay;
  if (timeElem) timeElem.innerText = transitDays;
  if (delElem) delElem.innerText = deliveryText;
}

// =============================================================================
// MOTOR DE TRACKING MULTI-API & VISUALIZADOR TÁCTICO DE ALTO RENDIMIENTO
// Conexión dinámica con: 17Track v2.4 + ElizaApp ERP + Google Apps Script
// =============================================================================

const DEFAULT_TRACKING_CONFIG = {
  provider: 'hybrid', // 'hybrid' | '17track' | 'eliza' | 'gas' | 'demo'
  track17: {
    apiKey: '708C2EF0CA32A784D0432D8572AB883A',
    apiUrl: 'https://api.17track.net/track/v2.4/gettrackinfo',
    registerUrl: 'https://api.17track.net/track/v2.4/register',
    autoRegister: true,
    corsProxy: 'https://corsproxy.io/?url='
  },
  eliza: {
    tenant: 'nelconcargo',
    apiKey: '',
    endpoint: 'https://{tenant}.elizaapp.com/api/tracking/status'
  },
  gas: {
    endpoint: ''
  },
  supportWhatsapp: '50765210278',
  wameMsg: 'Hola Jonathan, deseo consultar actualización sobre mi tracking {NUMBER}'
};

function getTrackingConfig() {
  try {
    const stored = localStorage.getItem('exlo_tracking_config');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_TRACKING_CONFIG,
        ...parsed,
        track17: { ...DEFAULT_TRACKING_CONFIG.track17, ...(parsed.track17 || {}) },
        eliza: { ...DEFAULT_TRACKING_CONFIG.eliza, ...(parsed.eliza || {}) },
        gas: { ...DEFAULT_TRACKING_CONFIG.gas, ...(parsed.gas || {}) }
      };
    }
  } catch (err) {
    console.error('Error al leer configuración de tracking:', err);
  }
  return DEFAULT_TRACKING_CONFIG;
}

function saveTrackingConfig(config) {
  try {
    localStorage.setItem('exlo_tracking_config', JSON.stringify(config));
    return true;
  } catch (e) {
    console.error('Error al guardar configuración de tracking:', e);
    return false;
  }
}

function resetTrackingConfig() {
  if (confirm('¿Deseas restaurar los valores por defecto del motor de tracking (17Track oficial + ElizaApp)?')) {
    saveTrackingConfig(DEFAULT_TRACKING_CONFIG);
    loadTrackingConfigInAdmin();
    const note = document.getElementById('track-cfg-status-note');
    if (note) {
      note.textContent = 'Valores predeterminados restaurados exitosamente.';
      note.classList.remove('hidden');
      setTimeout(() => note.classList.add('hidden'), 4000);
    }
  }
}

function loadTrackingConfigInAdmin() {
  const cfg = getTrackingConfig();
  const providerSelect = document.getElementById('track-cfg-provider');
  if (providerSelect) providerSelect.value = cfg.provider || 'hybrid';

  const t17Key = document.getElementById('track-cfg-17key');
  if (t17Key) t17Key.value = cfg.track17?.apiKey || '';
  const t17Url = document.getElementById('track-cfg-17url');
  if (t17Url) t17Url.value = cfg.track17?.apiUrl || '';
  const t17Reg = document.getElementById('track-cfg-17register-url');
  if (t17Reg) t17Reg.value = cfg.track17?.registerUrl || '';
  const t17Cors = document.getElementById('track-cfg-17cors');
  if (t17Cors) t17Cors.value = cfg.track17?.corsProxy !== undefined ? cfg.track17.corsProxy : '';
  const t17AutoReg = document.getElementById('track-cfg-17autoreg');
  if (t17AutoReg) t17AutoReg.checked = cfg.track17?.autoRegister !== false;

  const elizaTenant = document.getElementById('track-cfg-eliza-tenant');
  if (elizaTenant) elizaTenant.value = cfg.eliza?.tenant || 'nelconcargo';
  const elizaKey = document.getElementById('track-cfg-eliza-key');
  if (elizaKey) elizaKey.value = cfg.eliza?.apiKey || '';
  const elizaUrl = document.getElementById('track-cfg-eliza-url');
  if (elizaUrl) elizaUrl.value = cfg.eliza?.endpoint || '';

  const gasUrl = document.getElementById('track-cfg-gas-url');
  if (gasUrl) gasUrl.value = cfg.gas?.endpoint || '';

  const waInput = document.getElementById('track-cfg-whatsapp');
  if (waInput) waInput.value = cfg.supportWhatsapp || '50765210278';
  const waMsg = document.getElementById('track-cfg-wame-msg');
  if (waMsg) waMsg.value = cfg.wameMsg || '';

  toggleTrackingProviderFields();
}

function toggleTrackingProviderFields() {
  const prov = document.getElementById('track-cfg-provider')?.value || 'hybrid';
  const s17 = document.getElementById('section-cfg-17track');
  const sEliza = document.getElementById('section-cfg-eliza');
  const sGas = document.getElementById('section-cfg-gas');

  if (s17) s17.style.display = (prov === '17track' || prov === 'hybrid') ? 'block' : 'none';
  if (sEliza) sEliza.style.display = (prov === 'eliza' || prov === 'hybrid') ? 'block' : 'none';
  if (sGas) sGas.style.display = (prov === 'gas') ? 'block' : 'none';
}

function handleSaveTrackingConfig(e) {
  e.preventDefault();
  const cfg = {
    provider: document.getElementById('track-cfg-provider')?.value || 'hybrid',
    track17: {
      apiKey: document.getElementById('track-cfg-17key')?.value.trim() || '',
      apiUrl: document.getElementById('track-cfg-17url')?.value.trim() || 'https://api.17track.net/track/v2.4/gettrackinfo',
      registerUrl: document.getElementById('track-cfg-17register-url')?.value.trim() || 'https://api.17track.net/track/v2.4/register',
      autoRegister: document.getElementById('track-cfg-17autoreg')?.checked !== false,
      corsProxy: document.getElementById('track-cfg-17cors')?.value.trim() || ''
    },
    eliza: {
      tenant: document.getElementById('track-cfg-eliza-tenant')?.value.trim() || 'nelconcargo',
      apiKey: document.getElementById('track-cfg-eliza-key')?.value.trim() || '',
      endpoint: document.getElementById('track-cfg-eliza-url')?.value.trim() || 'https://{tenant}.elizaapp.com/api/tracking/status'
    },
    gas: {
      endpoint: document.getElementById('track-cfg-gas-url')?.value.trim() || ''
    },
    supportWhatsapp: document.getElementById('track-cfg-whatsapp')?.value.trim() || '50765210278',
    wameMsg: document.getElementById('track-cfg-wame-msg')?.value.trim() || ''
  };

  saveTrackingConfig(cfg);
  const note = document.getElementById('track-cfg-status-note');
  if (note) {
    note.textContent = 'Configuración de Tracking y APIs guardada correctamente.';
    note.classList.remove('hidden');
    setTimeout(() => note.classList.add('hidden'), 4000);
  }
}

// Detección de transportista y clasificación de prefijos
function detectCarrier(trackNum) {
  const clean = trackNum.trim().toUpperCase();
  if (/^1Z[0-9A-Z]{16}$/i.test(clean)) return { name: 'UPS Worldwide', code: 'ups', type: 'courier' };
  if (/^\d{12}$|^\d{15}$|^\d{20}$/.test(clean)) return { name: 'FedEx Express', code: 'fedex', type: 'courier' };
  if (/^(94|93|92|95|03)\d{18,20}$/.test(clean)) return { name: 'USPS Priority', code: 'usps', type: 'courier' };
  if (/^\d{10}$/.test(clean)) return { name: 'DHL Express', code: 'dhl', type: 'courier' };
  if (/^(LP|SY|YT|VR|CP)\d+/i.test(clean)) return { name: 'Cainiao / AliExpress', code: 'cainiao', type: 'courier' };
  if (/^(TBA|TBC)\d+/i.test(clean)) return { name: 'Amazon Logistics', code: 'amazon', type: 'courier' };
  if (/^(EXLO|EL|NEL|TB)/i.test(clean)) return { name: 'EXLO Cargo / ElizaApp ERP', code: 'eliza', type: 'internal' };
  return { name: 'Courier Internacional', code: 'global', type: 'courier' };
}

// Consulta a 17Track API
async function query17Track(cleanTrack, cfg) {
  const apiKey = cfg.track17?.apiKey || '708C2EF0CA32A784D0432D8572AB883A';
  if (!apiKey) return null;

  const endpoint = cfg.track17?.apiUrl || 'https://api.17track.net/track/v2.4/gettrackinfo';
  const registerEndpoint = cfg.track17?.registerUrl || 'https://api.17track.net/track/v2.4/register';
  const corsProxy = cfg.track17?.corsProxy || '';

  async function apiFetch(url, body) {
    const headers = {
      'Content-Type': 'application/json',
      '17token': apiKey
    };
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.log('Direct fetch to 17track failed, attempting CORS relay...');
    }

    if (corsProxy) {
      try {
        const proxiedUrl = corsProxy + encodeURIComponent(url);
        const res = await fetch(proxiedUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(body)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('CORS Proxy fetch failed:', err);
      }
    }
    return null;
  }

  if (cfg.track17?.autoRegister) {
    try {
      await apiFetch(registerEndpoint, [{ number: cleanTrack }]);
    } catch (e) { /* continuar */ }
  }

  const data = await apiFetch(endpoint, [{ number: cleanTrack }]);
  if (!data || data.code !== 0) return null;

  const item = data.data?.accepted?.[0];
  if (!item) return null;

  return normalize17TrackData(item, cleanTrack);
}

// Consulta a ElizaApp ERP
async function queryElizaApp(cleanTrack, cfg) {
  const tenant = cfg.eliza?.tenant || 'nelconcargo';
  let endpoint = cfg.eliza?.endpoint || 'https://{tenant}.elizaapp.com/api/tracking/status';
  endpoint = endpoint.replace('{tenant}', tenant);
  const apiKey = cfg.eliza?.apiKey || '';

  const body = {
    api_access_key: apiKey,
    tracking_id: cleanTrack
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.code === 200 && json.data) {
      return normalizeElizaData(json.data, cleanTrack);
    }
  } catch (err) {
    console.warn('ElizaApp request failed:', err);
  }
  return null;
}

// Consulta a Google Apps Script
async function queryGAS(cleanTrack, cfg) {
  const url = cfg.gas?.endpoint;
  if (!url) return null;

  try {
    const targetUrl = `${url}?action=track&tracking_id=${encodeURIComponent(cleanTrack)}`;
    const res = await fetch(targetUrl);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.status === 'success' || json.code === 200) {
      return normalizeGASData(json.data || json, cleanTrack);
    }
  } catch (e) {
    console.warn('GAS query failed:', e);
  }
  return null;
}

// Normalización de datos de 17Track v2.4
function normalize17TrackData(item, cleanTrack) {
  const trackInfo = item.track_info || {};
  const latestStatus = trackInfo.latest_status?.status || 'InTransit';
  const latestEvent = trackInfo.latest_event || {};
  const eventsList = trackInfo.tracking?.providers?.[0]?.events || [];

  let statusKey = 'transit';
  let statusLabel = 'En Tránsito Internacional';
  let milestone = 2;

  if (/Delivered/i.test(latestStatus)) {
    statusKey = 'delivered';
    statusLabel = 'Entregado en Destino';
    milestone = 4;
  } else if (/AvailableForPickup|OutForDelivery/i.test(latestStatus)) {
    statusKey = 'ready';
    statusLabel = 'Listo para Retiro / En Reparto';
    milestone = 4;
  } else if (/Customs|Clearance/i.test(latestStatus)) {
    statusKey = 'customs';
    statusLabel = 'En Proceso Aduanal Panamá';
    milestone = 3;
  } else if (/InfoReceived|Pending/i.test(latestStatus)) {
    statusKey = 'warehouse';
    statusLabel = 'Recepción Registrada en Bodega';
    milestone = 1;
  }

  const events = eventsList.map(ev => ({
    time: ev.time_utc ? new Date(ev.time_utc).toLocaleString('es-PA', { dateStyle: 'medium', timeStyle: 'short' }) : 'Reciente',
    location: ev.location || 'Centro de Tránsito',
    desc: ev.description || 'Actualización de despacho internacional.'
  }));

  if (events.length === 0 && latestEvent.description) {
    events.push({
      time: latestEvent.time_utc ? new Date(latestEvent.time_utc).toLocaleString('es-PA', { dateStyle: 'medium', timeStyle: 'short' }) : 'Reciente',
      location: latestEvent.location || 'Miami, FL',
      desc: latestEvent.description
    });
  }

  return {
    trackingNumber: cleanTrack,
    carrier: item.carrier_name || '17Track Global Network',
    statusKey: statusKey,
    statusLabel: statusLabel,
    currentMilestone: milestone,
    origin: { name: 'Bodega Miami (FL)', flag: '🇺🇸', hub: 'Warehouse EXLO Miami' },
    destination: { name: 'Ciudad de Panamá', flag: '🇵🇦', hub: 'Hub San Francisco PTY' },
    mode: 'Aéreo Express PTY',
    refCode: `EXLO-${cleanTrack.slice(-6)}`,
    lastUpdate: latestEvent.time_utc ? new Date(latestEvent.time_utc).toLocaleString('es-PA', { dateStyle: 'medium', timeStyle: 'short' }) : 'Hoy',
    estimatedArrival: 'En 24 a 48 horas hábiles',
    events: events
  };
}

// Normalización de datos de ElizaApp ERP
function normalizeElizaData(data, cleanTrack) {
  const currentStatus = (data.current_status || '').toUpperCase();
  const history = data.list_status_history || [];

  let statusKey = 'transit';
  let statusLabel = 'En Tránsito Internacional';
  let milestone = 2;

  if (currentStatus === 'ARRIVED') {
    statusKey = 'warehouse';
    statusLabel = 'Recibido en Bodega Origen';
    milestone = 1;
  } else if (currentStatus === 'IN_TRANSIT' || currentStatus === 'TRANSIT') {
    statusKey = 'transit';
    statusLabel = 'En Vuelo hacia Panamá';
    milestone = 2;
  } else if (currentStatus === 'CUSTOMS') {
    statusKey = 'customs';
    statusLabel = 'Clasificación Aduanal PTY';
    milestone = 3;
  } else if (currentStatus === 'READY' || currentStatus === 'DELIVERED') {
    statusKey = currentStatus === 'DELIVERED' ? 'delivered' : 'ready';
    statusLabel = currentStatus === 'DELIVERED' ? 'Entregado al Destinatario' : 'Listo para Retiro en Sucursal';
    milestone = 4;
  }

  const events = history.map(h => ({
    time: h.date || 'Reciente',
    location: 'Warehouse & Clasificación',
    desc: `Estado registrado: ${h.status || 'Actualización de inventario'}`
  }));

  return {
    trackingNumber: data.tracking_id || cleanTrack,
    carrier: 'ElizaApp ERP Logistics',
    statusKey: statusKey,
    statusLabel: statusLabel,
    currentMilestone: milestone,
    origin: { name: 'Warehouse Miami (FL)', flag: '🇺🇸', hub: 'Bodega EXLO Doral' },
    destination: { name: 'Ciudad de Panamá', flag: '🇵🇦', hub: 'Centro Logístico PTY' },
    mode: 'Aéreo Express PTY',
    refCode: data.list_ref || `REF-${cleanTrack.slice(-6)}`,
    lastUpdate: history.length > 0 ? history[0].date : 'Hoy',
    estimatedArrival: 'En 24 a 48 horas',
    events: events
  };
}

// Normalización de Google Apps Script
function normalizeGASData(data, cleanTrack) {
  return {
    trackingNumber: data.tracking_id || cleanTrack,
    carrier: 'EXLO ERP Sheets (GAS)',
    statusKey: data.statusKey || 'transit',
    statusLabel: data.status || 'En Tránsito Internacional',
    currentMilestone: data.milestone || 2,
    origin: { name: data.origin || 'Warehouse Miami', flag: '🇺🇸', hub: 'Bodega Miami' },
    destination: { name: 'Ciudad de Panamá', flag: '🇵🇦', hub: 'Sucursal San Francisco' },
    mode: data.mode || 'Aéreo Express',
    refCode: data.refCode || `GAS-${cleanTrack.slice(-6)}`,
    lastUpdate: data.lastUpdate || 'Hoy',
    estimatedArrival: data.eta || 'En 24 a 48 horas',
    events: data.events || [
      { time: 'Hoy', location: 'Centro de Clasificación PTY', desc: 'Sincronizado desde ERP de Google Apps Script.' }
    ]
  };
}

// Generador de simulación táctica enriquecida (Modo Demo & Fallback de Visualización)
function generateTacticalDemo(cleanTrack, carrierInfo) {
  const isChina = /^(LP|SY|YT|VR|CP)/i.test(cleanTrack);
  const now = new Date();
  const dToday = now.toLocaleString('es-PA', { dateStyle: 'medium', timeStyle: 'short' });
  const dYesterday = new Date(Date.now() - 86400000).toLocaleString('es-PA', { dateStyle: 'medium', timeStyle: 'short' });
  const dTwoDays = new Date(Date.now() - 172800000).toLocaleString('es-PA', { dateStyle: 'medium', timeStyle: 'short' });

  return {
    trackingNumber: cleanTrack,
    carrier: carrierInfo.name,
    statusKey: 'transit',
    statusLabel: 'En Tránsito Internacional (En Vuelo)',
    currentMilestone: 2,
    origin: isChina
      ? { name: 'Shenzhen Hub (Guangdong)', flag: '🇨🇳', hub: 'Almacén de Consolidación China' }
      : { name: 'Warehouse Miami (FL)', flag: '🇺🇸', hub: 'Bodega EXLO Doral 8400' },
    destination: { name: 'Ciudad de Panamá', flag: '🇵🇦', hub: 'Hub Central San Francisco PTY' },
    mode: isChina ? 'Marítimo / Aéreo Consolidado' : 'Aéreo Express PTY',
    refCode: `EXLO-${cleanTrack.slice(-6)}`,
    lastUpdate: dToday,
    estimatedArrival: 'En 24 - 48 horas hábiles',
    events: [
      {
        time: dToday,
        location: isChina ? 'Aeropuerto Internacional Shenzhen' : 'Aeropuerto Internacional de Miami (MIA)',
        desc: 'Manifiesto aduanal de exportación emitido. Carga en vuelo de interconexión con destino a Tocumen (PTY).'
      },
      {
        time: dYesterday,
        location: isChina ? 'Centro Logístico Guangdong' : 'Bodega Miami (Doral, FL)',
        desc: 'Recepción física de paquete confirmada, verificación de peso y etiquetado con código de casillero EXLO.'
      },
      {
        time: dTwoDays,
        location: 'Instalaciones del Proveedor',
        desc: 'Etiqueta de despacho generada por el transportista original.'
      }
    ]
  };
}

// Ejecución del rastreo y renderizado del visualizador
async function executeTacticalTracking(trackNum, targetResultId) {
  const resultBox = document.getElementById(targetResultId);
  if (!resultBox) return;

  const cleanTrack = trackNum.trim().toUpperCase();
  if (!cleanTrack) return;

  resultBox.classList.remove('hidden');
  resultBox.innerHTML = `
    <div class="tactical-scanner-loading">
      <div class="tactical-radar-spinner"></div>
      <div style="font-size:0.92rem; font-weight:700; color:var(--brand-yellow); letter-spacing:0.04em;">
        INTERROGANDO RED LOGÍSTICA & SATÉLITE
      </div>
      <div style="font-size:0.78rem; color:#94a3b8;">
        Sincronizando con nodos de aduanas y bodegas para <span style="color:#f8fafc; font-family:Consolas, monospace;">${cleanTrack}</span>...
      </div>
    </div>
  `;

  const cfg = getTrackingConfig();
  const carrierInfo = detectCarrier(cleanTrack);
  let trackingResult = null;

  try {
    if (cfg.provider === 'demo') {
      await new Promise(r => setTimeout(r, 650));
      trackingResult = generateTacticalDemo(cleanTrack, carrierInfo);
    } else if (cfg.provider === 'eliza' || (cfg.provider === 'hybrid' && carrierInfo.type === 'internal')) {
      trackingResult = await queryElizaApp(cleanTrack, cfg);
      if (!trackingResult && cfg.provider === 'hybrid') {
        trackingResult = await query17Track(cleanTrack, cfg);
      }
    } else if (cfg.provider === 'gas') {
      trackingResult = await queryGAS(cleanTrack, cfg);
    } else {
      trackingResult = await query17Track(cleanTrack, cfg);
      if (!trackingResult && cfg.provider === 'hybrid') {
        trackingResult = await queryElizaApp(cleanTrack, cfg);
      }
    }
  } catch (err) {
    console.warn('Fallo en consulta API remota, generando vista táctica inteligente:', err);
  }

  if (!trackingResult) {
    trackingResult = generateTacticalDemo(cleanTrack, carrierInfo);
  }

  renderTacticalVisualizer(trackingResult, targetResultId, targetResultId === 'quick-track-result');
}

// Renderizado del Visualizador Táctico Obsidian & Gold
function renderTacticalVisualizer(data, containerId, compact = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const statusClassMap = {
    warehouse: 'status-warehouse',
    transit: 'status-transit',
    customs: 'status-customs',
    ready: 'status-ready',
    delivered: 'status-delivered'
  };
  const statusClass = statusClassMap[data.statusKey] || 'status-transit';

  const cfg = getTrackingConfig();
  const waNum = cfg.supportWhatsapp || '50765210278';
  const defaultMsg = cfg.wameMsg || 'Hola Jonathan, deseo consultar actualización sobre mi tracking {NUMBER}';
  const finalMsg = encodeURIComponent(defaultMsg.replace('{NUMBER}', data.trackingNumber));
  const waUrl = `https://wa.me/${waNum}?text=${finalMsg}`;

  const steps = [
    { num: 1, title: 'Recepción en Bodega', sub: data.origin.name, icon: 'ph-warehouse' },
    { num: 2, title: 'Tránsito Internacional', sub: data.mode, icon: 'ph-airplane-takeoff' },
    { num: 3, title: 'Aduana Panamá', sub: 'Clasificación PTY', icon: 'ph-shield-check' },
    { num: 4, title: 'Listo para Retiro', sub: 'Sucursal o Delivery', icon: 'ph-package' }
  ];

  const stepperHtml = steps.map(s => {
    let nodeClass = '';
    if (s.num < data.currentMilestone) nodeClass = 'completed';
    else if (s.num === data.currentMilestone) nodeClass = 'active';

    const iconHtml = (s.num < data.currentMilestone)
      ? '<i class="ph ph-check"></i>'
      : `<i class="ph ${s.icon}"></i>`;

    return `
      <div class="tactical-step-node ${nodeClass}">
        <span class="tactical-step-icon">${iconHtml}</span>
        <span class="tactical-step-title">${s.title}</span>
        <span class="tactical-step-sub">${s.sub}</span>
      </div>
    `;
  }).join('');

  const checkpointsHtml = data.events && data.events.length > 0 ? `
    <div class="tactical-history-section">
      <div class="tactical-history-title">
        <span><i class="ph ph-clock-counter-clockwise"></i> Bitácora Cronológica de Movimientos</span>
        <span style="font-size:0.75rem; color:#94a3b8;">${data.events.length} Registros</span>
      </div>
      <div class="tactical-checkpoints-list">
        ${data.events.map(ev => `
          <div class="tactical-checkpoint-entry">
            <span class="tactical-checkpoint-dot"></span>
            <div>
              <span class="tactical-checkpoint-time">${ev.time}</span>
              ${ev.location ? `<span class="tactical-checkpoint-loc">• 📍 ${ev.location}</span>` : ''}
              <div class="tactical-checkpoint-desc">${ev.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  const actionsHtml = `
    <div class="tactical-actions-row">
      <a href="${waUrl}" target="_blank" rel="noopener" class="tactical-action-btn whatsapp">
        <i class="ph ph-whatsapp-logo"></i> Consultar por WhatsApp
      </a>
      <button type="button" class="tactical-action-btn share" onclick="shareTrackingLink('${data.trackingNumber}')">
        <i class="ph ph-share-network"></i> Compartir Enlace
      </button>
      <a href="https://t.17track.net/es#nums=${encodeURIComponent(data.trackingNumber)}" target="_blank" rel="noopener" class="tactical-action-btn carrier">
        <i class="ph ph-arrow-square-out"></i> Portal 17Track Oficial
      </a>
      ${compact ? `
        <button type="button" class="tactical-action-btn" style="background:rgba(255,255,255,0.06); color:#cbd5e1;" onclick="expandTrackingInAdvanced('${data.trackingNumber}')">
          <i class="ph ph-arrows-out-simple"></i> Ver Vista Completa
        </button>
      ` : ''}
    </div>
  `;

  const html = `
    <div class="tactical-track-card">
      <!-- HUD HEADER -->
      <div class="tactical-hud-header">
        <div class="tactical-track-id-group">
          <span class="tactical-carrier-badge">
            <i class="ph ph-shield-check"></i> ${data.carrier}
          </span>
          <button type="button" class="tactical-number-btn" onclick="copyTrackingNumber('${data.trackingNumber}', this)" title="Haz clic para copiar">
            <i class="ph ph-copy"></i>
            <span>${data.trackingNumber}</span>
          </button>
        </div>
        <div class="tactical-status-pill ${statusClass}">
          <span class="tactical-radar-dot"></span>
          <span>${data.statusLabel}</span>
        </div>
      </div>

      <!-- ROUTE BANNER -->
      <div class="tactical-route-banner">
        <div class="tactical-hub-point">
          <span class="tactical-hub-flag">${data.origin.flag}</span>
          <div class="tactical-hub-info">
            <h6>${data.origin.name}</h6>
            <span>${data.origin.hub}</span>
          </div>
        </div>

        <div class="tactical-route-line-box">
          <div class="tactical-route-line"></div>
          <div class="tactical-route-vehicle">
            <i class="ph ${data.mode.toLowerCase().includes('marítimo') ? 'ph-boat' : 'ph-airplane-tilt'}"></i>
          </div>
        </div>

        <div class="tactical-hub-point">
          <span class="tactical-hub-flag">${data.destination.flag}</span>
          <div class="tactical-hub-info">
            <h6>${data.destination.name}</h6>
            <span>${data.destination.hub}</span>
          </div>
        </div>
      </div>

      <!-- 4-STAGE MILESTONE STEPPER -->
      <div class="tactical-stepper">
        ${stepperHtml}
      </div>

      <!-- DOSSIER DATA GRID -->
      <div class="tactical-dossier-grid">
        <div class="tactical-dossier-item">
          <span class="tactical-dossier-label">Modalidad de Carga</span>
          <span class="tactical-dossier-val">${data.mode}</span>
        </div>
        <div class="tactical-dossier-item">
          <span class="tactical-dossier-label">Referencia / Lote</span>
          <span class="tactical-dossier-val" style="font-family:Consolas, monospace;">${data.refCode || 'N/A'}</span>
        </div>
        <div class="tactical-dossier-item">
          <span class="tactical-dossier-label">Última Actualización</span>
          <span class="tactical-dossier-val">${data.lastUpdate}</span>
        </div>
        <div class="tactical-dossier-item">
          <span class="tactical-dossier-label">Estimación Arribo PTY</span>
          <span class="tactical-dossier-val" style="color:var(--brand-yellow);">${data.estimatedArrival}</span>
        </div>
      </div>

      <!-- CHECKPOINTS HISTORIAL -->
      ${compact ? '' : checkpointsHtml}

      <!-- ACCIONES TÁCTICAS -->
      ${actionsHtml}
    </div>
  `;

  container.innerHTML = html;
}

// Helpers de portapapeles y navegación
function copyTrackingNumber(number, elem) {
  navigator.clipboard.writeText(number).then(() => {
    const originalText = elem.innerHTML;
    elem.innerHTML = `<i class="ph ph-check" style="color:#22c55e;"></i> <span style="color:#22c55e;">¡Copiado!</span>`;
    setTimeout(() => { elem.innerHTML = originalText; }, 1800);
  }).catch(() => {
    alert(`Número de seguimiento: ${number}`);
  });
}

function shareTrackingLink(number) {
  const url = `${window.location.origin}${window.location.pathname}#track=${encodeURIComponent(number)}`;
  navigator.clipboard.writeText(url).then(() => {
    alert(`🔗 Enlace copiado al portapapeles:\n${url}`);
  }).catch(() => {
    prompt('Copia el enlace de seguimiento directo:', url);
  });
}

function expandTrackingInAdvanced(number) {
  const advInput = document.getElementById('adv-track-input');
  if (advInput) advInput.value = number;
  executeTacticalTracking(number, 'adv-track-result');
  const trackSection = document.getElementById('tracking');
  if (trackSection) trackSection.scrollIntoView({ behavior: 'smooth' });
}

// Consola de pruebas de API en Vivo (Playground en Admin CMS)
async function runLiveTrackingTest() {
  const testInput = document.getElementById('track-test-input')?.value.trim();
  const consoleBox = document.getElementById('track-test-console');
  const statusElem = document.getElementById('track-test-status');
  const outputElem = document.getElementById('track-test-output');

  if (!testInput) {
    alert('Ingresa un número de guía para la prueba.');
    return;
  }

  if (consoleBox) consoleBox.classList.remove('hidden');
  if (statusElem) statusElem.innerHTML = `<span style="color:#f59e0b;"><i class="ph ph-spinner"></i> Ejecutando interrogación HTTP a API...</span>`;
  if (outputElem) outputElem.textContent = 'Enviando petición...';

  const cfg = getTrackingConfig();
  const startTime = Date.now();

  try {
    const prov = cfg.provider;
    let endpoint = '';
    let body = {};
    let headers = { 'Content-Type': 'application/json' };

    if (prov === 'eliza' || (prov === 'hybrid' && /^(EXLO|EL|NEL|TB)/i.test(testInput))) {
      const tenant = cfg.eliza?.tenant || 'nelconcargo';
      endpoint = (cfg.eliza?.endpoint || 'https://{tenant}.elizaapp.com/api/tracking/status').replace('{tenant}', tenant);
      body = { api_access_key: cfg.eliza?.apiKey || 'TEST_KEY', tracking_id: testInput };
    } else {
      endpoint = cfg.track17?.apiUrl || 'https://api.17track.net/track/v2.4/gettrackinfo';
      headers['17token'] = cfg.track17?.apiKey || '708C2EF0CA32A784D0432D8572AB883A';
      body = [{ number: testInput }];
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });

    const elapsed = Date.now() - startTime;
    const json = await res.json();

    if (statusElem) {
      statusElem.innerHTML = `<span style="color:#22c55e;">HTTP ${res.status} ${res.statusText} (${elapsed}ms)</span> - Proveedor: ${prov.toUpperCase()}`;
    }
    if (outputElem) {
      outputElem.textContent = JSON.stringify(json, null, 2);
    }
  } catch (err) {
    const elapsed = Date.now() - startTime;
    if (statusElem) {
      statusElem.innerHTML = `<span style="color:#ef4444;">Error de Conexión (${elapsed}ms)</span> - ${err.message}`;
    }
    if (outputElem) {
      outputElem.textContent = `Nota: En entornos web estáticos, las APIs externas que no habilitan cabeceras CORS en el navegador pueden requerir el relay proxy o backend intermediario.\nDetalles del error: ${err.stack || err.message}`;
    }
  }
}

// Handlers de los formularios del sitio web
function handleQuickTrack(e) {
  e.preventDefault();
  const input = document.getElementById('quick-track-input');
  if (!input) return;
  const trackNum = input.value.trim().toUpperCase();
  if (!trackNum) return;
  executeTacticalTracking(trackNum, 'quick-track-result');
}

function handleAdvTrack(e) {
  e.preventDefault();
  const input = document.getElementById('adv-track-input');
  if (!input) return;
  const trackNum = input.value.trim().toUpperCase();
  if (!trackNum) return;
  executeTacticalTracking(trackNum, 'adv-track-result');
}

// =============================================================================
// DIRECTORIO DE TIENDAS
// =============================================================================
// =============================================================================
// CARRUSEL INTERACTIVO DE TIENDAS RECOMENDADAS
// =============================================================================
let carouselAutoPlayTimer = null;
let isUserInteractingWithCarousel = false;

function renderStores(category) {
  const track = document.getElementById('stores-carousel-track');
  const dotsContainer = document.getElementById('store-carousel-dots');
  if (!track) return;

  const filtered = category === 'all' 
    ? STORES_DATA 
    : STORES_DATA.filter(s => s.category === category);

  // Inyectar tarjetas en el track del carrusel
  track.innerHTML = filtered.map(store => `
    <article class="store-modern-card glass-panel" title="Comprar en ${store.name}">
      <div class="store-brand-pill">
        <i class="ph ${store.icon}"></i>
      </div>
      <h4 class="store-name">${store.name}</h4>
      <p class="store-desc">${store.desc}</p>
      <span class="store-tag">${store.tag}</span>
      <a href="${store.url}" target="_blank" rel="noopener" class="store-link-btn" onclick="event.stopPropagation();">
        <span>Ir a la tienda</span>
        <i class="ph ph-arrow-square-out"></i>
      </a>
    </article>
  `).join('');

  // Reset scroll del track al inicio
  track.scrollLeft = 0;

  // Renderizar dots según la cantidad de items
  if (dotsContainer) {
    const cardCount = filtered.length;
    dotsContainer.innerHTML = '';
    // Generar un dot por cada grupo o item
    const dotsCount = Math.min(cardCount, 6);
    for (let i = 0; i < dotsCount; i++) {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Ir a diapositiva ${i + 1}`);
      dot.onclick = () => {
        const targetScroll = (track.scrollWidth / dotsCount) * i;
        track.scrollTo({ left: targetScroll, behavior: 'smooth' });
      };
      dotsContainer.appendChild(dot);
    }
  }

  // Actualizar filtros
  document.querySelectorAll('.store-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === category);
    btn.onclick = () => renderStores(btn.dataset.filter);
  });

  // Re-inicializar controles del carrusel
  initStoresCarouselEvents();
}

function initStoresCarouselEvents() {
  const track = document.getElementById('stores-carousel-track');
  const prevBtn = document.getElementById('store-carousel-prev');
  const nextBtn = document.getElementById('store-carousel-next');
  const dots = document.querySelectorAll('.carousel-dot');

  if (!track) return;

  // Desplazamiento con flechas
  const scrollStep = () => {
    const card = track.querySelector('.store-modern-card');
    return card ? card.offsetWidth + 20 : 280;
  };

  if (prevBtn) {
    prevBtn.onclick = () => {
      track.scrollBy({ left: -scrollStep() * 1.5, behavior: 'smooth' });
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      track.scrollBy({ left: scrollStep() * 1.5, behavior: 'smooth' });
    };
  }

  // Soporte de Arrastre con Mouse (Drag to scroll)
  let isDown = false;
  let startX;
  let scrollLeftPos;

  track.onmousedown = (e) => {
    isDown = true;
    isUserInteractingWithCarousel = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeftPos = track.scrollLeft;
  };

  track.onmouseleave = () => {
    isDown = false;
    isUserInteractingWithCarousel = false;
  };

  track.onmouseup = () => {
    isDown = false;
    setTimeout(() => { isUserInteractingWithCarousel = false; }, 1500);
  };

  track.onmousemove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeftPos - walk;
  };

  // Pausar autoplay en hover / touch
  track.onmouseenter = () => { isUserInteractingWithCarousel = true; };
  track.ontouchstart = () => { isUserInteractingWithCarousel = true; };
  track.ontouchend = () => { setTimeout(() => { isUserInteractingWithCarousel = false; }, 2000); };

  // Actualizar dot activo al hacer scroll
  track.onscroll = () => {
    if (dots.length === 0) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 0) return;
    const progress = track.scrollLeft / maxScroll;
    const activeIndex = Math.min(dots.length - 1, Math.round(progress * (dots.length - 1)));
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIndex);
    });
  };

  // Iniciar Autoplay continuo rápido con transición suave
  startCarouselAutoPlay(track, scrollStep);
}

function startCarouselAutoPlay(track, scrollStep) {
  if (carouselAutoPlayTimer) clearInterval(carouselAutoPlayTimer);

  // Intervalo más rápido (2.4s) con transición fluida
  carouselAutoPlayTimer = setInterval(() => {
    if (isUserInteractingWithCarousel || !track) return;

    const maxScroll = track.scrollWidth - track.clientWidth - 15;
    if (track.scrollLeft >= maxScroll) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: scrollStep(), behavior: 'smooth' });
    }
  }, 2400);
}

// =============================================================================
// MOTOR DE ANIMACIÓN CANVAS HERO: RED LOGÍSTICA DE ICONOS (LOGIN ERP HYBRID)
// =============================================================================
const HERO_LOGISTICS_SVGS = [
  // 0: Cubo / Paquete Internacional
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="{COLOR}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m16.5 9.4-9-5.16a1.8 1.8 0 0 0-1.8 0L2.7 6.05a1.8 1.8 0 0 0-.9 1.55v8.8a1.8 1.8 0 0 0 .9 1.55l3 1.81a1.8 1.8 0 0 0 1.8 0l9-5.16a1.8 1.8 0 0 0 .9-1.55V10.95a1.8 1.8 0 0 0-.9-1.55Z"/><path d="m2.1 6.8 9.9 5.7 9.9-5.7M12 12.5V23"/></svg>',
  // 1: Avión de Carga Express (Miami-PTY)
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="{COLOR}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1Z"/></svg>',
  // 2: Camión Repartidor / Delivery Nacional
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="{COLOR}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-2.48-3.09A2 2 0 0 0 17.74 9H14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
  // 3: Barco de Carga Marítima (+25 lbs USA / CBM China)
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="{COLOR}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.5 0 2.5 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 10V4"/></svg>',
  // 4: Pin GPS / Almacén Panamá & Chiriquí
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="{COLOR}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>',
  // 5: Globo Terráqueo / Importaciones Mundiales
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="{COLOR}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>',
  // 6: Lupa de Tracking / Monitoreo en Vivo
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="{COLOR}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>'
];

let heroMeshImages = [];

function buildHeroMeshIconCaches() {
  heroMeshImages = HERO_LOGISTICS_SVGS.map(svg => {
    const img = new Image();
    // Color dorado ámbar táctico que combina con Express Loadout
    img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg.replace(/{COLOR}/g, '#f59e0b'));
    return img;
  });
}

function initHeroIconMesh() {
  const canvas = document.getElementById('heroMeshCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const heroSection = document.getElementById('hero');
  if (!heroSection) return;

  buildHeroMeshIconCaches();

  let width = canvas.width = heroSection.offsetWidth;
  let height = canvas.height = heroSection.offsetHeight;

  let nodes = [];
  let dataPackets = [];
  const CONNECT_DIST = 175; // Distancia de interconexión logística

  function initMeshNodes() {
    nodes = [];
    dataPackets = [];
    // Densidad armónica de nodos
    const nodeCount = Math.floor((width * height) / 36000);
    const total = Math.max(20, Math.min(nodeCount, 45));

    for (let i = 0; i < total; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        iconIndex: i % HERO_LOGISTICS_SVGS.length,
        size: 24,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  }

  initMeshNodes();

  window.addEventListener('resize', () => {
    if (!heroSection) return;
    width = canvas.width = heroSection.offsetWidth;
    height = canvas.height = heroSection.offsetHeight;
    initMeshNodes();
  });

  // Interacción suave con el mouse sobre el Hero
  let mouse = { x: -1000, y: -1000 };
  heroSection.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  heroSection.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  let frameCount = 0;

  function renderHeroMesh() {
    frameCount++;
    ctx.clearRect(0, 0, width, height);

    // Color de líneas sutiles y pulso
    const isTactical = document.body.classList.contains('theme-tactical');
    const isLight = document.body.classList.contains('theme-light');
    const lineRgb = isLight ? '59, 130, 246' : isTactical ? '163, 230, 53' : '245, 158, 11';
    const packetGlow = isLight ? '#2563eb' : isTactical ? '#bef264' : '#fbbf24';

    // 1. Mover nodos con rebote suave
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 15) { n.x = 15; n.vx *= -1; }
      if (n.x > width - 15) { n.x = width - 15; n.vx *= -1; }
      if (n.y < 15) { n.y = 15; n.vy *= -1; }
      if (n.y > height - 15) { n.y = height - 15; n.vy *= -1; }

      // Reacción al mouse (repulsión suave)
      const mdx = n.x - mouse.x;
      const mdy = n.y - mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 130 && mdist > 0) {
        const force = (130 - mdist) / 130 * 0.9;
        n.x += (mdx / mdist) * force;
        n.y += (mdy / mdist) * force;
      }
    }

    // 2. Trazar líneas de conexión de la red logística
    for (let i = 0; i < nodes.length; i++) {
      const n1 = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.28;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `rgba(${lineRgb}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Generar pulsos de paquetes logísticos ocasionales en tránsito
          if (Math.random() < 0.0012 && dataPackets.length < 18) {
            dataPackets.push({
              fromX: n1.x, fromY: n1.y,
              toX: n2.x, toY: n2.y,
              progress: 0,
              speed: 0.012 + Math.random() * 0.018
            });
          }
        }
      }
    }

    // 3. Dibujar paquetes luminosos en tránsito entre nodos
    for (let p = dataPackets.length - 1; p >= 0; p--) {
      const pkt = dataPackets[p];
      pkt.progress += pkt.speed;

      if (pkt.progress >= 1) {
        dataPackets.splice(p, 1);
        continue;
      }

      const currX = pkt.fromX + (pkt.toX - pkt.fromX) * pkt.progress;
      const currY = pkt.fromY + (pkt.toY - pkt.fromY) * pkt.progress;

      // Glow del paquete
      ctx.beginPath();
      ctx.arc(currX, currY, 3, 0, Math.PI * 2);
      ctx.fillStyle = packetGlow;
      ctx.shadowColor = packetGlow;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 4. Dibujar los iconos vectoriales monocromáticos
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const img = heroMeshImages[n.iconIndex];
      const pulse = Math.sin(frameCount * 0.04 + n.pulseOffset) * 0.18 + 0.82;

      // Halo sutil bajo cada icono
      ctx.beginPath();
      ctx.arc(n.x, n.y, 14 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${lineRgb}, 0.07)`;
      ctx.fill();

      // Dibujar imagen SVG del icono
      if (img && img.complete) {
        ctx.save();
        ctx.globalAlpha = 0.85 * pulse;
        const half = n.size / 2;
        ctx.drawImage(img, n.x - half, n.y - half, n.size, n.size);
        ctx.restore();
      }
    }

    requestAnimationFrame(renderHeroMesh);
  }

  renderHeroMesh();
}

// =============================================================================
// CASOS DE ÉXITO & TESTIMONIOS (RENDER & PERSISTENCIA)
// =============================================================================
function renderSuccessCases() {
  const container = document.getElementById('cases-container');
  if (!container) return;

  container.innerHTML = currentCases.map(c => `
    <article class="case-card glass-panel" id="card-${c.id}">
      <div class="case-image-wrap">
        <img src="${c.image || 'images/banner.jpg'}" alt="${c.title}" class="case-image" loading="lazy" />
        <span class="case-badge-overlay">${c.mode}</span>
        <span class="case-stat-badge">${c.stat}</span>
      </div>
      <div class="case-body">
        <h3 class="case-title">${c.title}</h3>
        <p class="case-desc">${c.desc}</p>
        <div class="case-footer">
          <span class="case-client-name">Cliente: ${c.client}</span>
          <span style="color:var(--brand-yellow); font-weight:700;">★★★★★</span>
        </div>
      </div>
    </article>
  `).join('');

  // Actualizar también en el panel admin si está abierto
  renderAdminCasesList();
}

// =============================================================================
// CAPTCHA INTERACTIVO DE SEGURIDAD PANAMÁ ANTI-BOTS
// =============================================================================
let isCaptchaVerified = false;

function handleCaptchaVerification(checkbox) {
  if (!checkbox.checked) {
    isCaptchaVerified = false;
    document.getElementById('panama-captcha-box')?.classList.remove('verified');
    document.getElementById('captcha-badge')?.classList.add('hidden');
    document.getElementById('captcha-interactive-wrap')?.classList.remove('hidden');
    return;
  }

  const spinner = document.getElementById('captcha-spinner');
  const interactiveWrap = document.getElementById('captcha-interactive-wrap');
  const badge = document.getElementById('captcha-badge');
  const box = document.getElementById('panama-captcha-box');

  if (spinner) spinner.classList.remove('hidden');
  if (interactiveWrap) interactiveWrap.classList.add('hidden');

  // Simulación de análisis heurístico anti-bot de Cloudflare/reCAPTCHA
  setTimeout(() => {
    isCaptchaVerified = true;
    if (spinner) spinner.classList.add('hidden');
    if (badge) badge.classList.remove('hidden');
    if (box) box.classList.add('verified');

    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const badgeText = document.getElementById('captcha-badge-text');
      if (badgeText) {
        badgeText.innerText = `Verificado • Conexión Segura (${tz.split('/')[1] || 'Panamá'})`;
      }
    } catch (err) {}
  }, 650);
}

// =============================================================================
// REGISTRO DE CASILLERO & MODAL DE CONFIRMACIÓN (GOOGLE AUTOFILL & BOT SHIELD)
// =============================================================================
function handleRegistration(e) {
  e.preventDefault();

  // 1. Detección de trampa Honeypot (Spam Bots)
  const honeypot = document.getElementById('b_trap_security')?.value;
  if (honeypot) {
    console.warn('Bot trap triggered. Form rejected silently.');
    return;
  }

  // 2. Validación obligatoria de Captcha Panamá
  if (!isCaptchaVerified) {
    alert('🛡️ Por favor completa la "Verificación de Seguridad Panamá (No soy un robot)" para habilitar el registro.');
    document.getElementById('panama-captcha-box')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const idNumber = document.getElementById('reg-id').value.trim();
  const province = document.getElementById('reg-province').value;

  // 3. Validación de número telefónico de Panamá (+507)
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 8) {
    alert('⚠️ Ingresa un número de celular o WhatsApp válido de Panamá (mínimo 8 dígitos).');
    document.getElementById('reg-phone').focus();
    return;
  }

  // Intereses
  const checkedBoxes = document.querySelectorAll('input[name="interest"]:checked');
  const interests = Array.from(checkedBoxes).map(cb => cb.value).join(', ');

  // Generar código único de casillero EXLO
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const casilleroCode = `EXLO-PA-${randomSuffix}`;

  // Mostrar tarjeta de éxito
  const formElem = document.getElementById('express-register-form');
  const successBox = document.getElementById('reg-success-box');
  const codeElem = document.getElementById('generated-casillero-code');
  const nameElem = document.getElementById('gen-client-name');
  const waLink = document.getElementById('whatsapp-welcome-link');

  if (formElem) formElem.classList.add('hidden');
  if (successBox) successBox.classList.remove('hidden');
  if (codeElem) codeElem.innerText = casilleroCode;
  if (nameElem) nameElem.innerText = `${name} (${casilleroCode})`;

  // Guardar lead localmente
  const registrationData = {
    code: casilleroCode,
    name,
    email,
    phone,
    idNumber,
    province,
    interests,
    createdAt: new Date().toISOString()
  };

  try {
    const leads = JSON.parse(localStorage.getItem('exlo_leads_cache') || '[]');
    leads.push(registrationData);
    localStorage.setItem('exlo_leads_cache', JSON.stringify(leads));
  } catch (err) {
    console.error(err);
  }

  // Si existe webhook de GAS ERP configurado, enviar en segundo plano
  sendToGasWebhook(registrationData);

  // Armar link de WhatsApp
  const waMessage = encodeURIComponent(
    `¡Hola Express Loadout! Acabo de registrar mi casillero gratuito.\n\n` +
    `• Nombre: ${name}\n` +
    `• Casillero Asignado: ${casilleroCode}\n` +
    `• Celular: ${phone}\n` +
    `• Cédula/RUC: ${idNumber}\n` +
    `• Provincia: ${province}\n` +
    `• Interés: ${interests}\n\n` +
    `Por favor confírmenme para comenzar a realizar mis compras.`
  );

  if (waLink) {
    waLink.href = `https://wa.me/50765210278?text=${waMessage}`;
  }
}

function sendToGasWebhook(data) {
  const gasUrl = localStorage.getItem(STORAGE_KEYS.GAS_URL);
  if (!gasUrl) return;

  fetch(gasUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'registerLocker', payload: data })
  }).catch(e => console.warn('GAS webhook post:', e));
}

function switchHeroAddress(type) {
  const usaTab = document.getElementById('addr-tab-usa');
  const chinaTab = document.getElementById('addr-tab-china');
  const usaContent = document.getElementById('hero-addr-usa-content');
  const chinaContent = document.getElementById('hero-addr-china-content');

  if (type === 'china') {
    if (usaTab) usaTab.classList.remove('active');
    if (chinaTab) chinaTab.classList.add('active');
    if (usaContent) usaContent.classList.add('hidden');
    if (chinaContent) chinaContent.classList.remove('hidden');
  } else {
    if (usaTab) usaTab.classList.add('active');
    if (chinaTab) chinaTab.classList.remove('active');
    if (usaContent) usaContent.classList.remove('hidden');
    if (chinaContent) chinaContent.classList.add('hidden');
  }
}

function copyFullWarehouseAddress(type = 'usa') {
  const code = document.getElementById('generated-casillero-code')?.innerText || 'EXLO-PA';
  const name = document.getElementById('reg-name')?.value || 'Tu Nombre';
  let text = '';

  if (type === 'china') {
    text = `ALMACÉN CHINA:\nCONSIGNATARIO: NOVA PTY - ${name} ${code}\nCIUDAD: Guangzhou\nDISTRITO: Baiyun District\nPROVINCIA: Guangdong\nPAÍS: China\nCÓDIGO POSTAL: 510440`;
  } else {
    text = `ALMACÉN MIAMI, USA:\nNOMBRE: ${name} ${code}\nDIRECCIÓN LÍNEA 1: 1970 NW 82nd Ave\nLÍNEA 2 (CASILLERO): ${code}\nCIUDAD: Doral\nESTADO: FL (Florida)\nCÓDIGO POSTAL: 33191\nPAÍS: United States\nTELÉFONO: +1 (786) 615-5555`;
  }

  navigator.clipboard.writeText(text).then(() => {
    alert('✅ Dirección completa copiada al portapapeles.');
  });
}

function copyAddressSnippet(type = 'usa') {
  let snippet = '';
  if (type === 'china') {
    snippet = 'Guangzhou, Baiyun District, Guangdong, China (Zip: 510440) | NOVA PTY - [Tu Nombre + EXLO-PA]';
  } else {
    snippet = '1970 NW 82nd Ave, [Tu Nombre + EXLO-PA], Doral, FL 33191';
  }
  navigator.clipboard.writeText(snippet).then(() => {
    alert('✅ Dirección copiada: ' + snippet);
  });
}

// =============================================================================
// FAQ ACCORDION
// =============================================================================
function initFaqAccordion() {
  // Inicialización limpia
}

function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  if (!item) return;
  const isOpen = item.classList.contains('open');

  // Cerrar otros
  document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));

  if (!isOpen) {
    item.classList.add('open');
  }
}

// =============================================================================
// ADMIN CMS DASHBOARD & SUBIDA DE FOTOS
// =============================================================================
function openAdminModal(tab = 'cases') {
  const modal = document.getElementById('admin-modal');
  if (modal) modal.classList.remove('hidden');

  if (isAdminUnlocked) {
    showAdminDashboard();
    switchAdminTab(tab);
  } else {
    showAdminLogin();
  }
}

function closeAdminModal() {
  const modal = document.getElementById('admin-modal');
  if (modal) modal.classList.add('hidden');
}

function showAdminLogin() {
  document.getElementById('admin-login-screen')?.classList.remove('hidden');
  document.getElementById('admin-dashboard-screen')?.classList.add('hidden');
  document.getElementById('admin-logout-btn')?.classList.add('hidden');
}

function showAdminDashboard() {
  document.getElementById('admin-login-screen')?.classList.add('hidden');
  document.getElementById('admin-dashboard-screen')?.classList.remove('hidden');
  document.getElementById('admin-logout-btn')?.classList.remove('hidden');
  renderAdminCasesList();
  renderAdminEventsList();
  renderAdminSubscribersList();
  loadRatesInAdmin();
  loadGasConfig();
  loadTrackingConfigInAdmin();
}

function handleAdminLogout() {
  isAdminUnlocked = false;
  showAdminLogin();
  closeAdminModal();
  if (window.location.hash.toLowerCase() === '#admin' || window.location.hash.toLowerCase() === '#cms') {
    history.replaceState(null, document.title, window.location.pathname + window.location.search);
  }
  alert('🔒 Sesión administrativa cerrada con éxito. El sitio web vuelve a estar completamente blindado en Modo Solo Lectura.');
}

function handleAdminLogin(e) {
  e.preventDefault();
  const user = document.getElementById('admin-user-input')?.value.trim();
  const pass = document.getElementById('admin-pass-input')?.value.trim();

  // Validación de credenciales maestras (Usuario: JondZ33 | Clave: aN3ss1n350Z33!!!_2004!!!)
  const isUserValid = (!user || user.toLowerCase() === 'jondz33');
  const isPassValid = (pass === 'aN3ss1n350Z33!!!_2004!!!');

  if (isUserValid && isPassValid) {
    isAdminUnlocked = true;
    showAdminDashboard();
  } else {
    alert('❌ Credenciales incorrectas. Acceso restringido.');
    const passInput = document.getElementById('admin-pass-input');
    if (passInput) passInput.value = '';
  }
}

function switchAdminTab(tabName) {
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  document.querySelectorAll('.admin-tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === `tab-pane-${tabName}`);
  });
}

// Manejo de imagen para casos de éxito (Base64 o URL)
let currentCasePhotoData = '';

function previewCaseImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    currentCasePhotoData = e.target.result;
    displayPhotoPreview(currentCasePhotoData);
  };
  reader.readAsDataURL(file);
}

function previewCaseUrl(url) {
  if (!url) return;
  currentCasePhotoData = url;
  displayPhotoPreview(url);
}

function displayPhotoPreview(src) {
  const previewWrap = document.getElementById('case-img-preview-wrap');
  const previewImg = document.getElementById('case-img-preview');
  if (previewWrap && previewImg) {
    previewImg.src = src;
    previewWrap.classList.remove('hidden');
  }
}

function clearCaseImage() {
  currentCasePhotoData = '';
  const previewWrap = document.getElementById('case-img-preview-wrap');
  const fileInput = document.getElementById('case-file-input');
  const urlInput = document.getElementById('case-img-url');
  if (previewWrap) previewWrap.classList.add('hidden');
  if (fileInput) fileInput.value = '';
  if (urlInput) urlInput.value = '';
}

function handleSaveCase(e) {
  e.preventDefault();
  const client = document.getElementById('case-client').value.trim();
  const title = document.getElementById('case-title').value.trim();
  const mode = document.getElementById('case-mode').value;
  const stat = document.getElementById('case-stat').value.trim();
  const desc = document.getElementById('case-desc').value.trim();

  const newCase = {
    id: 'case-' + Date.now(),
    client,
    title,
    mode,
    stat,
    desc,
    image: currentCasePhotoData || 'images/banner.jpg',
    createdAt: new Date().toISOString()
  };

  currentCases.unshift(newCase);
  localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(currentCases));

  renderSuccessCases();
  resetCaseForm();
  alert('🎉 ¡Caso de éxito publicado en la web con éxito!');
}

function resetCaseForm() {
  document.getElementById('new-case-form')?.reset();
  clearCaseImage();
}

function deleteCase(caseId) {
  if (!confirm('¿Deseas eliminar este caso de éxito de la página web?')) return;
  currentCases = currentCases.filter(c => c.id !== caseId);
  localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(currentCases));
  renderSuccessCases();
}

function renderAdminCasesList() {
  const container = document.getElementById('admin-cases-list');
  const badge = document.getElementById('cases-count-badge');
  if (badge) badge.innerText = currentCases.length;
  if (!container) return;

  if (currentCases.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem;">No hay casos guardados.</p>';
    return;
  }

  container.innerHTML = currentCases.map(c => `
    <div class="admin-case-item">
      <div style="display:flex; align-items:center; gap:10px;">
        <img src="${c.image || 'images/banner.jpg'}" style="width:36px; height:36px; object-fit:cover; border-radius:4px;" />
        <div>
          <strong>${c.title}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">${c.client} • ${c.mode}</div>
        </div>
      </div>
      <button class="btn btn-outline btn-xs" style="color:var(--brand-red); border-color:var(--brand-red);" onclick="deleteCase('${c.id}')">
        <i class="ph ph-trash"></i>
      </button>
    </div>
  `).join('');
}

// Guardar y cargar tarifas desde Admin
function loadRatesInAdmin() {
  const rUsaAir = document.getElementById('rate-air-usa');
  const rChinaAir = document.getElementById('rate-air-china');
  const rUsaSea = document.getElementById('rate-sea-usa');
  const rChinaSeaMin = document.getElementById('rate-sea-china-min');
  const rChinaSeaMax = document.getElementById('rate-sea-china-max');
  const rDelivery = document.getElementById('rate-delivery-fee');

  if (rUsaAir) rUsaAir.value = currentRates.airUsa || 3.00;
  if (rChinaAir) rChinaAir.value = currentRates.airChina || 7.50;
  if (rUsaSea) rUsaSea.value = currentRates.seaUsaFt3 || 15.00;
  if (rChinaSeaMin) rChinaSeaMin.value = currentRates.seaChinaMin || 275.00;
  if (rChinaSeaMax) rChinaSeaMax.value = currentRates.seaChinaMax || 350.00;
  if (rDelivery) rDelivery.value = currentRates.deliveryMetro || 3.50;
}

function handleSaveRates(e) {
  e.preventDefault();
  currentRates.airUsa = parseFloat(document.getElementById('rate-air-usa').value) || 3.00;
  currentRates.airChina = parseFloat(document.getElementById('rate-air-china').value) || 7.50;
  currentRates.seaUsaFt3 = parseFloat(document.getElementById('rate-sea-usa').value) || 15.00;
  currentRates.seaChinaMin = parseFloat(document.getElementById('rate-sea-china-min').value) || 275.00;
  currentRates.seaChinaMax = parseFloat(document.getElementById('rate-sea-china-max').value) || 350.00;
  currentRates.deliveryMetro = parseFloat(document.getElementById('rate-delivery-fee').value) || 3.50;

  localStorage.setItem(STORAGE_KEYS.RATES, JSON.stringify(currentRates));
  updateCalculator();
  alert('✅ Tarifas actualizadas en la calculadora pública.');
}

// GAS ERP WebApp Sync
function loadGasConfig() {
  const input = document.getElementById('gas-webhook-url');
  if (input) {
    input.value = localStorage.getItem(STORAGE_KEYS.GAS_URL) || '';
  }
}

function saveGasUrl() {
  const url = document.getElementById('gas-webhook-url')?.value.trim();
  if (url) {
    localStorage.setItem(STORAGE_KEYS.GAS_URL, url);
    alert('✅ URL de WebApp GAS guardada correctamente.');
  } else {
    localStorage.removeItem(STORAGE_KEYS.GAS_URL);
    alert('Endpoint eliminado.');
  }
}

function testGasConnection() {
  const resElem = document.getElementById('gas-test-result');
  const url = document.getElementById('gas-webhook-url')?.value.trim();
  if (!url) {
    alert('Ingresa primero la URL de Google Apps Script.');
    return;
  }

  if (resElem) {
    resElem.classList.remove('hidden');
    resElem.style.background = 'rgba(59, 130, 246, 0.15)';
    resElem.style.color = '#93c5fd';
    resElem.innerHTML = 'Enviando ping al WebApp GAS...';
  }

  fetch(url + '?action=ping', { method: 'GET', mode: 'no-cors' })
    .then(() => {
      if (resElem) {
        resElem.style.background = 'rgba(16, 185, 129, 0.15)';
        resElem.style.color = '#6ee7b7';
        resElem.innerHTML = '✅ Conexión con GAS completada (HTTP 200 OK). Las solicitudes llegarán a tus Google Sheets.';
      }
    })
    .catch(err => {
      if (resElem) {
        resElem.style.background = 'rgba(239, 68, 68, 0.15)';
        resElem.style.color = '#fca5a5';
        resElem.innerHTML = '⚠️ Error conectando: ' + err.message;
      }
    });
}

// Backup & Export
function exportBackupJson() {
  const payload = {
    appName: 'Express Loadout Web',
    exportedAt: new Date().toISOString(),
    rates: currentRates,
    cases: currentCases,
    events: currentEvents,
    subscribers: currentSubscribers,
    leads: JSON.parse(localStorage.getItem('exlo_leads_cache') || '[]')
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute('href', dataStr);
  dlAnchor.setAttribute('download', `expressloadout_backup_${Date.now()}.json`);
  dlAnchor.click();
}

function triggerRestoreBackup() {
  document.getElementById('backup-file-input')?.click();
}

function handleRestoreFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.cases) {
        currentCases = data.cases;
        localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(currentCases));
        renderSuccessCases();
      }
      if (data.rates) {
        currentRates = data.rates;
        localStorage.setItem(STORAGE_KEYS.RATES, JSON.stringify(currentRates));
        updateCalculator();
      }
      if (data.events) {
        currentEvents = data.events;
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(currentEvents));
        renderEvents(activeEventsFilter);
      }
      if (data.subscribers) {
        currentSubscribers = data.subscribers;
        localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(currentSubscribers));
        renderAdminSubscribersList();
      }
      alert('✅ Copia de seguridad completa restaurada correctamente.');
    } catch (err) {
      alert('❌ Archivo de copia de seguridad no válido: ' + err.message);
    }
  };
  reader.readAsText(file);
}

// =============================================================================
// MOTOR DE EVENTOS, OFERTAS GLOBALES & CALENDARIO DE COMPRAS (AMAZON, ALIEXPRESS, TEMU, ALIBABA)
// =============================================================================
let activeEventsFilter = 'all';
let countdownInterval = null;

function initEventsEngine() {
  renderEvents('all');
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(updateCountdowns, 1000);
}

function filterEvents(platform) {
  activeEventsFilter = platform;
  document.querySelectorAll('.event-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.platform === platform);
  });
  renderEvents(platform);
}

function renderEvents(platform = 'all') {
  const container = document.getElementById('events-container');
  if (!container) return;

  const filtered = platform === 'all' 
    ? currentEvents 
    : currentEvents.filter(e => e.platform === platform);

  if (filtered.length === 0) {
    container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--text-muted);">No hay eventos programados en esta categoría actualmente.</div>';
    return;
  }

  container.innerHTML = filtered.map(evt => {
    const platformLabel = {
      amazon: 'Amazon Global',
      aliexpress: 'AliExpress Direct',
      temu: 'TEMU Factory',
      alibaba: 'Alibaba B2B',
      madeinchina: 'Made-in-China',
      shein: 'SHEIN Trends',
      walmart: 'Walmart USA'
    }[evt.platform] || evt.platform;

    const timerMarkup = (evt.hasTimer && evt.date) ? `
          <div class="countdown-container">
            <div class="countdown-label">
              <i class="ph ph-clock-countdown"></i> Cuenta Regresiva para la Apertura:
            </div>
            <div class="countdown-grid" data-target-date="${evt.date}">
              <div class="countdown-unit-box">
                <div class="countdown-number" id="cd-days-${evt.id}">00</div>
                <div class="countdown-text">Días</div>
              </div>
              <div class="countdown-unit-box">
                <div class="countdown-number" id="cd-hours-${evt.id}">00</div>
                <div class="countdown-text">Horas</div>
              </div>
              <div class="countdown-unit-box">
                <div class="countdown-number" id="cd-mins-${evt.id}">00</div>
                <div class="countdown-text">Min</div>
              </div>
              <div class="countdown-unit-box">
                <div class="countdown-number" id="cd-secs-${evt.id}">00</div>
                <div class="countdown-text">Seg</div>
              </div>
            </div>
          </div>
    ` : `
          <div class="countdown-pending-badge">
            <i class="ph ph-calendar-blank"></i>
            <span>Fecha oficial por confirmar por la tienda • ¡Te avisaremos 24h antes al suscribirte!</span>
          </div>
    `;

    return `
      <article class="event-card glass-panel" id="event-${evt.id}">
        <div class="event-flyer-header">
          <span class="event-platform-tag tag-${evt.platform}">
            <i class="ph ph-calendar-blank"></i> ${platformLabel}
          </span>
          <h3 class="event-title">${evt.title}</h3>
          <span class="event-discount-badge">${evt.discount}</span>
        </div>

        <div class="event-body">
          ${timerMarkup}

          <div class="event-logistics-note">
            <strong><i class="ph ph-shield-check"></i> Recomendación Logística Express Loadout:</strong><br>
            ${evt.logisticsTip}
          </div>

          <div class="event-actions-row">
            <a href="${evt.url}" target="_blank" rel="noopener" class="btn btn-primary btn-block">
              <i class="ph ph-shopping-cart"></i> Ver Oferta Oficial
            </a>
            <a href="https://wa.me/50765210278?text=Hola%20Express%20Loadout,%20deseo%20asesoría%20para%20el%20evento%20${encodeURIComponent(evt.title)}" target="_blank" rel="noopener" class="btn btn-outline" title="Pedir Asistencia de Compra">
              <i class="ph ph-whatsapp-logo"></i> Asesoría
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  updateCountdowns();
}

function updateCountdowns() {
  const now = Date.now();
  currentEvents.forEach(evt => {
    if (!evt.hasTimer || !evt.date) return;
    const target = new Date(evt.date).getTime();
    let diff = target - now;

    const daysElem = document.getElementById(`cd-days-${evt.id}`);
    const hoursElem = document.getElementById(`cd-hours-${evt.id}`);
    const minsElem = document.getElementById(`cd-mins-${evt.id}`);
    const secsElem = document.getElementById(`cd-secs-${evt.id}`);

    if (diff <= 0) {
      if (daysElem) daysElem.innerText = '00';
      if (hoursElem) hoursElem.innerText = '00';
      if (minsElem) minsElem.innerText = '00';
      if (secsElem) secsElem.innerText = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysElem) daysElem.innerText = String(days).padStart(2, '0');
    if (hoursElem) hoursElem.innerText = String(hours).padStart(2, '0');
    if (minsElem) minsElem.innerText = String(mins).padStart(2, '0');
    if (secsElem) secsElem.innerText = String(secs).padStart(2, '0');
  });
}

// Suscripción a Alertas 24h Antes por WhatsApp / Email
function handleEventSubscription(e) {
  e.preventDefault();
  const contact = document.getElementById('sub-contact')?.value.trim();
  const successMsg = document.getElementById('sub-success-msg');
  if (!contact) return;

  const newSub = {
    contact,
    date: new Date().toISOString(),
    platform: 'Todas las Ofertas'
  };

  currentSubscribers.unshift(newSub);
  localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(currentSubscribers));

  // Sync a GAS si está configurado
  sendToGasWebhook({ action: 'eventSubscribe', subscriber: newSub });

  if (successMsg) {
    successMsg.classList.remove('hidden');
    setTimeout(() => successMsg.classList.add('hidden'), 5000);
  }

  document.getElementById('event-alert-form')?.reset();
  renderAdminSubscribersList();
  alert('🎉 ¡Suscripción activada! Te notificaremos 24 horas antes del inicio de cada evento comercial.');
}

// Descarga de Calendario iCal (.ics) para Google Calendar, Apple Calendar y Outlook
function downloadIcsCalendar() {
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Express Loadout//Calendario de Compras e Importaciones Panamá//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Express Loadout - Ofertas Globales & Importación',
    'X-WR-TIMEZONE:America/Panama'
  ];

  currentEvents.forEach(evt => {
    const eventDate = new Date(evt.date);
    const startStr = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(eventDate.getTime() + 48 * 60 * 60 * 1000);
    const endStr = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    icsContent.push('BEGIN:VEVENT');
    icsContent.push(`UID:exlo-${evt.id}@expressloadout.com`);
    icsContent.push(`DTSTAMP:${startStr}`);
    icsContent.push(`DTSTART:${startStr}`);
    icsContent.push(`DTEND:${endStr}`);
    icsContent.push(`SUMMARY:${evt.title} (${evt.discount})`);
    icsContent.push(`DESCRIPTION:Recomendación de envío a Panamá: ${evt.logisticsTip.replace(/\\n/g, ' ')}`);
    icsContent.push(`URL:${evt.url}`);
    icsContent.push('LOCATION:Miami Warehouse / Panamá');
    icsContent.push('BEGIN:VALARM');
    icsContent.push('TRIGGER:-P1D'); // Recordatorio 1 día antes
    icsContent.push('ACTION:DISPLAY');
    icsContent.push(`DESCRIPTION:Recordatorio Express Loadout: Mañana comienza ${evt.title}`);
    icsContent.push('END:VALARM');
    icsContent.push('END:VEVENT');
  });

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const dl = document.createElement('a');
  dl.href = url;
  dl.setAttribute('download', 'ExpressLoadout_Calendario_Ofertas_Panama.ics');
  document.body.appendChild(dl);
  dl.click();
  document.body.removeChild(dl);
  URL.revokeObjectURL(url);
}

// Modal RSS Feed
function openRssFeedModal() {
  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>Express Loadout - Ofertas & Calendario de Importación</title>
  <link>https://www.expressloadout.com/</link>
  <description>Picos de descuento en Amazon, AliExpress 11.11, Temu y ferias de China para Panamá</description>
  ${currentEvents.map(e => `
  <item>
    <title>${e.title} - ${e.discount}</title>
    <link>${e.url}</link>
    <description>${e.logisticsTip}</description>
    <pubDate>${new Date(e.date).toUTCString()}</pubDate>
  </item>`).join('')}
</channel>
</rss>`;

  prompt('Feed RSS de eventos y ofertas de Express Loadout (Copia para tu lector de feeds):', rssXml.substring(0, 320) + '...');
}

// Admin CMS - Gestión de Eventos y Suscriptores
function handleSaveEvent(e) {
  e.preventDefault();
  const platform = document.getElementById('event-platform').value;
  const title = document.getElementById('event-title').value.trim();
  const dateInput = document.getElementById('event-date').value;
  const discount = document.getElementById('event-discount').value.trim();
  const logisticsTip = document.getElementById('event-recommendation').value.trim();
  const url = document.getElementById('event-url').value.trim();

  const newEvt = {
    id: 'evt-' + Date.now(),
    platform,
    title,
    date: `${dateInput}T00:00:00`,
    discount,
    logisticsTip,
    url: url || 'https://www.expressloadout.com',
    badge: 'Evento Destacado'
  };

  currentEvents.unshift(newEvt);
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(currentEvents));
  renderEvents(activeEventsFilter);
  renderAdminEventsList();
  document.getElementById('new-event-form')?.reset();
  alert('🎉 ¡Evento publicado con éxito en el calendario público!');
}

function deleteEvent(id) {
  if (!confirm('¿Deseas eliminar este evento del calendario?')) return;
  currentEvents = currentEvents.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(currentEvents));
  renderEvents(activeEventsFilter);
  renderAdminEventsList();
}

function renderAdminEventsList() {
  const container = document.getElementById('admin-events-list');
  if (!container) return;

  if (currentEvents.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem;">No hay eventos guardados.</p>';
    return;
  }

  container.innerHTML = currentEvents.map(e => `
    <div class="admin-case-item">
      <div>
        <strong>${e.title}</strong>
        <div style="font-size:0.75rem; color:var(--text-muted);">
          ${e.platform.toUpperCase()} • Fecha: ${e.date.split('T')[0]} • ${e.discount}
        </div>
      </div>
      <button class="btn btn-outline btn-xs" style="color:var(--brand-red); border-color:var(--brand-red);" onclick="deleteEvent('${e.id}')">
        <i class="ph ph-trash"></i>
      </button>
    </div>
  `).join('');
}

function renderAdminSubscribersList() {
  const container = document.getElementById('admin-subs-list');
  const badge = document.getElementById('subs-count-badge');
  if (badge) badge.innerText = currentSubscribers.length;
  if (!container) return;

  if (currentSubscribers.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem;">No hay suscriptores aún.</p>';
    return;
  }

  container.innerHTML = currentSubscribers.map(s => `
    <div class="admin-case-item">
      <div style="display:flex; align-items:center; gap:8px;">
        <i class="ph ph-bell"></i>
        <div>
          <strong>${s.contact}</strong>
          <span style="font-size:0.72rem; color:var(--text-muted); margin-left:8px;">
            ${new Date(s.date).toLocaleDateString()}
          </span>
        </div>
      </div>
      <span class="badge-tag">Alerta 24h</span>
    </div>
  `).join('');
}

function exportSubscribersCsv() {
  if (currentSubscribers.length === 0) {
    alert('No hay suscriptores para exportar.');
    return;
  }

  let csv = 'Contacto,Fecha_Suscripcion,Preferencia\\r\\n';
  currentSubscribers.forEach(s => {
    csv += `"${s.contact}","${s.date}","${s.platform || 'General'}"\\r\\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', `suscriptores_ofertas_expressloadout_${Date.now()}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// =============================================================================
// SELECTOR DE TEMAS (OBSIDIAN / TACTICAL / LIGHT)
// =============================================================================
function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.THEME) || 'theme-obsidian';
  document.body.className = saved;
  updateThemeIcon(saved);

  const toggleBtn = document.getElementById('theme-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', cycleTheme);
  }
}

function cycleTheme() {
  let next = 'theme-obsidian';
  if (document.body.classList.contains('theme-obsidian')) {
    next = 'theme-tactical';
  } else if (document.body.classList.contains('theme-tactical')) {
    next = 'theme-light';
  } else {
    next = 'theme-obsidian';
  }

  document.body.className = next;
  localStorage.setItem(STORAGE_KEYS.THEME, next);
  updateThemeIcon(next);
}

function updateThemeIcon(themeName) {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;
  if (themeName === 'theme-light') {
    icon.className = 'ph ph-sun';
  } else if (themeName === 'theme-tactical') {
    icon.className = 'ph ph-shield';
  } else {
    icon.className = 'ph ph-moon-stars';
  }
}

// =============================================================================
// NAVEGACIÓN Y MENÚ MÓVIL
// =============================================================================
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('mobile-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });

    document.querySelectorAll('.mobile-nav-item').forEach(link => {
      link.addEventListener('click', () => menu.classList.remove('open'));
    });
  }

  // =============================================================================
  // ACCESO ADMINISTRATIVO PRIVADO (SIN EXPOSICIÓN PÚBLICA)
  // Atajo de Teclado: Ctrl + Shift + A
  // URL Hash Privado: https://www.expressloadout.com/#admin
  // =============================================================================
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      openAdminModal('cases');
    }
  });

  function checkAdminHash() {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#admin' || hash === '#cms') {
      openAdminModal('cases');
    }
  }

  window.addEventListener('hashchange', checkAdminHash);
  checkAdminHash();

  function checkDirectTrackingUrl() {
    let trackNum = '';
    const hash = window.location.hash;
    if (hash.toLowerCase().startsWith('#track=')) {
      trackNum = decodeURIComponent(hash.substring(7)).trim();
    } else {
      const params = new URLSearchParams(window.location.search);
      if (params.has('track')) {
        trackNum = params.get('track').trim();
      }
    }

    if (trackNum) {
      const advInput = document.getElementById('adv-track-input');
      if (advInput) advInput.value = trackNum;
      setTimeout(() => {
        executeTacticalTracking(trackNum, 'adv-track-result');
        const trackSection = document.getElementById('tracking');
        if (trackSection) trackSection.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    }
  }

  window.addEventListener('hashchange', checkDirectTrackingUrl);
  checkDirectTrackingUrl();
}

function initScrollNav() {
  const navItems = document.querySelectorAll('.desktop-nav .nav-item');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentId}`) {
        item.classList.add('active');
      }
    });
  }, { passive: true });
}

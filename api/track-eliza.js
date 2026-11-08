/**
 * VERCEL SERVERLESS FUNCTION - ELIZAAPP ERP INTEGRATION & SECURITY SHIELD
 * Express Loadout Panamá (https://www.expressloadout.com)
 *
 * Blindaje Server-Side: Recibe consultas de tracking desde cualquier navegador o dispositivo,
 * inyecta de forma privada las credenciales de ElizaApp ERP (api_access_key) en el servidor
 * y devuelve los hitos logísticos sanitizados sin exponer jamás la API Key al cliente público.
 */

const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // Cabeceras CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extraer el número de guía
  const trackingId = (
    req.body?.tracking_id ||
    req.body?.number ||
    req.query?.tracking_id ||
    req.query?.number ||
    req.query?.id ||
    ''
  ).toString().trim().toUpperCase();

  if (!trackingId) {
    return res.status(400).json({
      code: 400,
      error: 'Parámetro tracking_id requerido.'
    });
  }

  // Cargar configuración de tracking persistida en el servidor
  let serverConfig = {};
  try {
    const configPath = path.join(process.cwd(), 'data', 'tracking.json');
    if (fs.existsSync(configPath)) {
      serverConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
  } catch (err) {
    console.warn('Aviso: data/tracking.json no encontrado o inaccesible:', err.message);
  }

  // Prioridad de API Key:
  // 1. Variable de entorno en Vercel (máxima seguridad)
  // 2. Configuración guardada en data/tracking.json desde el CMS
  // 3. Fallback enviado desde el CMS en modo prueba (si el admin lo pasa)
  const apiKey = (
    process.env.ELIZA_API_KEY ||
    serverConfig.eliza?.apiKey ||
    req.body?.apiKey ||
    ''
  ).trim();

  const tenant = (
    process.env.ELIZA_TENANT ||
    serverConfig.eliza?.tenant ||
    req.body?.tenant ||
    'nelconcargo'
  ).trim();

  if (!apiKey) {
    return res.status(200).json({
      code: 403,
      message: 'API Key de ElizaApp no configurada en el servidor. Ingrésala desde el Panel CMS (pestaña APIs Tracking) para activarla en toda la plataforma.',
      data: null
    });
  }

  const endpoint = `https://${tenant}.elizaapp.com/api/tracking/status`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const elizaRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_access_key: apiKey,
        tracking_id: trackingId
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (elizaRes.status === 403) {
      return res.status(200).json({
        code: 403,
        message: 'Acceso Denegado (403): La API Key de ElizaApp registrada no es válida o ha caducado. Actualízala desde el CMS.',
        data: null
      });
    }

    if (!elizaRes.ok) {
      return res.status(200).json({
        code: elizaRes.status,
        message: `Servidor ElizaApp respondió con estado HTTP ${elizaRes.status}`,
        data: null
      });
    }

    const data = await elizaRes.json();
    // Devolvemos la respuesta oficial de ElizaApp (sin exponer la API Key)
    return res.status(200).json(data);

  } catch (err) {
    console.error('Error al consultar ElizaApp ERP:', err);
    return res.status(200).json({
      code: 500,
      message: 'No se pudo comunicar con el servidor ElizaApp: ' + err.message,
      data: null
    });
  }
};

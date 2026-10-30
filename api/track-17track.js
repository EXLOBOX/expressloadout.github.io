/**
 * VERCEL SERVERLESS FUNCTION - 17TRACK API RELAY
 * Express Loadout Panamá (https://www.expressloadout.com)
 *
 * Reenvía consultas a la API de 17Track (v2.4 gettrackinfo & register) desde el servidor.
 * Elimina problemas de CORS (Failed to fetch) en navegadores web.
 */

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, 17token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const action = req.query?.action === 'register' ? 'register' : 'gettrackinfo';
    const targetUrl = `https://api.17track.net/track/v2.4/${action}`;

    const clientToken = req.headers['17token'] || req.body?.apiKey || '708C2EF0CA32A784D0432D8572AB883A';

    let payload = req.body;
    if (!Array.isArray(payload)) {
      if (payload?.number) {
        payload = [{ number: String(payload.number).trim() }];
      } else if (payload?.numbers && Array.isArray(payload.numbers)) {
        payload = payload.numbers.map(n => ({ number: String(n).trim() }));
      } else if (req.query?.number) {
        payload = [{ number: String(req.query.number).trim() }];
      }
    }

    if (!payload || !Array.isArray(payload) || payload.length === 0) {
      return res.status(400).json({
        code: 4001,
        message: 'Payload inválido. Se requiere lista o campo con número de guía.'
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const apiRes = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        '17token': clientToken
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const json = await apiRes.json();
    return res.status(apiRes.status).json(json);

  } catch (err) {
    console.error('Error en 17Track Relay:', err);
    return res.status(500).json({
      code: 5000,
      message: 'Fallo al conectar con servidor 17Track: ' + err.message
    });
  }
};

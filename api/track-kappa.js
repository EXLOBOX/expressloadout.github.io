/**
 * VERCEL SERVERLESS FUNCTION - KAPPA LOGISTICS INTEGRATION
 * Express Loadout Panamá (https://www.expressloadout.com)
 *
 * Consulta en tiempo real al servidor ASP.NET de Kappa Logistics (http://192.99.227.184:8096/TrackingPage.aspx)
 * y extrae el estado de recepción en Panamá (Warehouse Receipt, Shipper, Loaded Date).
 * Resuelve restricciones de Contenido Mixto (HTTPS -> HTTP) y CORS del navegador.
 */

module.exports = async (req, res) => {
  // Configuración de cabeceras CORS
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
      success: false,
      error: 'Parámetro tracking_id requerido.'
    });
  }

  const kappaUrl = 'http://192.99.227.184:8096/TrackingPage.aspx';

  try {
    // 1. Petición GET inicial para extraer tokens de estado de ASP.NET
    const getController = new AbortController();
    const timeoutId = setTimeout(() => getController.abort(), 8000);

    const getRes = await fetch(kappaUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: getController.signal
    });
    clearTimeout(timeoutId);

    if (!getRes.ok) {
      throw new Error(`Servidor Kappa respondió con HTTP ${getRes.status}`);
    }

    const html = await getRes.text();
    const vsMatch = html.match(/id="__VIEWSTATE"\s+value="([^"]+)"/);
    const vgMatch = html.match(/id="__VIEWSTATEGENERATOR"\s+value="([^"]+)"/);
    const evMatch = html.match(/id="__EVENTVALIDATION"\s+value="([^"]+)"/);

    const viewState = vsMatch ? vsMatch[1] : '';
    const viewStateGenerator = vgMatch ? vgMatch[1] : '';
    const eventValidation = evMatch ? evMatch[1] : '';

    // 2. Petición POST con los tokens y el número de guía
    const formParams = new URLSearchParams();
    formParams.append('__VIEWSTATE', viewState);
    if (viewStateGenerator) formParams.append('__VIEWSTATEGENERATOR', viewStateGenerator);
    if (eventValidation) formParams.append('__EVENTVALIDATION', eventValidation);
    formParams.append('_strNumber', trackingId);
    formParams.append('_strReference', '');
    formParams.append('btnWarehouse', 'Warehouse');

    const postController = new AbortController();
    const postTimeoutId = setTimeout(() => postController.abort(), 8000);

    const postRes = await fetch(kappaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: formParams.toString(),
      signal: postController.signal
    });
    clearTimeout(postTimeoutId);

    if (!postRes.ok) {
      throw new Error(`Fallo en consulta POST a Kappa (HTTP ${postRes.status})`);
    }

    const postHtml = await postRes.text();
    const resultMatch = postHtml.match(/id="lblTKResult"[^>]*>([\s\S]*?)<\/span>/i);
    const rawResult = resultMatch ? resultMatch[1] : '';

    // 3. Evaluar si existe registro en Kappa Logistics
    if (rawResult && !rawResult.includes('No Record Found') && !rawResult.includes('No se encontraron')) {
      const receiptMatch = rawResult.match(/Warehouse Receipts?:\s*([^\s<]+)/i);
      const shipperMatch = rawResult.match(/Shipper:\s*([^<]+)/i);
      const consigneeMatch = rawResult.match(/Consignee:\s*([^<]+)/i);
      const destinationMatch = rawResult.match(/Destination:\s*([^<]+)/i);
      const dateMatch = rawResult.match(/Date:\s*([^<]+)/i);
      const loadedMatch = rawResult.match(/Loaded:\s*([^<]+)/i);

      const warehouseReceipt = receiptMatch ? receiptMatch[1].trim() : null;
      const shipper = shipperMatch ? shipperMatch[1].trim() : null;
      const consignee = consigneeMatch ? consigneeMatch[1].trim() : null;
      const destination = destinationMatch ? destinationMatch[1].trim() : null;
      const receiptDate = dateMatch ? dateMatch[1].trim() : null;
      const loadedDate = loadedMatch ? loadedMatch[1].trim() : null;

      return res.status(200).json({
        success: true,
        tracking_id: trackingId,
        isLoaded: !!loadedDate,
        warehouseReceipt,
        shipper,
        consignee,
        destination,
        receiptDate,
        loadedDate,
        isAvailableInPTY: !!loadedDate,
        provider: 'Kappa Logistics PTY',
        rawText: rawResult.replace(/<br\s*[\/]?>/gi, ' \n ').replace(/<[^>]+>/g, '').trim()
      });
    }

    // Si no tiene registros en Kappa
    return res.status(200).json({
      success: false,
      tracking_id: trackingId,
      isLoaded: false,
      message: 'Guía no registrada aún en el sistema de recepción física de Panamá (Kappa Logistics).',
      provider: 'Kappa Logistics PTY'
    });

  } catch (err) {
    console.error('Error al consultar Kappa Logistics:', err);
    return res.status(200).json({
      success: false,
      tracking_id: trackingId,
      isLoaded: false,
      error: err.message,
      note: 'El servidor de Kappa Logistics no respondió a tiempo o no está accesible.'
    });
  }
};

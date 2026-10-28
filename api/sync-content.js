/**
 * VERCEL SERVERLESS FUNCTION - CMS AUTO-SYNC TO GITHUB
 * Express Loadout Panamá (https://www.expressloadout.com / https://expressloadout.vercel.app)
 *
 * Recibe eventos, casos de éxito o tarifas desde el CMS y crea un commit
 * automático en el repositorio oficial de GitHub usando GITHUB_TOKEN.
 * Al impactar la rama main en GitHub, Vercel dispara automáticamente el
 * Auto-Deploy en 15-20 segundos para todas las computadoras del mundo.
 */

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Se requiere POST.' });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(500).json({
      error: 'GITHUB_TOKEN no configurado en Vercel Environment Variables.'
    });
  }

  const { type, data } = req.body || {};
  if (!type || !['events', 'cases', 'rates'].includes(type) || !data) {
    return res.status(400).json({
      error: 'Parámetros inválidos. Se requiere type (events|cases|rates) y payload de datos.'
    });
  }

  const repoOwner = 'EXLOBOX';
  const repoName = 'expressloadout.github.io';
  const filePath = `data/${type}.json`;
  const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

  try {
    // 1. Obtener el SHA actual del archivo si ya existe en GitHub
    let currentSha = null;
    const getRes = await fetch(githubApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ExpressLoadout-CMS-Vercel-AutoSync'
      }
    });

    if (getRes.ok) {
      const fileData = await getRes.json();
      currentSha = fileData.sha;
    }

    // 2. Serializar y codificar en Base64 UTF-8
    const contentString = JSON.stringify(data, null, 2);
    const contentBase64 = Buffer.from(contentString, 'utf-8').toString('base64');

    // 3. Crear commit directo en la rama main vía GitHub REST API
    const commitPayload = {
      message: `cms(auto-sync): actualización de ${type} en vivo vía Vercel CMS [auto-deploy]`,
      content: contentBase64,
      branch: 'main'
    };
    if (currentSha) {
      commitPayload.sha = currentSha;
    }

    const putRes = await fetch(githubApiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ExpressLoadout-CMS-Vercel-AutoSync'
      },
      body: JSON.stringify(commitPayload)
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      console.error('Error de GitHub API al crear commit:', errText);
      return res.status(putRes.status).json({
        error: 'Error al enviar commit a GitHub API',
        details: errText
      });
    }

    const commitResult = await putRes.json();
    return res.status(200).json({
      success: true,
      message: `Commit ${commitResult.commit?.sha?.substring(0, 7)} creado con éxito en GitHub. Vercel auto-deploy en curso.`,
      commitSha: commitResult.commit?.sha
    });

  } catch (err) {
    console.error('Error interno en sync-content:', err);
    return res.status(500).json({
      error: 'Error interno en la función serverless de sincronización',
      message: err.message
    });
  }
};

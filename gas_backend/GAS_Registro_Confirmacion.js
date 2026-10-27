/**
 * =============================================================================
 * EXPRESS LOADOUT - MODULO DE REGISTRO CON DOBLE VERIFICACION (24 HORAS)
 * =============================================================================
 * 1. Genera enlace dinámico con HASH criptográfico (HMAC-SHA256 anti-tamper / anti-spam).
 * 2. Si el cliente NO confirma en 24 horas, NO se registra en EXPRESSLOADOUT_DB.
 * 3. Al confirmar:
 *    - Bloqueo atómico con LockService para evitar colisiones.
 *    - Valida la última fila y obtiene el número más alto en CODIGO (Math.max + 1).
 *    - Inserta en DB_Clientes con PO-box_A y PO-box_M autogenerados.
 *    - Envía Correo HTML de Bienvenida con Direcciones USA Aéreo y Marítimo.
 *    - Muestra página web de confirmación con datos listos para copiar.
 * =============================================================================
 */

var SPREADSHEET_DB_CLIENTES_ID = '10yX1OvFETdOBId25Ft4GsgumyPAqd4DywhN7-Ydq14Y';
var SECRET_HASH_SALT = 'EXLO_AUTH_SECRET_KEY_2026_PANAMA_TRACK';

// =============================================================================
// MANEJADORES HTTP: doGet y doPost
// =============================================================================

function doGet(e) {
  var p = (e && e.parameter) ? e.parameter : {};
  
  // Acción de confirmación desde el clic en el correo
  if (p.action === 'confirm' || p.token) {
    return handleConfirmarRegistroWeb(p.token);
  }
  
  // Consulta de próximo código disponible (opcional para el sitio web)
  if (p.action === 'getNextCode') {
    var nextCodeInfo = obtenerUltimoCodigoCasillero();
    return ContentService.createTextOutput(JSON.stringify(nextCodeInfo))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Solicitud de verificación vía GET (fallback para navegadores con bloqueo CORS estricto)
  if (p.action === 'requestVerification') {
    var resGet = solicitarVerificacionCasillero(p);
    return ContentService.createTextOutput(JSON.stringify(resGet))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Si existe interfaz de ERP Index, servirla; de lo contrario página estándar
  try {
    return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('ExpressLoadout ERP')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch(err) {
    return HtmlService.createHtmlOutput('<h3 style="font-family:sans-serif; text-align:center; margin-top:50px;">Express Loadout WebApp Gateway Activo</h3>');
  }
}

function doPost(e) {
  var data = {};
  try {
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }
  } catch(err) {
    data = (e && e.parameter) ? e.parameter : {};
  }
  
  var action = data.action || (e && e.parameter ? e.parameter.action : '');
  var result = {};

  if (action === 'requestVerification') {
    result = solicitarVerificacionCasillero(data.payload || data);
  } else if (action === 'confirmLocker') {
    result = confirmarCasilleroPorToken(data.token || (e && e.parameter ? e.parameter.token : ''));
  } else {
    result = { success: false, message: 'Acción no reconocida: ' + action };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// =============================================================================
// 1. SOLICITAR VERIFICACION (ENVIO DE ENLACE DINAMICO HASH - VALIDEZ 24 HORAS)
// =============================================================================

function solicitarVerificacionCasillero(payload) {
  try {
    payload = payload || {};
    var name = String(payload.name || '').trim();
    var email = String(payload.email || '').trim().toLowerCase();
    var phone = String(payload.phone || '').trim();
    var idNumber = String(payload.idNumber || payload.national_id || '').trim();
    var province = String(payload.province || payload.address_province || 'Panamá').trim();
    var interests = String(payload.interests || payload.interest || 'USA, China').trim();
    var language = String(payload.language || 'ES').trim().toUpperCase();

    if (!name) return { success: false, message: 'El nombre es obligatorio.' };
    if (!email || email.indexOf('@') === -1) return { success: false, message: 'Correo electrónico inválido.' };
    if (!phone) return { success: false, message: 'Número de WhatsApp es obligatorio.' };

    var ss = SpreadsheetApp.openById(SPREADSHEET_DB_CLIENTES_ID);
    var hojaPre = _obtenerOCrearHojaPreRegistros(ss);

    // Generar Token con firma HMAC-SHA256 anti-tamper
    var timestamp = Date.now();
    var rawString = name + '|' + email + '|' + phone + '|' + timestamp;
    var signatureBytes = Utilities.computeHmacSha256Signature(rawString, SECRET_HASH_SALT);
    var hashSignature = Utilities.base64EncodeWebSafe(signatureBytes).substring(0, 32);
    var token = 'EXLO_' + timestamp + '_' + hashSignature;

    // Expiración exacta de 24 horas (en milisegundos)
    var expiresAt = timestamp + (24 * 60 * 60 * 1000);
    var fechaLegible = new Date(timestamp);
    var expiraLegible = new Date(expiresAt);

    // Guardar en PRE_REGISTROS sin tocar la base principal DB_Clientes
    hojaPre.appendRow([
      token,
      fechaLegible,
      expiresAt,
      name,
      email,
      phone,
      idNumber,
      province,
      interests,
      language,
      'PENDIENTE',
      '' // Código asignado (vacío hasta que confirme)
    ]);

    // Construir URL dinámica de confirmación
    var webAppUrl = ScriptApp.getService().getUrl();
    var confirmUrl = webAppUrl + '?action=confirm&token=' + encodeURIComponent(token);

    // Enviar correo de verificación (Paso 1)
    _enviarCorreoConfirmacion24H(email, name, confirmUrl, expiraLegible);

    return {
      success: true,
      message: 'Se ha enviado un correo de verificación a ' + email + '. Tienes 24 horas para confirmarlo.'
    };
  } catch(e) {
    return { success: false, message: 'Error procesando solicitud: ' + e.toString() };
  }
}

// =============================================================================
// 2. CONFIRMAR CASILLERO POR TOKEN (ESCRITURA EN GOOGLE SHEET + CODIGO + 1)
// =============================================================================

function confirmarCasilleroPorToken(token) {
  token = String(token || '').trim();
  if (!token) return { success: false, message: 'Token no suministrado.' };

  var lock = LockService.getScriptLock();
  try {
    // Esperar hasta 30 segundos para garantizar bloqueo atómico
    lock.waitLock(30000);
  } catch(errLock) {
    return { success: false, message: 'El servidor está ocupado procesando otro registro. Por favor reintenta en unos instantes.' };
  }

  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_DB_CLIENTES_ID);
    var hojaPre = _obtenerOCrearHojaPreRegistros(ss);
    var dataPre = hojaPre.getDataRange().getValues();

    var filaEncontrada = -1;
    var rowData = null;

    for (var i = 1; i < dataPre.length; i++) {
      if (String(dataPre[i][0] || '').trim() === token) {
        filaEncontrada = i + 1; // Base 1
        rowData = dataPre[i];
        break;
      }
    }

    if (filaEncontrada === -1 || !rowData) {
      lock.releaseLock();
      return { success: false, message: 'El enlace de confirmación no es válido o no existe en el sistema.' };
    }

    var expiresAt = Number(rowData[2]);
    var name = String(rowData[3] || '').trim();
    var email = String(rowData[4] || '').trim();
    var phone = String(rowData[5] || '').trim();
    var idNumber = String(rowData[6] || '').trim();
    var province = String(rowData[7] || 'Panamá').trim();
    var interests = String(rowData[8] || '').trim();
    var language = String(rowData[9] || 'ES').trim();
    var estado = String(rowData[10] || '').trim().toUpperCase();
    var codigoPrevio = rowData[11];

    // Verificar si ya fue confirmado
    if (estado === 'CONFIRMADO') {
      lock.releaseLock();
      return {
        success: true,
        alreadyConfirmed: true,
        code: codigoPrevio,
        name: name,
        email: email,
        message: 'Tu casillero ya fue confirmado y activado previamente con el código ' + codigoPrevio + '.'
      };
    }

    // Verificar si ya expiraron las 24 horas
    var ahora = Date.now();
    if (ahora > expiresAt) {
      hojaPre.getRange(filaEncontrada, 11).setValue('EXPIRADO');
      lock.releaseLock();
      return {
        success: false,
        message: 'Este enlace de confirmación ha expirado (más de 24 horas desde su emisión). Por favor solicita tu casillero nuevamente en el sitio web.'
      };
    }

    // OBTENER ULTIMO CODIGO DE LA HOJA DB_CLIENTES Y CALCULAR CODIGO + 1
    var hojaClientes = ss.getSheetByName('DB_Clientes');
    if (!hojaClientes) {
      lock.releaseLock();
      return { success: false, message: 'Hoja DB_Clientes no encontrada en la base de datos.' };
    }

    var dataClientes = hojaClientes.getDataRange().getValues();
    var maxCodigo = 0;

    // Buscar el valor numérico más alto en la columna CODIGO (columna 0)
    for (var j = 1; j < dataClientes.length; j++) {
      var valCodigo = parseInt(dataClientes[j][0], 10);
      if (!isNaN(valCodigo) && valCodigo > maxCodigo) {
        maxCodigo = valCodigo;
      }
    }

    var nuevoCodigo = maxCodigo + 1; // Asignación ascendente (ej: 404 -> 405)

    // Formatear campos según la convención de DB_Clientes
    var poBoxA = 'EXLO ' + name + ' - ' + nuevoCodigo;
    var poBoxM = 'EXLO OCEAN ' + name + '-' + nuevoCodigo;
    var tarifaA = 2.75;
    var tipo = 'Personal';
    var tarifaM = 15.00;

    // Insertar en la fila 2 (en la parte superior de la tabla de clientes)
    hojaClientes.insertRowBefore(2);
    hojaClientes.getRange(2, 1, 1, 15).setValues([[
      nuevoCodigo,       // 0: CODIGO
      name,              // 1: NOMBRE/EMPRESA
      email,             // 2: Email
      phone,             // 3: Tel
      poBoxA,            // 4: PO-box_A
      poBoxM,            // 5: PO-box_M
      tarifaA,           // 6: Tarifa A
      tipo,              // 7: tipo
      tarifaM,           // 8: Tarifa M
      idNumber,          // 9: ID_RUC
      province,          // 10: Location
      '',                // 11: L_link
      0,                 // 12: Credito
      '',                // 13: Ubicacion_GPS
      language           // 14: Lenguaje
    ]]);

    // Actualizar estado en PRE_REGISTROS
    hojaPre.getRange(filaEncontrada, 11).setValue('CONFIRMADO');
    hojaPre.getRange(filaEncontrada, 12).setValue(nuevoCodigo);

    // Liberar bloqueo atómico
    lock.releaseLock();

    // Enviar Correo HTML de Bienvenida con Direcciones Oficiales (Paso 2)
    _enviarCorreoBienvenidaOficial(email, name, nuevoCodigo);

    return {
      success: true,
      code: nuevoCodigo,
      name: name,
      email: email,
      message: '¡Casillero activado con éxito! Tu código asignado es ' + nuevoCodigo + '.'
    };
  } catch(e) {
    if (lock) lock.releaseLock();
    return { success: false, message: 'Error al confirmar casillero: ' + e.toString() };
  }
}

// =============================================================================
// 3. PÁGINA WEB DE RESPUESTA A LA CONFIRMACIÓN EN NAVEGADOR
// =============================================================================

function handleConfirmarRegistroWeb(token) {
  var res = confirmarCasilleroPorToken(token);
  
  if (!res.success) {
    var errorHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación no válida - Express Loadout</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background:#090d14; color:#f8fafc; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; padding:20px; box-sizing:border-box; }
          .card { background:rgba(15,23,42,0.9); border:1px solid rgba(239,68,68,0.4); border-radius:16px; padding:36px; max-width:480px; width:100%; text-align:center; box-shadow:0 20px 40px rgba(0,0,0,0.6); }
          .icon { font-size:48px; color:#ef4444; margin-bottom:16px; }
          h2 { margin:0 0 12px 0; color:#f8fafc; font-size:22px; }
          p { color:#94a3b8; font-size:15px; line-height:1.5; margin-bottom:24px; }
          .btn { display:inline-block; background:#f59e0b; color:#0f172a; font-weight:700; text-decoration:none; padding:12px 28px; border-radius:8px; font-size:15px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">⚠️</div>
          <h2>No se pudo activar el casillero</h2>
          <p>${res.message}</p>
          <a href="https://www.expressloadout.com/#registro" class="btn">Volver a Solicitar Casillero</a>
        </div>
      </body>
      </html>
    `;
    return HtmlService.createHtmlOutput(errorHtml)
      .setTitle('Error de Confirmación - Express Loadout')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  var code = res.code;
  var name = res.name;

  var successHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>¡Casillero Confirmado y Activado! - Express Loadout</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background:#090d14; color:#f8fafc; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; padding:20px; box-sizing:border-box; }
        .card { background:rgba(15,23,42,0.92); border:1px solid rgba(245,158,11,0.3); border-radius:18px; padding:36px 30px; max-width:540px; width:100%; text-align:center; box-shadow:0 25px 50px rgba(0,0,0,0.7); }
        .icon { font-size:52px; color:#10b981; margin-bottom:12px; }
        h1 { margin:0 0 8px 0; color:#f8fafc; font-size:24px; font-weight:800; letter-spacing:-0.02em; }
        .sub { color:#94a3b8; font-size:14px; margin-bottom:20px; }
        .code-box { background:rgba(245,158,11,0.12); border:2px dashed #f59e0b; border-radius:12px; padding:16px; margin-bottom:24px; }
        .code-label { font-size:12px; text-transform:uppercase; letter-spacing:0.08em; color:#fbbf24; font-weight:700; display:block; margin-bottom:4px; }
        .code-val { font-size:32px; font-weight:900; color:#ffffff; font-family:Consolas, monospace; letter-spacing:0.04em; }
        .address-card { background:rgba(30,41,59,0.7); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:16px 18px; text-align:left; margin-bottom:16px; font-size:13px; }
        .address-title { color:#fbbf24; font-weight:700; margin-bottom:8px; font-size:14px; display:flex; align-items:center; justify-content:space-between; }
        .row { display:flex; justify-content:space-between; margin-bottom:4px; color:#cbd5e1; }
        .row strong { color:#ffffff; }
        .btn-wa { display:block; background:#22c55e; color:#ffffff; font-weight:700; text-decoration:none; padding:14px 20px; border-radius:10px; font-size:15px; margin-top:20px; }
        .btn-site { display:inline-block; color:#94a3b8; font-size:13px; text-decoration:none; margin-top:14px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="icon">✅</div>
        <h1>¡Casillero Confirmado y Activado!</h1>
        <p class="sub">Hola <strong>${name}</strong>, tu cuenta oficial de casillero internacional está 100% activa en nuestra base de datos.</p>
        
        <div class="code-box">
          <span class="code-label">Tu Número de Casillero Oficial:</span>
          <span class="code-val">EXLO - ${code}</span>
        </div>

        <div class="address-card">
          <div class="address-title">✈️ 1. Dirección USA Aéreo (3-5 días):</div>
          <div class="row"><span>Full Name:</span> <strong>[EXLO] ${name}</strong></div>
          <div class="row"><span>Address:</span> <strong>1970 NW 82nd Ave</strong></div>
          <div class="row"><span>Suite / Line 2:</span> <strong>EXLO - ${code}</strong></div>
          <div class="row"><span>City / State / Zip:</span> <strong>Doral, FL 33191</strong></div>
          <div class="row"><span>Phone:</span> <strong>+1 (786) 615-5555</strong></div>
        </div>

        <div class="address-card">
          <div class="address-title">🚢 2. Dirección USA Marítimo (+25 lbs):</div>
          <div class="row"><span>Full Name:</span> <strong>[EXLO OCEAN] ${name}</strong></div>
          <div class="row"><span>Address:</span> <strong>1970 NW 82nd Ave</strong></div>
          <div class="row"><span>Suite / Line 2:</span> <strong>EXLO OCEAN - ${code}</strong></div>
          <div class="row"><span>City / State / Zip:</span> <strong>Doral, FL 33191</strong></div>
        </div>

        <a href="https://wa.me/50765210278?text=Hola%20Express%20Loadout,%20acabo%20de%20confirmar%20mi%20casillero%20EXLO%20-${code}%20y%20deseo%20comenzar%20a%20importar." class="btn-wa">
          💬 Notificar a mi Asesor por WhatsApp
        </a>

        <a href="https://www.expressloadout.com" class="btn-site">
          Ir a ExpressLoadout.com
        </a>
      </div>
    </body>
    </html>
  `;

  return HtmlService.createHtmlOutput(successHtml)
    .setTitle('Casillero Activado - Express Loadout')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// =============================================================================
// 4. PLANTILLAS DE CORREO ELECTRONICO
// =============================================================================

function _enviarCorreoConfirmacion24H(email, name, confirmUrl, expiraLegible) {
  var subject = '🔐 Confirma tu Casillero Express Loadout (Enlace válido por 24 horas)';
  
  var html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0; padding:0; background-color:#090d14; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#090d14; padding:30px 10px;">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background-color:#0f172a; border-radius:14px; border:1px solid #334155; overflow:hidden;">
              <tr>
                <td style="background-color:#090d14; border-bottom:3px solid #f59e0b; padding:24px 30px; text-align:center;">
                  <h1 style="color:#ffffff; margin:0; font-size:22px; font-weight:800; letter-spacing:0.04em;">EXPRESS LOADOUT</h1>
                  <span style="color:#f59e0b; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em;">Logística & Casillero Internacional</span>
                </td>
              </tr>
              <tr>
                <td style="padding:32px 30px;">
                  <h2 style="color:#ffffff; font-size:18px; margin:0 0 12px 0;">¡Hola ${name}!</h2>
                  <p style="color:#cbd5e1; font-size:14px; line-height:1.6; margin:0 0 20px 0;">
                    Hemos recibido tu solicitud para abrir un casillero gratuito en Miami (USA) y China.
                  </p>
                  <p style="color:#cbd5e1; font-size:14px; line-height:1.6; margin:0 0 24px 0;">
                    Por motivos de seguridad y para garantizar la correcta asignación de tu código único de casillero, por favor confirma tu correo electrónico haciendo clic en el siguiente botón:
                  </p>

                  <div style="text-align:center; margin:30px 0;">
                    <a href="${confirmUrl}" style="background-color:#f59e0b; color:#0f172a; font-weight:800; font-size:15px; text-decoration:none; padding:15px 36px; border-radius:8px; display:inline-block; letter-spacing:0.02em;">
                      CONFIRMAR Y ACTIVAR MI CASILLERO
                    </a>
                  </div>

                  <div style="background-color:rgba(245,158,11,0.08); border-left:4px solid #f59e0b; padding:12px 16px; border-radius:4px; margin-bottom:24px;">
                    <span style="color:#fbbf24; font-size:12px; font-weight:700; display:block; margin-bottom:2px;">⚠️ Vencimiento de Seguridad (24 Horas):</span>
                    <span style="color:#cbd5e1; font-size:12px;">Tienes 24 horas para confirmar. Si no haces clic en el enlace, la solicitud se cancelará automáticamente y ningún dato será guardado.</span>
                  </div>

                  <p style="color:#64748b; font-size:12px; line-height:1.4; margin:0;">
                    Si no solicitaste este casillero, puedes ignorar este mensaje de forma segura.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background-color:#090d14; border-top:1px solid #1e293b; padding:16px 30px; text-align:center; color:#64748b; font-size:11px;">
                  Express Loadout Panamá • Operaciones Logísticas Miami - Panamá - China<br>
                  WhatsApp de Atención: +507 6521-0278 • exlo@expressloadout.com
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  GmailApp.sendEmail(email, subject, 'Confirma tu casillero en el siguiente enlace: ' + confirmUrl, {
    name: 'Express Loadout Panamá',
    htmlBody: html
  });
}

function _enviarCorreoBienvenidaOficial(email, name, code) {
  var subject = '🎉 ¡Bienvenido a Express Loadout! Tu Casillero EXLO #' + code + ' está Activo';

  var html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0; padding:0; background-color:#090d14; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#090d14; padding:30px 10px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#0f172a; border-radius:14px; border:1px solid #334155; overflow:hidden;">
              <tr>
                <td style="background-color:#090d14; border-bottom:3px solid #f59e0b; padding:24px 30px; text-align:center;">
                  <h1 style="color:#ffffff; margin:0; font-size:22px; font-weight:800; letter-spacing:0.04em;">EXPRESS LOADOUT</h1>
                  <span style="color:#f59e0b; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em;">Tu Casillero Oficial en USA y China</span>
                </td>
              </tr>
              <tr>
                <td style="padding:32px 30px;">
                  <h2 style="color:#ffffff; font-size:20px; margin:0 0 10px 0;">¡Felicidades, ${name}!</h2>
                  <p style="color:#cbd5e1; font-size:14px; line-height:1.6; margin:0 0 20px 0;">
                    Tu casillero ha sido verificado y dado de alta exitosamente en nuestra base de datos logística. A continuación tienes tus direcciones oficiales para ingresar en Amazon, eBay, Walmart, Shein, Temu o tus proveedores internacionales:
                  </p>

                  <!-- BADGE CODIGO -->
                  <div style="background-color:rgba(245,158,11,0.12); border:2px dashed #f59e0b; border-radius:10px; padding:16px; text-align:center; margin-bottom:26px;">
                    <span style="color:#fbbf24; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; display:block; margin-bottom:4px;">Tu Código Oficial de Casillero:</span>
                    <span style="color:#ffffff; font-size:32px; font-weight:900; font-family:Consolas, monospace;">EXLO - ${code}</span>
                  </div>

                  <!-- DIRECCION USA AEREO -->
                  <div style="background-color:#1e293b; border:1px solid #3b82f6; border-radius:10px; padding:18px; margin-bottom:20px;">
                    <h3 style="color:#60a5fa; font-size:15px; margin:0 0 12px 0;">✈️ DIRECCIÓN USA — AÉREO EXPRESS (3 A 5 DÍAS)</h3>
                    <table width="100%" cellpadding="3" cellspacing="0" style="font-size:13px; color:#cbd5e1;">
                      <tr><td width="150" style="color:#94a3b8;">Nombre completo:</td><td><strong style="color:#ffffff;">[EXLO] ${name}</strong></td></tr>
                      <tr><td style="color:#94a3b8;">Address:</td><td><strong style="color:#ffffff;">1970 NW 82nd Ave</strong></td></tr>
                      <tr><td style="color:#94a3b8;">Suite / Línea 2:</td><td><strong style="color:#fbbf24;">EXLO - ${code}</strong></td></tr>
                      <tr><td style="color:#94a3b8;">City (Ciudad):</td><td><strong style="color:#ffffff;">Doral</strong></td></tr>
                      <tr><td style="color:#94a3b8;">State (Estado):</td><td><strong style="color:#ffffff;">FL (Florida)</strong></td></tr>
                      <tr><td style="color:#94a3b8;">Zip Code (C.P.):</td><td><strong style="color:#ffffff;">33191</strong></td></tr>
                      <tr><td style="color:#94a3b8;">Phone (Teléfono):</td><td><strong style="color:#ffffff;">+1 (786) 615-5555</strong></td></tr>
                    </table>
                  </div>

                  <!-- DIRECCION USA MARITIMO -->
                  <div style="background-color:#1e293b; border:1px solid #10b981; border-radius:10px; padding:18px; margin-bottom:24px;">
                    <h3 style="color:#34d399; font-size:15px; margin:0 0 12px 0;">🚢 DIRECCIÓN USA — MARÍTIMO (+25 LBS / COMERCIAL)</h3>
                    <table width="100%" cellpadding="3" cellspacing="0" style="font-size:13px; color:#cbd5e1;">
                      <tr><td width="150" style="color:#94a3b8;">Nombre completo:</td><td><strong style="color:#ffffff;">[EXLO OCEAN] ${name}</strong></td></tr>
                      <tr><td style="color:#94a3b8;">Address:</td><td><strong style="color:#ffffff;">1970 NW 82nd Ave</strong></td></tr>
                      <tr><td style="color:#94a3b8;">Suite / Línea 2:</td><td><strong style="color:#34d399;">EXLO OCEAN - ${code}</strong></td></tr>
                      <tr><td style="color:#94a3b8;">City (Ciudad):</td><td><strong style="color:#ffffff;">Doral</strong></td></tr>
                      <tr><td style="color:#94a3b8;">State (Estado):</td><td><strong style="color:#ffffff;">FL (Florida)</strong></td></tr>
                      <tr><td style="color:#94a3b8;">Zip Code (C.P.):</td><td><strong style="color:#ffffff;">33191</strong></td></tr>
                    </table>
                  </div>

                  <!-- IMPORTACIONES DE CHINA -->
                  <div style="background-color:rgba(245,158,11,0.06); border:1px solid rgba(245,158,11,0.25); border-radius:10px; padding:16px; margin-bottom:24px;">
                    <h4 style="color:#fbbf24; font-size:14px; margin:0 0 6px 0;">🇨🇳 ¿Deseas importar desde China (Alibaba, Taobao, fábricas)?</h4>
                    <p style="color:#cbd5e1; font-size:13px; line-height:1.5; margin:0;">
                      Debido a los requerimientos arancelarios, cálculo de volumen CBM e inspección física en origen, los proyectos de importación desde China se coordinan de forma personalizada con un asesor de operaciones. Escríbenos a nuestro WhatsApp con tu número de casillero para habilitar tu dirección en Guangzhou.
                    </p>
                  </div>

                  <div style="text-align:center; margin:24px 0 10px 0;">
                    <a href="https://wa.me/50765210278?text=Hola%20Express%20Loadout,%20acabo%20de%20recibir%20mi%20casillero%20EXLO%20-${code}%20y%20tengo%20consultas%20de%20env%C3%ADos." style="background-color:#22c55e; color:#ffffff; font-weight:700; font-size:15px; text-decoration:none; padding:14px 32px; border-radius:8px; display:inline-block;">
                      Contactar a mi Asesor por WhatsApp
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background-color:#090d14; border-top:1px solid #1e293b; padding:16px 30px; text-align:center; color:#64748b; font-size:11px;">
                  Express Loadout Panamá • Operaciones Logísticas Miami - Panamá - China<br>
                  WhatsApp: +507 6521-0278 • exlo@expressloadout.com • expressloadout.com
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  GmailApp.sendEmail(email, subject, 'Tu casillero EXLO #' + code + ' está activo.', {
    name: 'Express Loadout Panamá',
    htmlBody: html
  });
}

// =============================================================================
// 5. UTILIDADES INTERNAS DE LA BASE DE DATOS
// =============================================================================

function _obtenerOCrearHojaPreRegistros(ss) {
  var hoja = ss.getSheetByName('PRE_REGISTROS');
  if (!hoja) {
    hoja = ss.insertSheet('PRE_REGISTROS');
    hoja.appendRow([
      'Token',
      'Fecha_Solicitud',
      'Expiracion_Timestamp',
      'Nombre',
      'Email',
      'Tel',
      'ID_RUC',
      'Provincia',
      'Intereses',
      'Lenguaje',
      'Estado',
      'CODIGO_ASIGNADO'
    ]);
    hoja.setFrozenRows(1);
  }
  return hoja;
}

function obtenerUltimoCodigoCasillero() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_DB_CLIENTES_ID);
    var hoja = ss.getSheetByName('DB_Clientes');
    var data = hoja.getDataRange().getValues();
    var max = 0;
    for (var i = 1; i < data.length; i++) {
      var c = parseInt(data[i][0], 10);
      if (!isNaN(c) && c > max) max = c;
    }
    return { success: true, maxCode: max, nextCode: max + 1 };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

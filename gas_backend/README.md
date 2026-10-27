# Backend Google Apps Script — Verificación en 2 Pasos & Registro de Casilleros

Este módulo implementa el flujo de registro seguro con confirmación de 24 horas para **Express Loadout**.

## ¿Cómo Funciona?

1. **Solicitud de Registro:**
   * El cliente llena el formulario en [expressloadout.com/#registro](https://www.expressloadout.com/#registro).
   * Se envía una petición `action=requestVerification` con los datos del cliente.
   * El script genera un token criptográfico `HMAC-SHA256` con caducidad de **24 horas**.
   * Guarda temporalmente la solicitud en la pestaña `PRE_REGISTROS` de la hoja de cálculo (creada automáticamente si no existe).
   * **No toca la base principal `DB_Clientes`** hasta que el usuario confirme.
   * Envía el correo: **"🔐 Confirma tu Casillero Express Loadout (Válido por 24 horas)"** con un botón de confirmación único.

2. **Confirmación del Cliente (menos de 24 horas):**
   * El cliente hace clic en el enlace recibido en su correo (`?action=confirm&token=...`).
   * El script verifica:
     1. Validez de la firma digital anti-tampering.
     2. Que no hayan transcurrido más de 24 horas (`Date.now() < expiresAt`).
     3. Que no haya sido confirmado previamente.
   * Activa un bloqueo atómico (`LockService`) para evitar duplicidad de códigos.
   * Lee la columna `CODIGO` de `DB_Clientes` y busca el número más alto existente (`max(CODIGO) + 1`).
     * Ejemplo: Si el último es `404`, asigna automáticamente el **`405`**.
   * Inserta la fila en `DB_Clientes` con:
     * `CODIGO`: `405`
     * `PO-box_A`: `EXLO [Nombre] - 405`
     * `PO-box_M`: `EXLO OCEAN [Nombre]-405`
     * `Tarifa A`: `2.75`
     * `Tarifa M`: `15.00`
     * `tipo`: `Personal`
   * Envía el **Correo HTML de Bienvenida VIP** con:
     * Dirección USA Aéreo (3-5 días):
       * `Full Name:` `[EXLO] [Nombre Cliente]`
       * `Address:` `1970 NW 82nd Ave`
       * `Suite / Línea 2:` `EXLO - [CODIGO]`
       * `City / State / Zip:` `Doral, FL 33191`
     * Dirección USA Marítimo (+25 lbs):
       * `Full Name:` `[EXLO OCEAN] [Nombre Cliente]`
       * `Address:` `1970 NW 82nd Ave`
       * `Suite / Línea 2:` `EXLO OCEAN - [CODIGO]`
       * `City / State / Zip:` `Doral, FL 33191`
     * Explicación de importaciones desde China vía WhatsApp.
   * Muestra en el navegador una pantalla táctica de confirmación con los datos para copiar.

3. **Expiración (+24 horas sin confirmar):**
   * Si el usuario intenta hacer clic después de 24 horas, el sistema marca el token como `EXPIRADO`, rechaza la solicitud y la hoja de cálculo principal permanece intacta y libre de registros basura o spam.

## Despliegue en Google Apps Script

1. Abre tu Google Drive con la cuenta `exlo.box@gmail.com`.
2. Ve a la hoja de cálculo: [EXPRESSLOADOUT_DB](https://docs.google.com/spreadsheets/d/10yX1OvFETdOBId25Ft4GsgumyPAqd4DywhN7-Ydq14Y/edit).
3. En el menú superior haz clic en **Extensiones > Apps Script**.
4. Copia el contenido de `GAS_Registro_Confirmacion.js` y pégalo en el editor (o agrégalo como un nuevo archivo `.gs`).
5. Haz clic en **Implementar > Nueva implementación**.
6. Tipo: **Aplicación web**.
   * Ejecutar como: **Yo (exlo.box@gmail.com)**.
   * Quién tiene acceso: **Cualquier usuario (incluso anónimos)**.
7. Haz clic en **Implementar**, copia la **URL de la aplicación web** (termina en `/exec`).
8. Pega esa URL en el panel administrativo de Express Loadout en [expressloadout.com/#admin](https://www.expressloadout.com/#admin) en la pestaña **"Conexión Google Sheets & ERP (GAS)"**.

const API_KEY = '708C2EF0CA32A784D0432D8572AB883A';

async function trackPackage() {
    const trackingNumber = document.getElementById('trackingNumber').value.trim();
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = 'Consultando...';

    if (!trackingNumber) {
        resultDiv.textContent = 'Por favor ingresa un número de seguimiento.';
        return;
    }

    try {
        // Paso 1: Registrar el número
        const registerResponse = await fetch('https://api.17track.net/track/v1/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                '17token': API_KEY
            },
            body: JSON.stringify({ numbers: [trackingNumber] })
        });

        const registerData = await registerResponse.json();

        if (registerData.code !== 0) {
            resultDiv.textContent = 'Error al registrar el paquete: ' + registerData.msg;
            return;
        }

        // Paso 2: Esperar unos segundos antes de consultar el estado
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Paso 3: Obtener el estado del paquete
        const getResponse = await fetch('https://api.17track.net/track/v1/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                '17token': API_KEY
            },
            body: JSON.stringify({ numbers: [trackingNumber] })
        });

        const getData = await getResponse.json();

        if (getData.code !== 0 || !getData.data[0]) {
            resultDiv.textContent = 'No se encontró información del paquete.';
            return;
        }

        const info = getData.data[0];

        resultDiv.textContent = `
Número: ${info.number}
Transportista: ${info.carrier.name || 'Desconocido'}
Estado: ${info.tracking_status?.status || 'No disponible'}
Última actualización: ${info.tracking_status?.last_event || 'Sin eventos'}
        `.trim();

    } catch (error) {
        console.error('Error:', error);
        resultDiv.textContent = 'Ocurrió un error al rastrear el paquete.';
    }
}

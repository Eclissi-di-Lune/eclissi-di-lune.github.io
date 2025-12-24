exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const { passcode } = JSON.parse(event.body);
        const passTrim = passcode ? passcode.toString().trim() : '';

        console.log('check-pass - passcode ricevuto (len):', passTrim.length, 'value preview:', JSON.stringify(passTrim.slice(0, 10) + (passTrim.length > 10 ? '...' : '')));

        // Lista delle password valide (case-sensitive)
        const validPass = ['5676apaleredmoonandabeatensun364'];

        const valid = validPass.includes(passTrim);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                valid,
                message: valid ? 'Passcode valido' : `Passcode non valido (ricevuta lunghezza=${passTrim.length})`
            })
        };
    } catch (error) {
        console.error('check-pass error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal Server Error: ' + error.message, valid: false })
        };
    }
};
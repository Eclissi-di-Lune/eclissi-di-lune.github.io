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
        const { playerName } = JSON.parse(event.body);
        const nameTrim = playerName ? playerName.toString().trim() : '';

        console.log('check-player - nome ricevuto:', JSON.stringify(nameTrim));

        // SEMPLICE REGOLA: valido se non vuoto
        const valid = nameTrim.length > 0;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                valid,
                receivedName: nameTrim,
                message: valid ? 'Nome accettato' : 'Nome vuoto o non valido'
            })
        };
    } catch (error) {
        console.error('check-player error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal Server Error: ' + error.message })
        };
    }
};
exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
    };
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };

    try {
        const { passcode } = JSON.parse(event.body || '{}');
        const raw = passcode ? passcode.toString() : '';

        const normalized = raw.normalize ? raw.normalize('NFKC') : raw;
        const stripped = normalized.replace(/\s+/g, '').replace(/[\u200B-\u200D\uFEFF]/g, '');

        const validPass = ['5676apaleredmoonandabeatensun364'];
        const validPassStripped = validPass.map(p => (p.normalize ? p.normalize('NFKC') : p).replace(/\s+/g, '').replace(/[\u200B-\u200D\uFEFF]/g, ''));

        console.log('check-pass raw:', JSON.stringify(raw));
        console.log('normalized:', JSON.stringify(normalized));
        console.log('stripped:', JSON.stringify(stripped));
        console.log('validPassStripped:', JSON.stringify(validPassStripped));

        const valid = validPassStripped.includes(stripped);

        const charCodes = Array.from(stripped).slice(0,100).map(c => c.charCodeAt(0));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                valid,
                receivedPasscode: raw,
                lengthReceived: raw.length,
                lengthStripped: stripped.length,
                stripped,
                charCodes,
                message: valid ? 'Passcode valido' : 'Passcode non valido'
            })
        };
    } catch (err) {
        console.error('check-pass error', err);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal Server Error: ' + err.message, valid: false }) };
    }
};

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

        // Normalizza e pulisci (NFKC), rimuove whitespace e caratteri invisibili
        const normalized = (raw.normalize ? raw.normalize('NFKC') : raw);
        const stripped = normalized.replace(/\s+/g, '').replace(/[\u200B-\u200D\uFEFF]/g, '');

        // Stringa attesa (modifica qui se vuoi cambiarla)
        const expected = '5676apaleredmoonandabeatensun364';
        const expectedNorm = (expected.normalize ? expected.normalize('NFKC') : expected).replace(/\s+/g, '').replace(/[\u200B-\u200D\uFEFF]/g, '');

        // Criteri di validità (più permissivi per testing):
        // 1) esatta corrispondenza stripped === expectedNorm
        // 2) oppure stripped contiene expectedNorm (es. ci sono caratteri extra all'inizio/fine)
        // 3) oppure expectedNorm contiene stripped (es. passcode troncato ma comunque riconoscibile)
        const exactMatch = stripped === expectedNorm;
        const containsMatch = stripped.includes(expectedNorm);
        const containedByExpected = expectedNorm.includes(stripped);
        const valid = exactMatch || containsMatch || containedByExpected;

        console.log('check-pass raw:', JSON.stringify(raw));
        console.log('normalized:', JSON.stringify(normalized));
        console.log('stripped:', JSON.stringify(stripped));
        console.log('expectedNorm:', JSON.stringify(expectedNorm));
        console.log('exactMatch:', exactMatch, 'containsMatch:', containsMatch, 'containedByExpected:', containedByExpected);

        const charCodes = Array.from(stripped).slice(0,200).map(c => c.charCodeAt(0));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                valid,
                receivedPasscode: raw,
                lengthReceived: raw.length,
                lengthStripped: stripped.length,
                stripped,
                expectedNorm,
                charCodes,
                reason: valid ? 'accepted' : 'no-match'
            })
        };
    } catch (err) {
        console.error('check-pass error', err);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal Server Error: ' + err.message, valid: false }) };
    }
};

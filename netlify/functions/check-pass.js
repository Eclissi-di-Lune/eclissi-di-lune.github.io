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

        // Normalize and clean (NFKC), remove whitespace and invisible characters
        const normalized = (raw.normalize ? raw.normalize('NFKC') : raw);
        const stripped = normalized.replace(/\s+/g, '').replace(/[\u200B-\u200D\uFEFF]/g, '');

        // Expected string
        const expected = '5676apaleredmoonandabeatensun364';
        const expectedNorm = (expected.normalize ? expected.normalize('NFKC') : expected).replace(/\s+/g, '').replace(/[\u200B-\u200D\uFEFF]/g, '');

        // ONLY accept exact match
        const exactMatch = stripped === expectedNorm;
        const valid = exactMatch;  // Only this one!

        console.log('check-pass raw:', JSON.stringify(raw));
        console.log('normalized:', JSON.stringify(normalized));
        console.log('stripped:', JSON.stringify(stripped));
        console.log('expectedNorm:', JSON.stringify(expectedNorm));
        console.log('exactMatch:', exactMatch);

        // For debugging, let's see if it's a substring match
        const isSubstring = expectedNorm.includes(stripped) && stripped !== expectedNorm;
        const containsSubstring = stripped.includes(expectedNorm) && stripped !== expectedNorm;
        
        if (isSubstring) {
            console.log('WARNING: Input is a substring of expected (too short)');
        }
        if (containsSubstring) {
            console.log('WARNING: Input contains expected but is longer');
        }

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
                reason: valid ? 'exact-match' : (isSubstring ? 'too-short' : 'no-match')
            })
        };
    } catch (err) {
        console.error('check-pass error', err);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal Server Error: ' + err.message, valid: false }) };
    }
};
exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': 'https://eclissi-di-lune.github.io',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };

    try {
        const { passkey } = JSON.parse(event.body || '{}');
        
        // DEFENSIVE: Handle missing passkey
        if (!passkey) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    valid: false, 
                    reason: 'no-passkey-provided',
                    version: 'NEW-FUNCTION-v1'
                })
            };
        }

        // Convert to string and trim
        const input = String(passkey).trim();
        
        // The expected passkey
        const expected = '567625364';
        
        // EXACT COMPARISON
        const valid = input === expected;
        
        console.log('=== RUNNING NEW FUNCTION ===');
        console.log('Input:', JSON.stringify(input));
        console.log('Expected:', JSON.stringify(expected));
        console.log('Valid:', valid);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                valid,
                input,
                expected,
                inputLength: input.length,
                expectedLength: expected.length,
                version: 'NEW-FUNCTION-v1',
                timestamp: new Date().toISOString(),
                reason: valid ? 'exact-match' : 'no-match'
            })
        };
    } catch (err) {
        console.error('check-pass-new error', err);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ 
                error: 'Internal Server Error: ' + err.message, 
                valid: false,
                version: 'NEW-FUNCTION-v1'
            }) 
        };
    }
};
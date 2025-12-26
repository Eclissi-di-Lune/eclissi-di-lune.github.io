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
        
        // DEFENSIVE: Handle missing passcode
        if (!passcode) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    valid: false, 
                    reason: 'no-passcode-provided' 
                })
            };
        }

        // Convert to string and trim
        const input = String(passcode).trim();
        
        // The expected passcode
        const expected = '5676apaleredmoonandabeatensun364';
        
        // SIMPLE EXACT COMPARISON - NO NORMALIZATION
        const valid = input === expected;
        
        // DEBUG: Log everything
        console.log('=== DEBUG LOG ===');
        console.log('Input received:', JSON.stringify(input));
        console.log('Input type:', typeof input);
        console.log('Input length:', input.length);
        console.log('Expected:', JSON.stringify(expected));
        console.log('Expected length:', expected.length);
        console.log('Valid?', valid);
        
        // Check if it's a substring
        const isSubstring = expected.includes(input) && input !== expected;
        const isSuperstring = input.includes(expected) && input !== expected;
        
        if (isSubstring) {
            console.log('WARNING: Input is a SUBSTRING of expected!');
            console.log('Input:', input);
            console.log('Expected:', expected);
        }
        
        if (isSuperstring) {
            console.log('WARNING: Input is a SUPERSTRING of expected!');
        }
        
        // Character-by-character comparison
        console.log('Character comparison:');
        for (let i = 0; i < Math.max(input.length, expected.length); i++) {
            const inputChar = input[i] || 'MISSING';
            const expectedChar = expected[i] || 'MISSING';
            const charCodeInput = input[i] ? input.charCodeAt(i) : 'N/A';
            const charCodeExpected = expected[i] ? expected.charCodeAt(i) : 'N/A';
            
            if (inputChar !== expectedChar) {
                console.log(`Position ${i}: Input "${inputChar}" (${charCodeInput}) vs Expected "${expectedChar}" (${charCodeExpected})`);
            }
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                valid,
                input,
                expected,
                inputLength: input.length,
                expectedLength: expected.length,
                isExactMatch: input === expected,
                isSubstring,
                isSuperstring,
                reason: valid ? 'exact-match' : 
                       isSubstring ? 'too-short' : 
                       isSuperstring ? 'too-long' : 'different-content'
            })
        };
    } catch (err) {
        console.error('check-pass error', err);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ 
                error: 'Internal Server Error: ' + err.message, 
                valid: false 
            }) 
        };
    }
};
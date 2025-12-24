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
        const { playerName, passcode } = JSON.parse(event.body);
        
        console.log('Verifica passcode per:', playerName, '- Codice:', passcode);
        
        // Password valida (case-sensitive come l'hai scritta)
        const validPass = ['5676apaleredmoonandabeatensun364'];
        
        // Verifica: 1. È Zeta? 2. Password corretta?
        const valid = playerName && 
                     playerName.toLowerCase() === 'zeta' && 
                     validPass.includes(passcode);
        
        console.log('Risultato verifica:', valid ? 'ACCESSO CONSENTITO' : 'ACCESSO NEGATO');
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                valid: valid,
                message: valid ? "Codice valido" : "Codice non valido"
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal Server Error: ' + error.message,
                valid: false
            })
        };
    }
};
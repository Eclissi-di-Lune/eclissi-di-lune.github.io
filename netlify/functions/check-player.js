exports.handler = async (event) => {
    // Aggiungi questi header CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
    };
    
    // Gestisci le richieste preflight OPTIONS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }
    
    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' }) 
        };
    }
    
    try {
        const { playerName } = JSON.parse(event.body);
        
        console.log('Nome ricevuto:', playerName);
        
        const validNames = ['zeta'];
        
        const playerNameLowerCase = playerName ? playerName.toLowerCase() : '';
        const valid = validNames.some(validName => 
            validName.toLowerCase() === playerNameLowerCase
        );
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                valid: valid,
                receivedName: playerName
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal Server Error: ' + error.message })
        };
    }
};
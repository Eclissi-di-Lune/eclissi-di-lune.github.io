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
        const { playerName, answer } = JSON.parse(event.body);
        
        console.log('Verifica risposta per:', playerName);
        
        // Sostituisci con la risposta corretta che hai deciso
        const correctAnswer = "Anahita Attar";
        
        const valid = playerName && 
                    playerName.toLowerCase() === 'zeta' && 
                    answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                valid: valid,
                message: valid ? "Risposta corretta" : "Risposta errata"
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
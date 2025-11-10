exports.handler = async (event) => {
    // Controlla che sia una richiesta POST
    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            body: JSON.stringify({ error: 'Method Not Allowed' }) 
        };
    }
    
    try {
        const { playerName } = JSON.parse(event.body);
        
        console.log('Nome ricevuto:', playerName); // Per debug
        
        // Lista dei nomi validi
        const validNames = ['Zeta', 'Beta', 'Alpha', 'Omega'];
        const valid = validNames.includes(playerName);
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                valid: valid,
                receivedName: playerName // Per debug
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error: ' + error.message })
        };
    }
};
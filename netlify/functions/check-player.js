exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
    };
    
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
        
        // Add this validation: check if playerName exists and is a string
        if (!playerName || typeof playerName !== 'string') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    valid: false,
                    receivedName: playerName,
                    message: 'Invalid player name'
                })
            };
        }
        
        const validNames = ['zeta'];
        
        // Trim and convert to lowercase for comparison
        const playerNameLowerCase = playerName.trim().toLowerCase();
        
        // Check for exact match (case-insensitive)
        const valid = validNames.some(validName => 
            validName.toLowerCase() === playerNameLowerCase
        );
        
        console.log(`Comparison: "${playerNameLowerCase}" against validNames: ${validNames}`);
        console.log(`Result: ${valid}`);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                valid: valid,
                receivedName: playerName
            })
        };
    } catch (error) {
        console.error('Error in check-player:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal Server Error: ' + error.message })
        };
    }
};
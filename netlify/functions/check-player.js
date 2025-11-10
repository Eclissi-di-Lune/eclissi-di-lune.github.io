exports.handler = async (event) => {
    // Solo metodo POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    
    try {
        const { playerName } = JSON.parse(event.body);
        
        // Verifica se il nome è "Zeta" (puoi aggiungere altri nomi validi)
        const validNames = ['Zeta', 'Beta', 'Alpha', 'Omega'];
        const valid = validNames.includes(playerName);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ valid: valid })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};
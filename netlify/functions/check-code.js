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
        const { code } = JSON.parse(event.body);
        
        console.log('Codice ricevuto:', code);
        
        const codeMap = {
            "DRAGONE-ANTICO": "Il drago si risveglia quando la luna è alta. Cerca dove le ombre si allungano al tramonto.",
            "SEGRETO-PERDUTO": "La verità giace sotto lo sguardo del guardiano di pietra. Cerca il leone che non ruggisce.",
            "CODICE-OMBRA": "Nell'acqua che non scorre, troverai la prossima chiave. La fontana muta attende."
        };
        
        const valid = codeMap.hasOwnProperty(code);
        const message = valid ? codeMap[code] : "Codice non riconosciuto";
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                valid: valid, 
                message: message,
                receivedCode: code
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
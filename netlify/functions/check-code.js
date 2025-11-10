exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    
    try {
        const { code } = JSON.parse(event.body);
        
        // Mappa dei codici validi e dei relativi messaggi
        const codeMap = {
            "DRAGONE-ANTICO": "Il drago si risveglia quando la luna è alta. Cerca dove le ombre si allungano al tramonto.",
            "SEGRETO-PERDUTO": "La verità giace sotto lo sguardo del guardiano di pietra. Cerca il leone che non ruggisce.",
            "CODICE-OMBRA": "Nell'acqua che non scorre, troverai la prossima chiave. La fontana muta attende."
        };
        
        const valid = codeMap.hasOwnProperty(code);
        const message = valid ? codeMap[code] : "Codice non riconosciuto";
        
        return {
            statusCode: 200,
            body: JSON.stringify({ valid: valid, message: message })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
}
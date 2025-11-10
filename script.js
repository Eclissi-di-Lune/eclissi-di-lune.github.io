function checkCode() {
    const code = document.getElementById('codeInput').value.trim();
    const resultDiv = document.getElementById('result');
    
    // Mappa temporanea dei codici - POI SOSTITUIRAI CON NETLIFY FUNCTIONS
    const codeMap = {
        "DRAGONE-ANTICO": "Il drago si risveglia quando la luna è alta. Cerca dove le ombre si allungano al tramonto.",
        "SEGRETO-PERDUTO": "La verità giace sotto lo sguardo del guardiano di pietra. Cerca il leone che non ruggisce.",
        "CODICE-OMBRA": "Nell'acqua che non scorre, troverai la prossima chiave. La fontana muta attende."
    };
    
    if (codeMap[code]) {
        resultDiv.innerHTML = `<div class="success">${codeMap[code]}</div>`;
        resultDiv.style.borderColor = "#00ff00";
    } else {
        resultDiv.innerHTML = '<div class="error">Codice non riconosciuto. Controlla e riprova.</div>';
        resultDiv.style.borderColor = "#ff0000";
    }
}
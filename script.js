function accedi() {
    // Cambia lo stato da Offline a Online
    document.getElementById('statusText').textContent = 'Online';
    document.querySelector('.status').classList.add('online');
    
    // Nasconde il bottone Accedi
    document.getElementById('loginBtn').style.display = 'none';
    
    // Mostra il terminale
    document.getElementById('terminal').style.display = 'block';
    
    // Avvia l'effetto typing
    typeText("typingText", "Sistema di autenticazione avviato...", 50, function() {
        // Quando finisce il typing, mostra l'input
        setTimeout(function() {
            document.getElementById('inputContainer').style.display = 'flex';
            document.getElementById('codeInput').focus();
        }, 500);
    });
}

// Funzione per l'effetto typing
function typeText(elementId, text, speed, callback) {
    const element = document.getElementById(elementId);
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Rimuove il cursore quando finisce
            element.style.borderRight = 'none';
            if (callback) callback();
        }
    }
    
    type();
}

// Funzione per verificare i codici
function checkCode() {
    const code = document.getElementById('codeInput').value.trim();
    const resultDiv = document.getElementById('result');
    
    // Mappa temporanea - POI SOSTITUIRAI CON NETLIFY FUNCTIONS
    const codeMap = {
        "DRAGONE-ANTICO": "Il drago si risveglia quando la luna è alta. Cerca dove le ombre si allungano al tramonto.",
        "SEGRETO-PERDUTO": "La verità giace sotto lo sguardo del guardiano di pietra. Cerca il leone che non ruggisce.",
        "CODICE-OMBRA": "Nell'acqua che non scorre, troverai la prossima chiave. La fontana muta attende."
    };
    
    if (codeMap[code]) {
        resultDiv.innerHTML = codeMap[code];
        resultDiv.style.borderColor = "#00ff00";
    } else {
        resultDiv.innerHTML = "CODICE NON RICONOSCIUTO. CONTROLLARE E RIPROVARE.";
        resultDiv.style.borderColor = "#ff0000";
    }
    
    // Pulisce l'input dopo l'invio
    document.getElementById('codeInput').value = '';
}

// Permette di inviare con Enter
document.getElementById('codeInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkCode();
    }
});
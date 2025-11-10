// Sequenza di testo per l'effetto typing
const terminalSequence = [
    { id: 'title', text: 'Terminale della Fondazione A⚡Z 0X41', delay: 100, initialDelay: 500 },
    { id: 'separator', text: '-------------------------------', delay: 30, initialDelay: 200 },
    { id: 'motto', text: 'Costringi, Comprendi, Contieni', delay: 80, initialDelay: 200 },
    { id: 'separator2', text: '-------------------------------', delay: 30, initialDelay: 200 },
    { id: 'status', text: 'Terminale della Fondazione 0X41: Online', delay: 60, initialDelay: 200 }
];

// Funzione principale per l'effetto typing
function typeText(elementId, text, speed, callback) {
    const element = document.getElementById(elementId);
    const line = element.parentElement;
    
    // Mostra la riga
    line.style.opacity = 1;
    
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

// Gestisce l'intera sequenza
async function startTerminalSequence() {
    for (const item of terminalSequence) {
        await new Promise(resolve => {
            setTimeout(() => {
                typeText(item.id, item.text, item.delay, resolve);
            }, item.initialDelay);
        });
    }
    
    // Dopo la sequenza, mostra l'input
    setTimeout(() => {
        document.getElementById('inputLine').style.display = 'flex';
        document.getElementById('codeInput').focus();
    }, 500);
}

// Funzione per verificare i codici (manteniamo la tua versione)
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
        resultDiv.style.display = 'block';
        resultDiv.style.borderColor = "#00ff00";
    } else {
        resultDiv.innerHTML = "CODICE NON RICONOSCIUTO. CONTROLLARE E RIPROVARE.";
        resultDiv.style.display = 'block';
        resultDiv.style.borderColor = "#ff0000";
    }
}

// Avvia tutto quando la pagina è caricata
document.addEventListener('DOMContentLoaded', function() {
    startTerminalSequence();
    
    // Permette di inviare con Enter
    document.getElementById('codeInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkCode();
        }
    });
});
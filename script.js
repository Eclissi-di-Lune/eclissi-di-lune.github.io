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
        // Quando finisce il typing, mostra l'input per la traccia di sangue
        setTimeout(function() {
            document.getElementById('inputContainer').style.display = 'flex';
            document.getElementById('playerNameInput').focus();
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

// Funzione per verificare il nome del giocatore
function checkPlayerName() {
    const playerName = document.getElementById('playerNameInput').value.trim();
    const resultDiv = document.getElementById('result');
    
    // Controllo frontend per "Archibald" - crash della pagina
    if (playerName === "Archibald") {
        window.close();
        throw new Error("Accesso negato: REDACT-----");
    }
    
    // Verifica con il backend
    checkPlayerNameBackend(playerName);
}

// Funzione per verificare il nome nel backend
async function checkPlayerNameBackend(playerName) {
    const resultDiv = document.getElementById('result');
    
    try {
        // Chiamata alla Netlify Function
        const response = await fetch('https://terminale-az.netlify.app/.netlify/functions/check-player', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerName: playerName }),
        });
        
        const data = await response.json();
        
        if (data.valid) {
            // Se il nome è valido, mostra il secondo step
            showSecondStep(playerName);
        } else {
            // Se il nome non è valido, mostra un errore
            resultDiv.innerHTML = "Traccia di sangue non riconosciuta. Accesso negato.";
            resultDiv.style.display = 'block';
            resultDiv.style.borderColor = "#ff0000";
        }
    } catch (error) {
        console.error('Errore:', error);
        resultDiv.innerHTML = "Errore di connessione al server centrale.";
        resultDiv.style.display = 'block';
        resultDiv.style.borderColor = "#ff0000";
    }
}

// Funzione per mostrare il secondo step
function showSecondStep(playerName) {
    // Nasconde il primo input
    document.getElementById('inputContainer').style.display = 'none';
    document.getElementById('result').style.display = 'none';
    
    // Mostra il secondo step
    document.getElementById('secondStep').style.display = 'block';
    
    // Avvia l'effetto typing per il messaggio di benvenuto
    const welcomeMessage = "| Caricamento...\n| Campione Riconosciuto. Bentornata " + playerName + ".";
    typeText("welcomeText", welcomeMessage, 50, function() {
        // Quando finisce il typing, mostra l'input per il codice del file
        setTimeout(function() {
            document.getElementById('fileCodeInputContainer').style.display = 'flex';
            document.getElementById('fileCodeInput').focus();
        }, 500);
    });
}

// Funzione per verificare il codice del file
function checkFileCode() {
    const fileCode = document.getElementById('fileCodeInput').value.trim();
    checkFileCodeBackend(fileCode);
}

// Funzione per verificare il codice del file nel backend
async function checkFileCodeBackend(fileCode) {
    const fileResultDiv = document.getElementById('fileResult');
    
    try {
        const response = await fetch('https://terminale-az.netlify.app/.netlify/functions/check-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: fileCode }),
        });
        
        const data = await response.json();
        
        if (data.valid) {
            fileResultDiv.innerHTML = data.message;
            fileResultDiv.style.borderColor = "#00ff00";
        } else {
            fileResultDiv.innerHTML = "Codice file non valido. Verificare e riprovare.";
            fileResultDiv.style.borderColor = "#ff0000";
        }
        
        fileResultDiv.style.display = 'block';
        
        // Pulisce l'input dopo l'invio
        document.getElementById('fileCodeInput').value = '';
    } catch (error) {
        console.error('Errore:', error);
        fileResultDiv.innerHTML = "Errore di connessione al database centrale.";
        fileResultDiv.style.display = 'block';
        fileResultDiv.style.borderColor = "#ff0000";
    }
}

// Permette di inviare con Enter per entrambi gli input
document.getElementById('playerNameInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkPlayerName();
    }
});

document.getElementById('fileCodeInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkFileCode();
    }
});
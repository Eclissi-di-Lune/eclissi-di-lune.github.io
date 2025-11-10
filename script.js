let currentPlayerName = '';

function accedi() {
    document.getElementById('statusText').textContent = 'Online';
    document.querySelector('.status').classList.add('online');
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('terminal').style.display = 'block';
    
    startTerminalSequence();
}

// Funzioni per gestire il terminale
function addSystemMessage(message, withTyping = true) {
    const output = document.getElementById('terminalOutput');
    const messageLine = document.createElement('div');
    messageLine.className = 'message-line';
    
    messageLine.innerHTML = `
        <span class="system-prompt">|</span>
        <span class="system-message" id="systemMsg_${Date.now()}">${withTyping ? '' : message}</span>
    `;
    
    output.appendChild(messageLine);
    output.scrollTop = output.scrollHeight;
    
    if (withTyping) {
        const messageElement = messageLine.querySelector('.system-message');
        return new Promise(resolve => {
            typeText(messageElement, message, 30, resolve);
        });
    }
    
    return Promise.resolve();
}

function addUserInputLine(prefix) {
    const output = document.getElementById('terminalOutput');
    const inputLine = document.createElement('div');
    inputLine.className = 'user-input-line';
    inputLine.innerHTML = `
        <span class="user-prompt">></span>
        <span class="user-input">${prefix}</span>
    `;
    
    output.appendChild(inputLine);
    output.scrollTop = output.scrollHeight;
}

function showInput(placeholder, callback) {
    const inputLine = document.getElementById('currentInputLine');
    const input = document.getElementById('currentInput');
    const button = document.getElementById('submitButton');
    
    input.placeholder = placeholder;
    input.value = '';
    input.onkeypress = function(e) {
        if (e.key === 'Enter') {
            callback(input.value.trim());
        }
    };
    
    button.onclick = function() {
        callback(input.value.trim());
    };
    
    inputLine.style.display = 'flex';
    input.focus();
}

function hideInput() {
    document.getElementById('currentInputLine').style.display = 'none';
}

function typeText(element, text, speed, callback) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    
    type();
}

// Sequenza principale del terminale
async function startTerminalSequence() {
    await addSystemMessage("Sistema di autenticazione avviato...");
    await addSystemMessage("Inserire traccia di sangue.");
    
    showInput("Inserire nome agente", async (playerName) => {
        if (playerName === "Archibald") {
            // Crash simulato per Archibald
            document.body.innerHTML = '<div style="color: red; text-align: center; margin-top: 50px;">💥 SISTEMA COMPROMESSO 💥<br>Accesso negato: Rilevata contaminazione</div>';
            return;
        }
        
        // Aggiungi la riga con l'input dell'utente
        addUserInputLine(playerName);
        hideInput();
        
        // Verifica il nome con il backend
        await checkPlayerNameBackend(playerName);
    });
}

// Verifica del nome del giocatore
async function checkPlayerNameBackend(playerName) {
    try {
        await addSystemMessage("Verifica traccia di sangue in corso...");
        
        const response = await fetch('https://terminale-az.netlify.app/.netlify/functions/check-player', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerName: playerName }),
        });
        
        const data = await response.json();
        
        if (data.valid) {
            currentPlayerName = playerName;
            await addSystemMessage("Traccia di sangue verificata. Accesso consentito.");
            await showSecondStep();
        } else {
            await addSystemMessage("ERRORE: Traccia di sangue non riconosciuta.", false);
            await addSystemMessage("Riprovare l'autenticazione...", false);
            // Ricomincia la sequenza
            setTimeout(startTerminalSequence, 2000);
        }
    } catch (error) {
        await addSystemMessage("ERRORE: Connessione al server centrale fallita.", false);
        setTimeout(startTerminalSequence, 2000);
    }
}

// Secondo step dopo il login
async function showSecondStep() {
    await addSystemMessage("Caricamento profilo agente...");
    await addSystemMessage(`Campione riconosciuto. Bentornata, ${currentPlayerName}.`);
    await addSystemMessage("Sistema pronto. Inserire codice file.");
    
    showInput("Inserire codice file", async (fileCode) => {
        // Aggiungi la riga con l'input dell'utente
        addUserInputLine(fileCode);
        hideInput();
        
        // Verifica il codice del file
        await checkFileCodeBackend(fileCode);
        
        // Dopo la risposta, mostra di nuovo l'input per nuovi codici
        setTimeout(() => {
            showInput("Inserire codice file", async (newFileCode) => {
                addUserInputLine(newFileCode);
                hideInput();
                await checkFileCodeBackend(newFileCode);
                // Continua a mostrare l'input per nuovi codici
                setTimeout(() => showInput("Inserire codice file", arguments.callee), 1000);
            });
        }, 1000);
    });
}

// Verifica del codice del file
async function checkFileCodeBackend(fileCode) {
    try {
        await addSystemMessage("Verifica codice file in corso...");
        
        const response = await fetch('https://terminale-az.netlify.app/.netlify/functions/check-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: fileCode }),
        });
        
        const data = await response.json();
        
        if (data.valid) {
            await addSystemMessage("Codice file verificato. Accesso ai dati consentito.");
            await addSystemMessage("=== INIZIO TRANSMISSIONE ===", false);
            await addSystemMessage(data.message, false);
            await addSystemMessage("=== FINE TRANSMISSIONE ===", false);
        } else {
            await addSystemMessage("ERRORE: Codice file non valido.", false);
        }
    } catch (error) {
        await addSystemMessage("ERRORE: Connessione al database centrale fallita.", false);
    }
}
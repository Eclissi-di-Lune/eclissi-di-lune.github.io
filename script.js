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

function addUserInputLine(input) {
    const output = document.getElementById('terminalOutput');
    const inputLine = document.createElement('div');
    inputLine.className = 'user-input-line';
    inputLine.innerHTML = `
        <span class="user-prompt">></span>
        <span class="user-input">${input}</span>
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
    
    // Rimuovi i listener precedenti per evitare duplicati
    input.onkeypress = null;
    button.onclick = null;
    
    let isSubmitting = false; // Flag per prevenire doppi invii
    
    input.onkeypress = function(e) {
        if (e.key === 'Enter') {
            const value = input.value.trim();
            if (value && !isSubmitting) {
                isSubmitting = true;
                callback(value);
                // Previene ulteriori invii per 1 secondo
                setTimeout(() => { isSubmitting = false; }, 1000);
            }
        }
    };
    
    button.onclick = function() {
        const value = input.value.trim();
        if (value && !isSubmitting) {
            isSubmitting = true;
            callback(value);
            setTimeout(() => { isSubmitting = false; }, 1000);
        }
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
    element.style.borderRight = '2px solid #00ff00';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            element.style.borderRight = 'none';
            callback();
        }
    }
    
    type();
}

// Sequenza principale del terminale
async function startTerminalSequence() {
    await addSystemMessage("Sistema di autenticazione avviato...");
    await addSystemMessage("Inserire traccia di sangue.");
    
    showInput("Inserire nome di chi offre il sangue", async (playerName) => {        
        // Aggiungi la riga con l'input dell'utente
        addUserInputLine(playerName);
        hideInput();
        
        // Prima verifica gli effetti speciali
        const hasSpecialEffect = await checkGlitchEffects(playerName);
        
        // Se non c'è effetto speciale, procedi con la verifica normale
        if (!hasSpecialEffect) {
            await checkPlayerNameBackend(playerName);
        }
    });
}

// Funzione per verificare effetti speciali
async function checkGlitchEffects(playerName) {
    try {
        const response = await fetch('https://terminale-az.netlify.app/.netlify/functions/glitch-effect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerName: playerName }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.effect && data.effect !== 'none') {
            await showSpecialEffect(data);
            return true; // Indica che c'è stato un effetto speciale
        }
        return false;
    } catch (error) {
        console.error('Errore effetti speciali:', error);
        return false;
    }
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
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.valid) {
            currentPlayerName = playerName;
            await addSystemMessage("Traccia di sangue verificata. Accesso consentito.");
            await showSecondStep();
        } else {
            await addSystemMessage("ERRORE: Traccia di sangue non riconosciuta.");
            await addSystemMessage("Riprovare l'autenticazione...");
            // Ricomincia la sequenza
            setTimeout(startTerminalSequence, 2000);
        }
    } catch (error) {
        await addSystemMessage("ERRORE: Connessione al server centrale fallita.");
        setTimeout(startTerminalSequence, 2000);
    }
}

// Secondo step dopo il login
async function showSecondStep() {
    await addSystemMessage("Caricamento profilo agente...");
    await addSystemMessage(`Campione riconosciuto. Bentornata, ${currentPlayerName}.`);
    await addSystemMessage("Sistema pronto. Inserire codice file.");
    
    startFileInputLoop();
}

// Loop per input file
function startFileInputLoop() {
    showInput("Inserire codice file", async (fileCode) => {
        // Aggiungi la riga con l'input dell'utente
        addUserInputLine(fileCode);
        hideInput();
        
        // Verifica il codice del file
        await checkFileCodeBackend(fileCode);
        
        // Continua il loop
        startFileInputLoop();
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
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.valid) {
            await addSystemMessage("Codice file verificato. Accesso ai dati consentito.");
            await addSystemMessage("=== INIZIO TRANSMISSIONE ===", false);
            await addSystemMessage(data.message);
            await addSystemMessage("=== FINE TRANSMISSIONE ===", false);
        } else {
            await addSystemMessage("ERRORE: Codice file non valido.", false);
        }
    } catch (error) {
        await addSystemMessage("ERRORE: Connessione al database centrale fallita.");
    }
}

// Funzione per mostrare effetti speciali
async function showSpecialEffect(data) {
    if (data.effect === 'ascii_art') {
        // Nascondi il terminale
        document.getElementById('terminal').style.display = 'none';
        
        // Crea un div per l'effetto
        const effectContainer = document.createElement('div');
        effectContainer.id = 'special-effect';
        effectContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            white-space: pre;
            font-size: 12px;
            line-height: 1;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            text-align: center;
        `;
        
        // Aggiungi l'ASCII art
        effectContainer.textContent = data.art;
        document.body.appendChild(effectContainer);
        
        // Effetto flicker
        await flickerEffect(effectContainer);
        
        // Dopo l'effetto, gestisci la chiusura
        if (data.closePage) {
            setTimeout(() => {
                // Tenta di chiudere la finestra
                if (!window.closed) {
                    window.close();
                }
                // Fallback: mostra messaggio di errore
                setTimeout(() => {
                    document.body.innerHTML = `
                        <div style="color: red; text-align: center; margin-top: 50px; padding: 20px;">
                            <h1>S I S T E M A   C O M P R O M E S S O</h1>
                            <p>Accesso negato: Rilevata breccia di contenimento</p>
                        </div>
                    `;
                }, 1000);
            }, 3000);
        }
    }
}

// Funzione per l'effetto flicker
async function flickerEffect(container) {
    const flickerDuration = 3000;
    const startTime = Date.now();
    
    function flicker() {
        if (Date.now() - startTime < flickerDuration) {
            const random = Math.random();
            if (random > 0.7) {
                container.style.background = '#00ff00';
                container.style.color = 'black';
            } else {
                container.style.background = 'black';
                container.style.color = '#00ff00';
            }
            setTimeout(flicker, 50 + Math.random() * 150);
        } else {
            container.style.background = 'black';
            container.style.color = '#00ff00';
        }
    }
    
    flicker();
}
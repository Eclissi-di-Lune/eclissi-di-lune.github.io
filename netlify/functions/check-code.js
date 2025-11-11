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
            "DRAGONE-ANTICO": 
                "Il drago si risveglia quando la luna è alta. Cerca dove le ombre si allungano al tramonto."
                ,
            "abloodymoonandabeatensun":
                `
                Istruzioni:

                Quando L'Infante si avvicina a meno di 500 metri dalla vostra base, attivate le luci da 250 lumen attorno alla base. Questo può essere fatto tramite il pannello di controllo dietro di voi.

                Tentate di riparare le luci solo durante la notte. Il manuale per la Riparazione e Manutenzione dei Riflettori, versione x0.87, si trova nel cassetto in alto a sinistra della scrivania. Gli strumenti si trovano nella cassetta degli attrezzi accanto al terminale.

                Mangiate solo tre barattoli di frutta/verdura al giorno; ciò vi durerà per circa 5 anni. Utilizzate la camera di coltivazione con i semi che trovate nella stessa area dei cibi in scatola per produrre altro cibo. Cercate di arrivare a un punto in cui possiate mangiare solo due barattoli di frutta/verdura e una porzione di cibo coltivato a giorni alterni.

                Il controllo dei parassiti non è necessario.

                Se L'Infante scopre la vostra posizione e non viene respinto dalle luci, nella cassaforte con codice HFSE631 si trova una pillola che causa una morte rapida e indolore. Utilizzatela solo se la presenza de L'Infante è certa e non un'illusione.

                Un (1) Risultato Aggiuntivo: Nota di "█████████"

                Alla sfortunata persona inviata a presidiare questo avamposto,

                Stare a dichiarare il mio nome ora sarebbe uno spreco di tempo, ma se sei arrivato a questo punto, puoi capire che ero una persona importante. Io non esisterò più, ma questo file continuerà a esistere finché esisterà la speciale macchina che ho usato per scriverlo. E io non so nemmeno dove si trovi quell'aggeggio, quindi questo file è al sicuro.

                Ti trovi su un'isola al largo della costa di un'altra isola più grande che un tempo esisteva vicino al Polo Nord della Terra. È una piccola isola, e ci sono solo altri 50 avamposti là fuori, presidiati da altre 49 persone. Dalla sua origine, la Terra ha avuto un solo continente: l'Asia, con Cina, Africa Orientale e Oceania come parti principali del continente. Abbiamo alcune prove dell'esistenza di continenti precedenti, prima che L'Infante li raggiungesse. Il tuo compito è semplice. Uccidi L'Infante. Il nome del Bambino è Smith, e lui non esiste. Come lo realizzerai dipende da te, ma prenditi il tuo tempo. Hai tutto il tempo del mondo.

                L'Infante proveniva da un paese che non conosceva il resto del mondo. Conosceva solo le altre isole che lo circondavano. Nel 2001, ha cessato di esistere. I due enormi continenti a estremo occidente sono sempre esistiti per lui, e continueranno a esistere per lui. Lui vive in un mondo normale. Semplicemente non esistono più per noi. Non ora.

                Hai circa 50 anni per completare il tuo compito. Questo è ciò che intendo con "tutto il tempo del mondo". A 30 anni, la luna scomparirà, e a 50 anni, il Sole. Questo ucciderà L'Infante, ma preferirei che non si arrivasse a quel punto. Mettiti all'opera.

                Oh, e hai anche un obiettivo secondario...
                
                Ricordati di noi.
                `
                ,

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
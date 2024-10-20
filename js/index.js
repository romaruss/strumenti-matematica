// Funzione per caricare il contenuto di una pagina HTML e gli script associati
function loadPage(page, script) {
    fetch(page)
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nel caricamento della pagina.');
            }
            return response.text();
        })
        .then(html => {
            document.getElementById('contentArea').innerHTML = html; // Inserisci il contenuto nel div

            // Rimuovi eventuali script precedenti
            const existingScript = document.getElementById('dynamicScript');
            if (existingScript) {
                existingScript.remove();
            }

            // Carica lo script JavaScript associato
            if (script) {
                const scriptElement = document.createElement('script');
                scriptElement.src = script;
                scriptElement.id = 'dynamicScript';
                document.body.appendChild(scriptElement); // Aggiungi lo script al corpo del documento
            }
        })
        .catch(error => {
            document.getElementById('contentArea').innerHTML = '<p>Errore nel caricamento della pagina.</p>';
        });
}

// Assegna l'evento click al link "Operazioni entro il 100"
document.getElementById('linkOperazioni100').addEventListener('click', function(e) {
    e.preventDefault(); // Evita la navigazione normale
    loadPage('html/operazioniEntroil100.html', 'js/operazioniEntroil100.js'); // Carica la pagina operazioni.html e il relativo script
});

// Funzione per caricare il contenuto di una pagina HTML
function loadPage(page) {
    fetch(page)
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nel caricamento della pagina.');
            }
            return response.text();
        })
        .then(html => {
            document.getElementById('contentArea').innerHTML = html; // Carica il contenuto nel div contentArea
        })
        .catch(error => {
            document.getElementById('contentArea').innerHTML = '<p>Errore nel caricamento della pagina.</p>';
        });
}

// Assegna l'evento click al link "Operazioni entro il 100"
document.getElementById('linkOperazioni100').addEventListener('click', function(e) {
    e.preventDefault(); // Evita che il link segua la navigazione normale
    loadPage('html/operazioni.html'); // Carica la pagina operazioni.html
});

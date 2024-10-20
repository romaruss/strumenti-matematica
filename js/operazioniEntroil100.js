let currentOperationIndex = 0;
const operations = [];
const results = [];
const maxOperations = 10;

document.getElementById('startButton').addEventListener('click', function() {
    currentOperationIndex = 0;
    operations.length = 0; // Pulisce le operazioni precedenti
    results.length = 0; // Pulisce i risultati precedenti
    document.getElementById('operation').style.display = 'block';
    document.getElementById('squaresContainer').style.display = 'flex'; // Mostra i quadrati
    displayOperation();
});

document.getElementById('resultsButton').addEventListener('click', function() {
    endGame();
});

document.getElementById('restartButton').addEventListener('click', function() {
    location.reload();
});

document.getElementById('homeButton').addEventListener('click', function() {
    window.location.href = 'index.html'; // Cambia 'index.html' con il nome della tua pagina principale
});

function displayOperation() {
    if (currentOperationIndex < maxOperations) {
        generateOperation();
        document.getElementById('operation').textContent = operations[currentOperationIndex];
        colorSquare(currentOperationIndex, 'red');
        currentOperationIndex++;
        resetProgressBar(); 
        startProgressBar();
    } else {
        endGame();
    }
}

function generateOperation() {
    // Generazione delle operazioni di somma e sottrazione
}

function displayResults() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; 
    resultsDiv.style.display = 'block';

    const resultsTable = document.createElement('table');
    resultsTable.setAttribute('id', 'resultsTable');

    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Operazione</th><th>Risultato</th>';
    resultsTable.appendChild(headerRow);

    for (let i = 0; i < operations.length; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${operations[i]}</td><td>${results[i]}</td>`;
        resultsTable.appendChild(row);
    }

    resultsDiv.appendChild(resultsTable);
}

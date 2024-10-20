const operations = [];
const results = [];

let currentOperationIndex = 0;

        const maxOperations = 10;
        let timerInterval;
        let operationTime = 10; // Default time in seconds
        let timeInterval; // Variable to hold the interval for changing operations

// Funzione per generare operazioni (somma o sottrazione)
function generateOperation() {
    let operation = '';
    let result = 0;
    const includeAddition = document.getElementById('additionCheck').checked;
    const includeSubtraction = document.getElementById('subtractionCheck').checked;
    const firstAddendRound = document.getElementById('firstAddendRound').checked;
    const secondAddendRound = document.getElementById('secondAddendRound').checked;
    const threeAddends = document.getElementById('threeAddends').checked;
    const thirdAddendRound = document.getElementById('thirdAddendRound').checked;
    const minuendRound = document.getElementById('minuendRound').checked;
    const subtrahendRound = document.getElementById('subtrahendRound').checked;

    function getRandomNonZero(min, max) {
        let num;
        do {
            num = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (num === 0); // Esclude lo 0
        return num;
    }

    // Genera una somma o sottrazione
    if (includeAddition && (Math.random() < 0.5 || !includeSubtraction)) {
        let num1 = firstAddendRound ? getRandomNonZero(1, 9) * 10 : getRandomNonZero(1, 99);
        let num2 = secondAddendRound ? getRandomNonZero(1, 9) * 10 : getRandomNonZero(1, 100 - num1);

        if (threeAddends) {
            let num3 = thirdAddendRound ? getRandomNonZero(1, 9) * 10 : getRandomNonZero(1, 100 - num1 - num2);
            operation = `${num1} + ${num2} + ${num3}`;
            result = num1 + num2 + num3;
        } else {
            operation = `${num1} + ${num2}`;
            result = num1 + num2;
        }
    } else if (includeSubtraction) {
        let num1 = minuendRound ? getRandomNonZero(1, 9) * 10 : getRandomNonZero(1, 99);
        let num2 = subtrahendRound ? getRandomNonZero(1, 9) * 10 : getRandomNonZero(1, num1);
        operation = `${num1} - ${num2}`;
        result = num1 - num2;
    }

    if (result > 100 || result < 0) {
        generateOperation(); // Ricrea l'operazione se non valida
    } else {
        operations.push(operation);
        results.push(result);
    }
}

// Funzione per visualizzare l'operazione attuale
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

// Funzione per terminare il gioco e mostrare i risultati
function endGame() {
    clearInterval(timerInterval);
    document.getElementById('operation').style.display = 'none';
    document.getElementById('squaresContainer').style.display = 'none';
    document.getElementById('resultsButton').style.display = 'inline';
    document.getElementById('restartButton').style.display = 'inline';
    displayResults();
}

// Funzione per visualizzare i risultati
function displayResults() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Pulisce i risultati precedenti
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

// Assegna l'evento click per iniziare il gioco
document.getElementById('startButton').addEventListener('click', function() {
    currentOperationIndex = 0;
    operations.length = 0;
    results.length = 0;
    document.getElementById('operation').style.display = 'block';
    document.getElementById('squaresContainer').style.display = 'flex';
    initializeSquares(); // Inizializza i quadrati di avanzamento
    displayOperation();
});

document.getElementById('restartButton').addEventListener('click', function() {
    location.reload();
});

document.getElementById('resultsButton').addEventListener('click', function() {
    endGame();
});

let timerInterval;
let operationTime = 10; // Tempo predefinito in secondi
const maxOperations = 10; // Numero massimo di operazioni
let currentOperationIndex = 0; // Indicatore dell'operazione attuale

// Settaggio slider del tempo
const savedTime = localStorage.getItem('operationTime');
if (savedTime) {
    operationTime = savedTime;
    document.getElementById('timeSlider').value = operationTime;
    document.getElementById('timeValue').textContent = operationTime;
}

document.getElementById('timeSlider').addEventListener('input', function() {
    operationTime = this.value;
    document.getElementById('timeValue').textContent = operationTime;
    localStorage.setItem('operationTime', operationTime);
});

// Funzione per resettare la barra di progresso
function resetProgressBar() {
    document.getElementById('progress').style.width = '100%'; // Riempie immediatamente la barra
}

// Funzione per avviare la barra di progresso
function startProgressBar() {
    let progress = 100;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        progress -= (100 / (operationTime * 10)); // Diminuisci la percentuale in base al tempo
        if (progress <= 0) {
            clearInterval(timerInterval);
            displayOperation(); // Mostra la prossima operazione quando il timer scade
        } else {
            document.getElementById('progress').style.width = `${progress}%`; // Aggiorna la larghezza della barra
        }
    }, 100);
}

// Funzione per colorare il quadrato di avanzamento
function colorSquare(index, color) {
    document.getElementById('squaresContainer').children[index].style.backgroundColor = color;
}

// Aggiunge i quadratini di progresso
function initializeSquares() {
    const squaresContainer = document.getElementById('squaresContainer');
    squaresContainer.innerHTML = ''; // Pulisce eventuali quadrati precedenti
    for (let i = 0; i < maxOperations; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        squaresContainer.appendChild(square);
    }
}

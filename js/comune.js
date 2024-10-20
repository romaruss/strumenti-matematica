let timerInterval;
let operationTime = 10; // Tempo predefinito in secondi

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

function resetProgressBar() {
    document.getElementById('progress').style.width = '100%'; 
}

function startProgressBar() {
    let progress = 100;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        progress -= (100 / (operationTime * 10));
        if (progress <= 0) {
            clearInterval(timerInterval);
            displayOperation(); 
        } else {
            document.getElementById('progress').style.width = `${progress}%`; 
        }
    }, 100);
}

// Funzione per colorare il quadrato di avanzamento
function colorSquare(index, color) {
    document.getElementById('squaresContainer').children[index].style.backgroundColor = color;
}

// Aggiunge quadratini di progresso
for (let i = 0; i < maxOperations; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    document.getElementById('squaresContainer').appendChild(square);
}

let currentOperationIndex = 0;
        const operations = [];
        const results = [];
        const maxOperations = 10;
        let timerInterval;
        let operationTime = 10; // Default time in seconds
        let timeInterval; // Variable to hold the interval for changing operations

        // Set slider value from local storage if it exists
        const savedTime = localStorage.getItem('operationTime');
        if (savedTime) {
            operationTime = savedTime;
            document.getElementById('timeSlider').value = operationTime;
            document.getElementById('timeValue').textContent = operationTime;
        }

        // Update the displayed value of the slider and save it
        document.getElementById('timeSlider').addEventListener('input', function() {
            operationTime = this.value;
            document.getElementById('timeValue').textContent = operationTime;
            localStorage.setItem('operationTime', operationTime); // Save to local storage
        });

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

            const canAdd = includeAddition;
            const canSubtract = includeSubtraction;

            function getRandomNonZero(min, max) {
                let num;
                do {
                    num = Math.floor(Math.random() * (max - min + 1)) + min;
                } while (num === 0); // Esclude lo 0
                return num;
            }

            // Genera una somma o sottrazione
            if (canAdd && (Math.random() < 0.5 || !canSubtract)) {
                let num1 = firstAddendRound ? getRandomNonZero(1, 9) * 10 : getRandomNonZero(1, 99); // Esclude lo 0
                let num2 = secondAddendRound ? getRandomNonZero(1, 9) * 10 : getRandomNonZero(1, 100 - num1); // Esclude lo 0

                if (threeAddends) {
                    let num3 = thirdAddendRound ? getRandomNonZero(1, 9) * 10 : getRandomNonZero(1, 100 - num1 - num2); // Esclude lo 0
                    operation = `${num1} + ${num2} + ${num3}`;
                    result = num1 + num2 + num3;
                } else {
                    operation = `${num1} + ${num2}`;
                    result = num1 + num2;
                }
            } else if (canSubtract) {
                let num1 = minuendRound ? getRandomNonZero(1, 9) * 10 : getRandomNonZero(1, 99); // Esclude lo 0
                let num2 = subtrahendRound ? getRandomNonZero(1, 9) * 10 : getRandomNonZero(1, num1); // Esclude lo 0
                operation = `${num1} - ${num2}`;
                result = num1 - num2;
            }

            // Evita somme con risultato maggiore di 100 o sottrazioni con sottraendo maggiore di 100
            if (result > 100 || result < 0) {
                generateOperation(); // Ricrea l'operazione se non valida
            } else {
                operations.push(operation);
                results.push(result);
            }
        }

        function displayOperation() {
            if (currentOperationIndex < maxOperations) {
                generateOperation();
                document.getElementById('operation').textContent = operations[currentOperationIndex];
                document.getElementById('squaresContainer').children[currentOperationIndex].style.backgroundColor = 'red'; // Colora il quadratino
                currentOperationIndex++;
                resetProgressBar(); // Riempie la barra completamente
                startProgressBar(); // Avvia la barra di avanzamento
            } else {
                endGame();
            }
        }

        function resetProgressBar() {
            document.getElementById('progress').style.width = '100%'; // Riempie immediatamente la barra
        }

        function startProgressBar() {
            let progress = 100; // Percentuale iniziale
            clearInterval(timerInterval); // Ferma il timer se è già in esecuzione
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

        function endGame() {
            clearInterval(timerInterval);
            document.getElementById('operation').style.display = 'none';
            document.getElementById('squaresContainer').style.display = 'none';
            document.getElementById('resultsButton').style.display = 'inline';
            document.getElementById('restartButton').style.display = 'inline';
            displayResults();
        }

        function displayResults() {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = ''; // Pulisce i risultati precedenti
            resultsDiv.style.display = 'block';

            const resultsTable = document.createElement('table');
            resultsTable.setAttribute('id', 'resultsTable');

            const headerRow = document.createElement('tr');
            const operationHeader = document.createElement('th');
            operationHeader.textContent = 'Operazione';
            const resultHeader = document.createElement('th');
            resultHeader.textContent = 'Risultato';
            headerRow.appendChild(operationHeader);
            headerRow.appendChild(resultHeader);
            resultsTable.appendChild(headerRow);

            for (let i = 0; i < operations.length; i++) {
                const row = document.createElement('tr');
                const operationCell = document.createElement('td');
                operationCell.textContent = operations[i];
                const resultCell = document.createElement('td');
                resultCell.textContent = results[i];
                row.appendChild(operationCell);
                row.appendChild(resultCell);
                resultsTable.appendChild(row);
            }

            resultsDiv.appendChild(resultsTable);
        }

        // Aggiunge quadratini
        for (let i = 0; i < maxOperations; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            document.getElementById('squaresContainer').appendChild(square);
        }

        document.getElementById('startButton').addEventListener('click', function() {
            currentOperationIndex = 0;
            operations.length = 0; // Pulisce le operazioni precedenti
            results.length = 0; // Pulisce i risultati precedenti
            document.getElementById('operation').style.display = 'block';
            document.getElementById('squaresContainer').style.display = 'flex'; // Mostra il contenitore dei quadratini
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
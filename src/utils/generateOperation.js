// generateOperation.js

const extractedOperations = []; // Memorizza le operazioni già estratte

function generateOperation(selectedOptions) {
  const operations = [];
  let operation = {};

  const getRandomNumber = (min, max) => {
    let num;
    do {
      num = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (num === 0); // Evita lo 0
    return num;
  };

  const isDuplicate = (expression) => {
    return extractedOperations.some(op => op.expression === expression);
  };

  // Verifica delle opzioni per le addizioni
  if (selectedOptions.Addizioni.includes('Add10')) {
    let addend1, addend2, expression;
    do {
      addend1 = getRandomNumber(1, 9);
      addend2 = getRandomNumber(1, 10 - addend1); // Somma massima di 10
      expression = `${addend1} + ${addend2}`;
    } while (isDuplicate(expression));
    operations.push({ expression, correctAnswer: addend1 + addend2 });
  }

  if (selectedOptions.Addizioni.includes('Add20')) {
    let addend1, addend2, sum, expression;
    do {
      addend1 = getRandomNumber(1, 19);
      addend2 = getRandomNumber(1, 19);
      sum = addend1 + addend2;
      expression = `${addend1} + ${addend2}`;
    } while (sum < 11 || sum > 20 || isDuplicate(expression)); // Verifica anche il duplicato
    operations.push({ expression, correctAnswer: sum });
  }

  if (selectedOptions.Addizioni.includes('Add100')) {
    const add100Operation = generateAdd100Operation(selectedOptions);
    operations.push(add100Operation);
  }

  if (operations.length > 0) {
    operation = operations[Math.floor(Math.random() * operations.length)];
    extractedOperations.push(operation); // Salva l’operazione estratta per evitare duplicati
  } else {
    operation = { expression: 'Nessuna operazione disponibile', correctAnswer: null };
  }

  return operation;
}

// Funzione helper: Gestisce le addizioni entro 100 con le nuove restrizioni
function generateAdd100Operation(selectedOptions) {
  let firstAddend, secondAddend, thirdAddend;

  // Primo addendo: controlla se deve essere una decina tonda
  if (selectedOptions.Addizioni.includes('FirstAddendTens')) {
      firstAddend = generateRoundTens();
  } else {
      firstAddend = Math.floor(Math.random() * 99) + 1;
  }

  // Secondo addendo: controlla se deve essere una decina tonda
  if (selectedOptions.Addizioni.includes('SecondAddendTens')) {
      secondAddend = generateRoundTens();
  } else {
      secondAddend = Math.floor(Math.random() * (100 - firstAddend)) + 1;
  }

  // Verifica se è selezionata l'opzione "Tre addendi"
  if (selectedOptions.Addizioni.includes('ThreeAddends')) {
      // Terzo addendo: controlla se deve essere una decina tonda
      if (selectedOptions.Addizioni.includes('ThirdAddendTens')) {
          thirdAddend = generateRoundTens();
      } else {
          thirdAddend = Math.floor(Math.random() * (100 - firstAddend - secondAddend)) + 1;
      }

      // Calcola il totale della somma dei tre addendi
      const total = firstAddend + secondAddend + thirdAddend;

      // Assicura che il totale sia entro 100
      if (total > 100) {
          return generateAdd100Operation(selectedOptions); // Riprova se il totale supera 100
      }

      // Restituisce un array con l'espressione e il totale per 'ThreeAddends'
      return { expression: `${firstAddend} + ${secondAddend}+ ${thirdAddend}`, correctAnswer: total };
  } else {
      // Calcola il totale della somma dei due addendi
      const total = firstAddend + secondAddend;

      // Assicura che il totale sia entro 100
      if (total > 100) {
          return generateAdd100Operation(selectedOptions); // Riprova se il totale supera 100
      }

      // Restituisce un array con l'espressione e il totale per due addendi
      return { expression: `${firstAddend} + ${secondAddend}`, correctAnswer: total };
  }
}

// Funzione di supporto per generare una decina tonda casuale (10, 20, ... , 90)
const generateRoundTens = () => Math.floor(Math.random() * 9 + 1) * 10;


export { generateOperation };

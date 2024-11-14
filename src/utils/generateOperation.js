// Lista di operazioni già estratte per evitare duplicati
const extractedOperations = []

// Genera un numero casuale tra min e max (inclusi), evitando 0
const getRandomNumber = (min, max) => {
  let num
  //do {
  num = Math.floor(Math.random() * (max - min + 1)) + min
  //} while (num === 0)
  return num
}

function resetOperations() {
   extractedOperations.values = []
}
// Verifica che l'operazione non sia un duplicato
const isDuplicate = (expression) => {
  return extractedOperations.some((op) => op.expression === expression)
}

// Funzione principale per generare l'operazione
function generateOperation(selectedOptions) {
  // Raccoglie tutte le categorie selezionate
  const categories = []

  // Popola la lista delle categorie in base alle selezioni
  if (selectedOptions.Addizioni.includes('Add10')) categories.push('Add10')
  if (selectedOptions.Addizioni.includes('Add20')) categories.push('Add20')
  if (selectedOptions.Addizioni.includes('Add100')) categories.push('Add100')
  if (selectedOptions.Sottrazioni.includes('Sub10')) categories.push('Sub10')
  if (selectedOptions.Sottrazioni.includes('Sub20')) categories.push('Sub20')
  if (selectedOptions.Sottrazioni.includes('Sub100')) categories.push('Sub100')
  if (selectedOptions.Moltiplicazioni.includes('MultTab')) categories.push('MultTab')
  if (selectedOptions.Moltiplicazioni.includes('MultNoCarry')) categories.push('MultNoCarry')
  if (selectedOptions.Moltiplicazioni.includes('MultCarry')) categories.push('MultCarry')
  if (selectedOptions.Divisioni.includes('DivTabelline')) categories.push('DivTabelline')
  if (selectedOptions.Divisioni.includes('DivNoResto')) categories.push('DivNoResto')
  if (selectedOptions.Divisioni.includes('DivResto')) categories.push('DivResto')
  if (selectedOptions.Divisioni.includes('DivRestoInt')) categories.push('DivRestoInt')

  // Se non ci sono categorie selezionate, ritorna un messaggio di errore
  if (categories.length === 0) {
    return { expression: 'Nessuna operazione disponibile', correctAnswer: null }
  }

  // Seleziona casualmente una categoria dalla lista
  const chosenCategory = categories[Math.floor(Math.random() * categories.length)]

  // Genera l’operazione in base alla categoria scelta
  let operation = {}

  switch (chosenCategory) {
    case 'Add10':
      operation = generateAdd10()
      break
    case 'Add20':
      operation = generateAdd20()
      break
    case 'Add100':
      operation = generateAdd100(selectedOptions)
      break
    case 'Sub10':
      operation = generateSub10()
      break
    case 'Sub20':
      operation = generateSub20()
      break
    case 'Sub100':
      operation = generateSub100()
      break
    case 'MultTab':
      operation = generateMultTab()
      break
    case 'MultNoCarry':
      operation = generateMultNoCarry()
      break
    case 'MultCarry':
      operation = generateMultCarry()
      break
    case 'DivTabelline':
      operation = generateDivTabelline()
      break
    case 'DivNoResto':
      operation = generateDivNoResto()
      break
    case 'DivResto':
      operation = generateDivResto()
      break
    case 'DivRestoInt':
      operation = generateDivRestoInt()
      break
  }

  // Aggiunge l'operazione estratta alla lista per evitare duplicati
  extractedOperations.push(operation)
  return operation
}
/*****************************************************************
 * Addizioni
 * *********************************/
// Funzioni per le addizioni
function generateAdd10() {
  let addend1, addend2, expression
  do {
    addend1 = getRandomNumber(1, 9)
    addend2 = getRandomNumber(1, 10 - addend1)
    expression = `${addend1} + ${addend2}`
  } while (isDuplicate(expression))
  return { expression, correctAnswer: addend1 + addend2 }
}

function generateAdd20() {
  let addend1, addend2, sum, expression
  do {
    addend1 = getRandomNumber(1, 19)
    addend2 = getRandomNumber(1, 19)
    sum = addend1 + addend2
    expression = `${addend1} + ${addend2}`
  } while (sum < 11 || sum > 20 || isDuplicate(expression))
  return { expression, correctAnswer: sum }
}

function generateAdd100(selectedOptions) {
  // Codice per generare addizioni entro 100 come mostrato in precedenza
  let addend1 = getRandomNumber(1, 99),
    addend2 = getRandomNumber(1, 99 - addend1),
    total
  if (selectedOptions.Addizioni.includes('ThreeAddends')) {
    let addend3 = getRandomNumber(1, 100 - addend1 - addend2)
    total = addend1 + addend2 + addend3
    return { expression: `${addend1} + ${addend2} + ${addend3}`, correctAnswer: total }
  } else {
    total = addend1 + addend2
    return { expression: `${addend1} + ${addend2}`, correctAnswer: total }
  }
}

/*****************************************************************
 * Sottrzioni
 * *********************************/
// Funzioni per le sottrazioni
function generateSub10() {
  let minuend, subtrahend, expression
  do {
    minuend = getRandomNumber(1, 10)
    subtrahend = getRandomNumber(1, minuend)
    expression = `${minuend} - ${subtrahend}`
  } while (isDuplicate(expression) || minuend - subtrahend === 0)
  return { expression, correctAnswer: minuend - subtrahend }
}

function generateSub20() {
  let minuend, subtrahend, expression
  do {
    minuend = getRandomNumber(1, 20)
    subtrahend = getRandomNumber(1, minuend)
    expression = `${minuend} - ${subtrahend}`
  } while (isDuplicate(expression) || minuend - subtrahend === 0)
  return { expression, correctAnswer: minuend - subtrahend }
}

function generateSub100() {
  let minuend, subtrahend, expression
  do {
    minuend = getRandomNumber(1, 100)
    subtrahend = getRandomNumber(1, minuend)
    expression = `${minuend} - ${subtrahend}`
  } while (isDuplicate(expression) || minuend - subtrahend === 0)
  return { expression, correctAnswer: minuend - subtrahend }
}

/*****************************************************************
 * Moltiplicazioni
 * *********************************/
// Funzioni per le moltiplicazioni
function generateMultTab() {
  let factor1, factor2, expression
  do {
    factor1 = getRandomNumber(2, 10)
    factor2 = getRandomNumber(2, 10)
    expression = `${factor1} × ${factor2}`
  } while (isDuplicate(expression))
  return { expression, correctAnswer: factor1 * factor2 }
}

function generateMultNoCarry() {
  let factor1, factor2, expression
  let tens, units
  do {
    // Estrai il moltiplicatore come una cifra
    factor2 = getRandomNumber(2, 9)

    // Estrai il moltiplicando come un numero di due cifre
    tens = getRandomNumber(1, 9) // Decine
    units = getRandomNumber(0, 9) // Unità
    factor1 = tens * 10 + units

    // Verifica che il prodotto di ciascuna cifra del moltiplicando con il moltiplicatore sia inferiore a 10
  } while (tens * factor2 >= 10 || units * factor2 >= 10 || isDuplicate(`${factor1} × ${factor2}`))

  expression = `${factor1} × ${factor2}`
  return { expression, correctAnswer: factor1 * factor2 }
}

function generateMultCarry() {
  let factor1, factor2, expression
  let tens, units
  do {
    // Estrai il moltiplicatore come una cifra
    factor2 = getRandomNumber(2, 9)

    // Estrai il moltiplicando come un numero di due cifre
    tens = getRandomNumber(1, 9) // Decine
    units = getRandomNumber(0, 9) // Unità
    factor1 = tens * 10 + units

    // Verifica che almeno uno dei prodotti sia maggiore o uguale a 10
  } while ((tens * factor2 < 10 && units * factor2 < 10) || isDuplicate(`${factor1} × ${factor2}`))

  expression = `${factor1} × ${factor2}`
  return { expression, correctAnswer: factor1 * factor2 }
}

/*****************************************************************
 * Divisioni
 * *********************************/
function generateDivTabelline() {
  let dividend, divisor, expression
  do {
    divisor = getRandomNumber(1, 10)
    const correctAnswer = getRandomNumber(1, 10)
    dividend = divisor * correctAnswer // Garantisce che la divisione sia esatta
    expression = `${dividend} ÷ ${divisor}`
  } while (isDuplicate(expression))
  return { expression, correctAnswer: dividend / divisor }
}

function generateDivNoResto() {
  let divisor, multiple1, multiple2, dividend, expression
  do {
    do {
      // Estrazione del divisore tra 2 e 9
      divisor = getRandomNumber(2, 9)

      // Estrazione dei due numeri, entrambi devono essere multipli del divisore

      do {
        multiple1 = getRandomNumber(1, 9) * divisor
      } while (multiple1 >= 10)

      do {
        multiple2 = getRandomNumber(1, 9) * divisor
      } while (multiple2 >= 10)

      // Creazione del dividendo unendo i due numeri (decine + unità)
      dividend = multiple1 * 10 + multiple2

      // Verifica che la divisione dividend / divisor sia > 10
    } while (dividend / divisor <= 10)

    // Creazione dell'espressione di divisione
    expression = `${dividend} ÷ ${divisor}`
  } while (isDuplicate(expression))
  return { expression, correctAnswer: dividend / divisor }
}

function generateDivResto() {
  let divisor, multiple1, multiple2, dividend, expression, dividendNoResto, resto
  do {
    do {
      // Estrazione del divisore tra 2 e 9
      divisor = getRandomNumber(2, 9)

      // Estrazione dei due numeri, entrambi devono essere multipli del divisore

      do {
        multiple1 = getRandomNumber(1, 9) * divisor
      } while (multiple1 >= 10)

      do {
        multiple2 = getRandomNumber(0, 9) * divisor
      } while (multiple2 >= 9)

      // Creazione del dividendo unendo i due numeri (decine + unità)
      do {
        resto = getRandomNumber(1, (divisor-1))
      } while (resto + multiple2 >= 10)

      dividend = multiple1 * 10 + multiple2 + resto
      dividendNoResto = multiple1 * 10 + multiple2

      // Verifica che la divisione dividend / divisor sia > 10
    } while (dividend / divisor <= 10)

    // Creazione dell'espressione di divisione
    expression = `${dividend} ÷ ${divisor}`
  } while (isDuplicate(expression))
  return { expression, correctAnswer: `${dividendNoResto / divisor} + ${resto}` }
}

/**
 * Generates a division operation with an integer remainder.
 * The dividend is a two-digit number formed by combining two multiples of the divisor,
 * and the remainder is a number that, when added to the first multiple, results in a number that is divisible by the divisor.
 *
 * @returns {Object} An object containing the expression and the correct answer.
 * @property {string} expression - The division operation as a string.
 * @property {string} correctAnswer - The correct answer as a string.
 */
function generateDivRestoInt() {
  let divisor, multiple1, multiple2, dividend, expression, resto
  do {
    do {
      // Estrazione del divisore tra 2 e 9
      divisor = getRandomNumber(2, 8)

      // Estrazione dei due numeri, entrambi devono essere multipli del divisore

      do {
        multiple1 = getRandomNumber(1, 9) * divisor
      } while (multiple1 >= 9)

      do {
        resto = getRandomNumber(1, (divisor-1))
      } while (resto + multiple1 >= 10)

      do {
        multiple2 = getRandomNumber(0, 9)
      } while ((resto * 10 + multiple2) % divisor > 0)

      // Creazione del dividendo unendo i due numeri (decine + unità)

      dividend = (multiple1 + resto) * 10 + multiple2

      // Verifica che la divisione dividend / divisor sia > 10
    } while (dividend / divisor <= 10)

    // Creazione dell'espressione di divisione
    expression = `${dividend} ÷ ${divisor}`
  } while (isDuplicate(expression))
  return { expression, correctAnswer: `${dividend / divisor}` }
}


export { generateOperation,resetOperations }

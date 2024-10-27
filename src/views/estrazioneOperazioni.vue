<template>
  <div class="estrazione-operazioni">

    <div v-if="showConfig" class="overlay">

      <!--pannello di configurazione-->
      <div class="config-menu">
        <div class="config-title">
          <h3>Configurazione</h3>
        </div>
        <div class="config-grid">
          <!-- Riga 1 Colonna 1: Addizioni -->
          <div class="config-column" v-if="configOptions.Addizioni">
            <input type="checkbox" v-model="sectionEnabled.Addizioni" />
            <h4 :class="{ highlighted: sectionEnabled.Addizioni }">Addizioni</h4>
            <div v-for="option in configOptions.Addizioni" :key="option.name">
              <input type="checkbox" v-model="selectedOptions.Addizioni" :value="option.name"
                :disabled="isChildDisabled('Addizioni', option.name)" @change="toggleChildOptions('Add100')" />
              <label>{{ option.label }}</label>
            </div>
          </div>

          <!-- Riga 1 Colonna 2: Sottrazioni -->
          <div class="config-column" v-if="configOptions.Sottrazioni">
            <input type="checkbox" v-model="sectionEnabled.Sottrazioni" />
            <h4 :class="{ highlighted: sectionEnabled.Sottrazioni }">Sottrazioni</h4>
            <div v-for="option in configOptions.Sottrazioni" :key="option.name">
              <input type="checkbox" v-model="selectedOptions.Sottrazioni" :value="option.name"
                :disabled="isChildDisabled('Sottrazioni', option.name)" />
              <label>{{ option.label }}</label>
            </div>
          </div>

          <!-- Riga 2 Colonna 1: Moltiplicazioni -->
          <div class="config-column" v-if="configOptions.Moltiplicazioni">
            <input type="checkbox" v-model="sectionEnabled.Moltiplicazioni" />
            <h4 :class="{ highlighted: sectionEnabled.Moltiplicazioni }">Moltiplicazioni</h4>
            <div v-for="option in configOptions.Moltiplicazioni" :key="option.name">
              <input type="checkbox" v-model="selectedOptions.Moltiplicazioni" :value="option.name"
                :disabled="isChildDisabled('Moltiplicazioni', option.name)" />
              <label>{{ option.label }}</label>
            </div>
          </div>

          <!-- Riga 2 Colonna 2: Divisioni -->
          <div class="config-column" v-if="configOptions.Divisioni">
            <input type="checkbox" v-model="sectionEnabled.Divisioni" />
            <h4 :class="{ highlighted: sectionEnabled.Divisioni }">Divisioni</h4>
            <div v-for="option in configOptions.Divisioni" :key="option.name">
              <input type="checkbox" v-model="selectedOptions.Divisioni" :value="option.name"
                :disabled="isChildDisabled('Divisioni', option.name)" />
              <label>{{ option.label }}</label>
            </div>
          </div>

          <!-- Riga 3: Altre Configurazioni a larghezza intera -->
          <div class="config-full-row">
            <div>
              <input type="checkbox" v-model="enableSound" /> <label>Attiva suono</label>
            </div>
            <div>
              <label>Quante operazioni estrarre</label>
              <select v-model="operationsCount">
                <option v-for="count in [5, 10, 15, 20]" :key="count" :value="count">{{ count }}</option>
              </select>
            </div>
            <div>
              <input type="checkbox" v-model="digitalAnswer" /> <label>Risposta digitale</label>
            </div>
            <!-- Contenitore per centrare il pulsante -->
            <div class="button-center">
              <button @click="toggleConfig">Chiudi</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Parte 2: Parte centrale -->
    <div class="main-area">
      <button @click="toggleConfig" class="config-button">Configurazione</button>
      <h2>Operazioni</h2>
      <div class="summary">
        <div v-for="(options, key) in selectedOptions" :key="key">
          <strong>{{ key }}</strong>: {{ options.join(', ') }}
        </div>
      </div>

      <!-- Timer di gioco -->
      <label>Timer di gioco</label>
      <input type="range" v-model="gameTimer" min="1" max="30" class="timer-slider" />
      <span>{{ gameTimer }} secondi</span> <!-- Visualizza il valore selezionato -->
      <!-- fine timer di gioco-->

      
       <button v-if="!gameStarted" @click="startGame">Inizia</button>
      <button v-else @click="stopGame">Stop</button>

      <!-- Area per le operazioni estratte -->
      <div v-if="gameStarted" class="operation-display">
        <h1>{{ currentOperation.expression }}</h1>
        <input v-if="digitalAnswer" v-model="userAnswer" @keyup.enter="submitAnswer" type="text" />
      </div>
    </div>

    <!-- Parte 3: Traccia del Progresso -->
    <div class="progress-area">
      <div class="time-bar" :style="{ width: timeBarWidth + '%' }"></div>
      <div class="progress-indicator">
        <span v-for="(status, index) in progressArray" :key="index" :class="status"></span>
      </div>
    </div>

    <!-- Parte 4: Risultati -->
    <div v-if="showResults" class="results">
      <h3>Risultati</h3>
      <table>
        <tr v-for="(operation, index) in extractedOperations" :key="index">
          <td>{{ operation.expression }}</td>
          <td>{{ operation.correctAnswer }}</td>
        </tr>
      </table>
      <button @click="restartGame">Ricomincia</button>
    </div>
  </div>
</template>

<script>
const LIVELLO_DEBUG = true; // Abilita il debug
import { ref, reactive } from 'vue';

export default {
  setup() {
    const showConfig = ref(false);
    const selectedOptions = reactive({
      Addizioni: [],
      Sottrazioni: [],
      Moltiplicazioni: [],
      Divisioni: []
    });

    const configOptions = reactive({
      Addizioni: [
        { name: 'Add10', label: 'Addizioni entro il 10' },
        { name: 'Add20', label: 'Addizioni entro il 20' },
        { name: 'Add100', label: 'Addizioni entro il 100' },
        { name: 'SecondAddendTens', label: 'Secondo addendo solo decine tonde' },
        { name: 'ThreeAddends', label: 'Tre addendi' },
        { name: 'ThirdAddendTens', label: 'Terzo addendo solo decine tonde' }
      ],
      Sottrazioni: [
        { name: 'Sub10', label: 'Sottrazioni entro il 10' },
        { name: 'Sub20', label: 'Sottrazioni entro il 20' },
        { name: 'Sub100', label: 'Sottrazioni entro il 100' }
      ],
      Moltiplicazioni: [
        { name: 'MultTab', label: 'Moltiplicazioni entro le tabelline' },
        { name: 'MultNoCarry', label: 'Moltiplicazioni senza riporto' },
        { name: 'MultCarry', label: 'Moltiplicazioni con riporto' }
      ],
      Divisioni: [
        { name: 'DivRow', label: 'Divisioni in riga' },
        { name: 'DivCol1', label: 'Divisioni in colonna con una cifra' },
        { name: 'DivCol2', label: 'Divisioni in colonna con due cifre' }
      ]
    });

    // Aggiunta degli stati per controllare l'abilitazione delle sezioni
    const sectionEnabled = reactive({
      Addizioni: true,
      Sottrazioni: true,
      Moltiplicazioni: true,
      Divisioni: true
    });

    const enableSound = ref(false);
    const operationsCount = ref(5);
    const digitalAnswer = ref(false);
    const gameTimer = ref(10);
    const gameStarted = ref(false);
    const showResults = ref(false);
    const currentOperation = ref(null);
    const extractedOperations = ref([]);
    const userAnswer = ref('');
    const progressArray = ref([]);
    const timeBarWidth = ref(100);
    let timerInterval = null;

    const toggleConfig = () => {
      showConfig.value = !showConfig.value;
    };

    const isChildDisabled = (key, optionName) => {
      // Disabilita sezione intera se la sezione principale non è selezionata
      if (!sectionEnabled[key]) return true;

      // Disabilita checkbox figlie se 'Add100' non è selezionato
      if (key === 'Addizioni' && ['SecondAddendTens', 'ThreeAddends', 'ThirdAddendTens'].includes(optionName)) {
        return !selectedOptions.Addizioni.includes('Add100');
      }

      return false;
    };

    const toggleChildOptions = (parent) => {
      if (parent === 'Add100' && !selectedOptions.Addizioni.includes('Add100')) {
        selectedOptions.Addizioni = selectedOptions.Addizioni.filter(
          opt => !['SecondAddendTens', 'ThreeAddends', 'ThirdAddendTens'].includes(opt)
        );
      }
    };

    const startGame = () => {
      if (LIVELLO_DEBUG) {
        console.log("Inizio gioco"); // Messaggio di debug
      }
      gameStarted.value = true;
      showResults.value = false;
      extractedOperations.value = [];
      progressArray.value = Array(operationsCount.value).fill('blue');
      startTimer();
      generateOperation();
    };


    const stopGame = () => {
      gameStarted.value = false;
      clearInterval(timerInterval);
    };

    const generateOperation = () => {
      // Simulazione di generazione di operazioni
      const operation = { expression: '2 + 2', correctAnswer: 4 }; // Questo deve essere sostituito con la logica di generazione reale
      extractedOperations.value.push(operation);
      currentOperation.value = operation;

      // Aggiorna il progresso
      if (progressArray.value.length > 0) {
        progressArray.value[extractedOperations.value.length - 1] = 'red';
      }

      // Se la risposta digitale è abilitata, cambia il colore se corretto
      if (digitalAnswer.value) {
        userAnswer.value = '';
      }

      // Estrai una nuova operazione con frequenza del timer
      if (extractedOperations.value.length < operationsCount.value) {
        setTimeout(generateOperation, gameTimer.value * 1000); // Delay basato sul timer
      } else {
        endGame();
      }
    };

    const endGame = () => {
      clearInterval(timerInterval);
      gameStarted.value = false;
      showResults.value = true;
    };

    const submitAnswer = () => {
      const current = extractedOperations.value[extractedOperations.value.length - 1];
      if (parseInt(userAnswer.value) === current.correctAnswer) {
        progressArray.value[extractedOperations.value.length - 1] = 'green';
      }
      generateOperation();
    };

    const restartGame = () => {
      showResults.value = false;
      gameStarted.value = false;
      progressArray.value = [];
      currentOperation.value = null;
      timeBarWidth.value = 100;
    };

    const startTimer = () => {
      timeBarWidth.value = 100;
      let timeLeft = gameTimer.value;

      timerInterval = setInterval(() => {
        timeLeft--;
        timeBarWidth.value = (timeLeft / gameTimer.value) * 100;

        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          endGame();
        }
      }, 1000);
    };

    return {
      showConfig,
      selectedOptions,
      configOptions,
      sectionEnabled, // Ritorna anche lo stato della sezione per abilitarne/disabilitarne la modifica
      enableSound,
      operationsCount,
      digitalAnswer,
      gameTimer,
      gameStarted,
      showResults,
      currentOperation,
      extractedOperations,
      userAnswer,
      progressArray,
      timeBarWidth,
      toggleConfig,
      toggleChildOptions,
      isChildDisabled,
      startGame,
      stopGame,
      submitAnswer,
      restartGame,
      startTimer,
      endGame
    };
  }
};
</script>

<style src="@/assets/estrazioneOperazioni.css"></style>
<style src="@/assets/estrazioneOperazioni-pannello.css"></style>

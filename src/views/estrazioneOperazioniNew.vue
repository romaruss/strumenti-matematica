<template>
  <div class="estrazione-operazioni">

    <!--importato il template della pagina dal file giocoATempo-template.vue-->
    <!--<giocoATempo_template  @update-game-status="handleGameState">-->
    <giocoATempo_template @saveConfigPadre="saveConfig" @nuovaEstrazione="nuovaEstrazione">
      <!--configurazione personalizzata di estrazioneOperazione pannello di configurazione-->
      <template #pannello-configurazione>
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
              <!--<label>Quante operazioni estrarre <h1>{{ gameState.itemTotal }}</h1></label>-->
              <label>Quante operazioni estrarre </label>
              <select v-model="operationsCount">
                <option v-for="count in [5, 10, 15, 20]" :key="count" :value="count">{{ count }}</option>
              </select>
            </div>
            <div>
              <input type="checkbox" v-model="digitalAnswer" /> <label>Risposta digitale</label>
            </div>
          </div>
        </div>


      </template>

      <template #main-area-centro>
        <!-- Area per le operazioni estratte -->
        <div class="operation-display-container">
          <div v-if="gameState.gameStarted" class="operation-display">
            <h1>CE: {{ currentOperation.expression }}</h1>
          </div>
          <div v-else class="operation-display">
            <h1>Pronto</h1>
            <h1>{{ gameState.itemTotal }}</h1>
          </div>
          <div class="input-container" v-if="gameState.rispostaDigitale">
            <!--<label for="answer-input">Inserisci il risultato</label>-->
            <input id='answer-input' v-model="userAnswer" @keyup.enter="submitAnswer" type="text"
              placeholder="Inserisci il risultato" />
            <button id="input-button" @click="submitAnswer" :disabled="!userAnswer">Invio</button>
          </div>
        </div>
      </template>

      <template #result-table>
        <!--<table>-->
        <tr v-for="(operation, index) in extractedOperations" :key="index">
          <td>operazione</td>
          <td>{{ operation.expression }}</td>
          <td>{{ operation.correctAnswer }}</td>
        </tr>
        <!--</table>-->

      </template>
    </giocoATempo_template>


  </div>
</template>

<script>
const LIVELLO_DEBUG = true; // Abilita il debug
import { ref, reactive, onMounted, onBeforeUnmount, defineComponent, provide } from 'vue';
import { generateOperation, resetOperations } from '@/utils/generateOperation';
import giocoATempo_template from "./templateArchive/giocoATempo_template.vue";

export default defineComponent({
  name: "estrazioneOperazioni",
  components: { giocoATempo_template },
  setup() {

    const showConfig = ref(false);


    //variabili importate dal template
    // Dichiara una variabile reattiva nel padre
    const gameState = reactive({
      gameStarted: false,
      showConfig: false,
      showResultButton: false,
      showResults: false,
      itemTotal: JSON.parse(localStorage.getItem('config'))?.operationsCount || 5,
      gameTimer: JSON.parse(localStorage.getItem('config'))?.gameTimer || 5,
      enableSound: JSON.parse(localStorage.getItem('config'))?.enableSound,
      rispostaDigitale: true,
      status: 'idle', //stati possibili: idle (pronto a partire) started, stopped, results
      answerGiven: 'none' // none=risposta non data, correct: risposta data corretta, wrong risposta data sbagliata

    });
    //rende disponibile la variabile al figlio
    provide("gameState", gameState);

    const loadConfig = () => {
      const savedConfig = localStorage.getItem('config'); // Recupera la configurazione salvata
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        // Carica le variabili dal localStorage
        sectionEnabled.Addizioni = config.sectionEnabled.Addizioni || true;
        sectionEnabled.Sottrazioni = config.sectionEnabled.Sottrazioni || true;
        sectionEnabled.Moltiplicazioni = config.sectionEnabled.Moltiplicazioni || true;
        sectionEnabled.Divisioni = config.sectionEnabled.Divisioni || true;

        // Carica le opzioni selezionate
        selectedOptions.Addizioni = config.selectedOptions.Addizioni || [];
        selectedOptions.Sottrazioni = config.selectedOptions.Sottrazioni || [];
        selectedOptions.Moltiplicazioni = config.selectedOptions.Moltiplicazioni || [];
        selectedOptions.Divisioni = config.selectedOptions.Divisioni || [];

        // Carica le altre impostazioni
        enableSound.value = config.enableSound || false;
        gameState.itemTotal = config.operationsCount || 5;
        digitalAnswer.value = config.digitalAnswer || false;
        gameTimer.value = config.gameTimer || 10;
      }
    };
    const saveConfig = () => {
      const config = {
        sectionEnabled,
        selectedOptions,
        enableSound: enableSound.value,
        operationsCount: operationsCount.value,
        digitalAnswer: digitalAnswer.value,
        gameTimer: gameTimer.value,
      };
      gameState.itemTotal = operationsCount.value;
      gameState.rispostaDigitale = digitalAnswer.value;
      gameState.enableSound = enableSound.value;
      config.gameTimer = gameState.gameTimer
      localStorage.setItem('config', JSON.stringify(config)); // Salva nel localStorage

      currentOperation.value = null;
      extractedOperations.value = [];
    };

    // Chiama loadConfig quando il componente è montato
    onMounted(() => {
      loadConfig();
    });

    //area configurazioni pannello di controllo
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
        { name: 'FirstAddendTens', label: 'Primo addendo solo decine tonde' },
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
        { name: 'DivTabelline', label: 'Divisioni delle tabelline' },
        { name: 'DivNoResto', label: 'Divisioni in riga senza resto' },
        { name: 'DivResto', label: 'Divisioni in riga con resto' },
        { name: 'DivRestoInt', label: 'Divisioni in riga con resto interno' }
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
    const operationsCount = ref(JSON.parse(localStorage.getItem('config'))?.operationsCount || 5);

    const digitalAnswer = ref(false);

    const gameStarted = ref(false);
    const showResults = ref(false);
    const currentOperation = ref(null);
    const extractedOperations = ref([]);
    const userAnswer = ref('');
    const progressArray = ref(Array(parseInt(operationsCount.value)).fill('pending'));
    const timeBarWidth = ref(100);
    //const operation = ref('spazio Operazioni');

    // const timer = ref(0); // Tracks current countdown for each operation
    const gameTimer = ref(10); // The set duration for each operation
    //let timerIntervalEO = null;

    const toggleConfig = () => {
      showConfig.value = !showConfig.value;
      progressArray.value = Array(parseInt(operationsCount.value)).fill('pending');
      saveConfig();
    };

    const isChildDisabled = (key, optionName) => {
      // Disabilita sezione intera se la sezione principale non è selezionata
      if (!sectionEnabled[key]) return true;

      // Disabilita checkbox figlie se 'Add100' non è selezionato
      if (key === 'Addizioni' && ['FirstAddendTens', 'SecondAddendTens', 'ThreeAddends', 'ThirdAddendTens'].includes(optionName)) {
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
      saveConfig();
    };

    const nuovaEstrazione = (progressoItem) => {
      const operation = generateOperation(selectedOptions); // Funzione esterna che crea l'operazione
      currentOperation.value = operation;

      extractedOperations.value.push(operation);

      userAnswer.value = ''; // Resetta la risposta per ogni nuova operazione
      return operation;
    };

    const submitAnswer = () => {

      let correctAnswerFormatted;
      let userAnswerFormatted;
      //pulisce eventuali spazi dalle risposte
      if (typeof currentOperation.value.correctAnswer === 'string') {
        correctAnswerFormatted = currentOperation.value.correctAnswer.replace(/\s+/g, "").trim();
      }
      else {
        correctAnswerFormatted = String(currentOperation.value.correctAnswer)
      }

      if (typeof userAnswer.value === 'string') {
        userAnswerFormatted = userAnswer.value.replace(/\s+/g, "").trim();
      }
      else {
        userAnswerFormatted = String(userAnswer.value)
      }

      if (userAnswerFormatted === correctAnswerFormatted) {
         // Risposta corretta
         gameState.answerGiven = 'correct';
       } else {
         // Risposta errata
         gameState.answerGiven = 'wrong'; 
       }
 
    };

    /*vecchia logica*/
    /*  const startGame = () => {
        if (LIVELLO_DEBUG) {
          console.log("Inizio gioco"); // Messaggio di debug
        }
        gameStarted.value = true;
        showResults.value = false;
        extractedOperations.value = [];
        resetOperations();
        //progressArray.value = Array(parseInt(operationsCount.value)).fill('pending'); // Imposta i pallini come "non completati"
  
        generateOperationWrapper(); // Estrai immediatamente la prima operazione
  
        saveConfig();
      };
  
  */
    /*
        const stopGame = () => {
          gameStarted.value = false;
          clearInterval(timerIntervalEO);
          progressArray.value = Array(parseInt(operationsCount.value)).fill('pending');
        };
    */
    /*
        const endGame = () => {
          clearInterval(timerIntervalEO);
          gameStarted.value = false;
          showResults.value = true;
        };
    */
    /*
        const generateOperationWrapper = () => {
    
    
          if (extractedOperations.value.length < operationsCount.value) {
            // Genera la prossima operazione
            const operation = generateOperation(selectedOptions); // Funzione che crea l'operazione
            progressArray.value[extractedOperations.value.length] = 'active';
            extractedOperations.value.push(operation);
            currentOperation.value = operation;
            userAnswer.value = ''; // Resetta la risposta per ogni nuova operazione
            startTimer(); // Avvia il timer per la nuova operazione
            if (enableSound.value) { // Controlla se l'opzione del suono è attivata
              playSound();
            }
          } else {
            endGame(); // Termina il gioco se non ci sono più operazioni da estrarre
          }
    
        };
    
    
        // Funzione per avviare il timer
        const startTimer = () => {
          timer.value = gameTimer.value;
          clearInterval(timerIntervalEO); // Clear previous timer if exists
          timeBarWidth.value = 100;
          timerClass.value = 'no-transition'; // Rendi il ripristino istantaneo
    
          setTimeout(() => {
            timerClass.value = 'smooth-transition'; // Riabilita l'animazione
          }, 20); // 20ms per permettere il cambio di classe
    
          timerIntervalEO = setInterval(() => {
            if (gameStarted.value == true) {
              timeBarWidth.value -= (100 / gameTimer.value); // Riduci la larghezza in base al tempo
              if (timer.value > 0) {
                timer.value--;
              } else {
                //handleTimerExpiration(); // Timer expired
                progressArray.value[extractedOperations.value.length - 1] = 'incomplete';
                generateOperationWrapper();
              }
            }
          }, 500);
        };
    */
    /*
        // Funzione per inviare e valutare la risposta
        const submitAnswer = () => {
          clearInterval(timerIntervalEO.value); // Ferma il timer corrente
          let correctAnswerFormatted;
          let userAnswerFormatted;
          //pulisce eventuali spazi dalle risposte
          if (typeof currentOperation.value.correctAnswer === 'string') {
            correctAnswerFormatted = currentOperation.value.correctAnswer.replace(/\s+/g, "").trim();
          }
          else {
            correctAnswerFormatted = String(currentOperation.value.correctAnswer)
          }
    
          if (typeof userAnswer.value === 'string') {
            userAnswerFormatted = userAnswer.value.replace(/\s+/g, "").trim();
          }
          else {
            userAnswerFormatted = String(userAnswer.value)
          }
    
    
          if (userAnswerFormatted === correctAnswerFormatted) {
            // Risposta corretta
            progressArray.value[extractedOperations.value.length - 1] = 'correct';
          } else {
            // Risposta errata
            progressArray.value[extractedOperations.value.length - 1] = 'incorrect';
          }
    
          nuovaEstrazione(); // Procede con una nuova operazione
        };
        */
    /*
    const playSound = () => {
      const bellSound = new Audio("/campanella.mp3");
      bellSound.play();
    };
    // Pulisce il timer quando il componente viene smontato
    onBeforeUnmount(() => {
      if (timerIntervalEO !== null) {
        clearInterval(timerIntervalEO.value);
      }
    });

    // Inizia la prima operazione quando si avvia il gioco
    onMounted(() => {
      //generateOperationWrapper();
    });

    const restartGame = () => {
      showResults.value = false;
      gameStarted.value = false;
      progressArray.value = [];
      currentOperation.value = null;
      timeBarWidth.value = 100;
      progressArray.value = Array(parseInt(operationsCount.value)).fill('pending');
    };

    const timerClass = ref(''); // Gestirà l'animazione della barra

*/
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
      //startGame,
      //stopGame,
      submitAnswer,
      //restartGame,
      // startTimer,
      //endGame,
      //generateOperationWrapper,
      //timerClass,
      saveConfig,
      gameState,
      nuovaEstrazione,
    };
  }
});
</script>

<style>
/*@import "@/assets/comune.css"; */
</style>

<style scoped>
/* Importa i file CSS esterni */
/*@import "@/assets/estrazioneOperazioni.css"; */
@import "@/assets/css/estrazioneOperazioni-pannello.css";
</style>

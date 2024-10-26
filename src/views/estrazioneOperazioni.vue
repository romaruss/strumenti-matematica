
<template>
    <div class="estrazione-operazioni">
      
      <!-- Parte 1: Bottone Configurazione -->
      <button @click="toggleConfig" class="config-button">Configurazione</button>
  
      <!-- Menu di Configurazione -->
      <div v-if="showConfig" class="overlay">
        <div class="config-menu">
          <h3>Configurazione</h3>
          <div class="config-options">
            <!-- Colonne di configurazione -->
            <div class="config-column" v-for="(options, key) in configOptions" :key="key">
              <h4>{{ key }}</h4>
              <div v-for="option in options" :key="option.name">
                <input type="checkbox" v-model="selectedOptions[key]" :value="option.name" />
                <label>{{ option.label }}</label>
              </div>
            </div>
          </div>
          <!-- Opzioni aggiuntive -->
          <div class="additional-options">
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
            <button @click="toggleConfig">Chiudi</button>
          </div>
        </div>
      </div>
  
      <!-- Parte 2: Parte centrale -->
      <div class="main-area">
        <h2>Operazioni</h2>
        <div class="summary">
          <div v-for="(options, key) in selectedOptions" :key="key">
            <strong>{{ key }}</strong>: {{ options.join(', ') }}
          </div>
        </div>
  
        <!-- Timer di gioco -->
        <label>Timer di gioco (secondi)</label>
        <input type="range" v-model="gameTimer" min="1" max="30" />
  
        <button v-if="!gameStarted" @click="startGame">Inizia</button>
        <button v-else @click="stopGame">Stop</button>
  
        <!-- Area per le operazioni estratte -->
        <div v-if="gameStarted" class="operation-display">
          <h1>{{ currentOperation }}</h1>
          <input v-if="digitalAnswer" v-model="userAnswer" @keyup.enter="submitAnswer" type="text" />
        </div>
      </div>
  
      <!-- Parte 3: Traccia del Progresso -->
      <div class="progress-area">
        <!-- Barra del tempo -->
        <div class="time-bar" :style="{ width: timeBarWidth + '%' }"></div>
        <!-- Indicatore del progresso -->
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
import '@/assets/estrazioneOperazioni.css'
  export default {
    data() {
      return {
        // Configurazione del menu
        showConfig: false,
        selectedOptions: {
          Addizioni: [],
          Sottrazioni: [],
          Moltiplicazioni: [],
          Divisioni: []
        },
        configOptions: {
          Addizioni: [
            { name: 'Add10', label: 'Addizioni entro il 10' },
            { name: 'Add20', label: 'Addizioni entro il 20' },
            { name: 'Add100', label: 'Addizioni entro il 100' }
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
        },
        enableSound: false,
        operationsCount: 5,
        digitalAnswer: false,
        gameTimer: 10,
        
        // Stato del gioco
        gameStarted: false,
        showResults: false,
        currentOperation: null,
        extractedOperations: [],
        userAnswer: '',
        progressArray: [],
        timeBarWidth: 100
      };
    },
    methods: {
      toggleConfig() {
        this.showConfig = !this.showConfig;
      },
      startGame() {
        this.gameStarted = true;
        this.showResults = false;
        // Inizializza il timer, operazioni, e il progresso
      },
      stopGame() {
        this.gameStarted = false;
      },
      submitAnswer() {
        // Funzione per gestire la risposta digitale
      },
      restartGame() {
        this.showResults = false;
        this.gameStarted = false;
        this.progressArray = [];
        this.currentOperation = null;
        this.timeBarWidth = 100;
      }
    }
  };

  </script>
  
  
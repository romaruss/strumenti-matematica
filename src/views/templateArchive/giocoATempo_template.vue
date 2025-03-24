<template>

    <div>
        <!--CONFIG MENU*/-->
        <div v-if="gameState.showConfig" class="overlay">
            
            <div class="overalay-container">
                <div class="config-title">
                    <h3>Configurazione</h3>
                </div>
                <slot name="pannello-configurazione" :gameState="gameState"></slot>
                <div class="button-center">
                    <button @click="toggleConfig">Chiudi</button>
                </div>
            </div>
        </div>

        <!--RISULTATI*/-->
        <div id="result-area" v-if="gameState.showResults" class="overlay-result">
            <div class="overalay-container">
                <div class="config-title">
                    <h3>Risultati</h3>
                </div>
                <table class="results-table">
                    <slot name="result-table"></slot>
                </table>
                <div class="button-center">
                    <button @click="toggleResult">Chiudi</button>
                </div>
            </div>
        </div>

        <!--MAIN AREA-->
        <div class="main-area">

            <!-- RIGA 1 -->
            <div class="main-area-row-1">
                <!--area laterale sinistra-->
                <div id="main-area-left-panel">
                    <!-- Timer di gioco -->
                    <div id="gameTimerContainer">
                        <label>Timer di gioco</label>
                        <input type="range" v-model="gameTimer" min="1" max="30" class="timer-slider"
                            :disabled="gameState.status != 'idle'" @mouseup="updateGameTimer" />
                        <span>{{ gameTimer }} secondi</span> <!-- Visualizza il valore selezionato -->
                        <!-- fine timer di gioco-->
                    </div>

                    <!--area pulsanti di gioco-->
                    <div id="gameButtonscontainer">
                        gameState.status.value: {{ gameState.status }}
                        <button v-if="gameState.status == 'idle'" @click="startGame">Inizia</button>
                        <button v-if="gameState.status == 'started'" @click="stopGame">Stop</button>
                        <button v-if="gameState.status == 'stopped'" @click="endGame">Restart</button>
                        <button v-if="gameState.status == 'stopped'" @click="toggleResult"> Risultati</button>
                    </div>
                </div>


                <!--area centrale-->
                <div id="main-area-center">
                    <slot name="main-area-centro"></slot>
                </div>

                <!--area laterale destra-->
                <div id="main-area-right-panel">
                    <button @click="toggleConfig" class="config-button"
                        :disabled="gameState.status != 'idle'">Configurazione</button>
                </div>
            </div>
            <!-- RIGA 2 -->
            <div class="main-area-row-2">
                <!--area bottom-->
                <div id="main-area-bottom">
                    <div class="progress-area">
                        <div class="time-bar" :class="timerClass" :style="{ width: timeBarWidth + '%' }"></div>

                        <div class="progress-indicator">
                            <span v-for="(status, index) in progressArray" :key="index" :class="status"></span>
                        </div>

                    </div>
                </div>
            </div>
            <!-- RIGA 3 -->
            <div class="main-area-row-3">
                <!--area result-->
                <div id="result-area">
                    <div v-if="gameState.showResults" class="results">
                        <h3>Risultati</h3>
                        <table class="results-table">

                        </table>

                    </div>
                </div>

            </div>

        </div>

    </div>
</template>



<script>
import { ref, inject } from 'vue'; // Importa `ref` per la reattività
import { defineComponent } from "vue";

//import ConfigContentA100 from './armadio100Folder/armadio100Ext.vue';

export default defineComponent({
    name: "giocoATempo_template",
    props: {
        title: {
            type: String,
            default: "Titolo predefinito",
        },
    },
    emits: ["saveConfigPadre", "nuovaEstrazione"],
    setup(_, { emit }) {

        const gameState = inject('gameState');

        /* definita nel GENITORE
    const gameState = reactive({
      gameStarted: false,
      showConfig: false,
      showResultButton: false,
      showResults: false,
      itemTotal: JSON.parse(localStorage.getItem('config'))?.operationsCount || 5,
      gameTimer: JSON.parse(localStorage.getItem('config'))?.gameTimer || 5,
      enableSound: JSON.parse(localStorage.getItem('config'))?.enableSound || true,
      rispostaDigitale: true,
      status: 'idle', //stati possibili: idle (pronto a partire) started, stopped, results
      answerGiven: 'none' // none=risposta non data, correct: risposta data corretta, wrong risposta data sbagliata

    });
    */

        //gestione timer
        let timerInterval;
        const gameTimer = ref(gameState.gameTimer);
        const timerClass = ref('no-transition');
        const timeBarWidth = ref(100);

        //barra dei progressi
        const progressArray = ref(Array(parseInt(gameState.itemTotal)).fill('pending'));
        const itemCount = ref(0);

        //funzionalità bottoni
        const toggleConfig = () => {
            const newState = !gameState.showConfig;
            gameState.showConfig = newState;

            emit("saveConfigPadre", newState); // Comunica il nuovo stato al genitore

            //riconfigura la barra dei progressi
            set_progressArray(gameState.itemTotal)
        };

        const updateGameTimer = () => {
            gameState.gameTimer = gameTimer;

            emit("saveConfigPadre", ""); // Comunica il nuovo stato al genitore
        };

        const set_progressArray = (itemTotal) => {
            progressArray.value = Array(parseInt(itemTotal)).fill('pending');

            return progressArray.value;

        };

        const startGame = () => {
            gameState.status = 'started'
            gameState.gameStarted = true;
            gameState.showResults = false;
            gameState.showResultButton = false;
            itemCount.value = 0;
            cicloGioco();
        };

        //restart game
        const endGame = () => {
            //il gioco viene ripristinato alla situazione di partenza
            gameState.status = 'idle'
            gameState.gameStarted = false;
            gameState.showResults = false;
            gameState.showResultButton = false;
            timeBarWidth.value = 100;
            //riconfigura la barra dei progressi
            set_progressArray(gameState.itemTotal)
            emit("saveConfigPadre", ""); // Comunica il nuovo stato al genitore
        }

        const stopGame = () => {
            gameState.status = 'stopped'
            gameState.gameStarted = false;
            gameState.showResults = false;
            gameState.showResultButton = true;
        };

        const showResults = () => {
            gameState.showResults = true;
        };

        const toggleResult = () => {
            gameState.showResults = !gameState.showResults;
        };

        const cicloGioco = () => {

            //se non sono ancora finiti i numeri da estrarre *da pescare nella configurazione
            if (itemCount.value < gameState.itemTotal && gameState.status == 'started') {

                //attiva la l'item nella barra del progresso
                progressArray.value[itemCount.value] = 'active';
                itemCount.value++;


                //effettua un nuovo step del gioco (estrazione
                emit('nuovaEstrazione', itemCount.value);

                if (gameState.enableSound) {
                    playSound();
                }
                //start timer
                startTimer();
            }
            else {

                //else ferma il gioco
                stopGame();

            }
        };

        const startTimer = () => {
            const timer = ref(gameTimer.value);
            clearInterval(timerInterval); // Clear previous timer if exists
            timeBarWidth.value = 100;
            timerClass.value = 'no-transition'; // Rendi il ripristino istantaneo

            setTimeout(() => {
                timerClass.value = 'smooth-transition'; // Riabilita l'animazione
            }, 20); // 20ms per permettere il cambio di classe


            timerInterval = setInterval(() => {
                if (gameState.gameStarted == true) {
                    timeBarWidth.value -= (100 / gameTimer.value); // Riduci la larghezza in base al tempo
                    if (timer.value > 0 && gameState.answerGiven == 'none') {
                        timer.value--;
                    } else {
                        //handleTimerExpiration(); // Timer expired
                        if (gameState.answerGiven == 'correct') {
                            progressArray.value[itemCount.value - 1] = 'correct';
                        }
                        else if (gameState.answerGiven == 'wrong') {
                            progressArray.value[itemCount.value - 1] = 'wrong';
                        }
                        else {
                            progressArray.value[itemCount.value - 1] = 'incomplete';
                        }
                        gameState.answerGiven = 'none'
                        cicloGioco();
                    }
                }
                else {
                    clearInterval(timerInterval); // Clear previous timer if exists
                    timerClass.value = 'no-transition'; // Rendi il ripristino istantaneo

                }
            }, 1000);

        };

        const playSound = () => {
            const bellSound = new Audio("/campanella.mp3");
            bellSound.play();
        };




        return {
            toggleConfig,
            startGame,
            stopGame,
            endGame,
            showResults,
            updateGameTimer,
            toggleResult,
            progressArray,
            itemCount,
            gameTimer,
            timerClass,
            timeBarWidth,
            gameState, //gestita dal file principale

        };
    }
});
</script>

<style scoped>
@import "@/assets/css/giocoATempo_css.css";
@import "@/assets/css/debugcss.css";
</style>
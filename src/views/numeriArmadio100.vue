<template>
    <div class="game-container">
        <!-- Pannello di configurazione -->
        <div v-if="showConfig" class="overlay">
            <div class="config-panel">
                <h3>Configurazione Gioco</h3>
                <div>
                    <label>Quanti pallini estrarre:</label>
                    <select v-model="selectedDotCount">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </div>
                <div>
                    <input type="checkbox" v-model="enableSound" /> Attiva suono
                </div>
                <button @click="toggleConfig">Chiudi</button>
            </div>
        </div>

        <!-- Main area -->
        <div class="main-area">
            <div class="left-panel">
                <!-- Slider per il tempo -->
                <label for="time-slider"  >Tempo tra le estrazioni (secondi):</label>
                <input type="range" id="time-slider" :disabled="gameStarted" v-model="gameTimer" min="1" max="10" step="1" />
                <span>{{ gameTimer }} secondi</span>

                <!-- Bottone Inizia / Stop -->
                <button @click="startGame" v-if="!gameStarted && !showResultsButton">Inizia</button>

                <button @click="stopGame" v-if="gameStarted">Stop</button>
                <button @click="restartGame" v-if="!gameStarted && showResultsButton">Restart</button>

            </div>

            <div class="center-panel">
                <!-- Griglia di pallini -->
                <div id="grid" class="grid">
                    <div v-for="(dot, index) in totalDots" :key="index" :class="['dot', { 'red': dot.isRed }]">
                        <span v-if="dot.isRed && resultShown">{{ index+1 }}</span> <!-- Mostra l'indice all'interno del pallino rosso -->
                    </div>

                </div>
            </div>

            <div class="right-panel">
                <!-- Bottone Configura -->
                <button @click="toggleConfig" class="config-button" :disabled="gameStarted">Configurazione</button>

            </div>
        </div>

        <!-- Barra del tempo e progresso -->
        <div class="progress-area">

            <div class="time-bar" :class="timerClass" :style="{ width: timeBarWidth + '%' }"></div>
            <div class="progress-indicator">
                <span v-for="(status, index) in progressArray" :key="index" :class="status"></span>
            </div>

        </div>

        <!-- Risultati -->
        <div v-if="showResultsButton" class="results-container">
            <div class="results-message">{{ resultsMessage }}</div>
            <button @click="showResults" :hidden="resultShown">Visualizza Risultati</button>
        </div>

    </div>
</template>



<script>
import { ref, reactive, onMounted, watch } from 'vue';

export default {
    name: "NumeriArmadio100",
    setup() {
        // Stati del gioco
        const showConfig = ref(false);
        const enableSound = ref(localStorage.getItem('enableSound') === 'true');
        const selectedDotCount = ref(parseInt(localStorage.getItem('selectedDotCount')) || 5);
        const extractedDots = ref([]);  // Array per memorizzare gli indici dei pallini estratti
        const showResultsButton = ref(false);
        const resultShown = ref(false);
        const gameTimer = ref(parseInt(localStorage.getItem('gameTimer')) || 3);
        const gameStarted = ref(false);
        const timeBarWidth = ref(100);
        const totalDots = reactive(Array.from({ length: 100 }, () => ({ isRed: false })));
        const progressArray = ref(Array(selectedDotCount.value).fill('pending'));
        const resultsMessage = ref("");
        const timerIntervalAC = ref(null);
        // Aggiungi queste variabili nella parte di setup
        const timer = ref(0); // Tempo rimanente del timer
        const timerClass = ref(''); // Classe per gestire l'animazione della barra
        const numeroEstratto = ref(null);

        const showResults = () => {
            resultsMessage.value = "Numeri estratti: " + extractedDots.value.map(num => num + 1).join(", ");     // Mostra i numeri estratti
            // Colora i pallini estratti di rosso
            extractedDots.value.forEach(index => {
                totalDots[index].isRed = true;  // Colora i pallini estratti
                
            });
            resultShown.value=true;
        };

        // Funzione per alternare la visibilità del pannello di configurazione
        const toggleConfig = () => {
            showConfig.value = !showConfig.value;
           
            progressArray.value=Array(parseInt(selectedDotCount.value)).fill('pending') 

            saveconfig();

        };

        // Funzione per avviare il gioco
        // Funzione per avviare il gioco
        const startGame = () => {
            gameStarted.value = true;
            showResultsButton.value = false;
            progressArray.value = Array(parseInt(selectedDotCount.value)).fill('pending');  // Inizia lo stato di progressione
            resultsMessage.value = "";
            totalDots.forEach(dot => dot.isRed = false); // Reset alla griglia (tutti i pallini verdi)
            extractedDots.value = [];  // Pulisci gli estratti precedenti
            gameCycle();
        };

        const gameCycle = () => {

            //controlla se sono finiti i pallini da estrarre
            if (extractedDots.value.length < parseInt(selectedDotCount.value)) {
                if (numeroEstratto.value) {
                    totalDots[numeroEstratto.value].isRed = false; ////resetta il pallino precedente
                }
                numeroEstratto.value = extractDot(); ////estrae un pallino
                totalDots[numeroEstratto.value].isRed = true; ////colora il pallino di rosso
                progressArray.value[extractedDots.value.length - 1] = 'incomplete'; // Fa avanzare la barra dei progressi
                extractedDots.value.push(numeroEstratto.value);     ////aggiunge il pallino ai risultati
                progressArray.value[extractedDots.value.length - 1] = 'active'; // Fa avanzare la barra dei progressi
                

                // Suono
                if (enableSound.value) {
                    const bellSound = new Audio("/campanella.mp3");
                    bellSound.play();
                }

                // Avvia la prossima estrazione
                startTimer();
            } else {
                if (numeroEstratto.value) {
                    totalDots[numeroEstratto.value].isRed = false; ////resetta il pallino precedente
                    progressArray.value[extractedDots.value.length - 1] = 'incomplete'; // Fa avanzare la barra dei progressi
                }
                stopGame();  // Altrimenti, ferma il gioco
            }


        };

        const startTimer = () => {
            timer.value = gameTimer.value // Imposta il timer in base al tempo e pallini
            clearInterval(timerIntervalAC.value); // Ferma il timer precedente se esiste

            //gestione barra
            timeBarWidth.value = 100; // Ripristina la larghezza della barra a 100
            timerClass.value = 'no-transition'; // Rendi il ripristino della barra istantaneo

            // Rendi la transizione della barra fluida dopo un breve intervallo
            setTimeout(() => {
                timerClass.value = 'smooth-transition'; // Riabilita l'animazione
            }, 20); // Ritardo per cambiare classe (per evitare transizione istantanea)

            //gestione timeout
            timerIntervalAC.value = setInterval(() => {
                timeBarWidth.value -= (100 / (gameTimer.value)); // Riduce la larghezza della barra
                if (timer.value > 0) {
                    timer.value--;
                } else {
                    gameCycle(); // Quando il timer scade
                }
            }, 1000);
        };
        // Funzione per estrarre i pallini
        const extractDot = () => {
            // Estrazione di un pallino
            const randomIndex = Math.floor(Math.random() * 100);

            return randomIndex;
        };


        // Funzione per fermare il gioco
        const stopGame = () => {
            clearInterval(timerIntervalAC.value);
            gameStarted.value = false;
            showResultsButton.value = true;
        };


        // Funzione per riavviare il gioco
        const restartGame = () => {
            totalDots.forEach(dot => dot.isRed = false);
            progressArray.value = Array(parseInt(selectedDotCount.value)).fill('pending');
            //progressArray.value = Array(7).fill('pending');
            timeBarWidth.value = 100;
            showResultsButton.value = false;
            //startGame(); 
        };


        const saveconfig= () =>{

            localStorage.setItem('selectedDotCount', selectedDotCount.value); 
            localStorage.setItem('enableSound', enableSound.value);
            localStorage.setItem('gameTimer', gameTimer.value);

        }



        return {

            showConfig,
            enableSound,
            selectedDotCount,
            gameTimer,
            gameStarted,
            timeBarWidth,
            totalDots,
            progressArray,
            resultsMessage,
            showResults,
            startGame,
            stopGame,
            restartGame,
            toggleConfig,
            showResultsButton,
            timerClass,
            resultShown,
        };
    }
};
</script>


<style>
    @import "@/assets/comune.css";
</style>

<style scoped>
/* Importa i file CSS esterni */
@import "@/assets/numeriArmadio100.css";

</style>
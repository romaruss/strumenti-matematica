<template>
    <div>
        <!--CONFIG MENU*/-->
        <div v-if="showConfig" class="overlay">
            <div class="config-menu">
                <div class="config-title">
                    <h3>Configurazione</h3>
                </div>
                <div v-if="paginaAttuale == 'EO'">
                    <estrazioneOperazioniExt block="ConfigPanelEO" />

                </div>
                <div v-if="paginaAttuale == 'a100'">
                    <!--da aggiungere--> <!--  <ConfigContentA100 block="ConfigPanelA100" />-->
                </div>
                <div class="button-center">
                    <button @click="toggleConfig">Chiudi</button>
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
                            :disabled="gameStarted" />
                        <span>{{ gameTimer }} secondi</span> <!-- Visualizza il valore selezionato -->
                        <!-- fine timer di gioco-->
                    </div>

                    <!--area pulsanti di gioco-->
                    <div id="gameButtonscontainer">
                        <button v-if="!gameStarted" @click="startGame">Inizia</button>
                        <button v-else @click="stopGame">Stop</button>
                    </div>
                </div>


                <!--area centrale-->
                <div id="main-area-center">
                    a
                </div>

                <!--area laterale destra-->
                <div id="main-area-right-panel">
                    <button @click="toggleConfig" class="config-button" :disabled="gameStarted">Configurazione</button>
                </div>
            </div>
            <!-- RIGA 2 -->
            <div class="main-area-row-2">
                <!--area bottom-->
                <div id="main-area-bottom">
                    <div class="progress-area">
                        <div class="time-bar" :class="timerClass" :style="{ width: timeBarWidth + '%' }"></div>

                        <!--<div class="progress-indicator">
                            <span v-for="(status, index) in progressArray" :key="index" :class="status"></span>
                        </div>
                        -->
                    </div>
                </div>
            </div>
            <!-- RIGA 3 -->
            <div class="main-area-row-3">
                <!--area result-->
                <div id="result-area">
                    <div v-if="showResults" class="results">
                        <!--  <h3>Risultati</h3>
                        <table>
                            <tr v-for="(operation, index) in extractedOperations" :key="index">
                                <td>{{ operation.expression }}</td>
                                <td>{{ operation.correctAnswer }}</td>
                            </tr>
                        </table>
                        <button @click="restartGame">Ricomincia</button>
                        -->
                    </div>
                </div>

            </div>

        </div>

    </div>
</template>



<script>
import { ref } from 'vue'; // Importa `ref` per la reattività

import estrazioneOperazioniExt from './estrazioneOperazioniFolder/estrazioneOperazioniExt.vue';
import { logicheOperazioni } from './estrazioneOperazioniFolder/estrazioneOperazioniExt.vue';

//import ConfigContentA100 from './armadio100Folder/armadio100Ext.vue';

export default {
    components: {
        estrazioneOperazioniExt,
    },
    setup() {
        const paginaAttuale = 'EO';
        const LIVELLO_DEBUG = true;


        //configurazioni generali
        const showConfig = ref(false);
        const gameTimer = ref(10); // The set duration for each operation

        //gestione del timer
        const timeBarWidth = ref(100);
        const timerClass = ref(''); // Gestirà l'animazione della barra

        const gameStarted = ref(false);
        const showResults = ref(false);

        const itemExtracted = ref([]);
        const itemTotali = ref();

        const { getTotalItemOperazioni, getEnableSound, saveConfig } = logicheOperazioni();

        //area funzioni
        const startGame = () => {
            if (LIVELLO_DEBUG) {
                console.log("Inizio gioco"); // Messaggio di debug
            }
            gameStarted.value = true;
            showResults.value = false;
            //resetEstractions(); //da fare: pulizia degli array di estrazione

            //scelta della pagina
            if (paginaAttuale == 'EO') {
                itemTotali.value = getTotalItemOperazioni();
            }
            else if (paginaAttuale == 'A100') {
                //itemTotali.value = getTotalItemArmadio100();
            }

            cicloEstrazioni(); // da fare: Estrai immediatamente la prima operazione
        };

        const cicloEstrazioni = () => {
            if (itemExtracted.value.length < itemTotali.value) {
                startTimer();

                if (getEnableSound()) { // Controlla se l'opzione del suono è attivata
                    playSound();
                }
            } else {
                endGame(); // Termina il gioco se non ci sono più operazioni da estrarre
            }
        };

        const startTimer = () => {
            /* timer.value = gameTimer.value;
             clearInterval(timerInterval); // Clear previous timer if exists
             timeBarWidth.value = 100;
             timerClass.value = 'no-transition'; // Rendi il ripristino istantaneo
 
             setTimeout(() => {
                 timerClass.value = 'smooth-transition'; // Riabilita l'animazione
             }, 20); // 20ms per permettere il cambio di classe
 
             timerInterval = setInterval(() => {
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
             */
        };

        //funzionalità bottoni
        const toggleConfig = () => {
            showConfig.value = !showConfig.value;
            saveConfig();
        };

        //funzionalità accessorie
        const playSound = () => {
            const bellSound = new Audio("/campanella.mp3");
            bellSound.play();
        };

        return {
            paginaAttuale,
            showConfig,
            estrazioneOperazioniExt,
            toggleConfig,
            gameStarted,
            gameTimer,
            startGame,
            startTimer,
            showResults,
            timeBarWidth,
            timerClass,
        };
    }
};
</script>

<style>
/*@import "@/assets/comune.css";*/
@import "@/assets/com-pannelloConfig.css";
</style>

<style scoped>
/* Importa i file CSS esterni */
/*@import "@/assets/estrazioneOperazioni.css";*/
@import "@/assets/css/contenitoreGiocoATempo.css";
</style>
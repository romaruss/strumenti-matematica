<template>
  <div class="game-container">
    <!-- Menù a tendina per scegliere la durata del timer -->
    <div class="timer-select">
      <label for="timerDuration">Durata del timer (secondi):</label>
      <select id="timerDuration" v-model="timerDuration">
        <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>

    <!-- Pallina -->
    <div
      class="ball"
      :class="{ blue: isBlue }"
    ></div>

    <!-- Componente figlio -->
    <ChildComponent @start-timer="handleTimerComplete" />
  </div>
</template>

<script>
import { ref, provide } from "vue";
import ChildComponent from "./templateArchive/testComunicazioneTemplate.vue";

export default {
  components: { ChildComponent },
  setup() {
    // Definizione della variabile condivisa
    const timerDuration = ref(5); // Durata iniziale (5 secondi)

    // Provide per rendere disponibile timerDuration
    provide("timerDuration", timerDuration);

    const isBlue = ref(false);

    const handleTimerComplete = () => {
      isBlue.value = true;
    };

    return { isBlue, timerDuration, handleTimerComplete };
  },
};
</script>

<style scoped>
.game-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
}

.timer-select {
  margin-bottom: 20px;
}

.timer-select label {
  margin-right: 10px;
  font-size: 16px;
}

select {
  padding: 5px;
  font-size: 16px;
}

.ball {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: green;
  transition: background-color 0.5s;
}

.ball.blue {
  background-color: blue;
}
</style>

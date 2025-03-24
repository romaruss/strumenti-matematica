<template>
    <div class="child-container">
      <!-- Bottone per avviare il timer -->
      <button @click="startTimer">Avvia Timer</button>
  
      <!-- Campo per modificare la durata del timer -->
      <div class="duration-editor">
        <label for="durationInput">Modifica durata:</label>
        <input 
          id="durationInput" 
          type="number" 
          v-model="timerDuration" 
          min="1" 
          max="5" 
        />
      </div>
    </div>
  </template>
  
  <script>
  import { inject } from "vue";
  
  export default {
    emits: ["start-timer"],
    setup(_, { emit }) {
      const timerDuration = inject("timerDuration"); // Recupera lo stato condiviso dal genitore
  
      const startTimer = () => {
        setTimeout(() => {
          emit("start-timer");
        }, timerDuration.value * 1000); // Usa la durata condivisa in millisecondi
      };
  
      return { timerDuration, startTimer };
    },
  };
  </script>
  
  <style scoped>
  .child-container {
    margin-top: 20px;
  }
  
  button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }
  
  .duration-editor {
    margin-top: 15px;
  }
  
  .duration-editor label {
    margin-right: 10px;
    font-size: 14px;
  }
  
  input {
    padding: 5px;
    width: 50px;
    text-align: center;
  }
  </style>
  
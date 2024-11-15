<template>

  <div v-if="block === 'ConfigPanelEO'">
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
      </div>



    </div>

  </div>
</template>


<script>
const LIVELLO_DEBUG = true; // Abilita il debug
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { generateOperation, resetOperations } from '@/utils/generateOperation';



export default {
  name: "estrazioneOperazioniExt",
  props: {
    block: {
      type: String,
      required: true, // Definisci quale blocco visualizzare
    },
  }, setup() {

    const { getTotalItemOperazioni, getEnableSound,saveConfig } = logicheOperazioni();

    //voci del pannello di configurazione
    const enableSound = ref(false);
    //const operationsCount = ref(JSON.parse(localStorage.getItem('config'))?.operationsCount || 5);
    const operationsCount = ref(getTotalItemOperazioni());
    const digitalAnswer = ref(false);

    const sectionEnabled = reactive({
      Addizioni: true,
      Sottrazioni: true,
      Moltiplicazioni: true,
      Divisioni: true
    });

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
        enableSound.value = getEnableSound() || false;
        operationsCount.value = getTotalItemOperazioni();
        digitalAnswer.value = config.digitalAnswer || false;
      }
    };


    onMounted(() => {
      loadConfig();
    });
    const toggleConfig = () => {
      saveConfig();

    };

 
    

    return {
      //uso interno
      configOptions,
      selectedOptions,
      //saveConfig,
      sectionEnabled,
      isChildDisabled,
      toggleChildOptions,
      digitalAnswer,
      operationsCount,
      enableSound,
      //uso esterno

    };
  }
};

/**
 * funzioni da esportare
 */
export function logicheOperazioni() {
  const getTotalItemOperazioni = () => {
    let operationCountRET = (JSON.parse(localStorage.getItem('config'))?.operationsCount || 5);
    return operationCountRET;
  };

  const getEnableSound = () => {
    let enableSoundValue = (JSON.parse(localStorage.getItem('config'))?.enableSound || true);
    return enableSoundValue;
  };

  const saveConfig = () => {
    const config = {
      sectionEnabled,
      selectedOptions,
      enableSound:getEnableSound(),
      operationsCount: getTotalItemOperazioni(),
      digitalAnswer: digitalAnswer.value,
    };
    localStorage.setItem('config', JSON.stringify(config)); // Salva nel localStorage
  };



  return {
    getTotalItemOperazioni,
    getEnableSound,
    saveConfig,
  }




};
</script>

<template>

    <div v-if="block === 'ConfigPanelA100'">
        <div class="config-title">
            <h3>Configurazione Armadio 100</h3>
        </div>        
    </div>
</template>


    <script>

export default {
  name: "armadio100Ext",
  props: {
    block: {
      type: String,
      required: true, // Definisci quale blocco visualizzare
    },
  },
};
</script>


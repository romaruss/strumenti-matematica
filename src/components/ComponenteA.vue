<template>
    <div id="ComponenteA">
        <h1 class="bg-gray-200 p-5 mb-5">ComponentA</h1>
        {{myvar}}
        <input v-model="Campo" type="text" />
        <button @click="$emit('mandaDaAaB', Campo)">Manda a componente b</button>
    </div>
</template>
<script lang="ts">
import { ref } from 'vue'
export default {
props: ['myvar'],
setup(props,{emit}) {
    const Campo = ref('')
    Campo.value = 'zappa'
    //usa emit per mandare la variabile "torta"
    emit('torta','panna');
    return {
        Campo
    }
}
}
</script>
<style scoped lang="scss">
#ComponenteA {
    @apply bg-red-200 h-[200px]
}    
button {
    @apply p-3 m-5 bg-yellow-600 rounded-[45px];
}
</style>
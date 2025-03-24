<template>
  <div id="ComponenteB">
    <h1 class="bg-gray-200 p-5 mb-5">ComponentB</h1>
    {{myvar}}<br />
    <hr />
    <input v-model="Campo" type="text" />
    <button @click="$emit('mandaDaBaA', Campo)">Manda a componente a</button>
  </div>
</template>
<script>
import { ref } from 'vue'

export default {
  props: ['myvar'],
  setup(props) {
    const Campo = ref('')
    return {
      Campo
    }
  }
}

</script>
<style scoped lang="scss">
#ComponenteB {
  @apply h-[300px] bg-red-500;
}
button {
    @apply p-3 m-5 bg-yellow-600 rounded-[45px];
}
</style>
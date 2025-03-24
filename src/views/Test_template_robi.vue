<template>
    <RouterView />
    <div class="grid grid-cols-2">
      <div class="col-span-2 hidden">
        {{myvarAaB}} -- {{myvarBaA}}
      </div>
      <ComponenteA @mandaDaAaB="riceviDaAaB" :myvar="myvarBaA" />
      <ComponenteB @mandaDaBaA="riceviDaBaA" :myvar="myvarAaB" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import ComponenteA from '@/components/ComponenteA.vue';
  import ComponenteB from '@/components/ComponenteB.vue';
  
  const myvarAaB = ref('')
  const myvarBaA = ref('')
  const Campo = ref('')
  
  const riceviDaAaB = (dato: string) => {
    console.log(dato)  
    myvarAaB.value = dato
  }
  
  const riceviDaBaA = (dato: string) => {
    console.log(dato)  
    myvarBaA.value = dato
  }

  const riceviTorta = (dato: string) => {
    console.log(dato)  
    myvarAaB.value = dato
  }
  </script>
  
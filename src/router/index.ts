import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/AppHome.vue')
      
    },
    {
      path: '/estrazioneOperazioni',
      name: 'estrazioneOperazioni',
      component: () => import('@/views/estrazioneOperazioni.vue')
      
    },
    {
      path: '/numeriArmadio100',
      name: 'numeriArmadio100',
      component: () => import('@/views/numeriArmadio100.vue')
      
    },
    {
      path: '/giocoATempo',
      name: 'giocoATempo',
      component: () => import('@/views/ContenitoreGiocoATempo.vue')
      
    }
  ]
})

export default router



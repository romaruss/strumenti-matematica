import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue')
      
    },
    {
      path: '/estrazioneOperazioni',
      name: 'estrazioneOperazioni',
      component: () => import('@/views/estrazioneOperazioni.vue')
      
    }
  ]
})

export default router

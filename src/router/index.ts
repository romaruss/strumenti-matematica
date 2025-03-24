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
      component: () => import('@/views/estrazioneOperazioniNew.vue')
      
    },
    {
      path: '/numeriArmadio100',
      name: 'numeriArmadio100',
      component: () => import('@/views/numeriArmadio100.vue')
      
    },
    {
      path: '/testRobi',
      name: 'testRobi',
      component: () => import('@/views/Test_template_robi.vue')
      
    }
    ,
    {
      path: '/testMassi',
      name: 'testMassi',
      component: () => import('@/views/testMassi.vue')
      
    }
  ]
})

export default router

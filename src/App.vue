<template>

  <div>
      <AppNavbar :isScrolled="isScrolled" />
      <div class="content-container">
          <main class="main-content" :class="{ 'scrolled': isScrolled }">
              <h2>Benvenuto su Strumenti Matematici</h2>
              <p>Qui trovi strumenti matematici utili per studenti e insegnanti.</p>
          </main>
          <AppSidebar />
      </div>
      <RouterView />
    </div>
  
</template>


<script>
import AppNavbar from './components/AppNavbar.vue';
import AppSidebar from './components/AppSidebar.vue';

export default {
    components: {
        AppNavbar,
        AppSidebar
    },
    data() {
        return {
            isScrolled: false
        };
    },
    methods: {
        handleScroll() {
            this.isScrolled = window.scrollY > 50;
        }
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
};

</script>

<style>
.content-container {
  display: flex;
}
.main-content {
  flex: 1;
  padding: 20px;
  transition: transform 0.3s;
}
.main-content.scrolled {
  transform: scale(0.95);
}
</style>

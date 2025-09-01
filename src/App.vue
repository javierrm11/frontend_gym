<template>
  <div id="app">
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import Footer from './components/Footer.vue';
import Header from "./components/Header.vue";
import "./styles/global.css";

export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
  mounted() {
    this.verificarSesion();
  },
  methods: {
    async verificarSesion() {
      const horaExpiracion = localStorage.getItem("expirationDate");
      if (horaExpiracion) {
        const ahora = Date.now();
        const diferencia = ahora - new Date(horaExpiracion).getTime();
        console.log(`Diferencia de tiempo: ${diferencia} ms`);
        if (diferencia > 3600000) { // 1 hora en milisegundos
          await this.$store.dispatch('logout');
          this.$router.push('/');
        }
      }
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
}
</style>

<template>
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,viewport-fit=cover">
    <title>Document</title>
    <meta name="description" content="GymPro es la red social fitness donde puedes crear, compartir y seguir rutinas de entrenamiento mientras conectas con una comunidad activa. Disponible en web y app móvil.">
    <meta name="keywords" content="fitness, rutinas, gym, entrenamiento, app fitness, comunidad fitness, deporte, salud">
    <meta name="author" content="GymPro">
  
    <!-- Open Graph (para compartir en redes sociales) -->
    <meta property="og:title" content="GymPro - Conecta, entrena, evoluciona">
    <meta property="og:description" content="La red social fitness donde tus entrenamientos se convierten en una experiencia social. Disponible en web y móvil.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.molerofit.es/">
    <meta property="og:image" content="https://www.molerofit.es/og-image.png">
    <meta property="og:site_name" content="GymPro">
    <meta property="og:locale" content="es_ES">
  </head>
  <body>
    <div id="app">
    <Header />
    <router-view />
    <Footer />
    </div>
  </body>
  </html>
</template>

<script>
import Footer from './components/Footer.vue';
import Header from "./components/Header.vue";
import "./styles/global.css";
//import { StatusBar } from '@capacitor/status-bar';


export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
  mounted() {
    this.verificarSesion();
    //StatusBar.hide();
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

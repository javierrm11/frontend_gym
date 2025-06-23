<template>
    <header>
      <div class="header-container">
        <h1>Gym</h1>
        <button class="hamburger" @click="toggleMenu" :class="{ 'active': isMenuOpen }" aria-label="Menú">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <nav :class="{ 'active': isMenuOpen }" aria-hidden="!isMenuOpen">
        <ul>
          <li><router-link to="/" @click="closeMenu">Inicio</router-link></li>
          <li v-if="!isLoggedIn"><router-link to="/login" @click="closeMenu">Iniciar Sesión</router-link></li>
          <li v-if="!isLoggedIn"><router-link to="/register" @click="closeMenu">Registrarse</router-link></li>
          <li v-if="isLoggedIn"><router-link to="/entrenamiento" @click="closeMenu">Entrenamiento</router-link></li>
          <li v-if="isLoggedIn"><router-link to="/profile" @click="closeMenu">Perfil</router-link></li>
          <li v-if="isLoggedIn"><button @click="handleLogout" class="logout-btn">Cerrar Sesión</button></li>
        </ul>
      </nav>
    </header>
  </template>

  <script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'HeaderPages',
    data() {
      return {
        isMenuOpen: false
      }
    },
    computed: {
      ...mapGetters(['isLoggedIn', 'usuario']),
    },
    methods: {
      ...mapActions(['logout']),
      handleLogout() {
        this.logout();
        this.closeMenu();
        this.$router.push('/');
      },
      toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        // Bloquear scroll cuando el menú está abierto
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
      },
      closeMenu() {
        this.isMenuOpen = false;
        document.body.style.overflow = ''; // Restaurar scroll
      }
    }
  }
  </script>
  <style>
  /* Estilos base (mobile first) */
  header {
    background-color: var(--primary-color);
    color: var(--text-light);
    padding: 1rem 2rem;
    position: sticky;
    top: 0;
    z-index: 1000;
  }
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  header h1 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--secondary-color);
  }
  /* Menú hamburguesa */
  .hamburger {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 2rem;
    height: 1.5rem;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 10;
  }
  .hamburger:focus {
    outline: none;
  }
  .hamburger span {
    width: 100%;
    height: 0.25rem;
    background: var(--text-light);
    border-radius: 0.25rem;
    transition: all var(--transition-speed) ease;
    position: relative;
    transform-origin: center;
  }
  .hamburger.active span:nth-child(1) {
    transform: translateY(0.6rem) rotate(45deg);
  }
  .hamburger.active span:nth-child(2) {
    opacity: 0;
  }
  .hamburger.active span:nth-child(3) {
    transform: translateY(-0.6rem) rotate(-45deg);
  }
  /* Navegación */
  nav {
    width: 100%;
    max-height: 0;
    overflow: hidden;
    transition: max-height var(--transition-speed) ease-out;
    background-color: var(--primary-color);
  }
  nav.active {
    max-height: 100vh;
  }
  nav ul {
    list-style: none;
    padding: 1rem 0;
  }
  nav ul li {
    width: 100%;
    text-align: center;
  }
  nav ul li a,
  nav ul li .logout-btn {
    display: block;
    text-decoration: none;
    color: var(--text-light);
    font-size: 1.1rem;
    padding: 0.8rem 0;
    transition: background-color var(--transition-speed), color var(--transition-speed);
    width: 100%;
    border: none;
    background: none;
    cursor: pointer;
  }
  nav ul li a:hover,
  nav ul li .logout-btn:hover {
    background-color: var(--secondary-color);
    color: var(--text-light);
  }
  /* Estilos para tablets (min-width: 600px) */
  @media (min-width: 600px) {
    header h1 {
      font-size: 1.75rem;
    }
  }
  /* Estilos para escritorio (min-width: 900px) */
  @media (min-width: 900px) {
    .hamburger {
      display: none;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
    }
    nav {
      max-height: none;
      width: auto;
      overflow: visible;
    }
    nav ul {
      display: flex;
      gap: 1rem;
      padding: 0;
    }
    nav ul li {
      width: auto;
    }
    nav ul li a,
    nav ul li .logout-btn {
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
    }
  }
  </style>
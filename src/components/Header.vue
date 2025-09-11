<template>
  <header class="header">
    <div class="header-container">
      <a><h1>Gym</h1></a>
      <button
        class="hamburger"
        @click="toggleMenu"
        :class="{ active: isMenuOpen }"
        aria-label="Menú"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
    </div>
    <nav :class="{ active: isMenuOpen }" aria-hidden="!isMenuOpen">
      <ul>
        <li><router-link to="/" @click="closeMenu">Inicio</router-link></li>
        <li><router-link to="/inicio" @click="closeMenu">Red</router-link></li>
        <li v-if="!isLoggedIn">
          <router-link to="/login" @click="closeMenu"
            >Iniciar Sesión</router-link
          >
        </li>
        <li v-if="!isLoggedIn">
          <router-link to="/register" @click="closeMenu"
            >Registrarse</router-link
          >
        </li>
        <li v-if="isLoggedIn">
          <router-link to="/entrenamiento" @click="closeMenu"
            >Rutinas</router-link
          >
        </li>
        <li v-if="isLoggedIn">
          <router-link to="/profile" @click="closeMenu">Perfil</router-link>
        </li>
        <li v-if="isLoggedIn">
          <button @click="handleLogout" class="logout-btn">
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </nav>
    <BotonToogleDark />
  </header>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import BotonToogleDark from "@/components/botonToogleDark.vue";
export default {
  name: "HeaderPages",
  components: {
    BotonToogleDark,
  },
  data() {
    return {
      isMenuOpen: false,
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn", "usuario"]),
  },
  methods: {
    ...mapActions(["logout"]),
    handleLogout() {
      this.logout();
      this.closeMenu();
      this.$router.push("/");
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      // Bloquear scroll cuando el menú está abierto
      document.body.style.overflow = this.isMenuOpen ? "hidden" : "";
    },
    closeMenu() {
      this.isMenuOpen = false;
      document.body.style.overflow = ""; // Restaurar scroll
    },
  },
};
</script>
<style>
/* Estilos base (mobile first) */
.header {
  background-color: var(--color-secondary);
  color: var(--color-secondary);
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
  background: linear-gradient(to right, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
  background: var(--color-primary);
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
.header nav {
  width: 100%;
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--transition-speed) ease-out;
  background-color: var(--color-secondary);
  flex: 1;
}

nav.active {
  max-height: 100vh;
}

.header nav ul {
  list-style: none;
  padding: 1rem 0;
  margin: 0;
}

.header nav ul li {
  width: 100%;
  text-align: center;
}

.header nav ul li a,
.header nav ul li .logout-btn {
  display: block;
  text-decoration: none;
  color: var(--color-primary);
  font-size: 1.1rem;
  padding: 0.8rem 0;
  transition: background-color var(--transition-speed),
    color var(--transition-speed) transform var(--transition-speed);
  width: 100%;
  border: none;
  background: none;
  cursor: pointer;
}

.header nav ul li a:hover,
.header nav ul li .logout-btn:hover {
  color: var(--color-accent);
  transform: translate(-2px, -2px);

}

.header nav ul li a.router-link-exact-active {
  color: var(--color-accent);
  font-weight: bold;
}

/* Estilos para escritorio (min-width: 900px) */
@media (min-width: 900px) {
  header h1 {
    font-size: 1.75rem;
  }
  .hamburger {
    display: none;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
  }

  .header nav {
    max-height: none;
    width: auto;
    overflow: visible;
  }

  .header nav ul {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 0;
  }

  .header nav ul li {
    width: auto;
  }

  .header nav ul li a,
  .header nav ul li .logout-btn {
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
  }

}
</style>

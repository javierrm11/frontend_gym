<template>
  <header class="header">
    <div class="header-container">
      <div class="logo-container">
        <router-link to="/" class="logo-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="logo-icon">
            <path d="M6 16a2 2 0 0 1-2-2c0-1.7 1.3-3 3-3 1.5 0 2.7.9 3.2 2.1"/>
            <path d="M14.2 13.9A3 3 0 0 1 17 11c1.7 0 3 1.3 3 3a2 2 0 0 1-2 2"/>
            <path d="M18 12h.01"/>
            <path d="M18 8h.01"/>
            <path d="M8 8h.01"/>
            <path d="M2 2h20v20H2z"/>
          </svg>
          <h1 class="logo-text">GymPro</h1>
        </router-link>
      </div>
      
      <div class="header-actions">
        <BotonToogleDark class="dark-toggle" />
        
        <button
          class="hamburger"
          @click="toggleMenu"
          :class="{ active: isMenuOpen }"
          aria-label="Menú"
          aria-expanded="isMenuOpen"
        >
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </div>
    
    <nav :class="{ active: isMenuOpen }" aria-hidden="!isMenuOpen">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/" @click="closeMenu" class="nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Inicio</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link to="/inicio" @click="closeMenu" class="nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <span>Explorar</span>
          </router-link>
        </li>
        
        <template v-if="!isLoggedIn">
          <li class="nav-item">
            <router-link to="/login" @click="closeMenu" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              <span>Iniciar Sesión</span>
            </router-link>
          </li>
          
          <li class="nav-item">
            <router-link to="/register" @click="closeMenu" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              <span>Registrarse</span>
            </router-link>
          </li>
        </template>
        
        <template v-else>
          <li class="nav-item">
            <router-link to="/entrenamiento" @click="closeMenu" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              <span>Mis Rutinas</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/mensajes" @click="closeMenu" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>Mensajes</span>
            </router-link>
          </li>
          
          <li class="nav-item">
            <router-link to="/profile" @click="closeMenu" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Perfil</span>
            </router-link>
          </li>
          
          <li class="nav-item">
            <button @click="handleLogout" class="nav-link logout-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Cerrar Sesión</span>
            </button>
          </li>
        </template>
      </ul>
      
      <div v-if="isLoggedIn" class="user-welcome">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Hola, {{ usuario?.nombre || 'Usuario' }}</span>
      </div>
    </nav>
    
    <!-- Overlay para móviles -->
    <div v-if="isMenuOpen" class="nav-overlay" @click="closeMenu"></div>
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
      document.body.style.overflow = this.isMenuOpen ? "hidden" : "";
    },
    closeMenu() {
      this.isMenuOpen = false;
      document.body.style.overflow = "";
    },
  },
};
</script>

<style scoped>
.header {
  background-color: var(--color-secondary);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 0.75rem 1rem;
}

.header-container {
  padding-left: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
}

/* Logo */
.logo-container {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 0.5rem;
}

.logo-icon {
  color: var(--color-primary);
}

.logo-text {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(to right, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Header actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dark-toggle {
  margin-right: 0.5rem;
}

/* Hamburger menu */
.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 2rem;
  height: 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
  position: relative;
}

.hamburger:focus {
  outline: none;
}

.hamburger-line {
  width: 100%;
  height: 0.2rem;
  background: var(--color-quinto);
  border-radius: 0.25rem;
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger.active .hamburger-line:nth-child(1) {
  transform: translateY(0.65rem) rotate(45deg);
}

.hamburger.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.hamburger.active .hamburger-line:nth-child(3) {
  transform: translateY(-0.65rem) rotate(-45deg);
}

/* Navigation */
nav {
  position: fixed;
  top: 0;
  right: -100%;
  width: 80%;
  max-width: 320px;
  height: 100vh;
  background-color: var(--color-secondary);
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  z-index: 999;
  transition: right 0.3s ease;
  padding: 5rem 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
}

nav.active {
  right: 0;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--color-quinto);
  padding: 0.9rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 500;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
}

.nav-link:hover {
  background-color: var(--color-terciario);
  color: var(--color-primary);
  transform: translateX(5px);
}

.nav-link.router-link-exact-active {
  background-color: var(--color-primary);
  color: var(--color-secondary);
}

.nav-icon {
  flex-shrink: 0;
}

.logout-btn {
  color: var(--color-error);
}

.logout-btn:hover {
  background-color: rgba(220, 53, 69, 0.1);
  color: var(--color-error);
}

/* User welcome */
.user-welcome {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  margin-top: 1rem;
  background-color: var(--color-terciario);
  border-radius: 8px;
  color: var(--color-sexto);
  font-size: 0.9rem;
}

/* Nav overlay */
.nav-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

/* Desktop styles */
@media (min-width: 900px) {
  .header {
    padding: 0.5rem 2rem;
  }
  
  .hamburger {
    display: none;
  }
  
  nav {
    position: static;
    width: auto;
    height: auto;
    max-width: max-content;
    background: transparent;
    box-shadow: none;
    padding: 0;
    flex-direction: row;
    align-items: center;
    overflow: visible;
    right: auto;
  }
  
  .nav-list {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .nav-item {
    margin-bottom: 0;
  }
  
  .nav-link {
    padding: 0.6rem 1rem;
    border-radius: 6px;
  }
  
  .nav-link:hover {
    transform: translateY(-2px);
  }
  
  .user-welcome {
    display: none;
  }
  
  .nav-overlay {
    display: none;
  }
}

@media (min-width: 1024px) {
  .logo-text {
    font-size: 1.75rem;
  }
  
  .nav-list {
    gap: 0.5rem;
  }
}
</style>
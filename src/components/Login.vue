<template>
  <main class="login-main">
    <div class="login-header">
      <div class="header-content">
        <h2 class="login-title">Iniciar Sesión</h2>
        <p class="login-subtitle">Accede a tu cuenta para gestionar tus rutinas</p>
      </div>
    </div>

    <form class="login-form" @submit.prevent="login">
      <div class="login-form-content">
        <div class="login-form-group">
          <label class="login-label" for="nombreUsuario">Nombre de Usuario</label>
          <div class="input-with-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <input
              type="text"
              id="nombreUsuario"
              class="login-input"
              v-model="nombreUsuario"
              placeholder="Ingresa tu nombre de usuario"
            />
          </div>
        </div>

        <div class="login-form-group">
          <label class="login-label" for="password">Contraseña</label>
          <div class="input-with-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input
              type="password"
              id="password"
              class="login-input"
              v-model="password"
              placeholder="Ingresa tu contraseña"
            />
          </div>
        </div>

        <div class="login-options">
          <router-link to="/recuperar-password" class="forgot-password">
            ¿Olvidaste tu contraseña?
          </router-link>
        </div>

        <div class="login-btn-group">
          <button type="submit" class="login-btn" :disabled="cargando">
            <svg v-if="cargando" class="spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <span v-else>Iniciar Sesión</span>
          </button>
        </div>

        <div class="login-register-link">
          <p>¿No tienes una cuenta? <router-link to="/registro">Regístrate aquí</router-link></p>
        </div>
      </div>

      <div v-if="errores.length" class="login-alert">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <div class="login-alert-content">
          <h4>Error al iniciar sesión</h4>
          <ul class="login-alert-list">
            <li v-for="(error, index) in errores" :key="index">{{ error }}</li>
          </ul>
        </div>
      </div>
    </form>
  </main>
</template>

<script>
import axios from "axios";
import socket from "@/services/socket";

export default {
  name: "LoginUser",
  data() {
    return {
      nombreUsuario: "",
      password: "",
      errores: [],
      cargando: false
    };
  },
  methods: {
    login() {
      this.errores = [];
      this.cargando = true;
      
      if (this.nombreUsuario === "") {
        this.errores.push("El nombre de usuario es obligatorio");
      }
      if (this.password === "") {
        this.errores.push("La contraseña es obligatoria");
      }
      
      if (this.errores.length > 0) {
        this.cargando = false;
        return;
      }
      
      axios
        .post(`${process.env.VUE_APP_BASE_URL}/api/auth/login`, {
          nombreUsuario: this.nombreUsuario,
          password: this.password,
        })
        .then((response) => {
          const token = response.data.token;
          const usuario = response.data.idUser;
          const payload = token.split(".")[1];
          const decoded = atob(payload);
          const jwtData = JSON.parse(decoded);
          const exp = jwtData.exp;
          const expirationDate = new Date(exp * 1000);
          const userId = response.data.idUser;
          socket.connect();
          socket.emit("join", userId);
          this.$store.dispatch("login", { token, usuario, expirationDate });
          this.$router.push("/inicio");
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.status === 401) {
            this.errores.push("Credenciales incorrectas. Verifique su usuario y contraseña.");
          } else {
            this.errores.push("Error al iniciar sesión. Inténtelo de nuevo más tarde.");
          }
        })
        .finally(() => {
          this.cargando = false;
        });
    },
  },
};
</script>

<style scoped>
.login-main {
  min-height: 100vh;
  background: var(--color-terciario);
  padding: 0;
  display: flex;
  flex-direction: column;
}

/* Header */
.login-header {
  background: var(--color-primary);
  color: var(--color-quinto);
  padding: 2rem 1rem;
  text-align: center;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.login-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  line-height: 1.2;
  color: var(--color-secondary);
}

.login-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  color: var(--color-secondary);
}

/* Formulario */
.login-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.login-form-content {
  background: var(--color-secondary);
  width: -webkit-fill-available;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.login-form-group {
  margin-bottom: 1.5rem;
}

.login-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--color-quinto);
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon svg {
  position: absolute;
  left: 1rem;
  color: var(--color-sexto);
  z-index: 1;
}

.login-input {
  width: -webkit-fill-available;
  padding: 0.8rem 1rem 0.8rem 3rem;
  border: 1px solid var(--color-terciario);
  color: var(--color-sexto);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--color-secondary);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.login-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
}

.login-input::placeholder {
  color: var(--color-sexto);
  opacity: 0.7;
}

/* Opciones */
.login-options {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.forgot-password {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: var(--color-cuarto);
  text-decoration: underline;
}

/* Botón */
.login-btn-group {
  text-align: center;
  margin-bottom: 1.5rem;
}

.login-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--color-primary);
  color: var(--color-secondary);
  padding: 0.9rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
  width: 100%;
}

.login-btn:hover:not(:disabled) {
  background: var(--color-cuarto);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  animation: spin 1s linear infinite;
  width: 20px;
  height: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Enlace de registro */
.login-register-link {
  text-align: center;
  color: var(--color-sexto);
}

.login-register-link a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.login-register-link a:hover {
  color: var(--color-cuarto);
  text-decoration: underline;
}

/* Alertas */
.login-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  background: var(--color-error);
  color: var(--color-secondary);
  width: 100%;
}

.login-alert-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.login-alert-list {
  margin: 0;
  padding-left: 1.25rem;
}

.login-alert-list li {
  margin-bottom: 0.25rem;
}

.login-alert-list li:last-child {
  margin-bottom: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .login-form {
    padding: 1rem;
  }
  
  .login-form-content {
    padding: 1.5rem;
  }
  
  .login-title {
    font-size: 1.8rem;
  }
  
  .login-subtitle {
    font-size: 1rem;
  }
}
</style>
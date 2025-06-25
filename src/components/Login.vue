<template>
  <main class="login-main">
    <h2 class="login-title">Login de Usuario</h2>
    <form class="login-form" @submit.prevent="login">
      <div class="login-form-group">
        <label class="login-label" for="nombreUsuario">Nombre de Usuario</label>
        <input
          type="text"
          id="nombreUsuario"
          class="login-input"
          v-model="nombreUsuario"
        />
      </div>

      <div class="login-form-group">
        <label class="login-label" for="password">Contraseña</label>
        <input
          type="password"
          id="password"
          class="login-input"
          v-model="password"
        />
      </div>

      <div class="login-btn-group">
        <button type="submit" class="login-btn">Iniciar Sesión</button>
      </div>

      <div v-if="errores.length" class="login-alert">
        <ul class="login-alert-list">
          <li v-for="(error, index) in errores" :key="index">{{ error }}</li>
        </ul>
      </div>
    </form>
  </main>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginUser",
  data() {
    return {
      nombreUsuario: "",
      password: "",
      errores: [],
    };
  },
  methods: {
    login() {
      this.errores = [];
      if (this.nombreUsuario === "") {
        this.errores.push("El nombre de usuario es obligatorio");
      }
      if (this.password === "") {
        this.errores.push("La contraseña es obligatoria");
      }
      if (this.errores.length === 0) {
        axios
          .post("http://localhost:3000/api/auth/login", {
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

            this.$store.dispatch("login", { token, usuario, expirationDate });
            this.$router.push("/");
          })
          .catch((error) => {
            console.log(error);
            this.errores.push(
              "Error al iniciar sesión. Verifique sus credenciales."
            );
          });
      }
    },
  },
};
</script>

<style>
.login-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: var(--background-light);
  color: var(--text-primary);
  min-height: 100vh;
}

.login-title {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.login-form {
  max-width: 500px;
  width: 100%;
  background-color: var(--color-secondary);
  border: 2px solid var(--color-primary);
  padding: 2rem;
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.login-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.login-label {
  font-weight: bold;
  color: var(--text-secondary);
}

.login-input {
  padding: 0.75rem;
  border: 1px solid #444;
  border-radius: var(--border-radius);
  background-color: #2C2C2E;
  color: var(--text-primary);
  transition: border var(--transition-speed);
}

.login-input:focus {
  border-color: var(--color-primary);
  outline: none;
}

.login-btn-group {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.login-btn {
  font-size: 1.2rem;
  background-color: var(--color-primary);
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  border: none;
  width: 12rem;
  cursor: pointer;
  color: white;
  transition: background-color var(--transition-speed);
}

.login-btn:hover {
  background-color: var(--color-accent);
  color: var(--color-secondary);
}

.login-alert {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: var(--border-radius);
  background-color: var(--color-error);
  color: #fff;
}

.login-alert-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.login-alert-list li {
  margin-bottom: 0.5rem;
}

@media (max-width: 600px) {
  .login-form {
    padding: 1.5rem;
    margin: 0 1rem;
  }
  .login-title {
    font-size: 1.75rem;
  }
}
</style>
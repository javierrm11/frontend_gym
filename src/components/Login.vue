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
  padding: 2rem 1rem;
  min-height: 100vh;
}

.login-title {
  font-size: 2.2rem;
  font-weight: 700;
  background: linear-gradient(to right, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 1rem 0 2rem;
  text-align: center;
  letter-spacing: 0.5px;
}

.login-form {
  background-color: var(--color-secondary);
  max-width: 500px;
  width: 100%;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  place-self: center;
}

.login-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.login-label {
  font-weight: 600;
  color: var(--color-primary);
  font-size: 0.95rem;
}

.login-input {
  padding: 0.8rem 1rem;
  border: 1px solid var(--color-terciario);
  border-radius: 8px;
  font-size: 1rem;
  background-color: var(--color-secondary);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.login-input:focus {
  outline: none;
  border-color: var(--color-accent);
}

/* Botón */
.login-btn-group {
  display: flex;
  justify-content: center;
}

.login-btn {
  font-size: 1rem;
  background-color: var(--color-cuarto);
  margin-top: 1rem;
  padding: 0.9rem 2rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  color: var(--color-secondary);
  font-weight: 600;
  letter-spacing: 0.3px;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.login-btn:hover {
  background-color: var(--color-quinto);
  color: var(--color-secondary);
  transform: translateY(-2px);
}

/* Alertas */
.login-alert {
  margin-top: 1rem;
  padding: 1rem 1.2rem;
  border-radius: 8px;
  background-color: var(--color-error);
  color: #fff;
  font-size: 0.95rem;
}

.login-alert-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.login-alert-list li {
  margin-bottom: 0.4rem;
}

/* Responsive */
@media (max-width: 600px) {
  .login-form {
    padding: 1.5rem;
  }
  .login-btn {
    width: 100%;
  }
}

</style>
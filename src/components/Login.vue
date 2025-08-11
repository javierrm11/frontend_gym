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
  padding: 3rem 1rem;
  min-height: 100vh;
}

/* TÍTULO */
.login-title {
  font-size: 2.5rem;
  color: var(--color-secondary);
  margin-bottom: 2rem;
  text-align: center;
}

/* FORMULARIO */
.login-form {
  background-color: var(--color-primary);
  max-width: 500px;
  width: 100%;
  padding: 2rem 2.5rem;
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: var(--box-shadow);
  border: 1px solid var(--color-accent);
}

/* CAMPOS */
.login-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.login-label {
  font-weight: 600;
  color: var(--color-secondary);
  font-size: 1rem;
}

.login-input {
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: var(--border-radius);
  font-size: 1rem;
  color: var(--color-secondary);
  background-color: #f9f9f9;
  transition: border var(--transition-speed), box-shadow var(--transition-speed);
}

.login-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 6px var(--color-accent);
}

/* BOTÓN */
.login-btn-group {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.login-btn {
  font-size: 1.1rem;
  background-color: var(--color-secondary);
  padding: 1rem 2.5rem;
  border-radius: var(--border-radius);
  border: none;
  cursor: pointer;
  color: var(--color-primary);
  transition: background-color var(--transition-speed), color var(--transition-speed), transform var(--transition-speed);
  box-shadow: 4px 4px 0 var(--color-accent);
}

.login-btn:hover {
  background-color: var(--color-accent);
  color: var(--color-secondary);
  box-shadow: 4px 4px 0 var(--color-secondary);
  transform: translateY(-2px);
}

/* ALERTAS */
.login-alert {
  margin-top: 1rem;
  padding: 1rem 1.5rem;
  border-radius: var(--border-radius);
  background-color: var(--color-error);
  color: #fff;
  box-shadow: var(--box-shadow);
}

.login-alert-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.login-alert-list li {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

/* RESPONSIVE */
@media (max-width: 600px) {
  .login-form {
    padding: 1.5rem;
    margin: 0 1rem;
  }

  .login-title {
    font-size: 2rem;
  }

  .login-btn {
    width: 100%;
  }
}
</style>
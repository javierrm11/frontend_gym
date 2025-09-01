<template>
  <main class="register-main">
    <h2 class="register-title">Registro de Usuario</h2>
    <form class="register-form" @submit.prevent="registrar">

      <div class="register-form-group">
        <label class="register-label" for="nombreUsuario">Nombre de Usuario</label>
        <input type="text" id="nombreUsuario" class="register-input" v-model="nombreUsuario">
      </div>

      <div class="register-form-group">
        <label class="register-label" for="nombre">Nombre</label>
        <input type="text" id="nombre" class="register-input" v-model="nombre">
      </div>

      <div class="register-form-group">
        <label class="register-label" for="email">Email</label>
        <input type="email" id="email" class="register-input" v-model="email">
      </div>

      <div class="register-form-group">
        <label class="register-label" for="imagen">Imagen</label>
        <input type="file" id="imagen" class="register-input" @change="cargarImagen">
      </div>

      <div class="register-descripcion-group register-form-group">
        <label class="register-label" for="descripcion">Descripción</label>
        <input type="text" id="descripcion" class="register-input" v-model="descripcion">
      </div>

      <div class="register-form-group">
        <label class="register-label" for="password">Contraseña</label>
        <input type="password" id="password" class="register-input" v-model="password">
      </div>

      <div class="register-form-group">
        <label class="register-label" for="password2">Repetir Contraseña</label>
        <input type="password" id="password2" class="register-input" v-model="password2">
      </div>
      <div class="register-btn-group">
        <button type="submit" class="register-btn">Registrarse</button>
      </div>
      <div v-if="errores.length" class="register-alert">
        <ul class="register-alert-list">
          <li v-for="(error, index) in errores" :key="index">{{ error }}</li>
        </ul>
      </div>
    </form>
  </main>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RegistroUser',
  data() {
    return {
      nombreUsuario: '',
      nombre: '',
      email: '',
      imagen: null,
      descripcion: '',
      password: '',
      password2: '',
      errores: []
    };
  },
  methods: {
    cargarImagen(event) {
      this.imagen = event.target.files[0];
    },
    registrar() {
      this.errores = [];

      if (this.password !== this.password2) {
        this.errores.push("Las contraseñas no coinciden.");
      }

      if (!this.nombreUsuario || !this.nombre || !this.email || !this.password || !this.password2) {
        this.errores.push("Todos los campos son obligatorios.");
      }

      const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!correoValido.test(this.email)) {
        this.errores.push("El correo electrónico no es válido.");
      }

      if (this.errores.length === 0) {
        const formData = new FormData();
        formData.append('Nombre_Usuario', this.nombreUsuario);
        formData.append('Nombre', this.nombre);
        formData.append('Email', this.email);
        formData.append('Descripcion', this.descripcion);
        formData.append('Password', this.password);

        if (this.imagen) {
          formData.append('fotoPerfil', this.imagen);
        }

        axios.post(`${process.env.VUE_APP_BASE_URL}/api/auth/register`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(response => {
          console.log(response.data);
          this.$router.push({ path: '/mensaje', query: { msg: 'Usuario registrado correctamente. Compruebe su correo electrónico.' } });
        })
        .catch(error => {
          console.error('Error al registrar:', error);
        });
      }
    }
  }
};
</script>

<style>
.register-main {
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  min-height: 100vh;
}

.register-title {
  font-size: 2.2rem;
  font-weight: 700;
  background: linear-gradient(to right, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 1rem 0 2rem;
  text-align: center;
  letter-spacing: 0.5px;
}

.register-form {
  background-color: var(--color-secondary);
  max-width: 700px;
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  place-self: center;
}

.register-form-group {
  flex: 1 1 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.register-label {
  font-weight: 600;
  color: var(--color-primary);
  font-size: 0.95rem;
}

.register-input {
  padding: 0.8rem 1rem;
  border: 1px solid var(--color-terciario);
  color: var(--color-sexto);
  border-radius: 8px;
  font-size: 1rem;
  background-color: var(--color-secondary);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

#imagen {
  width: 100%;
  box-sizing: border-box;
}

.register-input:focus {
  outline: none;
  border-color: var(--color-accent);
}

/* Botón */
.register-btn-group {
  flex: 0 0 100%;
  display: flex;
  justify-content: center;
}

.register-btn {
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

.register-btn:hover {
  background-color: var(--color-quinto);
  color: var(--color-secondary);
  transform: translateY(-2px);
}

/* Alertas */
.register-alert {
  flex: 1 1 100%;
  margin-top: 1rem;
  padding: 1rem 1.2rem;
  border-radius: 8px;
  background-color: var(--color-error);
  color: #fff;
  font-size: 0.95rem;
}

.register-alert-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.register-alert-list li {
  margin-bottom: 0.4rem;
}

/* Responsive */
@media (min-width: 600px) {
  .register-form-group {
    flex: 1 1 48%;
  }
  .register-form{
    padding: 2rem;
  }
  .register-descripcion-group {
    flex: 1 1 100%;
  }
}

</style>
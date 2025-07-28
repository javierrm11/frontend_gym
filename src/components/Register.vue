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

        axios.post('http://localhost:3000/api/auth/register', formData, {
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
  align-items: center;
  padding: 2rem;
  background-color: var(--background-light);
  color: var(--text-primary);
  min-height: 100vh;
}

.register-title {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.register-form {
  max-width: 800px;
  width: 100%;
  background-color: var(--color-secondary);
  border: 2px solid var(--color-primary);
  padding: 2rem;
  border-radius: var(--border-radius);
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.register-form > div {
  flex: 1 1 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.register-label {
  font-weight: bold;
  color: var(--text-secondary);
}

.register-input {
  padding: 0.75rem;
  border: 1px solid #444;
  border-radius: var(--border-radius);
  background-color: #2C2C2E;
  color: var(--text-primary);
  transition: border var(--transition-speed);
}

.register-input:focus {
  border-color: var(--color-primary);
  outline: none;
}

.register-btn-group {
  flex: 0 0 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-btn {
  font-size: 1.2rem;
  background-color: var(--color-primary);
  margin-top: 1rem;
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  border: none;
  width: 12rem;
  cursor: pointer;
  color: white;
  transition: background-color var(--transition-speed);
}

.register-btn:hover {
  background-color: var(--hover-color);
}

.register-alert {
  flex: 1 1 100%;
  margin-top: 1rem;
  padding: 1rem;
  border-radius: var(--border-radius);
  background-color: var(--color-error);
  color: #fff;
}

.register-alert-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.register-alert-list li {
  margin-bottom: 0.5rem;
}

@media (min-width: 600px) {
  .register-form > div {
    flex: 1 1 45%;
  }
  .register-descripcion-group{
    flex: 1 1 100% !important;
  }
}

</style>
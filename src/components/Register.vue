<template>
  <div id="registro">
    <form @submit.prevent="registrar">
      <h2>Registro de Usuario</h2>

      <div class="form-group">
        <label for="nombreUsuario">Nombre de Usuario</label>
        <input type="text" id="nombreUsuario" class="form-control" v-model="nombreUsuario">
      </div>

      <div class="form-group">
        <label for="nombre">Nombre</label>
        <input type="text" id="nombre" class="form-control" v-model="nombre">
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" class="form-control" v-model="email">
      </div>

      <div class="form-group">
        <label for="imagen">Imagen</label>
        <input type="file" id="imagen" class="form-control" @change="cargarImagen">
      </div>

      <div class="form-group">
        <label for="descripcion">Descripción</label>
        <input type="text" id="descripcion" class="form-control" v-model="descripcion">
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input type="password" id="password" class="form-control" v-model="password">
      </div>

      <div class="form-group">
        <label for="password2">Repetir Contraseña</label>
        <input type="password" id="password2" class="form-control" v-model="password2">
      </div>

      <button type="submit" class="btn btn-primary">Registrarse</button>
    </form>
  </div>
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
      imagen: null, // ← importante: guardar el archivo
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

      // Validaciones
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
          formData.append('fotoPerfil', this.imagen); // ← mismo nombre que en multer
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

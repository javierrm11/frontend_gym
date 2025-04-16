<template>
    <div id="registro">
        <form action="" method="post" @submit.prevent="registrar">
            <h2>Registro de Usuario</h2>
            <div class="form-group">
                <label for="nombreUsuario">Nombre de Usuario</label>
                <input type="text" name="nombreUsuario" id="nombreUsuario" class="form-control" v-model="nombreUsuario">
            </div>
            <div class="form-group">
                <label for="nombre">Nombre</label>
                <input type="text" name="nombre" id="nombre" class="form-control" v-model="nombre">
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" name="email" id="email" class="form-control" v-model="email">
            </div>
            <div class="form-group">
                <label for="imagen">Imagen</label>
                <input type="file" name="imagen" id="imagen" class="form-control">
            </div>
            <div class="form-group">
                <label for="descripcion">Descripcion</label>
                <input type="descripcion" name="descripcion" id="descripcion" class="form-control" v-model="descripcion">
            </div>
            <div class="form-group">
                <label for="password">Contraseña</label>
                <input type="password" name="password" id="password" class="form-control" v-model="password">
            </div>
            <div class="form-group">
                <label for="password2">Repetir Contraseña</label>
                <input type="password" name="password2" id="password2" class="form-control" v-model="password2">
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
      imagen: '',
      descripcion: '',
      password: '',
      password2: '',
      errores: []
    };
  },
  methods: {
    registrar() {
      this.errores = [];

      // Validación de contraseñas
      if (this.password !== this.password2) {
        this.errores.push("Las contraseñas no coinciden.");
      }

      // Verificar que todos los campos estén llenos
      if (!this.nombreUsuario || !this.nombre || !this.email || !this.password || !this.password2) {
        this.errores.push("Todos los campos son obligatorios.");
      }

      // Validación de correo electrónico
      const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!correoValido.test(this.email)) {
        this.errores.push("El correo electrónico no es válido.");
      }

      // Si no hay errores, enviar los datos
      if (this.errores.length === 0) {
        axios.post('http://localhost:3000/api/auth/register', {
          Nombre_Usuario: this.nombreUsuario,
          Nombre: this.nombre,
          Email: this.email,
          Foto: this.imagen,
          Descripcion: this.descripcion,
          Password: this.password
        })
        .then(response => {
            console.log(response);
            this.$router.push({ path: '/mensaje', query: { msg: 'Usuario registrado correctamente. Compruebe su correo electronico para verificar la cuenta' } });
        })
      }
    },
  }
};
</script>

<style>

</style>
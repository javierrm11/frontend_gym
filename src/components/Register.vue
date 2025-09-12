<template>
  <main class="register-main">
    <div class="register-header">
      <div class="header-content">
        <h2 class="register-title">Registro de Usuario</h2>
        <p class="register-subtitle">Crea tu cuenta para comenzar a usar nuestra plataforma</p>
      </div>
    </div>

    <form class="register-form" @submit.prevent="registrar">
      <div class="register-form-columns">
        <div class="register-form-col">
          <div class="register-form-group">
            <label class="register-label" for="nombreUsuario">Nombre de Usuario *</label>
            <input type="text" id="nombreUsuario" class="register-input" v-model="nombreUsuario" placeholder="Ingresa tu nombre de usuario">
          </div>

          <div class="register-form-group">
            <label class="register-label" for="nombre">Nombre Completo *</label>
            <input type="text" id="nombre" class="register-input" v-model="nombre" placeholder="Ingresa tu nombre completo">
          </div>

          <div class="register-form-group">
            <label class="register-label" for="email">Email *</label>
            <input type="email" id="email" class="register-input" v-model="email" placeholder="ejemplo@correo.com">
          </div>
        </div>

        <div class="register-form-col">
          <div class="register-form-group">
            <label class="register-label" for="imagen">Imagen de Perfil</label>
            <div class="file-input-container">
              <input type="file" id="imagen" class="register-file-input" @change="cargarImagen" accept="image/*">
              <label for="imagen" class="file-input-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                {{ imagen ? imagen.name : 'Seleccionar archivo' }}
              </label>
            </div>
          </div>

          <div class="register-form-group">
            <label class="register-label" for="descripcion">Descripción</label>
            <input type="text" id="descripcion" class="register-input" v-model="descripcion" placeholder="Breve descripción sobre ti">
          </div>

          <div class="register-form-group">
            <label class="register-label" for="password">Contraseña *</label>
            <input type="password" id="password" class="register-input" v-model="password" placeholder="Crea una contraseña segura">
          </div>

          <div class="register-form-group">
            <label class="register-label" for="password2">Repetir Contraseña *</label>
            <input type="password" id="password2" class="register-input" v-model="password2" placeholder="Repite tu contraseña">
          </div>
        </div>
      </div>

      <div class="register-btn-group">
        <button type="submit" class="register-btn">
          <svg v-if="cargando" class="spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <span v-else>Crear Cuenta</span>
        </button>
      </div>

      <div v-if="errores.length" class="register-alert">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <div class="register-alert-content">
          <h4>Por favor, corrige los siguientes errores:</h4>
          <ul class="register-alert-list">
            <li v-for="(error, index) in errores" :key="index">{{ error }}</li>
          </ul>
        </div>
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
      errores: [],
      cargando: false
    };
  },
  methods: {
    cargarImagen(event) {
      this.imagen = event.target.files[0];
    },
    registrar() {
      this.errores = [];
      this.cargando = true;

      // Validaciones
      if (!this.nombreUsuario) {
        this.errores.push("El nombre de usuario es obligatorio.");
      }
      
      if (!this.nombre) {
        this.errores.push("El nombre completo es obligatorio.");
      }
      
      if (!this.email) {
        this.errores.push("El email es obligatorio.");
      } else {
        const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correoValido.test(this.email)) {
          this.errores.push("El correo electrónico no es válido.");
        }
      }
      
      if (!this.password) {
        this.errores.push("La contraseña es obligatoria.");
      } else if (this.password.length < 6) {
        this.errores.push("La contraseña debe tener al menos 6 caracteres.");
      }
      
      if (this.password !== this.password2) {
        this.errores.push("Las contraseñas no coinciden.");
      }

      if (this.errores.length > 0) {
        this.cargando = false;
        return;
      }

      // Enviar datos al servidor
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
        if (error.response && error.response.data && error.response.data.error) {
          this.errores.push(error.response.data.error);
        } else {
          this.errores.push("Error al registrar usuario. Inténtalo de nuevo.");
        }
      })
      .finally(() => {
        this.cargando = false;
      });
    }
  }
};
</script>

<style scoped>
.register-main {
  min-height: 100vh;
  background: var(--color-terciario);
  padding: 0;
}

/* Header */
.register-header {
  background: var(--color-primary);
  color: var(--color-quinto);
  padding: 2rem 1rem;
  text-align: center;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.register-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  line-height: 1.2;
  color: var(--color-secondary);
}

.register-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  color: var(--color-secondary);
}

/* Formulario */
.register-form {
  background: var(--color-secondary);
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.register-form-columns {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.register-form-col {
  flex: 1;
  min-width: 300px;
}

.register-form-group {
  margin-bottom: 1.5rem;
}

.register-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--color-quinto);
}

.register-input {
  width: -webkit-fill-available;
  padding: 0.8rem 1rem;
  border: 1px solid var(--color-terciario);
  color: var(--color-sexto);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--color-secondary);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.register-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
}

.register-input::placeholder {
  color: var(--color-sexto);
  opacity: 0.7;
}

/* File Input */
.file-input-container {
  position: relative;
}

.register-file-input {
  position: absolute;
  left: -9999px;
}

.file-input-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1rem;
  border: 1px solid var(--color-terciario);
  border-radius: 8px;
  background: var(--color-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--color-sexto);
  font-size: 0.95rem;
}

.file-input-label:hover {
  border-color: var(--color-primary);
  background: var(--color-terciario);
}

/* Botón */
.register-btn-group {
  text-align: center;
  margin-top: 1.5rem;
}

.register-btn {
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
}

.register-btn:hover:not(:disabled) {
  background: var(--color-cuarto);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.register-btn:disabled {
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

/* Alertas */
.register-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  background: var(--color-error);
  color: var(--color-secondary);
}

.register-alert-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.register-alert-list {
  margin: 0;
  padding-left: 1.25rem;
}

.register-alert-list li {
  margin-bottom: 0.25rem;
}

.register-alert-list li:last-child {
  margin-bottom: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .register-form {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .register-form-columns {
    flex-direction: column;
    gap: 0;
  }
  
  .register-title {
    font-size: 1.8rem;
  }
  
  .register-subtitle {
    font-size: 1rem;
  }
}
</style>
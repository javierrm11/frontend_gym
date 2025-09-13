<template>
    <main class="edit-profile-main">
      <!-- Header -->
      <div class="edit-header">
        <div class="header-content">
          <h1 class="edit-title">Editar Perfil</h1>
          <p class="edit-subtitle">Actualiza tu información personal y preferencias</p>
        </div>
      </div>
  
      <!-- Formulario -->
      <div class="edit-content">
        <form class="edit-form" @submit.prevent="updateProfile">
          <!-- Información básica -->
          <div class="form-section">
            <h2 class="section-title">Información Básica</h2>
            
            <div class="form-grid">
              <div class="form-group">
                <label for="nombre_usuario" class="form-label">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Nombre de Usuario
                </label>
                <input 
                  type="text" 
                  id="nombre_usuario" 
                  v-model="usuario.Nombre_Usuario"
                  class="form-input"
                  required
                >
              </div>
  
              <div class="form-group">
                <label for="nombre" class="form-label">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Nombre Completo
                </label>
                <input 
                  type="text" 
                  id="nombre" 
                  v-model="usuario.Nombre"
                  class="form-input"
                  required
                >
              </div>
  
              <div class="form-group">
                <label for="email" class="form-label">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Correo Electrónico
                </label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="usuario.Email"
                  class="form-input"
                  required
                >
              </div>
  
              <div class="form-group">
                <label for="password" class="form-label">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Nueva Contraseña
                </label>
                <input 
                  type="password" 
                  id="password" 
                  v-model="usuario.Password" 
                  placeholder="Dejar en blanco para no cambiar"
                  class="form-input"
                >
                <p class="input-hint">Mínimo 8 caracteres, incluir mayúsculas, minúsculas y números</p>
              </div>
            </div>
          </div>
  
          <!-- Imagen de perfil -->
          <div class="form-section">
            <h2 class="section-title">Imagen de Perfil</h2>
            
            <div class="avatar-upload">
              <div class="avatar-preview">
                <img :src="avatarPreview" alt="Vista previa" class="avatar-image" v-if="avatarPreview">
                <div class="avatar-placeholder" v-else>
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
              
              <div class="upload-controls">
                <label for="imagen" class="btn-upload">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Seleccionar Imagen
                </label>
                <input 
                  type="file" 
                  id="imagen" 
                  @change="handleFileUpload"
                  class="file-input"
                  accept="image/*"
                >
                <p class="upload-hint">Formatos: JPG, PNG o GIF. Máx. 5MB</p>
              </div>
            </div>
          </div>
  
          <!-- Descripción -->
          <div class="form-section">
            <h2 class="section-title">Sobre Mí</h2>
            
            <div class="form-group full-width">
              <label for="descripcion" class="form-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Descripción Personal
              </label>
              <textarea 
                id="descripcion" 
                v-model="usuario.Descripcion"
                class="form-textarea"
                rows="4"
                placeholder="Cuéntanos algo sobre ti, tus objetivos fitness, etc."
              ></textarea>
              <div class="textarea-counter">
                {{ usuario.Descripcion ? usuario.Descripcion.length : 0 }}/500 caracteres
              </div>
            </div>
          </div>
  
          <!-- Acciones -->
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="$router.go(-1)">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Cancelar
            </button>
            
            <button type="submit" class="btn-save" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="btn-spinner"></span>
              <span v-else>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Guardar Cambios
              </span>
            </button>
          </div>
        </form>
      </div>
    </main>
  </template>
  
  <script>
  import axios from "axios"
  
  export default {
    name: 'EditProfile',
    data() {
      return {
        usuario: {
          Nombre_Usuario: '',
          Nombre: '',
          Email: '',
          Descripcion: '',
          Password: ''
        },
        imagen: null,
        avatarPreview: null,
        isSubmitting: false
      }
    },
    mounted() {
      this.fetchUserData();
    },
    methods: {
      fetchUserData() {
        axios.get(`${process.env.VUE_APP_BASE_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(response => {
          this.usuario = response.data;
          
          // Cargar imagen actual si existe
          if (this.usuario.Foto) {
            this.avatarPreview = `${process.env.VUE_APP_BASE_URL}${this.usuario.Foto}`;
          }
        })
        .catch(error => {
          console.error("Error al obtener el usuario:", error);
        });
      },
      
      handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Validar tamaño (máx 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('La imagen no puede superar los 5MB');
          return;
        }
        
        // Validar tipo
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          alert('Formato de imagen no válido. Use JPG, PNG o GIF');
          return;
        }
        
        this.imagen = file;
        
        // Crear vista previa
        const reader = new FileReader();
        reader.onload = (e) => {
          this.avatarPreview = e.target.result;
        };
        reader.readAsDataURL(file);
      },
      
      updateProfile() {
        this.isSubmitting = true;
        
        const formData = new FormData();
        formData.append('Nombre_Usuario', this.usuario.Nombre_Usuario);
        formData.append('Nombre', this.usuario.Nombre);
        formData.append('Email', this.usuario.Email);
        formData.append('Descripcion', this.usuario.Descripcion);
        
        if (this.usuario.Password) {
          // Validar contraseña si se proporciona
          if (this.usuario.Password.length < 8) {
            alert('La contraseña debe tener al menos 8 caracteres');
            this.isSubmitting = false;
            return;
          }
          formData.append('Password', this.usuario.Password);
        }
  
        if (this.imagen) {
          formData.append('fotoPerfil', this.imagen);
        }
  
        axios.put(`${process.env.VUE_APP_BASE_URL}/api/user`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(response => {
          console.log("Perfil actualizado exitosamente:", response.data);
          this.$router.push('/profile');
        })
        .catch(error => {
          console.error("Error al actualizar el perfil:", error);
          alert('Error al actualizar el perfil. Por favor, intente nuevamente.');
        })
        .finally(() => {
          this.isSubmitting = false;
        });
      }
    }
  }
  </script>
  
  <style scoped>
  
  .edit-profile-main {
    min-height: 100vh;
    background: var(--color-terciario);
    padding-bottom: 2rem;
  }
  
  /* Header */
  .edit-header {
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
    color: var(--color-secondary);
    padding: 2rem 1rem;
    margin-bottom: 2rem;
  }
  
  .header-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }
  
  .edit-title {
    color: var(--color-secondary);
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .edit-subtitle {
    color: var(--color-secondary);
    font-size: 1.1rem;
    opacity: 0.9;
  }
  
  /* Contenido principal */
  .edit-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .edit-form {
    background: var(--color-secondary);
    border-radius: var(--border-radius);
    padding: 2rem;
    box-shadow: var(--shadow);
  }
  
  /* Secciones del formulario */
  .form-section {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .form-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
  
  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-quinto);
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  /* Grid del formulario */
  .form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  @media (min-width: 768px) {
    .form-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  /* Grupos de formulario */
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-group.full-width {
    grid-column: 1 / -1;
  }
  
  .form-label {
    font-weight: 600;
    color: var(--color-quinto);
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .form-input,
  .form-textarea {
    padding: 0.75rem 1rem;
    color: var(--color-sexto);
    border: 1px solid var(--color-terciario);
    border-radius: var(--border-radius);
    font-size: 1rem;
    transition: all var(--transition-speed);
    background: var(--color-secondary);
  }
  
  .form-input:focus,
  .form-textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
  }
  
  .form-input::placeholder {
    color: var(--color-sexto);
  }
  
  .input-hint {
    font-size: 0.8rem;
    color: var(--color-sexto);
    margin-top: 0.25rem;
  }
  
  .form-textarea {
    resize: vertical;
    min-height: 120px;
    font-family: inherit;
  }
  
  .textarea-counter {
    font-size: 0.8rem;
    color: var(--color-sexto);
    text-align: right;
    margin-top: 0.25rem;
  }
  
  /* Upload de avatar */
  .avatar-upload {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
  }
  
  @media (min-width: 768px) {
    .avatar-upload {
      flex-direction: row;
      align-items: flex-start;
    }
  }
  
  .avatar-preview {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-terciario);
  }
  
  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .avatar-placeholder {
    color: var(--color-sexto);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .upload-controls {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .btn-upload {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--color-primary);
    color: var(--color-secondary);
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-speed);
    border: none;
    text-align: center;
    justify-content: center;
  }
  
  .btn-upload:hover {
    background: var(--color-cuarto);
  }
  
  .file-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .upload-hint {
    font-size: 0.8rem;
    color: var(--color-sexto);
    margin: 0;
  }
  
  /* Acciones del formulario */
  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e2e8f0;
  }
  
  .btn-cancel,
  .btn-save {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-speed);
    border: none;
    font-size: 1rem;
  }
  
  .btn-cancel {
    background: var(--color-terciario);
    color: var(--color-quinto);
    border: 1px solid #e2e8f0;
  }
  
  .btn-cancel:hover {
    background: #e2e8f0;
  }
  
  .btn-save {
    background: var(--color-success);
    color: var(--color-secondary);
  }
  
  .btn-save:hover:not(:disabled) {
    background: #089e45;
  }
  
  .btn-save:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .btn-spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: var(--color-secondary);
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .edit-form {
      padding: 1.5rem;
    }
    
    .form-actions {
      flex-direction: column;
    }
    
    .btn-cancel,
    .btn-save {
      justify-content: center;
    }
  }
  
  @media (max-width: 480px) {
    .edit-header {
      padding: 1.5rem 1rem;
    }
    
    .edit-title {
      font-size: 1.75rem;
    }
    
    .edit-content {
      padding: 0 0.5rem;
    }
    
    .edit-form {
      padding: 1.25rem;
    }
  }
  </style>
<template>
  <main class="profile-container">
    <div class="header-section">
      <h1 class="titulo-principal">Mi Perfil</h1>
      <p class="descripcion-principal">Administra tu información personal y configuración</p>
    </div>

    <div class="profile-content">
      <div class="profile-card">
        <div class="profile-image">
          <img :src="usuario.Foto" alt="Imagen de Perfil" class="profile-avatar">
        </div>

        <div class="profile-info">
          <div class="info-item">
            <span class="info-label">Nombre de Usuario:</span>
            <span class="info-value">{{ usuario.Nombre_Usuario }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Nombre:</span>
            <span class="info-value">{{ usuario.Nombre }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Correo Electrónico:</span>
            <span class="info-value">{{ usuario.Email }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Descripción:</span>
            <p class="info-description">{{ usuario.Descripcion || 'Sin descripción' }}</p>
          </div>

          <div class="profile-actions">
            <router-link to="/edit-profile" class="btn-action btn-edit">
              <span>✏️</span> Editar Perfil
            </router-link>
            <button class="btn-action btn-delete" @click="confirmDelete">
              <span>🗑</span> Eliminar Perfil
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para cambiar avatar -->
    <div v-if="avatarModal" class="modal-overlay">
      <div class="avatar-modal">
        <h3>Cambiar foto de perfil</h3>
        <div class="avatar-options">
          <div class="avatar-option" v-for="option in avatarOptions" :key="option.id" @click="selectAvatar(option)">
            <img :src="option.image" :alt="option.name" class="avatar-preview">
            <span>{{ option.name }}</span>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-action btn-cancel" @click="closeAvatarModal">
            <span>✖</span> Cancelar
          </button>
          <button class="btn-action btn-confirm" @click="saveAvatar">
            <span>✔</span> Guardar
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios"

export default ({
    name: 'ProfileUser',
    data() {
        return {
            usuario: {}
        }
    },
    mounted() {
        axios.get('http://localhost:3000/api/user', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            this.usuario = response.data;
            // Si tiene foto personalizada, agregamos el host si no está completo
            if (this.usuario.Foto) {
                this.usuario.Foto = `http://localhost:3000${this.usuario.Foto}`;
            } else {
                this.usuario.Foto = require('@/assets/users/predeterminada.png');
            }
        })
        .catch(error => {
            console.error("Error al obtener el usuario:", error);
        });
    },
})
</script>

<style scoped>

/* CONTENEDOR GENERAL */
.profile-container {
  margin: 0 auto;
  padding: 2rem;
  font-family: var(--font-family);
  min-height: 100vh;
}

/* ENCABEZADO */
.header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.titulo-principal {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-secondary);
  margin-bottom: 0.5rem;
}

.descripcion-principal {
  font-size: 1.1rem;
  color: #555;
}

/* TARJETA DE PERFIL */
.profile-content {
  display: flex;
  justify-content: center;
}

.profile-card {
  background-color: var(--color-primary);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  display: flex;
  max-width: 800px;
  width: 100%;
  padding: 2rem;
  gap: 2rem;
  border: 1px solid var(--color-accent);
}

/* IMAGEN DE PERFIL */
.profile-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.profile-avatar {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-accent);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* INFORMACIÓN DEL PERFIL */
.profile-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-weight: 600;
  color: var(--color-secondary);
  font-size: 0.95rem;
}

.info-value {
  font-size: 1.1rem;
  color: var(--color-secondary);
  background-color: #f9f9f9;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-terciario);
}

.info-description {
  font-size: 1rem;
  color: #555;
  padding: 0.75rem 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid var(--color-terciario);
  line-height: 1.5;
}

/* ACCIONES */
.profile-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all var(--transition-speed);
  border: none;
}

.btn-edit {
  background-color: var(--color-success);
  color: white;
}

.btn-edit:hover {
  background-color: #009e3f;
}

.btn-delete {
  background-color: var(--color-error);
  color: white;
}

.btn-delete:hover {
  background-color: #d73737;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.avatar-modal {
  background-color: var(--color-primary);
  border-radius: var(--border-radius);
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.avatar-modal h3 {
  margin-bottom: 1.5rem;
  color: var(--color-secondary);
  text-align: center;
}

.avatar-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.avatar-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 1rem;
  border-radius: var(--border-radius);
  transition: background-color var(--transition-speed);
  border: 1px solid transparent;
}

.avatar-option:hover {
  background-color: #f8f9fa;
  border-color: var(--color-accent);
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-terciario);
}

.avatar-option span {
  font-size: 0.9rem;
  color: #666;
}

/* BOTONES MODAL */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-cancel {
  background-color: var(--color-warning);
  color: var(--color-secondary);
}

.btn-cancel:hover {
  background-color: #e69500;
}

.btn-confirm {
  background-color: var(--color-accent);
  color: var(--color-secondary);
}

.btn-confirm:hover {
  background-color: #e6c200;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .profile-card {
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
  }

  .profile-info {
    width: 100%;
  }

  .profile-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn-action {
    justify-content: center;
  }

  .avatar-options {
    grid-template-columns: repeat(2, 1fr);
  }
}

</style>
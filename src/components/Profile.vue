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
.profile-container {
  margin: 0 1rem;
  padding: 0 1.5rem;
  font-family: 'Poppins', sans-serif;
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.titulo-principal {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: #2c3e50;
}

.descripcion-principal {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin-bottom: 1.5rem;
}

.profile-content {
  display: flex;
  justify-content: center;
}

.profile-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  max-width: 800px;
  width: 100%;
  padding: 2rem;
  gap: 2rem;
}

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
  border: 4px solid #3498db;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-edit-avatar {
  background-color: #3498db;
  color: white;
  padding: 0.5rem 1rem;
}

.btn-edit-avatar:hover {
  background-color: #2980b9;
}

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
  color: #2c3e50;
  font-size: 0.95rem;
}

.info-value {
  font-size: 1.1rem;
  color: #34495e;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.info-description {
  font-size: 1rem;
  color: #7f8c8d;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 6px;
  line-height: 1.5;
}

.profile-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-edit {
  background-color: #2ecc71;
  color: white;
}

.btn-edit:hover {
  background-color: #27ae60;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background-color: #c0392b;
}

/* Modal styles */
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
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.avatar-modal h3 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
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
  border-radius: 8px;
  transition: background-color 0.2s;
}

.avatar-option:hover {
  background-color: #f8f9fa;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #eee;
}

.avatar-option span {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-cancel {
  background-color: #95a5a6;
  color: white;
}

.btn-cancel:hover {
  background-color: #7f8c8d;
}

.btn-confirm {
  background-color: #3498db;
  color: white;
}

.btn-confirm:hover {
  background-color: #2980b9;
}

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
  }

  .avatar-options {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
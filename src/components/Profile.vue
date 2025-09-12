<template>
  <main class="profile-main">
    <!-- Header del perfil -->
    <div class="profile-header">
      <div class="header-content">
        <div class="profile-avatar-container">
          <img :src="usuario?.Foto" alt="Foto de perfil" class="profile-avatar" />
          <div class="avatar-overlay">
            <label for="avatar-upload" class="avatar-upload-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </label>
            <input type="file" id="avatar-upload" class="avatar-upload-input" @change="updateAvatar" accept="image/*" />
          </div>
        </div>
        <h1 class="profile-name">{{ usuario?.Nombre_Usuario }}</h1>
        <p class="profile-bio">{{ usuario?.Descripcion || "Sin descripción" }}</p>
        <div class="profile-stats">
          <router-link :to="{ path: `/followers/${usuario?.id}/Seguidores`}" class="stat-item">
            <span class="stat-number">{{ usuario?.seguidores ? usuario.seguidores.length : 0 }}</span>
            <span class="stat-label">Seguidores</span>
          </router-link>
          <router-link :to="{ path: `/followers/${usuario?.id}/Seguidos` }" class="stat-item">
            <span class="stat-number">{{ usuario?.seguidos ? usuario.seguidos.length : 0 }}</span>
            <span class="stat-label">Seguidos</span>
          </router-link>
          <div class="stat-item">
            <span class="stat-number">{{ usuario?.rutinas && usuario.rutinas.length > 0 ? usuario.rutinas.length : 0 }}</span>
            <span class="stat-label">Rutinas</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="profile-content">
      <!-- Información del usuario -->
      <div class="profile-info-card">
        <h2 class="card-title">Información del Perfil</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Nombre completo</span>
            <span class="info-value">{{ usuario?.Nombre }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Email</span>
            <span class="info-value">{{ usuario?.Email }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Puntos totales</span>
            <span class="info-value">{{ usuario?.puntosTotales || 0 }}</span>
          </div>
        </div>
        <div class="card-actions">
          <router-link to="/edit-profile" class="btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Editar Perfil
          </router-link>
          <button class="btn-danger" @click="confirmDelete">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Eliminar Perfil
          </button>
          <button class="btn-secondary" @click="toggleLogrosModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="8" r="7"></circle>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
            </svg>
            Ver Logros
          </button>
        </div>
      </div>

      <!-- Rutinas del usuario -->
      <div class="profile-section">
        <h2 class="section-title">Mis Rutinas</h2>
        <div v-if="usuario?.rutinas && usuario.rutinas.length > 0" class="cards-grid">
          <div v-for="(rutina) in usuario.rutinas" :key="rutina.id" class="card">
            <div class="card-header">
              <h3 class="card-title">{{ rutina.Nombre }}</h3>
              <div class="card-likes">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span>{{ rutina.likes.length }}</span>
              </div>
            </div>
            <p class="card-description">{{ rutina.Descripcion || "Sin descripción" }}</p>
            <div class="card-actions">
              <router-link :to="{ path: `/verEntrenamiento/${rutina.id}` }" class="btn-primary btn-sm">
                Ver Rutina
              </router-link>
            </div>
          </div>
        </div>
        <p v-else class="empty-state">No has creado ninguna rutina.</p>
      </div>

      <!-- Rutinas favoritas -->
      <div class="profile-section">
        <h2 class="section-title">Rutinas Favoritas</h2>
        <div v-if="usuario?.favoritos && usuario.favoritos.length > 0" class="cards-grid">
          <div v-for="(rutina) in usuario.favoritos" :key="rutina.id" class="card">
            <div class="card-header">
              <h3 class="card-title">{{ rutina.rutina.Nombre }}</h3>
              <button class="btn-icon" @click="removeFromFavorites(rutina.rutina.id)" title="Eliminar de favoritos">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <p class="card-description">{{ rutina.rutina.Descripcion || "Sin descripción" }}</p>
            <div class="card-actions">
              <router-link :to="{ path: `/verRutina/${rutina.rutina.id}` }" class="btn-primary btn-sm">
                Ver Rutina
              </router-link>
            </div>
          </div>
        </div>
        <p v-else class="empty-state">No tienes rutinas favoritas.</p>
      </div>
    </div>

    <!-- Modal de logros -->
    <div v-if="showLogrosModal" class="modal-overlay" @click.self="toggleLogrosModal">
      <div class="modal">
        <div class="modal-header">
          <h2>Logros</h2>
          <button class="btn-close" @click="toggleLogrosModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="total-points">
            <span class="points-label">Total de Puntos:</span>
            <span class="points-value">{{ usuario?.puntosTotales || 0 }}</span>
          </div>
          <div class="achievements-grid">
            <div v-for="logro in logros" :key="logro.id" class="achievement-item" :class="{ unlocked: usuario?.usuariosLogros.some(ul => ul.id_logro === logro.id_logro) }">
              <div class="achievement-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="8" r="7"></circle>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
              </div>
              <div class="achievement-details">
                <h3>{{ logro.nombre }}</h3>
                <p>{{ logro.descripcion }}</p>
                <span class="achievement-points">+{{ logro.puntos }} puntos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios"

export default {
  name: 'ProfileUser',
  data() {
    return {
      usuario: {},
      logros: [],
      showLogrosModal: false
    }
  },
  async mounted() {
    try {
      const response = await axios.get(`${process.env.VUE_APP_BASE_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log("Usuario obtenido:", response.data);

      this.usuario = response.data;
      // Si tiene foto personalizada, agregamos el host si no está completo
      if (this.usuario.Foto && !this.usuario.Foto.startsWith('http')) {
        this.usuario.Foto = `${process.env.VUE_APP_BASE_URL}${this.usuario.Foto}`;
      } else if (!this.usuario.Foto) {
        this.usuario.Foto = require('@/assets/users/predeterminada.png');
      }

      await this.fetchLogros();
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
    }
  },
  methods: {
    confirmDelete() {
      if (confirm("¿Estás seguro de que deseas eliminar tu perfil? Esta acción no se puede deshacer.")) {
        this.deleteProfile();
      }
    },
    deleteProfile() {
      axios.delete(`${process.env.VUE_APP_BASE_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(() => {
        alert("Perfil eliminado con éxito.");
        localStorage.removeItem('token');
        this.$router.push('/login');
      })
      .catch(error => {
        console.error("Error al eliminar el perfil:", error);
        alert("Ocurrió un error al eliminar el perfil.");
      });
    },
    removeFromFavorites(favoriteId) {
      axios.delete(`${process.env.VUE_APP_BASE_URL}/api/favoritos/${favoriteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        data: {
          id_rutina: favoriteId,
          id_usuario: this.$store.state.usuario?.id
        }
      })
      .then(response => {
        console.log('Rutina eliminada de favoritos:', response.data);
        // Actualizar el usuario para reflejar los cambios
        this.usuario.favoritos = this.usuario.favoritos.filter(fav => fav.rutina.id !== favoriteId);
      })
      .catch(error => {
        console.error('Error al eliminar rutina de favoritos:', error);
        alert('Error al eliminar rutina de favoritos.');
      });
    },
    fetchLogros() {
      axios.get(`${process.env.VUE_APP_BASE_URL}/api/logros`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        this.logros = response.data;
        // Logros obtenidos
        this.usuario.puntosTotales = Array.isArray(this.usuario.usuariosLogros) 
          ? this.usuario.usuariosLogros.reduce((total, ul) => total + ul.logro.puntos, 0) 
          : 0;
        console.log("Logros obtenidos:", this.logros);
        console.log("Puntos totales del usuario:", this.usuario.puntosTotales);
      })
      .catch(error => {
        console.error("Error al obtener los logros:", error);
      });
    },
    toggleLogrosModal() {
      this.showLogrosModal = !this.showLogrosModal;
    },
    updateAvatar(event) {
      // Lógica para actualizar el avatar
      console.log("Actualizar avatar:", event.target.files[0]);
      // Aquí implementarías la lógica para subir la nueva imagen al servidor
    }
  }
}
</script>

<style scoped>
/* Variables de colores (deben coincidir con las del login) */

.profile-main {
  min-height: 100vh;
  background: var(--color-terciario);
  padding-bottom: 2rem;
}

/* Header del perfil */
.profile-header {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  color: var(--color-secondary);
  padding: 2rem 1rem;
  text-align: center;
  margin-bottom: 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-avatar-container {
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-secondary);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.avatar-overlay {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--color-secondary);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.avatar-upload-label {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-primary);
}

.avatar-upload-input {
  display: none;
}

.profile-name {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--color-secondary);
}

.profile-bio {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  color: var(--color-secondary);
}

.profile-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: var(--color-secondary);
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Contenido principal */
.profile-content {
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}


/* Tarjetas */
.profile-info-card,
.profile-section {
  background: var(--color-secondary);
  border-radius: var(--border-radius);
  flex: 0 0 100%;
  padding: 1.5rem;
  box-sizing: border-box;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-quinto);
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-quinto);
  margin-bottom: 1rem;
}

/* Información del perfil */
.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.9rem;
  color: var(--color-sexto);
  margin-bottom: 0.25rem;
}

.info-value {
  font-size: 1rem;
  color: var(--color-quinto);
  font-weight: 500;
}

/* Botones */
.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all var(--transition-speed);
  border: none;
  font-size: 0.9rem;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-secondary);
}

.btn-primary:hover {
  background: var(--color-cuarto);
  transform: translateY(-2px);
}

.btn-secondary {
  background: var(--color-terciario);
  color: var(--color-quinto);
  border: 1px solid var(--color-terciario);
}

.btn-secondary:hover {
  background: var(--color-terciario);
}

.btn-danger {
  background: var(--color-error);
  color: var(--color-secondary);
}

.btn-danger:hover {
  background: #d73737;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: transparent;
  border: none;
  color: var(--color-sexto);
  cursor: pointer;
  transition: all var(--transition-speed);
}

.btn-icon:hover {
  background: #f1f5f9;
  color: var(--color-error);
}

/* Grid de tarjetas */
.cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1400px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.card {
  background: var(--color-terciario);
  border-radius: var(--border-radius);
  padding: 1.25rem;
  transition: all var(--transition-speed);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-quinto);
  margin-bottom: 0;
}

.card-likes {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-error);
  font-size: 0.9rem;
}

.card-description {
  color: var(--color-sexto);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.empty-state {
  text-align: center;
  color: var(--color-sexto);
  padding: 2rem;
  font-style: italic;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: var(--color-secondary);
  border-radius: var(--border-radius);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  margin: 0;
  color: var(--color-quinto);
}

.btn-close {
  background: transparent;
  border: none;
  color: var(--color-sexto);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  background: var(--color-error);
  color: var(--color-quinto);
}

.modal-body {
  padding: 1.5rem;
}

.total-points {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--color-terciario);
  border-radius: var(--border-radius);
}

.points-label {
  font-weight: 500;
  color: var(--color-quinto);
}

.points-value {
  font-weight: 700;
  color: var(--color-primary);
  font-size: 1.25rem;
}

.achievements-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--border-radius);
  background: var(--color-terciario);
  opacity: 0.6;
  transition: all var(--transition-speed);
}

.achievement-item.unlocked {
  opacity: 1;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-left: 4px solid var(--color-primary);
}

.achievement-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-secondary);
  color: var(--color-primary);
  flex-shrink: 0;
}

.achievement-item.unlocked .achievement-icon {
  background: var(--color-primary);
  color: var(--color-secondary);
}

.achievement-details {
  flex: 1;
}

.achievement-details h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: var(--color-quinto);
}

.achievement-details p {
  margin: 0 0 0.5rem 0;
  font-size: 0.85rem;
  color: var(--color-sexto);
}

.achievement-points {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-primary);
}
@media (min-width: 992px) {
  .profile-section{
    flex: 1;
  }
}
</style>
<template>
  <main class="user-profile-main">
    <!-- Header del perfil -->
    <div class="profile-header">
      <div class="header-content">
        <div class="profile-avatar-container">
          <img :src="user?.Foto" alt="Foto de perfil" class="profile-avatar" />
        </div>
        
        <div class="profile-info">
          <h1 class="profile-name">{{ user?.Nombre_Usuario }}</h1>
          <p class="profile-email">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            {{ user?.Email }}
          </p>
          
          <p class="profile-bio" v-if="user?.Descripcion">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            {{ user.Descripcion }}
          </p>
          
          <p class="profile-bio" v-else>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Este usuario no tiene descripción
          </p>
        </div>
        
        <div class="profile-stats">
          <router-link :to="{ path: `/followers/${user?.id}/Seguidores` }" class="stat-item">
            <span class="stat-number">{{ user?.seguidores ? user.seguidores.length : 0 }}</span>
            <span class="stat-label">Seguidores</span>
          </router-link>
          
          <router-link :to="{ path: `/followers/${user?.id}/Seguidos` }" class="stat-item">
            <span class="stat-number">{{ user?.seguidos ? user.seguidos.length : 0 }}</span>
            <span class="stat-label">Seguidos</span>
          </router-link>
          
          <div class="stat-item">
            <span class="stat-number">{{ user?.rutinas && user.rutinas.length > 0 ? user.rutinas.length : 0 }}</span>
            <span class="stat-label">Rutinas</span>
          </div>
        </div>
        
        <div class="profile-actions" v-if="this.$store.state.usuario && user">
          <button 
            v-if="user?.seguidores?.some(seguidor => seguidor.seguidor_id == $store.state.usuario)" 
            class="btn-following"
            @click="dejarDeSeguir(user.id)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            Siguiendo
          </button>
          
          <button 
            v-else 
            class="btn-follow"
            @click="seguir(user.id)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            Seguir
          </button>
        </div>
      </div>
    </div>

    <!-- Rutinas del usuario -->
    <div class="profile-content">
      <section class="routines-section">
        <div class="section-header">
          <h2>Rutinas de {{ user?.Nombre_Usuario }}</h2>
          <span class="routines-count">{{ user?.rutinas && user.rutinas.length > 0 ? user.rutinas.length : 0 }} rutinas</span>
        </div>
        
        <div v-if="user?.rutinas && user.rutinas.length > 0" class="routines-grid">
          <div v-for="rutina in user.rutinas" :key="rutina.id" class="routine-card">
            <div class="routine-header">
              <h3>{{ rutina.Nombre }}</h3>
              <div class="routine-likes">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span>{{ rutina.likes.length }}</span>
              </div>
            </div>
            
            <p class="routine-description">
              {{ rutina.Descripcion || "Esta rutina no tiene descripción." }}
            </p>
            
            <div class="routine-actions">
              <router-link :to="{ path: `/verRutina/${rutina.id}` }" class="btn-view-routine">
                Ver Rutina
              </router-link>
            </div>
          </div>
        </div>
        
        <div v-else class="empty-routines">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <p>Este usuario no tiene rutinas disponibles.</p>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import axios from "axios";

export default {
  name: "OtherUser",
  data() {
    return {
      user: null,
    };
  },
  created() {
    this.fetchUser();
  },
  methods: {
    fetchUser() {
      const userId = this.$route.params.id;
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/user/${userId}`)
        .then((response) => {
          this.user = response.data;
          console.log("Usuario obtenido:", this.user);
          
          if (this.user.Foto) {
            this.user.Foto = `${process.env.VUE_APP_BASE_URL}${this.user.Foto}`;
          } else {
            this.user.Foto = require("@/assets/users/predeterminada.png");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    },
    seguir(id){
      axios
        .post(`${process.env.VUE_APP_BASE_URL}/api/seguidores`, {
          seguido_id: id,
          seguidor_id: this.$store.state.usuario.id,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          console.log("Seguido correctamente:", response.data);
          this.fetchUser(); // Actualizar el usuario para reflejar el cambio
        })
        .catch((error) => {
          console.error("Error al seguir al usuario:", error);
        });
    },
    dejarDeSeguir(id){
      axios
        .delete(`${process.env.VUE_APP_BASE_URL}/api/seguidores/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          data: {
            seguido_id: id,
            seguidor_id: this.$store.state.usuario.id,
          },
        })
        .then((response) => {
          console.log("Dejado de seguir correctamente:", response.data);
          this.fetchUser(); // Actualizar el usuario para reflejar el cambio
        })
        .catch((error) => {
          console.error("Error al dejar de seguir al usuario:", error);
        });
      }
  },
};
</script>

<style scoped>
/* Variables de colores */
:root {
  --color-primary: #4a6cf7;
  --color-secondary: #ffffff;
  --color-terciario: #f8f9fa;
  --color-cuarto: #3a57e8;
  --color-quinto: #2d3748;
  --color-sexto: #718096;
  --color-success: #0abf53;
  --color-error: #e24d4c;
  --color-accent: #6c5ce7;
  --border-radius: 12px;
  --transition-speed: 0.3s;
  --shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  --shadow-hover: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.user-profile-main {
  min-height: 100vh;
  background: var(--color-terciario);
  padding: 0;
  padding-bottom: 2rem;
}

/* Header del perfil */
.profile-header {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  color: var(--color-secondary);
  padding: 2rem 2.5rem;
  margin-bottom: 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  align-items: center;
}

@media (max-width: 768px) {
  .header-content {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }
}

.profile-avatar-container {
  position: relative;
}

.profile-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-secondary);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.profile-name {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-secondary);
}

.profile-email,
.profile-bio {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  opacity: 0.9;
  font-size: 1rem;
  color: var(--color-secondary);
}

.profile-stats {
  display: flex;
  gap: 2rem;
}

@media (max-width: 768px) {
  .profile-stats {
    justify-content: center;
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
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

.profile-actions {
  display: flex;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .profile-actions {
    justify-content: center;
  }
}

.btn-follow,
.btn-following {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-speed);
  border: none;
}

.btn-follow {
  background: var(--color-success);
  color: var(--color-secondary);
}

.btn-follow:hover {
  background: #089e45;
  transform: translateY(-2px);
}

.btn-following {
  background: var(--color-cuarto);
  color: var(--color-secondary);
}

.btn-following:hover {
  background: #2c4cd6;
  transform: translateY(-2px);
}

/* Contenido principal */
.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Sección de rutinas */
.routines-section {
  background: var(--color-secondary);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-quinto);
  margin: 0;
}

.routines-count {
  font-size: 0.9rem;
  color: var(--color-sexto);
  font-weight: 500;
}

/* Grid de rutinas */
.routines-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .routines-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .routines-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Tarjeta de rutina */
.routine-card {
  border-radius: var(--border-radius);
  padding: 1.25rem;
  background: var(--color-terciario);
  transition: all var(--transition-speed);
}

.routine-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.routine-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.routine-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-quinto);
  flex: 1;
}

.routine-likes {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #e53e3e;
  font-size: 0.9rem;
}

.routine-description {
  color: var(--color-sexto);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.routine-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-view-routine {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: var(--color-secondary);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all var(--transition-speed);
}

.btn-view-routine:hover {
  background: var(--color-cuarto);
  transform: translateY(-2px);
}

/* Estado vacío */
.empty-routines {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: var(--color-sexto);
}

.empty-routines svg {
  margin-bottom: 1rem;
  color: #cbd5e0;
}

.empty-routines p {
  margin: 0;
  font-size: 1rem;
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.routine-card {
  animation: fadeIn 0.4s ease forwards;
}

.routine-card:nth-child(1) { animation-delay: 0.1s; }
.routine-card:nth-child(2) { animation-delay: 0.2s; }
.routine-card:nth-child(3) { animation-delay: 0.3s; }
.routine-card:nth-child(4) { animation-delay: 0.4s; }
.routine-card:nth-child(5) { animation-delay: 0.5s; }
.routine-card:nth-child(6) { animation-delay: 0.6s; }
</style>
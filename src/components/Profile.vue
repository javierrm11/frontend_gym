<template>
  <main class="profile-container">
    <div class="profile-header">
      <div class="profile-foto">
        <img :src="usuario?.Foto" alt="Foto de perfil" class="profile-avatar" />
      </div>
      <div class="profile-info">
        <h1 class="profile-name">{{ usuario?.Nombre_Usuario }}</h1>
        <p class="info-value">{{ usuario?.Nombre }}</p>
        <p class="profile-email">{{ usuario?.Email }}</p>
        <p class="info-description">{{ usuario?.Descripcion || "Sin descripción" }}</p>
      </div>
      <div class="profile_seguidores_siguiendo">
        <router-link :to="{ path: `/followers/${usuario?.id}/Seguidores`}" class="profile__followers">
          <h3>Seguidores</h3>
          <p>{{ usuario?.seguidores ? usuario.seguidores.length : 0 }}</p>
        </router-link>
        <router-link :to="{ path: `/followers/${usuario?.id}/Seguidos` }" class="profile__following">
          <h3>Seguidos</h3>
          <p>{{ usuario?.seguidos ? usuario.seguidos.length : 0 }}</p>
        </router-link>
        <div class="profile-actions">
          <router-link to="/edit-profile" class="btn-action btn-edit">
            <span>✏️</span> Editar Perfil
          </router-link>
          <a class="btn-action btn-delete" @click="confirmDelete">
            <span>🗑</span> Eliminar Perfil
          </a>
        </div>
      </div>
    </div>
    <div class="profile-rutinas">
      <div class="profile-rutinas-propias">
        <h2>Mis Rutinas: {{ usuario?.rutinas && usuario.rutinas.length > 0 ? usuario.rutinas.length : "0" }}</h2>
        <div v-if="usuario?.rutinas && usuario.rutinas.length > 0" class="profile-own-routines">
            <div v-for="(rutina) in usuario.rutinas" :key="rutina.id" class="routine-item">
              <h3>{{ rutina.Nombre }}</h3>
              <p>{{ rutina.Descripcion || "Sin descripción" }}</p>
              <router-link :to="{ path: `/verEntrenamiento/${rutina.id}` }" class="btn-view-routine">
                Ver Rutina
              </router-link>
            </div>
        </div>
          <p v-else>No has creado ninguna rutina.</p>
      </div>

      <div class="profile-rutinas-favoritas">
        <h2>Rutinas Favoritas: {{ usuario?.favoritos && usuario.favoritos.length > 0 ? usuario.favoritos.length : "0" }}</h2>
        <div v-if="usuario?.favoritos && usuario.favoritos.length > 0" class="profile-favorites">
            <div v-for="(rutina) in usuario.favoritos" :key="rutina.id" class="favorite-item">
              <h3>{{ rutina.rutina.Nombre }}</h3>
              <p>{{ rutina.rutina.Descripcion || "Sin descripción" }}</p>
              <div class="favorite-actions">
                <router-link :to="{ path: `/verRutina/${rutina.rutina.id}` }" class="btn-view-routine-out">
                  Ver Rutina
                </router-link>
                <a class="btn-remove-favorite" @click="removeFromFavorites(rutina.rutina.id)">
                  Eliminar
                </a>
              </div>
            </div>
        </div>
          <p v-else>No tienes rutinas favoritas.</p>
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
        axios.get(`${process.env.VUE_APP_BASE_URL}/api/user`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
          console.log("Usuario obtenido:", response.data);
          
            this.usuario = response.data;
            // Si tiene foto personalizada, agregamos el host si no está completo
            if (this.usuario.Foto) {
                this.usuario.Foto = `${process.env.VUE_APP_BASE_URL}${this.usuario.Foto}`;
            } else {
                this.usuario.Foto = require('@/assets/users/predeterminada.png');
            }
        })
        .catch(error => {
            console.error("Error al obtener el usuario:", error);
        });
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
        }
    }
})
</script>

<style scoped>
/* CONTENEDOR GENERAL */
.profile-container {
  font-family: "Poppins", sans-serif;
  padding: 2rem;
}

/* ENCABEZADO */
.profile-header {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}
.profile-foto{
  flex: 1;
}
.profile-avatar {
  height: 220px;
  width: 220px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 4px solid var(--color-accent);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-name {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(to right, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}


.profile_seguidores_siguiendo{
  flex: 2;
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  gap: 1rem;
}
.profile__followers, .profile__following {
  flex: 1;
  text-decoration: none;
}

/* INFORMACIÓN DEL PERFIL */
.profile-info {
  flex: 2;
}

.info-item {
  margin-bottom: 1rem;
}

.info-label {
  font-weight: 600;
  color: var(--color-primary);
  font-size: 1rem;
}

.info-value, .info-description, .profile-email {
  font-size: 1.1rem;
  color: var(--color-quinto);
  padding: 0.6rem 1rem;
  border-radius: 8px;
  margin: 0;
}

/* ACCIONES */
.profile-actions {
  flex: 0 0 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
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
.profile-rutinas{
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}
.profile-rutinas-propias, .profile-rutinas-favoritas{
  flex: 1 1 48%;
}
.profile-rutinas-propias h2{
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: var(--color-primary);
}
.profile-own-routines{
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.routine-item{
  background-color: var(--color-secondary);
  padding: 1rem;
  border-radius: 8px;
  flex: 1 1 43%;
}
.btn-view-routine{
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-accent);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color var(--transition-speed);
}
.profile-rutinas-favoritas h2{
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: var(--color-primary);
}
.profile-favorites{
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.favorite-item{
  background-color: var(--color-secondary);
  padding: 1rem;
  border-radius: 8px;
  flex: 1 1 43%;
  position: relative;
}
.favorite-actions{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}
.btn-view-routine-out{
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: var(--color-accent);
  color: var(--color-secondary);
  border-radius: 4px;
  text-decoration: none;
  transition: background-color var(--transition-speed);
}
.btn-remove-favorite{
  padding: 0.5rem 1rem;
  background-color: var(--color-error);
  color: var(--color-secondary);
  position: absolute;
  top: 0px;
  right: 0px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color var(--transition-speed);
}
@media (max-width: 1052px) {
  .profile_seguidores_siguiendo{
    flex: 2 1 100%;
    gap: 3rem;
  }
  .profile-header{
    text-align-last: center;
  }
  .profile-foto {
    flex: 2;
  }
  .profile-info{
    text-align-last: auto;
  }
  .profile-actions {
    justify-content: center;
  }
  
}
</style>
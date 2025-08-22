<template>
  <main class="profile-container">
    <div class="profile-header">
      <img :src="usuario?.Foto" alt="Foto de perfil" class="profile-avatar" />
      <h1 class="profile-name">{{ usuario?.Nombre_Usuario }}</h1>
      <p class="profile-email">{{ usuario?.Email }}</p>
      <div class="profile_seguidores_siguiendo">
      <router-link :to="{ path: `/followers/${usuario?.id}/Seguidores`}" class="profile__followers">
        <h3>Seguidores</h3>
        <p>{{ usuario?.seguidores ? usuario.seguidores.length : 0 }}</p>
      </router-link>
      <router-link :to="{ path: `/followers/${usuario?.id}/Seguidos` }" class="profile__following">
        <h3>Seguidos</h3>
        <p>{{ usuario?.seguidos ? usuario.seguidos.length : 0 }}</p>
      </router-link>
    </div>
      <p class="info-value">{{ usuario?.Nombre }}</p>
      <p class="info-description">{{ usuario?.Descripcion || "Sin descripción" }}</p>
    </div>


    <div class="profile-actions">
      <router-link to="/edit-profile" class="btn-action btn-edit">
        <span>✏️</span> Editar Perfil
      </router-link>
      <button class="btn-action btn-delete" @click="confirmDelete">
        <span>🗑</span> Eliminar Perfil
      </button>
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
        }
    }
})
</script>

<style scoped>
/* CONTENEDOR GENERAL */
.profile-container {
  font-family: "Poppins", sans-serif;
  padding: 2rem;
  text-align: center;
}

/* ENCABEZADO */
.profile-header {
  margin-bottom: 2rem;
}

.profile-avatar {
  width: 120px;
  height: 120px;
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

.profile-email {
  font-size: 1rem;
  color: var(--color-quinto);
  margin-bottom: 1.5rem;
}

.profile_seguidores_siguiendo{
  display: flex;
  flex-wrap: wrap;
  max-width: 1000px;
  margin: 0 auto;
  gap: 1rem;
}
.profile__followers, .profile__following {
  flex: 1 1 40%;
  text-decoration: none;
}

/* INFORMACIÓN DEL PERFIL */
.profile-info {
  margin-bottom: 2rem;
  text-align: left;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.info-item {
  margin-bottom: 1rem;
}

.info-label {
  font-weight: 600;
  color: var(--color-primary);
  font-size: 1rem;
}

.info-value {
  font-size: 1.1rem;
  color: var(--color-quinto);
  padding: 0.6rem 1rem;
  border-radius: 8px;
}

.info-description {
  font-size: 1rem;
  color: var(--color-quinto);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  line-height: 1.5;
}

/* ACCIONES */
.profile-actions {
  display: flex;
  justify-content: center;
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

/* RESPONSIVE */
@media (max-width: 768px) {
  .profile-followers {
    flex-direction: column;
    gap: 1rem;
  }

  .profile-actions {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
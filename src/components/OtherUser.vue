<template>
  <main class="profile-container">
    <div class="profile-header">
      <div class="profile-foto">
        <img :src="user?.Foto" alt="Foto de perfil" class="profile-avatar" />
      </div>
      <div class="profile-info">
        <h1 class="profile-name">{{ user?.Nombre_Usuario }}</h1>
        <p class="profile-email">{{ user?.Email }}</p>
        <p class="info-description">{{ user?.Descripcion || "Sin descripción" }}</p>
      </div>
      <div class="profile_seguidores_siguiendo">
        <router-link :to="{ path: `/followers/${user?.id}/Seguidores` }" class="profile__followers">
          <h3>Seguidores</h3>
          <p>{{ user?.seguidores ? user.seguidores.length : 0 }}</p>
        </router-link>
        <router-link :to="{ path: `/followers/${user?.id}/Seguidos` }" class="profile__following">
          <h3>Seguidos</h3>
          <p>{{ user?.seguidos ? user.seguidos.length : 0 }}</p>
        </router-link>
        <div class="profile-actions" v-if="this.$store.state.usuario">
          <button v-if="user?.seguidores?.some(seguidor => seguidor.seguidor_id == $store.state.usuario.id)" class="btn-action btn-siguiendo">
            Siguiendo
          </button>
          <button v-else @click="seguir(user?.id)" class="btn-action btn-seguir">
            Seguir
          </button>
          <button v-if="user?.seguidores?.some(seguidor => seguidor.seguidor_id == $store.state.usuario.id)" @click="dejarDeSeguir(user?.id)" class="btn-action btn-dejar">
            Dejar de seguir
          </button>
        </div>
      </div>
    </div>

    <div class="profile-rutinas">
      <div class="profile-rutinas-propias">
        <h2>Rutinas: {{ user?.rutinas && user.rutinas.length > 0 ? user.rutinas.length : "0" }}</h2>
        <div v-if="user?.rutinas && user.rutinas.length > 0" class="profile-own-routines">
          <div v-for="rutina in user.rutinas" :key="rutina.id" class="routine-item">
            <h3>{{ rutina.Nombre }}</h3>
            <p>{{ rutina.Descripcion || "Sin descripción" }}</p>
            <router-link :to="{ path: `/verEntrenamiento/${rutina.id}` }" class="btn-view-routine">
              Ver Rutina
            </router-link>
            <p class="profile-meGustas">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="red"
                class="bi bi-heart"
                viewBox="0 0 16 16"
              >
                <path
                  d="M8 2.748-.717-1.737C5.6-.281 8 3.993 8 3.993s2.4-4.274 8.717-3.74C15.6-.281 8 2.748 8 2.748z"
                />
                <path
                  d="M8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"
                  fill-rule="evenodd"
                />
              </svg>
              {{ rutina.likes.length }}
            </p>
          </div>
        </div>
        <p v-else>Este usuario no tiene rutinas disponibles.</p>
      </div>
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
/* CONTENEDOR GENERAL */
.profile-container {
  font-family: "Poppins", sans-serif;
  padding: 2rem;
  position: relative;
  overflow: hidden;
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
  align-content: flex-start;
  gap: 1rem;
}
.profile__followers, .profile__following {
  flex: 1;
  text-decoration: none;
}
.profile__followers h3,.profile__following h3{
  color: var(--color-cuarto);
  margin-bottom: 0.3rem;
}
.profile__followers p, .profile__following p{
  color: var(--color-quinto);
  margin-left: 4px;
}

/* INFORMACIÓN DEL PERFIL */
.profile-info {
  flex: 2;
}

.info-description, .profile-email {
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
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all var(--transition-speed);
  border: none;
}

.btn-seguir {
  background-color: var(--color-success);
  color: white;
}

.btn-seguir:hover {
  background-color: #009e3f;
}

.btn-siguiendo {
  background-color: var(--color-cuarto);
  color: white;
}

.btn-dejar {
  background-color: var(--color-error);
  color: white;
}

.btn-dejar:hover {
  background-color: #d73737;
}

.profile-rutinas{
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}
.profile-rutinas-propias{
  flex: 1 1 100%;
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
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.routine-item h3{
  margin-bottom: 0.5rem;
  color: var(--color-quinto);
}
.routine-item p{
  color: var(--color-sexto);
}
.btn-view-routine{
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-cuarto);
  color: var(--color-secondary);
  border-radius: 4px;
  text-decoration: none;
  transition: background-color var(--transition-speed);
}
.profile-meGustas{
  position: absolute;
  top: 0;
  right: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.5rem;
  color: var(--color-quinto);
  font-weight: bold;
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
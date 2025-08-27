<template>
  <main class="other-user">
    <div class="other-user__header">
      <img :src="user?.Foto" alt="Foto de usuario" class="other-user__avatar" />
      <h1 class="other-user__name">{{ user?.Nombre_Usuario }}</h1>
      <p class="other-user__email">{{ user?.Email }}</p>
      <div class="other-user_seguidores_siguiendo">
        <router-link :to="{ path: `/followers/${user?.id}/Seguidores` }" class="other-user__followers">
          <h3>Seguidores</h3>
          <p>{{ user?.seguidores ? user.seguidores.length : 0 }}</p>
        </router-link>
        <router-link :to="{ path: `/followers/${user?.id}/Seguidos` }" class="other-user__following">
          <h3>Seguidos</h3>
          <p>{{ user?.seguidos ? user.seguidos.length : 0 }}</p>
        </router-link>
        <div class="btn-follow" v-if="this.$store.state.usuario">
          <button v-if="user?.seguidores?.some(seguidor => seguidor.seguidor_id == $store.state.usuario)" class="btn-siguiendo">Siguiendo</button>
          <button v-else @click="seguir(user?.id)" class="btn-seguir">Seguir</button>
          <button v-if="user?.seguidores?.some(seguidor => seguidor.seguidor_id == $store.state.usuario)" @click="dejarDeSeguir(user?.id)" class="btn-dejar">Dejar de seguir</button>
        </div>
      </div>
    </div>

    <div v-if="user?.rutinas?.length > 0" class="other-user__routines">
      <h2>Rutinas</h2>
      <div v-for="rutina in user.rutinas" :key="rutina.id" class="routine-card">
        <div class="routine-card__header">
          <h3 class="routine-card__name">{{ rutina.Nombre }}</h3>
          <p class="routine-card__description">{{ rutina.Descripcion }}</p>
        </div>

        <div class="routine-card__content">
          <details class="routine-card__details">
            <summary class="routine-card__summary">
              <span>Ver ejercicios</span>
              <svg class="routine-card__icon" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </summary>
            <div
              v-if="rutina.rutinaEjercicio?.length"
              class="routine-card__exercises"
            >
              <div
                v-for="ejercicio in rutina.rutinaEjercicio"
                :key="ejercicio.id"
                class="exercise-item"
              >
                <div class="exercise-item__info">
                  <h4 class="exercise-item__name">
                    {{ ejercicio.ejercicio.Nombre }}
                  </h4>
                  <img
                    :src="ejercicio.ejercicio.Foto"
                    alt="Foto de ejercicio"
                    class="exercise-item__avatar"
                  />
                  <p class="exercise-item__series">
                    <span class="exercise-item__badge"
                      >{{ ejercicio.Num_Series }} series</span
                    >
                  </p>
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>

    <div v-else>
      <p class="other-user__no-routines">
        Este usuario no tiene rutinas disponibles.
      </p>
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
    verRutina(id) {
      this.$router.push({ name: "VerRutina", params: { id } });
    },
    seguir(id){
      const userId = this.$route.params.id;
      axios
        .post(`${process.env.VUE_APP_BASE_URL}/api/seguidores`, {
          seguido_id: id,
          seguidor_id: userId,
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
      const userId = this.$route.params.id;
      axios
        .delete(`${process.env.VUE_APP_BASE_URL}/api/seguidores/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          data: {
            seguido_id: id,
            seguidor_id: userId,
          },
        })
        .then((response) => {
          console.log("Seguido correctamente:", response.data);
          this.fetchUser(); // Actualizar el usuario para reflejar el cambio
        })
        .catch((error) => {
          console.error("Error al seguir al usuario:", error);
        });
      }
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap");

.other-user {
  font-family: "Poppins", sans-serif;
}

.other-user__header {
  text-align: center;
  margin-bottom: 3rem;
}

.other-user__avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}

.other-user__name {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  background: linear-gradient(to right, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.other-user__email {
  font-size: 1rem;
  color: var(--color-quinto);
  margin-bottom: 1.5rem;
}
.other-user_seguidores_siguiendo{
  display: flex;
  flex-wrap: wrap;
  max-width: 1000px;
  margin: 0 auto;
  gap: 1rem;
}
.other-user__followers, .other-user__following {
  flex: 1 1 40%;
  text-decoration: none;
}
.btn-follow{
  flex: 0 0 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 0 1rem;
  box-sizing: border-box;
}
.btn-follow button {
  flex: 1;
  max-width: 200px;
  font-size: 1rem;
}
.btn-siguiendo, .btn-seguir {
  background: transparent;
  color: var(--color-cuarto);
  border: 1px solid var(--color-cuarto);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 600;
}
.btn-siguiendo{
  background: var(--color-cuarto);
  color: var(--color-secondary);
  border: none;
}
.btn-seguir:hover {
  background: var(--color-cuarto);
  color: var(--color-secondary);
}

.btn-dejar {
  background: transparent;
  color: var(--color-error);
  border: 1px solid var(--color-error);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 600;
}
.btn-dejar:hover {
  background: var(--color-error);
  color: var(--color-secondary);
}

.other-user__routines {
  display: flex;
  padding: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  align-items: baseline;
  background: var(--color-primary);
}
.other-user__routines h2 {
  flex: 0 0 100%;
  font-size: 1.8rem;
  text-align: center;
  color: var(--color-secondary);
  
}

.routine-card {
  flex: 0 0 100%;
  background-color: var(--color-secondary);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform var(--transition-speed),
    box-shadow var(--transition-speed);
  display: flex;
  flex-direction: column;
}

.routine-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.routine-card__header {
  padding: 1.5rem;
}

.routine-card__name {
  font-size: 1.4rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.routine-card__description {
  font-size: 0.95rem;
  color: var(--color-quinto);
  line-height: 1.5;
}

.routine-card__content {
  padding: 0 1.5rem;
}

.routine-card__details {
  margin: 1rem 0;
}

.routine-card__summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  cursor: pointer;
  color: var(--color-accent);
  font-weight: 500;
  list-style: none;
}

.routine-card__summary::-webkit-details-marker {
  display: none;
}

.routine-card__icon {
  width: 1.25rem;
  height: 1.25rem;
  fill: var(--color-accent);
  transition: transform var(--transition-speed);
}

.routine-card__details[open] .routine-card__icon {
  transform: rotate(180deg);
}

.routine-card__exercises {
  margin-top: 0.5rem;
  padding: 0.5rem 0;
}

.exercise-item {
  padding: 0.75rem 0;
}

.exercise-item:last-child {
  border-bottom: none;
}

.exercise-item__info h4 {
  font-size: 1rem;
  color: var(--color-primary);
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.exercise-item__avatar {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  margin-top: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.exercise-item__badge {
  display: inline-block;
  background-color: var(--color-cuarto);
  color: var(--color-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.other-user__no-routines {
  text-align: center;
  font-size: 1.2rem;
  color: var(--color-secondary);
  margin-top: 2rem;
}

/*tablet*/
@media (min-width: 768px) {
  .routine-card {
    flex: 1 1 calc(50% - 1rem);
  }
}
/*desktop*/
@media (min-width: 769px) {
  .routine-card {
    flex: 1 1 calc(33.333% - 1rem);
  }
}
</style>

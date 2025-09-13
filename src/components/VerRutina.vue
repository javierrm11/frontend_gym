<template>
  <main class="rutina-view-main">
    <!-- Header de la rutina -->
    <div class="rutina-header">
      <div class="header-content">
        <h1 class="rutina-title">{{ rutina?.Nombre || "Cargando rutina..." }}</h1>
        <p class="rutina-description">
          {{ rutina?.Descripcion || "Por favor espera mientras cargamos los detalles de la rutina." }}
        </p>
        <div class="rutina-actions">
          
          <div class="action-buttons" v-if="this.$store.state.usuario">
            <button class="btn-copy" @click="copiarRutina(rutina)">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copiar Rutina
            </button>
            
            <button
              class="btn-favorite"
              @click="agregarAFavoritos(rutina)"
              v-if="!favoritos.some((favorito) => favorito.id_rutina == rutina.id)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              Agregar a Favoritos
            </button>

            <button
              class="btn-unfavorite"
              @click="eliminarAFavoritos(rutina.id)"
              v-else
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              Eliminar de Favoritos
            </button>
          </div>
          <button
            class="btn-like"
            :class="{ 'btn-liked': meGustas.some((like) => like.usuario_id == this.$store.state.usuario) }"
            @click="
              meGustas.some((like) => like.usuario_id == this.$store.state.usuario)
                ? eliminarMeGusta(rutina.id)
                : this.$store.state.usuario ? darMeGusta(rutina.id) : null
            "
            :disabled="!this.$store.state.usuario"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>{{ meGustas.length }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="rutina-content">
      <!-- Sección de ejercicios -->
      <section class="exercises-section">
        <div class="section-header">
          <h2>Ejercicios de la rutina</h2>
          <span class="exercises-count">{{ ejercicios?.length || 0 }} ejercicios</span>
        </div>
        
        <div v-if="ejercicios?.length" class="exercises-grid">
          <div
            v-for="ejercicio in ejercicios"
            :key="ejercicio.id"
            class="exercise-card"
            :class="[
              `border-${ejercicio.Categoria?.toLowerCase() || 'border-default'}`,
              `filter-${ejercicio.Categoria?.toLowerCase() || 'filter-default'}`
            ]"
          >
            <div>
              <div class="exercise-header">
                <h3 :class="`color-${ejercicio.Categoria?.toLowerCase() || 'color-default'}`">
                  {{ ejercicio.Nombre }}
                </h3>
                <span class="exercise-category" :class="`${ejercicio.Categoria?.toLowerCase() || 'default'}`">
                  {{ ejercicio.Categoria }}
                </span>
              </div>
              
              <p class="exercise-description">
                {{ ejercicio.Descripcion || "Este ejercicio no tiene descripción." }}
              </p>
            </div>
            
            <div class="exercise-footer">
              <span class="series-badge" :class="`${ejercicio.Categoria?.toLowerCase() || 'default'}`">
                {{ ejercicio.Num_Series }} series
              </span>
            </div>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>Cargando ejercicios o no hay ejercicios disponibles para esta rutina.</p>
        </div>
      </section>

      <!-- Sección de comentarios -->
      <section class="comments-section">
        <div class="section-header">
          <h2>Comentarios</h2>
          <button 
            class="btn-add-comment" 
            @click="mostrarInput = !mostrarInput" 
            v-if="this.$store.state.usuario && !mostrarInput"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Añadir
          </button>
        </div>

        <!-- Formulario para comentario -->
        <div v-if="mostrarInput" class="comment-form">
          <div class="form-group">
            <textarea
              v-model="nuevoComentario"
              placeholder="Escribe tu comentario..."
              rows="3"
            ></textarea>
          </div>
          <div class="form-actions">
            <button class="btn-cancel" @click="mostrarInput = false">
              Cancelar
            </button>
            <button @click="agregarComentario(rutina.id)" class="btn-submit">
              Enviar comentario
            </button>
          </div>
        </div>

        <!-- Lista de comentarios -->
        <div v-if="!rutina?.comentarios || rutina.comentarios.length === 0" class="empty-comments">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <p>No hay comentarios para esta rutina.</p>
        </div>
        
        <div v-else class="comments-list">
          <comentario-item
            v-for="comentario in rutina.comentarios"
            :key="comentario.id"
            :comentario="comentario"
            :rutinaId="rutina.id"
            :nivel="0"
            @actualizar-rutina="obtenerRutina"
          />
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import ComentarioItem from '@/components/ComentarioItem.vue';

export default {
  name: "VerRutina",
  components: {
    ComentarioItem
  },
  mounted() {
    this.obtenerRutina();
    this.obtenerMeGustas();
  },
  data() {
    return {
      rutina: null,
      ejercicios: [],
      favoritos: [],
      meGustas: [],
      mostrarInput: false,
      nuevoComentario: "",
    };
  },
  methods: {
    obtenerRutina() {
      const id = this.$route.params.id;
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/rutinas/${id}`)
        .then((response) => {
          console.log("Rutina obtenida:", response.data[0]);

          this.rutina = response.data[0];
          this.ejercicios = response.data[0].ejercicios;
          this.favoritos = response.data[0].favoritos || [];
        })
        .catch((error) => {
          console.error("Error al obtener la rutina:", error);
        });
    },
    copiarRutina(rutina) {
      axios
        .post(
          `${process.env.VUE_APP_BASE_URL}/api/rutinas`,
          {
            Nombre: rutina.Nombre,
            Descripcion: rutina.Descripcion,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          this.rutina.ejercicios.forEach((ejercicio) => {
            axios
              .post(
                `${process.env.VUE_APP_BASE_URL}/api/ejercicio`,
                {
                  Nombre_Rutina: response.data.Nombre,
                  Nombre_Ejercicio: ejercicio.Nombre,
                  Descripcion: ejercicio.Descripcion,
                  Num_Series: ejercicio.Num_Series,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              )
              .then((response) => {
                console.log("Ejercicio copiado:", response.data);
              })
              .catch((error) => {
                console.log("Error copiando ejercicio:", error);
              });
          });
        })
        .catch((error) => {
          console.log("Error copiando rutina:", error);
        });
    },
    agregarAFavoritos(rutina) {
      axios
        .post(
          `${process.env.VUE_APP_BASE_URL}/api/favoritos`,
          {
            id_rutina: rutina.id,
            id_usuario: this.$store.state.usuario.id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          console.log("Rutina agregada a favoritos:", response.data);
          this.favoritos.push(response.data);
        })
        .catch((error) => {
          console.error("Error al agregar rutina a favoritos:", error);
          alert("Error al agregar rutina a favoritos.");
        });
    },
    eliminarAFavoritos(favoriteId) {
      axios
        .delete(`${process.env.VUE_APP_BASE_URL}/api/favoritos/${favoriteId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          data: {
            id_rutina: favoriteId,
            id_usuario: this.$store.state.usuario?.id,
          },
        })
        .then((response) => {
          console.log("Rutina eliminada de favoritos:", response.data);
          this.favoritos = this.favoritos.filter(
            (fav) => fav.id_rutina !== favoriteId
          );
        })
        .catch((error) => {
          console.error("Error al eliminar rutina de favoritos:", error);
          alert("Error al eliminar rutina de favoritos.");
        });
    },
    agregarComentario(rutinaId) {
      if (!this.nuevoComentario.trim()) return;
      axios
        .post(
          `${process.env.VUE_APP_BASE_URL}/api/comentarios`,
          {
            id_rutina: rutinaId,
            id_usuario: this.$store.state.usuario.id,
            contenido: this.nuevoComentario.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          console.log("Comentario agregado:", response.data);
          this.nuevoComentario = "";
          this.mostrarInput = false;
          this.obtenerRutina();
        })
        .catch((error) => {
          console.error("Error al agregar comentario:", error);
        });
    },
    obtenerMeGustas() {
      const rutinaId = this.$route.params.id;
      axios
      .get(`${process.env.VUE_APP_BASE_URL}/api/like/${rutinaId}`, {
        headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("Me gustas obtenidos:", response.data);
        this.meGustas = response.data;
      })
      .catch((error) => {
        console.error("Error al obtener me gustas:", error);
      });
    },
    darMeGusta(rutinaId) {
      axios
        .post(
          `${process.env.VUE_APP_BASE_URL}/api/like`,
          {
            rutina_id: rutinaId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          console.log("Me gusta agregado:", response.data);
          this.meGustas.push(response.data);
        })
        .catch((error) => {
          console.error("Error al agregar me gusta:", error);
        });
    },
    eliminarMeGusta(rutinaId) {
      axios
      .delete(`${process.env.VUE_APP_BASE_URL}/api/like/${rutinaId}`, {
        headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("Me gusta eliminado:", response.data);
        this.obtenerMeGustas();
      })
      .catch((error) => {
        console.error("Error al eliminar me gusta:", error);
      });
    },
  },
};
</script>

<style scoped>
.rutina-view-main {
  min-height: 100vh;
  background: var(--color-terciario);
  padding-bottom: 2rem;
}

/* Header de la rutina */
.rutina-header {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  color: var(--color-secondary);
  padding: 2rem 2.5rem;
  margin-bottom: 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.rutina-title {
  color: var(--color-secondary);
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.rutina-description {
  color: var(--color-secondary);
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  max-width: 800px;
}

.rutina-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.btn-like {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-secondary);
  color: var(--color-quinto);
  border: none;
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.btn-like:hover:not(:disabled) {
  background: var(--color-terciario);
}

.btn-like:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-liked {
  color: var(--color-error);
}

.btn-liked svg {
  fill: var(--color-error);
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-copy,
.btn-favorite,
.btn-unfavorite {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-speed);
  border: none;
}

.btn-copy {
  background: var(--color-secondary);
  color: var(--color-quinto);
}

.btn-copy:hover {
  background: var(--color-terciario);
}

.btn-favorite {
  background: var(--color-success);
  color: var(--color-secondary);
}

.btn-favorite:hover {
  background: #089e45;
}

.btn-unfavorite {
  background: var(--color-error);
  color: var(--color-secondary);
}

.btn-unfavorite:hover {
  background: #d73737;
}

/* Contenido principal */
.rutina-content {
  max-width: 1250px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 992px) {
  .rutina-content {
    grid-template-columns: 2fr 1fr;
  }
}

/* Secciones */
.exercises-section,
.comments-section {
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
  border-bottom: 1px solid #c8cdd3;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-quinto);
  margin: 0;
}

.exercises-count {
  font-size: 0.9rem;
  color: var(--color-sexto);
  font-weight: 500;
}

/* Grid de ejercicios */
.exercises-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .exercises-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .exercises-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tarjeta de ejercicio */
.exercise-card {
  border-radius: var(--border-radius);
  padding: 1.25rem;
  background: var(--color-terciario);
  transition: all var(--transition-speed);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

.exercise-card:hover {
  transform: translateY(-4px);
}

.exercise-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.exercise-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  margin-top: 1rem;
  flex: 1;
}

.exercise-category {
  padding: 0.25rem 1.2rem;
  border-radius: 10px 10px 0 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-secondary);
  position: absolute;
  top: 0;
  right: 0;
  width: -webkit-fill-available;
}

.exercise-description {
  color: var(--color-sexto);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.exercise-footer {
  display: flex;
  justify-content: flex-start;
}

.series-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-secondary);
}

/* Estados vacíos */
.empty-state,
.empty-comments {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: var(--color-sexto);
}

.empty-state svg,
.empty-comments svg {
  margin-bottom: 1rem;
  color: #cbd5e0;
}

.empty-state p,
.empty-comments p {
  margin: 0;
  font-size: 1rem;
}

/* Sección de comentarios */
.btn-add-comment {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-primary);
  color: var(--color-secondary);
  border: none;
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.btn-add-comment:hover {
  background: var(--color-cuarto);
}

.comment-form {
  background: var(--color-terciario);
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group textarea {
  width: -webkit-fill-available;
  padding: 0.75rem;
  border: 1px solid var(--color-terciario);
  border-radius: var(--border-radius);
  font-family: inherit;
  font-size: 0.9rem;
  resize: vertical;
  transition: border-color var(--transition-speed);
}

.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-start;
}

.btn-cancel {
  background: var(--color-terciario);
  color: var(--color-quinto);
  border: 1px solid var(--color-quinto);
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.btn-cancel:hover {
  background: var(--color-cuarto);
  color: var(--color-secondary);
}

.btn-submit {
  background: var(--color-success);
  color: var(--color-quinto);
  border: none;
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.btn-submit:hover {
  background: #089e45;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.exercise-card {
  animation: fadeIn 0.4s ease forwards;
}

.exercise-card:nth-child(1) { animation-delay: 0.1s; }
.exercise-card:nth-child(2) { animation-delay: 0.2s; }
.exercise-card:nth-child(3) { animation-delay: 0.3s; }
.exercise-card:nth-child(4) { animation-delay: 0.4s; }
.exercise-card:nth-child(5) { animation-delay: 0.5s; }
.exercise-card:nth-child(6) { animation-delay: 0.6s; }

/* Loading Spinner */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-terciario);
  border-top: 4px solid var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
<template>
  <main class="rutina-detail-main">
    <!-- Header de la rutina -->
    <div class="rutina-header">
      <div class="header-content">
        <h1 class="rutina-title">{{ rutina.Nombre }}</h1>
        <p class="rutina-description">{{ rutina.Descripcion }}</p>
        <div class="rutina-meta">
          <div class="likes-count">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>{{ rutina.likes?.length || 0 }}</span>
          </div>
          <div class="exercises-count">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
            <span>{{ rutina.ejercicios?.length || 0 }} ejercicios</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="rutina-content">
      <!-- Sección de ejercicios -->
      <section class="exercises-section">
        <div class="section-header">
          <h2>Ejercicios de la rutina</h2>
        </div>
        
        <div v-if="rutina.ejercicios?.length" class="exercises-grid">
          <div 
            v-for="ejercicio in rutina.ejercicios" 
            :key="ejercicio._id" 
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
                <div class="exercise-category">
                  <span :class="`category-tag ${ejercicio.Categoria?.toLowerCase() || 'default'}`">
                    {{ ejercicio.Categoria || "Sin categoría" }}
                  </span>
                </div>
              </div>
              
              <p class="exercise-description">
                {{ ejercicio.Descripcion || "Este ejercicio no tiene descripción." }}
              </p>
            </div>
            <span class="series-badge" :class="`${ejercicio.Categoria?.toLowerCase() || 'default'}`">
                  {{ ejercicio.Num_Series }} series
                </span>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>No hay ejercicios disponibles para esta rutina.</p>
        </div>
      </section>

      <!-- Sección de estadísticas -->
      <section class="stats-section" v-if="estadisticas.length">
        <div class="section-header">
          <h2>Historial de estadísticas</h2>
        </div>
        
        <swiper 
          :modules="modules" 
          :slides-per-view="1" 
          :space-between="20" 
          navigation 
          :pagination="{ clickable: true }" 
          :auto-height="true"
        >
          <swiper-slide
            v-for="(item, index) in estadisticas"
            :key="index"
            class="stats-slide"
          >
            <div class="stats-date">
              <h3>{{ item.fecha }}</h3>
              <p v-if="item.duracion" class="stats-duration">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Duración: {{ item.duracion }}
              </p>
            </div>
            
            <div class="stats-exercises">
              <div
                v-for="ejercicio in rutina.ejercicios"
                :key="ejercicio._id || ejercicio.ejercicioRutina_id"
                class="stats-exercise-card"
              >
                <h4>{{ ejercicio.Nombre }}</h4>
                
                <div class="stats-details">
                  <ul v-if="item.estadisticas.length">
                    <li
                      v-for="(detalle, idx) in item.estadisticas"
                      :key="detalle?.id || idx"
                    >
                      <span class="stat-value">{{ detalle.Peso }}kg</span>
                      <span class="stat-separator">-</span>
                      <span class="stat-value">{{ detalle.Repeticiones }} reps</span>
                    </li>
                  </ul>
                  <p v-else class="no-stats">No hay estadísticas disponibles para este ejercicio.</p>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </section>
      
      <div v-else class="no-stats-section">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="12" x2="2" y2="12"></line>
          <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
          <line x1="6" y1="16" x2="6.01" y2="16"></line>
          <line x1="10" y1="16" x2="10.01" y2="16"></line>
        </svg>
        <p>No hay estadísticas disponibles.</p>
      </div>

      <!-- Sección de comentarios -->
      <section class="comments-section">
        <div class="section-header">
          <h2>Comentarios</h2>
          <button 
            class="btn-comment-toggle" 
            @click="mostrarInput = !mostrarInput" 
            v-if="this.$store.state.usuario && !mostrarInput"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Añadir comentario
          </button>
        </div>

        <!-- Formulario para nuevo comentario -->
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
            @actualizar-rutina="getRutina"
          />
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import ComentarioItem from "@/components/ComentarioItem.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@/styles/slider-button.css";

export default {
  name: "VerEntrenamiento",
  components: {
    ComentarioItem,
    Swiper, 
    SwiperSlide
  },
  data() {
    return {
      modules: [Navigation, Pagination],
      rutina: {},
      isLoading: true,
      fechaUsada: null,
      fechaSeleccionada: null,
      duracion: null,
      modalAgregar: false,
      gruposMusculares: [],
      ejercicios: [
        {
          ejerciciosFiltrados: [],
          grupoSeleccionado: "",
          seleccionado: "",
          series: "",
        },
      ],
      estadisticas: [],
      nuevoComentario: "",
      mostrarInput: false
    };
  },
  mounted() {
    this.getRutina();
  },
  methods: {
    async getRutina() {
      this.isLoading = true;
      this.fechaUsada = null;
      this.duracion = null;

      try {
        const response = await axios.get(
          `${process.env.VUE_APP_BASE_URL}/api/rutinas/${this.$route.params.id}`
        );
        this.rutina = response.data[0];

        if (this.rutina.Usuario_id != localStorage.getItem("usuario")) {
          this.$router.push({ name: "error" });
          return;
        }
        
        if (!this.rutina?.ejercicios?.length) {
          this.isLoading = false;
          return;
        }

        const fetchEstadisticas = async (ejercicio) => {
          try {
            const res = await axios.post(
              `${process.env.VUE_APP_BASE_URL}/api/estadisticasEjercicio/getByDate`,
              {
                id: ejercicio.ejercicioRutina_id,
                Rutina_id: this.rutina.id,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            this.estadisticas = res.data || {};
            if(this.estadisticas){
              this.estadisticas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
              this.estadisticas.forEach(item => {
                  if (item.duracion) {
                  const duracionSegundos = item.duracion;
                  const horas = Math.floor(duracionSegundos / 3600);
                  const minutos = Math.floor((duracionSegundos % 3600) / 60);
                  const segundos = duracionSegundos % 60;

                  item.duracion = `${horas > 0 ? horas + 'h ' : ''}${minutos > 0 ? minutos + 'm ' : ''}${segundos}s`;
                  }
              });
            }
          } catch (error) {
            console.error("Error obteniendo estadísticas:", error);
          }
        };

        await Promise.all(fetchEstadisticas(this.rutina.ejercicios[0]));
      } catch (error) {
        console.error("Error cargando rutina:", error);
      } finally {
        this.isLoading = false;
      }
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
          this.getRutina();
        })
        .catch((error) => {
          console.error("Error al agregar comentario:", error);
        });
    },
    
    // ... otros métodos existentes (abrirModal, getEjercicios, etc.)
  }
};
</script>

<style scoped>
.rutina-detail-main {
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

.rutina-meta {
  display: flex;
  gap: 1.5rem;
}

.likes-count,
.exercises-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.likes-count svg {
  color: var(--color-secondary);
}

.exercises-count svg {
  color: var(--color-secondary);
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
    grid-template-columns: 1fr 1fr;
  }
  
  .comments-section {
    grid-column: 1 / -1;
  }
}

/* Secciones */
.exercises-section,
.stats-section,
.comments-section {
  background: var(--color-secondary);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  overflow: auto;
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
  display: flex;
  flex-direction: column;
  transition: all var(--transition-speed);
  justify-content: space-between;
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

.series-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-secondary);
  width: fit-content;
}

.exercise-description {
  color: var(--color-sexto);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.exercise-category {
  display: flex;
  justify-content: flex-start;
}

.category-tag {
    color: var(--color-secondary);
    padding: 0.25rem 1.2rem;
    border-radius: 10px 10px 0 0;
    font-size: 0.8rem;
    font-weight: 500;
    position: absolute;
    top: 0;
    right: 0;
    width: -webkit-fill-available;
}

/* Estados vacíos */
.empty-state,
.no-stats-section,
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
.no-stats-section svg,
.empty-comments svg {
  margin-bottom: 1rem;
  color: var(--color-sexto);
}

.empty-state p,
.no-stats-section p,
.empty-comments p {
  margin: 0;
  font-size: 1rem;
}

/* Sección de estadísticas */
.stats-slide {
  padding: 1rem;
  box-sizing: border-box;
}

.stats-date {
  text-align: center;
  margin-bottom: 1.5rem;
}

.stats-date h3 {
  font-size: 1.25rem;
  color: var(--color-quinto);
  margin: 0 0 0.5rem 0;
}

.stats-duration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--color-sexto);
  margin: 0;
}

.stats-exercises {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .stats-exercises {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stats-exercise-card {
  background: var(--color-terciario);
  border-radius: var(--border-radius);
  padding: 1rem;
}

.stats-exercise-card h4 {
  font-size: 1rem;
  color: var(--color-quinto);
  margin: 0 0 0.75rem 0;
  font-weight: 600;
}

.stats-details ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.stats-details li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
  color: var(--color-sexto);
}

.stats-details li:last-child {
  border-bottom: none;
}

.stat-value {
  font-weight: 500;
}

.stat-separator {
  color: var(--color-sexto);
}

.no-stats {
  color: var(--color-sexto);
  font-style: italic;
  margin: 0;
}

/* Sección de comentarios */
.btn-comment-toggle {
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

.btn-comment-toggle:hover {
  background: var(--color-cuarto);
}

.comment-form {
  background: var(--color-terciario);
  border-radius: var(--border-radius);
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group textarea {
  width: 100%;
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
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.15);
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn-cancel {
  background: var(--color-terciario);
  color: var(--color-quinto);
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-submit {
  background: var(--color-success);
  color: var(--color-secondary);
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

/* Loading state */
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
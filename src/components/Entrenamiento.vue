<template>
  <main class="mis-rutinas-container">
    <!-- Header con título y botón de acción -->
    <div class="mis-rutinas-header">
      <div class="header-content">
        <h1 class="mis-rutinas-titulo">Mis Rutinas</h1>
        <p class="mis-rutinas-subtitulo">Administra y ejecuta tus rutinas personalizadas</p>
      </div>
      <router-link class="btn-agregar-rutina" to="/anadirEntrenamiento">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Nueva Rutina
      </router-link>
    </div>

    <!-- Estados de carga y vacío -->
    <div v-if="rutinas.length === 0 && !cargando" class="estado-vacio">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
      <h3>No tienes rutinas creadas</h3>
      <p>Comienza creando tu primera rutina personalizada.</p>
      <router-link class="btn-vacio" to="/anadirEntrenamiento">
        Crear mi primera rutina
      </router-link>
    </div>

    <div v-else-if="cargando" class="estado-carga">
      <div class="carga-spinner"></div>
      <p>Cargando tus rutinas...</p>
    </div>

    <!-- Grid de rutinas -->
    <div v-else class="mis-rutinas-grid">
      <article
        v-for="rutina in rutinas"
        :key="rutina.id"
        class="mis-rutina-card"
      >
        <div class="mis-rutina-card-header">
          <div class="mis-rutina-info">
            <h3 class="mis-rutina-nombre">{{ rutina.Nombre }}</h3>
            <p class="mis-rutina-descripcion">{{ rutina.Descripcion || 'Sin descripción' }}</p>
          </div>
          <div class="mis-rutina-likes">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              viewBox="0 0 16 16"
              class="like-icon"
            >
              <path d="M8 2.748-.717-1.737C5.6-.281 8 3.993 8 3.993s2.4-4.274 8.717-3.74C15.6-.281 8 2.748 8 2.748z"/>
              <path d="M8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" fill-rule="evenodd"/>
            </svg>
            <span class="likes-count">{{ rutina.likes.length }}</span>
          </div>
        </div>

        <div class="mis-rutina-content">
          <details class="mis-ejercicios-details">
            <summary class="mis-ejercicios-summary">
              <span>Ejercicios incluidos ({{ rutina.rutinaEjercicio?.length || 0 }})</span>
              <svg class="mis-dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </summary>
            
            <div v-if="rutina.rutinaEjercicio?.length" class="mis-lista-ejercicios">
              <div v-for="ejercicio in rutina.rutinaEjercicio" :key="ejercicio._id" class="mis-ejercicio-item">
                <div class="mis-ejercicio-info">
                  <h4>{{ ejercicio.ejercicio.Nombre }}</h4>
                  <div class="mis-ejercicio-meta">
                    <span class="series-badge">{{ ejercicio.Num_Series }} series</span>
                    <span v-if="ejercicio.Num_Repeticiones" class="reps-badge">{{ ejercicio.Num_Repeticiones }} repeticiones</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="mis-ejercicios-vacio">
              <p>No hay ejercicios en esta rutina</p>
            </div>
          </details>
        </div>

        <div class="mis-rutina-footer">
          <button class="mis-btn-action btn-detalles" @click="verRutina(rutina.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Detalles
          </button>
          <button class="mis-btn-action btn-comenzar" @click="comenzarRutina(rutina.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Comenzar
          </button>
          <button class="mis-btn-action btn-eliminar" @click="eliminarRutina(rutina.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Eliminar
          </button>
        </div>
      </article>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import { eliminarLogro } from "@/services/logrosService";

export default {
  name: "EntrenamientoGym",
  data() {
    return {
      rutinas: [],
      countRutines: 0,
      cargando: true
    };
  },
  mounted() {
    this.getRutinas();
  },
  methods: {
    getRutinas() {
      this.cargando = true;
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/rutinas/usuario/` + this.$store.state.usuario)
        .then((response) => {
          this.rutinas = response.data;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.cargando = false;
        });
    },
    eliminarRutina(rutinaId) {
      if (confirm("¿Estás seguro de eliminar esta rutina?")) {
        axios
          .delete(`${process.env.VUE_APP_BASE_URL}/api/rutinas/` + rutinaId, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((response) => {
            console.log(response.data);
            this.fetchNumberRutines();
            this.getRutinas();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    async fetchNumberRutines() {
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/rutinas/count/${this.$store.state.usuario}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          this.countRutines = response.data.count;
          console.log("Number of routines:", this.countRutines);
          if(this.countRutines == 0){
            eliminarLogro(3, this.$store.state.usuario);
          }
        })
    },
    verRutina(rutinaId) {
      this.$router.push({ name: "VerEntrenamiento", params: { id: rutinaId } });
    },
    comenzarRutina(rutinaId) {
      this.$router.push({ name: "EjecutarEntrenamiento", params: { id: rutinaId } });
    },
  },
};
</script>

<style scoped>
.mis-rutinas-container {
  min-height: 100vh;
  background: var(--color-terciario);
  padding: 0;
}

/* Header */
.mis-rutinas-header {
  background: var(--color-primary);
  color: var(--color-quinto);
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header-content {
  text-align: center;
}

.mis-rutinas-titulo {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  line-height: 1.2;
  color: var(--color-secondary);
}

.mis-rutinas-subtitulo {
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  color: var(--color-secondary);
}

.btn-agregar-rutina {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-accent);
  color: var(--color-secondary);
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  margin: 0 auto;
  border: 2px solid transparent;
}

.btn-agregar-rutina:hover {
  background: var(--color-quinto);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* Estados */
.estado-carga,
.estado-vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  background: var(--color-secondary);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin: 2rem;
}

.carga-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--color-terciario);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.estado-vacio svg {
  color: var(--color-sexto);
  margin-bottom: 1rem;
}

.estado-vacio h3 {
  color: var(--color-quinto);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.estado-vacio p {
  color: var(--color-sexto);
  margin-bottom: 1.5rem;
}

.btn-vacio {
  background: var(--color-primary);
  color: var(--color-secondary);
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-vacio:hover {
  background: var(--color-cuarto);
  transform: translateY(-2px);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Grid de rutinas */
.mis-rutinas-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 2rem 1rem;
}

/* Tarjeta de rutina */
.mis-rutina-card {
  background: var(--color-secondary);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--color-terciario);
  display: flex;
  flex-direction: column;
}

.mis-rutina-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.mis-rutina-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid var(--color-terciario);
}

.mis-rutina-info {
  flex: 1;
}

.mis-rutina-nombre {
  font-size: 1.4rem;
  color: var(--color-quinto);
  margin-bottom: 0.5rem;
  font-weight: 700;
  background: linear-gradient(to right, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.mis-rutina-descripcion {
  color: var(--color-sexto);
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

.mis-rutina-likes {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--color-error);
  font-weight: 600;
}

.like-icon {
  color: var(--color-error);
}

.mis-rutina-content {
  padding: 1rem 1.5rem;
}

.mis-ejercicios-details {
  border: 1px solid var(--color-terciario);
  border-radius: 8px;
  overflow: hidden;
}

.mis-ejercicios-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--color-terciario);
  cursor: pointer;
  list-style: none;
  font-weight: 600;
  color: var(--color-quinto);
}

.mis-ejercicios-summary::-webkit-details-marker {
  display: none;
}

.mis-dropdown-icon {
  width: 18px;
  height: 18px;
  transition: transform 0.3s ease;
}

.mis-ejercicios-details[open] .mis-dropdown-icon {
  transform: rotate(180deg);
}

.mis-lista-ejercicios {
  padding: 0.5rem 1rem;
}

.mis-ejercicio-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-terciario);
}

.mis-ejercicio-item:last-child {
  border-bottom: none;
}

.mis-ejercicio-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: var(--color-quinto);
  font-weight: 600;
}

.mis-ejercicio-meta {
  display: flex;
  gap: 0.5rem;
}

.series-badge,
.reps-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.series-badge {
  background: var(--color-primary);
  color: var(--color-secondary);
}

.reps-badge {
  background: var(--color-accent);
  color: var(--color-secondary);
}

.mis-ejercicios-vacio {
  padding: 1rem;
  text-align: center;
  color: var(--color-sexto);
  font-style: italic;
}

.mis-rutina-footer {
  display: flex;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-terciario);
  gap: 0.75rem;
}

.mis-btn-action {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 0.9rem;
}

.btn-detalles {
  background: var(--color-info);
  color: var(--color-secondary);
}

.btn-detalles:hover {
  background: #126ab3;
}

.btn-comenzar {
  background: var(--color-success);
  color: var(--color-secondary);
}

.btn-comenzar:hover {
  background: #005c25;
}

.btn-eliminar {
  background: var(--color-error);
  color: var(--color-secondary);
}

.btn-eliminar:hover {
  background: #8b1513;
}

/* Responsive */
@media (min-width: 768px) {
  .mis-rutinas-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 2rem 2rem;
    text-align: left;
  }
  
  .header-content {
    text-align: left;
  }
  
  .mis-rutinas-grid {
    grid-template-columns: repeat(2, 1fr);
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  .mis-rutinas-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .mis-rutinas-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .mis-rutina-footer {
    flex-direction: column;
  }
  
  .mis-ejercicio-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
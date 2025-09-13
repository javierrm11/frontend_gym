<template>
  <main class="workout-execution-main">
    <!-- Header de la rutina -->
    <div class="workout-header">
      <div class="header-content">
        <h1 class="workout-title">Ejecutar Entrenamiento</h1>
        <div class="workout-info">
          <h2>{{ rutina.Nombre }}</h2>
          <p class="workout-description">{{ rutina.Descripcion }}</p>
          <div class="workout-meta">
            <div class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{{ fechaMostrada || "No disponible" }}</span>
            </div>
            <div class="meta-item timer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>{{ duracion.horas.toString().padStart(2, '0') }}:{{ duracion.minutos.toString().padStart(2, '0') }}:{{ duracion.segundos.toString().padStart(2, '0') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="workout-content">
      <!-- Estado de carga -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner-large"></div>
        <p>Cargando ejercicios...</p>
      </div>

      <!-- Lista de ejercicios -->
      <div v-else class="exercises-list">
        <div 
          v-for="(ejercicio, indexEj) in ejercicios" 
          :key="ejercicio.ejercicioRutina_id" 
          class="exercise-card"
        >
          <div class="exercise-header">
            <div class="exercise-title">
              <h3>{{ ejercicio.Nombre }}</h3>
              <p>{{ ejercicio.Descripcion }}</p>
            </div>
            <div class="series-count">
              <span>{{ ejercicio.nuevasSeries.length }} serie{{ ejercicio.nuevasSeries.length !== 1 ? 's' : '' }}</span>
            </div>
          </div>

          <!-- Estadísticas anteriores -->
          <div v-if="ejercicio.estadisticas.length" class="previous-stats">
            <div class="stats-toggle" @click="toggleStats(indexEj)">
              <span>Estadísticas anteriores</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ rotated: ejercicio.showStats }">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            
            <div v-if="ejercicio.showStats" class="stats-list">
              <div v-for="(est, index) in ejercicio.estadisticas" :key="index" class="stat-item">
                <div class="stat-badge">Serie {{ est.Serie }}</div>
                <div class="stat-values">{{ est.Peso }} kg × {{ est.Repeticiones }} rep</div>
              </div>
            </div>
          </div>
          
          <div v-else class="no-stats">
            <p>No hay estadísticas previas para este ejercicio</p>
          </div>

          <!-- Series del ejercicio -->
          <div class="series-container">
            <div 
              v-for="(serie, indexSerie) in ejercicio.nuevasSeries" 
              :key="indexSerie" 
              class="serie-card"
            >
              <div class="serie-header">
                <h4>Serie {{ indexSerie + 1 }}</h4>
                <button 
                  class="btn-remove-serie" 
                  @click="eliminarSerie(indexEj, indexSerie)"
                  :disabled="ejercicio.nuevasSeries.length <= 1"
                  title="Eliminar serie"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div class="serie-inputs">
                <div class="input-field">
                  <label>Peso (kg)</label>
                  <input
                    type="number"
                    v-model.number="serie.peso"
                    min="0"
                    step="0.5"
                    placeholder="0"
                    class="weight-input"
                  />
                </div>
                
                <div class="input-field">
                  <label>Repeticiones</label>
                  <input
                    type="number"
                    v-model.number="serie.repeticiones"
                    min="0"
                    placeholder="0"
                    class="reps-input"
                  />
                </div>
              </div>
            </div>

            <button class="btn-add-serie" @click="anadirSerie(indexEj)">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Añadir Serie
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Acciones -->
    <div class="workout-actions">
      <button class="btn-secondary" @click="$router.go(-1)">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Cancelar
      </button>
      
      <button 
        class="btn-primary" 
        @click="guardarEstadisticas" 
        :disabled="isLoading"
      >
        <span v-if="isLoading" class="btn-spinner"></span>
        <span v-else>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          Guardar Entrenamiento
        </span>
      </button>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import { updateLogro } from "@/services/logrosService";

export default {
  name: "EjecutarEntrenamiento",
  data() {
    return {
      rutina: {},
      ejercicios: [],
      isLoading: true,
      fechaMostrada: null,
      duracion: {
        horas: 0,
        minutos: 0,
        segundos: 0,
      },
      countEntrenamientos: 0,
    };
  },
  mounted() {
    this.getRutina();
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();
    this.fechaMostrada = `${anio}-${mes}-${dia}`;
    
    // Iniciar temporizador
    setInterval(() => {
      this.duracion.segundos++;
      if (this.duracion.segundos >= 60) {
        this.duracion.segundos = 0;
        this.duracion.minutos++;
      }
      if (this.duracion.minutos >= 60) {
        this.duracion.minutos = 0;
        this.duracion.horas++;
      }
    }, 1000);
  },
  methods: {
    async getRutina() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_BASE_URL}/api/rutinas/${this.$route.params.id}`
        );
        this.rutina = response.data[0];

        if(this.rutina.Usuario_id != localStorage.getItem("usuario")) {
          this.$router.push({ name: "error" });
          return;
        }

        this.ejercicios = this.rutina.ejercicios.map((ejercicio) => ({
          ...ejercicio,
          estadisticas: [],
          nuevasSeries: [],
          showStats: false
        }));
        
        await this.getIdSerieEjercicios();
        await this.cargarEstadisticas();
      } catch (error) {
        console.error("Error cargando rutina:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async cargarEstadisticas() {
      const token = localStorage.getItem("token");

      const promesas = this.ejercicios.map(async (ejercicio) => {
        try {
          const response = await axios.post(
            `${process.env.VUE_APP_BASE_URL}/api/estadisticasEjercicio/getByNumSeries`,
            {
              id: ejercicio.ejercicioRutina_id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const stats = response.data || [];
          ejercicio.estadisticas = stats;

          if (stats.length > 0) {
            ejercicio.nuevasSeries = stats.map((serie) => ({
              peso: serie.Peso,
              repeticiones: serie.Repeticiones,
            }));
          } else {
            ejercicio.nuevasSeries = Array.from({ length: ejercicio.Num_Series }, () => ({
              peso: 0,
              repeticiones: 0,
            }));
          }
        } catch (err) {
          console.warn("No se pudieron obtener estadísticas:", err);
          ejercicio.estadisticas = [];
          ejercicio.nuevasSeries = Array.from({ length: ejercicio.Num_Series }, () => ({
            peso: 0,
            repeticiones: 0,
          }));
        }
      });

      await Promise.all(promesas);
    },
    
    async getIdSerieEjercicios(){
      const token = localStorage.getItem("token");
      const promesas = this.ejercicios.map(async (ejercicio) => {
        try {
          const response = await axios.get(
            `${process.env.VUE_APP_BASE_URL}/api/estadisticasEjercicio/getIdSerie/` + ejercicio.ejercicioRutina_id,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          ejercicio.id_serie = response.data.id_serie + 1 || 1;
        } catch (err) {
          ejercicio.id_serie = 1;
        }
      });

      await Promise.all(promesas);
    },

    toggleStats(index) {
      this.ejercicios[index].showStats = !this.ejercicios[index].showStats;
    },

    anadirSerie(indexEjercicio) {
      this.ejercicios[indexEjercicio].nuevasSeries.push({
        peso: 0,
        repeticiones: 0,
      });
    },
    
    eliminarSerie(indexEjercicio, indexSerie) {
      this.ejercicios[indexEjercicio].nuevasSeries.splice(indexSerie, 1);
    },

    async guardarEstadisticas() {
      const rutinaId = this.rutina.id;
      const token = localStorage.getItem("token");

      // Calcular la duración total en segundos
      const duracionTotalSegundos =
        this.duracion.horas * 3600 +
        this.duracion.minutos * 60 +
        this.duracion.segundos;

      // Preparar los datos para enviar
      const datos = {
        fecha: this.fechaMostrada,
        duracion: duracionTotalSegundos,
        ejercicios: this.ejercicios.flatMap((ejercicio) =>
          ejercicio.nuevasSeries.map((serie, index) => ({
            RutinaEjercicio_id: ejercicio.ejercicioRutina_id,
            id_serie: ejercicio.id_serie,
            serie: index + 1,
            peso: serie.peso,
            repeticiones: serie.repeticiones,
          }))
        ),
      };

      try {
        this.isLoading = true;
        const response = await axios.post(
          `${process.env.VUE_APP_BASE_URL}/api/estadisticasEjercicio/agregar/${rutinaId}`,
          datos,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Estadísticas guardadas correctamente:", response.data);
        this.fetchNumberRutines();
        this.$router.push('/verEntrenamiento/' + this.rutina.id);
        this.isLoading = false;
      } catch (error) {
        console.error("Error guardando las estadísticas:", error);
        alert("Hubo un error al guardar las estadísticas.");
        this.isLoading = false;
      }
    },
    
    async fetchNumberRutines() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_BASE_URL}/api/duracion/count/${this.$store.state.usuario}`, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        this.countEntrenamientos = response.data;
        console.log(this.countEntrenamientos);
        
        if(this.countEntrenamientos.length == 1){
          updateLogro(1, this.$store.state.usuario);
        }
      } catch (error) {
        console.error("Error obteniendo conteo de rutinas:", error);
      }
    },
  },
};
</script>

<style scoped>
.workout-execution-main {
  min-height: 100vh;
  background: var(--color-terciario);
  padding-bottom: 2rem;
}

/* Header de la rutina */
.workout-header {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  color: var(--color-secondary);
  padding: 2rem 1rem;
  margin-bottom: 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.workout-title {
  color: var(--color-secondary);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
}

.workout-info {
  text-align: center;
}

.workout-info h2 {
  color: var(--color-secondary);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.workout-description {
  color: var(--color-secondary);
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.workout-meta {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1.25rem;
  border-radius: var(--border-radius);
  font-weight: 500;
}

.meta-item.timer {
  background: rgba(255, 255, 255, 0.2);
  font-family: monospace;
  font-size: 1.1rem;
}

/* Contenido principal */
.workout-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Estado de carga */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.spinner-large {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(74, 108, 247, 0.1);
  border-radius: 50%;
  border-top-color: var(--color-primary);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: var(--color-sexto);
  font-size: 1.1rem;
}

/* Lista de ejercicios */
.exercises-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.exercise-card {
  background: var(--color-secondary);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.exercise-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #cecfd1;
}

.exercise-title h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-quinto);
  margin: 0 0 0.5rem 0;
}

.exercise-title p {
  color: var(--color-sexto);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.series-count {
  background: var(--color-primary);
  color: var(--color-secondary);
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Estadísticas anteriores */
.previous-stats {
  margin-bottom: 1.5rem;
}

.stats-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--color-terciario);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  color: var(--color-primary);
  transition: all var(--transition-speed);
}

.stats-toggle:hover {
  background: #e2e8f0;
}

.stats-toggle svg {
  transition: transform var(--transition-speed);
}

.stats-toggle svg.rotated {
  transform: rotate(180deg);
}

.stats-list {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: var(--color-terciario);
  border-radius: var(--border-radius);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-badge {
  background: var(--color-primary);
  color: var(--color-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.stat-values {
  font-size: 0.9rem;
  color: var(--color-quinto);
}

.no-stats {
  text-align: center;
  padding: 1rem;
  color: var(--color-sexto);
  font-style: italic;
  background: var(--color-terciario);
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
}

/* Series del ejercicio */
.series-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.serie-card {
  background: var(--color-terciario);
  border-radius: var(--border-radius);
  padding: 1.25rem;
  flex: 0 0 100%;
  box-sizing: border-box;
}
@media (min-width: 600px) {
  .serie-card {
    flex: 1 1 40%;
  }
}
@media (min-width: 900px) {
  .serie-card {
    flex: 1 1 31%;
  }
}

.serie-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.serie-header h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-quinto);
  margin: 0;
}

.btn-remove-serie {
  background: none;
  border: none;
  color: var(--color-error);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all var(--transition-speed);
}

.btn-remove-serie:hover:not(:disabled) {
  background: rgba(226, 77, 76, 0.1);
}

.btn-remove-serie:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.serie-inputs {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.input-field {
  display: flex;
  flex-direction: column;
}

.input-field label {
  font-size: 0.8rem;
  color: var(--color-sexto);
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.weight-input,
.reps-input {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: all var(--transition-speed);
}

.weight-input:focus,
.reps-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.btn-add-serie {
  flex: 0 0 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--color-primary);
  color: var(--color-secondary);
  border: none;
  padding: 0.75rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-speed);
  margin-top: 0.5rem;
}

.btn-add-serie:hover {
  background: var(--color-cuarto);
}

/* Acciones */
.workout-actions {
  max-width: 1200px;
  margin: 2rem auto 0;
  padding: 0 1rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-secondary,
.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-speed);
  font-size: 1rem;
}

.btn-secondary {
  background: var(--color-secondary);
  color: var(--color-quinto);
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #f1f5f9;
}

.btn-primary {
  background: var(--color-success);
  color: var(--color-secondary);
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background: #089e45;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: var(--color-secondary);
  animation: spin 1s ease-in-out infinite;
}

/* Responsive */
@media (max-width: 768px) {
  .workout-meta {
    flex-direction: column;
    align-items: center;
  }
  
  .exercise-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  
  .serie-inputs {
    grid-template-columns: 1fr;
  }
  
  .workout-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .workout-header {
    padding: 1.5rem 1rem;
  }
  
  .workout-title {
    font-size: 1.75rem;
  }
  
  .exercise-card {
    padding: 1rem;
  }
}
</style>
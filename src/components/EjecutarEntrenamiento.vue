<template>
  <main class="training-execution">
    <div class="header-section">
      <h1 class="page-title">Ejecutar Entrenamiento</h1>
      <div class="training-info">
        <div class="training-meta">
          <span class="training-date">{{ fechaMostrada || "No disponible" }}</span>
          <span class="training-duration">
            <i class="bi bi-clock"></i> {{ formattedDuration }}
          </span>
        </div>
        <h2 class="training-name">{{ rutina.nombre }}</h2>
        <p class="training-description">{{ rutina.descripcion }}</p>
      </div>
    </div>

    <div class="container">
      <div v-if="isLoading" class="loading-state">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando estadísticas...</p>
      </div>

      <div v-else class="exercises-container">
        <div 
          v-for="(ejercicio, indexEj) in ejercicios"
          :key="ejercicio.ejercicioRutina_id"
          class="exercise-card"
        >
          <div class="exercise-header">
            <h3 class="exercise-name">{{ ejercicio.Nombre }}</h3>
            <p class="exercise-description">{{ ejercicio.Descripcion }}</p>
          </div>

          <div v-if="ejercicio.estadisticas.length" class="previous-stats">
            <h4 class="stats-title">
              <i class="bi bi-graph-up"></i> Histórico
            </h4>
            <div class="stats-grid">
              <div v-for="(est, index) in ejercicio.estadisticas" :key="index" class="stat-item">
                <span class="stat-label">Serie {{ est.Serie }}</span>
                <span class="stat-value">{{ est.Peso }} kg</span>
                <span class="stat-value">{{ est.Repeticiones }} rep</span>
              </div>
            </div>
          </div>
          <div v-else class="no-stats">
            <p>No hay estadísticas disponibles para este ejercicio.</p>
          </div>

          <div class="new-sets">
            <h4 class="sets-title">
              <i class="bi bi-plus-circle"></i> Nuevas Series
            </h4>
            <div 
              v-for="(serie, indexSerie) in ejercicio.nuevasSeries"
              :key="indexSerie"
              class="set-row"
            >
              <div class="set-number">Serie {{ indexSerie + 1 }}</div>
              <div class="set-inputs">
                <div class="input-group">
                  <input
                    type="number"
                    class="form-control"
                    v-model.number="serie.peso"
                    min="0"
                    placeholder="Peso (kg)"
                  />
                  <span class="input-group-text">kg</span>
                </div>
                <div class="input-group">
                  <input
                    type="number"
                    class="form-control"
                    v-model.number="serie.repeticiones"
                    min="0"
                    placeholder="Repeticiones"
                  />
                  <span class="input-group-text">rep</span>
                </div>
                <button 
                  @click="eliminarSerie(indexEj, indexSerie)"
                  class="btn btn-danger btn-sm set-delete"
                  title="Eliminar serie"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>

            <button
              class="btn btn-outline-primary add-set-btn"
              @click="anadirSerie(indexEj)"
            >
              <i class="bi bi-plus-lg"></i> Añadir Serie
            </button>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn btn-secondary">
          <i class="bi bi-skip-backward"></i> Cancelar
        </button>
        <button 
          class="btn btn-success save-btn"
          @click="guardarEstadisticas"
        >
          <i class="bi bi-check-circle"></i> Guardar Entrenamiento
        </button>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";

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
    };
  },
  computed: {
    formattedDuration() {
      return `${this.duracion.horas.toString().padStart(2, '0')}:${
        this.duracion.minutos.toString().padStart(2, '0')}:${
        this.duracion.segundos.toString().padStart(2, '0')}`;
    }
  },
  mounted() {
    this.getRutina();
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();
    this.fechaMostrada = `${anio}-${mes}-${dia}`;
    
    this.interval = setInterval(() => {
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
  beforeUnmount() {
    clearInterval(this.interval);
  },
  methods: {
    async getRutina() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/rutinas/${this.$route.params.id}`
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
            "http://localhost:3000/api/estadisticasEjercicio/getByNumSeries",
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
            "http://localhost:3000/api/estadisticasEjercicio/getIdSerie/" + ejercicio.ejercicioRutina_id,
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

    anadirSerie(indexEjercicio) {
      this.ejercicios[indexEjercicio].nuevasSeries.push({
        peso: this.ejercicios[indexEjercicio].nuevasSeries.length > 0 
          ? this.ejercicios[indexEjercicio].nuevasSeries[this.ejercicios[indexEjercicio].nuevasSeries.length - 1].peso
          : 0,
        repeticiones: this.ejercicios[indexEjercicio].nuevasSeries.length > 0
          ? this.ejercicios[indexEjercicio].nuevasSeries[this.ejercicios[indexEjercicio].nuevasSeries.length - 1].repeticiones
          : 0,
      });
    },
    
    eliminarSerie(indexEjercicio, indexSerie) {
      if (this.ejercicios[indexEjercicio].nuevasSeries.length > 1) {
        this.ejercicios[indexEjercicio].nuevasSeries.splice(indexSerie, 1);
      } else {
        alert("Debe haber al menos una serie por ejercicio");
      }
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
          `http://localhost:3000/api/estadisticasEjercicio/agregar/${rutinaId}`,
          datos,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Estadísticas guardadas correctamente:", response.data);
        this.$router.push('/verEntrenamiento/' + this.rutina.id);
      } catch (error) {
        console.error("Error guardando las estadísticas:", error);
        alert("Hubo un error al guardar las estadísticas.");
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Variables de color */
:root {
  --primary-color: #4361ee;
  --secondary-color: #3f37c9;
  --success-color: #4cc9f0;
  --light-color: #f8f9fa;
  --dark-color: #212529;
  --gray-color: #6c757d;
  --light-gray: #e9ecef;
  --border-radius: 12px;
  --box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  --transition: all 0.3s ease;
}

/* Estilos generales */
.training-execution {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding-bottom: 3rem;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Header section */
.header-section {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 2rem 1.5rem;
  margin-bottom: 2rem;
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  box-shadow: var(--box-shadow);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
}

.training-info {
  max-width: 800px;
  margin: 0 auto;
}

.training-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.9;
}

.training-name {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.training-description {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 0;
}

/* Exercise cards */
.exercises-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.exercise-card {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  transition: var(--transition);
}

.exercise-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
}

.exercise-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--light-gray);
}

.exercise-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
}

.exercise-description {
  color: var(--gray-color);
  font-size: 0.95rem;
  margin-bottom: 0;
}

/* Stats sections */
.previous-stats,
.new-sets {
  padding: 1.5rem;
}

.previous-stats {
  border-bottom: 1px solid var(--light-gray);
}

.stats-title,
.sets-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--dark-color);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.stat-item {
  background-color: var(--light-color);
  padding: 0.75rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 0.9rem;
  color: var(--gray-color);
}

.no-stats {
  padding: 1rem;
  text-align: center;
  color: var(--gray-color);
  font-style: italic;
}

/* New sets section */
.set-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: var(--light-color);
  border-radius: 8px;
}

.set-number {
  font-weight: 600;
  min-width: 70px;
}

.set-inputs {
  display: flex;
  gap: 1rem;
  flex-grow: 1;
  flex-wrap: wrap;
}

.input-group {
  flex: 1;
  min-width: 150px;
  display: flex;
}

.input-group .form-control {
  border-radius: 8px 0 0 8px !important;
}

.input-group-text {
  background-color: white;
  border-left: 0;
  border-radius: 0 8px 8px 0;
}

.set-delete {
  padding: 0.5rem;
  border-radius: 8px;
}

.add-set-btn {
  width: 100%;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Action buttons */
.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
  padding: 0 1.5rem;
}

.save-btn {
  padding: 0.75rem 2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Loading state */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
}

.loading-state p {
  font-size: 1.1rem;
  color: var(--gray-color);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header-section {
    padding: 1.5rem 1rem;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .training-name {
    font-size: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .set-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .set-inputs {
    width: 100%;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 1rem;
  }
  
  .action-buttons .btn {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .container {
    padding: 0 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
<template>
  <main class="entrenamiento-container">
    <div class="header-section">
      <h1 class="titulo-principal">Ejecutar Entrenamiento</h1>
      <div class="rutina-info">
        <h2>{{ rutina.Nombre }}</h2>
        <p class="descripcion-rutina">{{ rutina.Descripcion }}</p>
        <div class="meta-info">
          <span class="info-badge">
            <svg class="icon" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
            </svg>
            {{ fechaMostrada || "No disponible" }}
          </span>
          <span class="info-badge">
            <svg class="icon" viewBox="0 0 24 24">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
            </svg>
            {{ duracion.horas }}h {{ duracion.minutos }}m {{ duracion.segundos }}s
          </span>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando ejercicios...</p>
    </div>

    <div v-else class="ejercicios-container">
      <div 
        v-for="(ejercicio, indexEj) in ejercicios" 
        :key="ejercicio.ejercicioRutina_id" 
        class="ejercicio-card"
      >
        <div class="ejercicio-header">
          <h3>{{ ejercicio.Nombre }}</h3>
          <p>{{ ejercicio.Descripcion }}</p>
          <div class="series-indicator">
            <span>{{ ejercicio.nuevasSeries.length }} serie{{ ejercicio.nuevasSeries.length !== 1 ? 's' : '' }}</span>
          </div>
        </div>

        <div v-if="ejercicio.estadisticas.length" class="estadisticas-anteriores">
          <details class="estadisticas-details">
            <summary class="estadisticas-summary">
              <span>Estadísticas anteriores</span>
              <svg class="dropdown-icon" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </summary>
            <ul class="estadisticas-lista">
              <li v-for="(est, index) in ejercicio.estadisticas" :key="index" class="estadistica-item">
                <div class="estadistica-info">
                  <span class="serie-badge">Serie {{ est.Serie }}</span>
                  <span class="serie-info">{{ est.Peso }} kg × {{ est.Repeticiones }} rep</span>
                </div>
              </li>
            </ul>
          </details>
        </div>
        <div v-else class="sin-estadisticas">
          <p>No hay estadísticas previas para este ejercicio</p>
        </div>

        <div class="series-container">
          <div 
            v-for="(serie, indexSerie) in ejercicio.nuevasSeries" 
            :key="indexSerie" 
            class="serie-item"
          >
            <div class="serie-header">
              <h4>Serie {{ indexSerie + 1 }}</h4>
              <button 
                class="btn-eliminar-serie" 
                @click="eliminarSerie(indexEj, indexSerie)"
                :disabled="ejercicio.nuevasSeries.length <= 1"
              >
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div class="serie-inputs">
              <div class="input-group">
                <label>Peso (kg)</label>
                <input
                  type="number"
                  v-model.number="serie.peso"
                  min="0"
                  step="0.5"
                  class="input-peso"
                  placeholder="0"
                />
              </div>
              <div class="input-group">
                <label>Repeticiones</label>
                <input
                  type="number"
                  v-model.number="serie.repeticiones"
                  min="0"
                  class="input-repeticiones"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <button class="btn-anadir-serie" @click="anadirSerie(indexEj)">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Añadir Serie
          </button>
        </div>
      </div>
    </div>

    <div class="actions-container">
      <button class="btn-cancelar" @click="$router.go(-1)">
        Cancelar
      </button>
      <button 
        class="btn-guardar" 
        @click="guardarEstadisticas" 
        :disabled="isLoading"
      >
        <span v-if="isLoading" class="spinner-btn"></span>
        <span v-else>Guardar Entrenamiento</span>
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
      }, // Duración de la rutina
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
          nuevasSeries: [], // Aquí guardamos nuevas series ingresadas por el usuario
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

          // Inicializar nuevasSeries con valores anteriores o con Num_Series si está vacío
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

          ejercicio.id_serie = response.data.id_serie + 1|| 1;
        } catch (err) {
          ejercicio.id_serie = 1;
        }
      });

      await Promise.all(promesas);
    },

    anadirSerie(indexEjercicio) {
      this.ejercicios[indexEjercicio].nuevasSeries.push({
        peso: this.ejercicios[indexEjercicio].nuevasSeries[this.ejercicios[indexEjercicio].nuevasSeries.length - 1].peso,
        repeticiones: this.ejercicios[indexEjercicio].nuevasSeries[this.ejercicios[indexEjercicio].nuevasSeries.length - 1].repeticiones,
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
        duracion: duracionTotalSegundos, // Duración en segundos
        ejercicios: this.ejercicios.flatMap((ejercicio) =>
          ejercicio.nuevasSeries.map((serie, index) => ({
        RutinaEjercicio_id: ejercicio.ejercicioRutina_id,
        id_serie: ejercicio.id_serie, // Asumiendo que cada ejercicio tiene una propiedad 'id_serie'
        serie: index + 1, // El número de serie (1, 2, 3...)
        peso: serie.peso,
        repeticiones: serie.repeticiones,
          }))
        ),
      };

      try {
        this.isLoading = true; // Mostrar el loader
        const response = await axios.post(
          `${process.env.VUE_APP_BASE_URL}/api/estadisticasEjercicio/agregar/${rutinaId}`,
          datos,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Manejar la respuesta
        console.log("Estadísticas guardadas correctamente:", response.data);
        this.fetchNumberRutines();
        this.$router.push('/verEntrenamiento/' + this.rutina.id);
        this.isLoading = false; // Ocultar el loader
      } catch (error) {
        console.error("Error guardando las estadísticas:", error);
        alert("Hubo un error al guardar las estadísticas.");
      }
    },
    async fetchNumberRutines() {
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/duracion/count/${this.$store.state.usuario}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          this.countEntrenamientos = response.data;
          console.log(this.countEntrenamientos);
          if(this.countEntrenamientos.length == 1){
            updateLogro(1, this.$store.state.usuario);
          }
          
        })
    },
  },
};
</script>

<style scoped>
.entrenamiento-container {
  padding: 1rem;
  font-family: 'Poppins', sans-serif;
}

.header-section {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
}

.titulo-principal {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  background: linear-gradient(to right, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.rutina-info {
  margin-top: 1.5rem;
}

.rutina-info h2 {
  color: var(--color-quinto);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.descripcion-rutina {
  font-size: 1rem;
  color: var(--color-sexto);
  margin-bottom: 1.5rem;
}

.meta-info {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.info-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--color-primary);
  color: var(--color-secondary);
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  box-sizing: border-box;
}

.icon {
  width: 1rem;
  height: 1rem;
  fill: currentColor;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(163, 255, 18, 0.3);
  border-radius: 50%;
  border-top-color: var(--color-accent);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.ejercicios-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.ejercicio-card {
  background-color: var(--color-secondary);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.ejercicio-header {
  position: relative;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.ejercicio-header h3 {
  font-size: 1.3rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.ejercicio-header p {
  font-size: 0.95rem;
  color: var(--color-sexto);
  line-height: 1.5;
}

.series-indicator {
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--color-cuarto);
  color: var(--color-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.estadisticas-anteriores {
  margin: 1.5rem 0;
}

.estadisticas-details {
  margin-bottom: 1rem;
}

.estadisticas-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  cursor: pointer;
  color: var(--color-accent);
  font-weight: 500;
  list-style: none;
}

.estadisticas-summary::-webkit-details-marker {
  display: none;
}

.dropdown-icon {
  width: 1.25rem;
  height: 1.25rem;
  fill: var(--color-accent);
  transition: transform var(--transition-speed);
}

.estadisticas-details[open] .dropdown-icon {
  transform: rotate(180deg);
}

.estadisticas-lista {
  margin-top: 0.5rem;
  padding: 0.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.estadistica-item {
  list-style: none;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.estadistica-item:last-child {
  border-bottom: none;
}

.estadistica-info {
  display: flex;
  align-items: center;
}

.serie-badge {
  background-color: var(--color-cuarto);
  color: var(--color-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  margin-right: 1rem;
}
.serie-info{
  color: var(--color-secondary);
}
.sin-estadisticas {
  font-size: 0.9rem;
  color: var(--color-secondary);
  margin: 1rem 0;
  font-style: italic;
  text-align: center;
}

.series-container {
  margin-top: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.serie-item {
  flex: 1 1 calc(30% - 1rem);
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: calc(var(--border-radius) / 2);
  padding: 1rem;
  margin-bottom: 1rem;
}

.serie-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.serie-header h4 {
  font-size: 1.1rem;
  color: var(--color-primary);
  margin: 0;
}

.btn-eliminar-serie {
  background: none;
  border: none;
  color: var(--color-error);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-eliminar-serie:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-eliminar-serie svg {
  fill: currentColor;
}

.serie-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  font-size: 0.8rem;
  color: var(--color-quinto);
  margin-bottom: 0.25rem;
}

.input-peso, .input-repeticiones {
  background-color: var(--color-secondary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: calc(var(--border-radius) / 2);
  padding: 0.75rem;
  color: var(--color-primary);
  font-size: 1rem;
  box-sizing: border-box;
  width: 100%;
}

.input-peso:focus, .input-repeticiones:focus {
  outline: none;
  border-color: var(--color-accent);
}

.btn-anadir-serie {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: var(--color-cuarto);
  color: var(--color-secondary);
  border: none;
  padding: 0.75rem;
  border-radius: calc(var(--border-radius) / 2);
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.5rem;
  width: 100%;
  transition: all var(--transition-speed);
}

.btn-anadir-serie:hover {
  background-color: var(--color-accent);
  color: var(--color-secondary);
}

.btn-anadir-serie svg {
  fill: currentColor;
}

.actions-container {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancelar, .btn-guardar {
  padding: 0.75rem 1.5rem;
  border-radius: calc(var(--border-radius) / 2);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-speed);
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-cancelar {
  background-color: transparent;
  border: 1px solid var(--color-error);
  color: var(--color-error);
}

.btn-cancelar:hover {
  background-color: var(--color-error);
  color: var(--color-secondary);
}

.btn-guardar {
  background-color: var(--color-success);
  color: var(--color-secondary);
  border: none;
}

.btn-guardar:hover:not(:disabled) {
  background-color: #00b347;
}

.btn-guardar:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner-btn {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: var(--color-secondary);
  animation: spin 1s ease-in-out infinite;
}

@media (max-width: 600px) {
  .serie-inputs {
    grid-template-columns: 1fr;
  }
  
  .meta-info {
    flex-direction: column;
    align-items: center;
  }
  
  .info-badge {
    width: 100%;
    justify-content: center;
  }
  .serie-item {
    flex: 0 0 100%;
    box-sizing: border-box;
  }
}

@media (max-width: 400px) {
  .actions-container {
    flex-direction: column;
  }
}
</style>
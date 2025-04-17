<template>
  <div>
    <h1>Ejecutar Entrenamiento</h1>
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <h2>{{ rutina.nombre }}</h2>
          <p>{{ rutina.descripcion }}</p>
          <p>Fecha: {{ fechaMostrada || "No disponible" }}</p>
          <p>
            Duración: {{ duracion.horas }}h {{ duracion.minutos }}m
            {{ duracion.segundos }}s
          </p>
        </div>
      </div>

      <div class="row">
        <div v-if="isLoading" class="col-md-12">
          <p>Cargando estadísticas...</p>
        </div>

        <div
          v-else
          class="col-md-12"
          v-for="(ejercicio, indexEj) in ejercicios"
          :key="ejercicio.ejercicioRutina_id"
        >
          <div class="card p-4 my-3 shadow-sm">
            <h3>{{ ejercicio.Nombre }}</h3>
            <p>{{ ejercicio.Descripcion }}</p>

            <div v-if="ejercicio.estadisticas.length">
              <p><strong>Última ejecución:</strong></p>
              <ul>
                <li v-for="(est, index) in ejercicio.estadisticas" :key="index">
                  Serie: {{ est.Serie }} - Peso: {{ est.Peso }} - Repeticiones:
                  {{ est.Repeticiones }}
                </li>
              </ul>
            </div>
            <div v-else>
              <p>No hay estadísticas disponibles para este ejercicio.</p>
            </div>

            <!-- Nuevas series -->
            <div
              v-for="(serie, indexSerie) in ejercicio.nuevasSeries"
              :key="indexSerie"
              class="row mb-2 g-2"
            >
              <div class="col-md-6">
                <label for="">Peso (kg) - Serie {{ indexSerie + 1 }}</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="serie.peso"
                  min="0"
                />
              </div>
              <div class="col-md-6">
                <label for="">Repeticiones</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="serie.repeticiones"
                  min="0"
                />
              </div>
              <div>
                <button @click="eliminarSerie(indexEj, indexSerie)">Eliminar Serie</button>
              </div>
            </div>

            <button
              class="btn btn-outline-primary btn-sm mt-2"
              @click="anadirSerie(indexEj)"
            >
              Añadir Serie
            </button>
          </div>
        </div>
      </div>
      <button class="btn btn-success" @click="guardarEstadisticas">
        Guardar Estadísticas
      </button>
    </div>
  </div>
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
      }, // Duración de la rutina
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
            "http://localhost:3000/api/estadisticasEjercicio/getIdSerie/" + ejercicio.ejercicioRutina_id,
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
          `http://localhost:3000/api/estadisticasEjercicio/agregar/${rutinaId}`,
          datos,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Manejar la respuesta
        console.log("Estadísticas guardadas correctamente:", response.data);
        this.$router.push('/verEntrenamiento/' + this.rutina.id);
        this.isLoading = false; // Ocultar el loader
      } catch (error) {
        console.error("Error guardando las estadísticas:", error);
        alert("Hubo un error al guardar las estadísticas.");
      }
    },
  },
};
</script>

<style scoped>
/* Estilos generales */
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

p {
  color: #666;
  font-size: 1rem;
  margin: 5px 0;
}

/* Estilos para las tarjetas de ejercicio */
.card {
  border-radius: 12px;
  border: none;
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.card p {
  font-size: 1rem;
  color: #666;
}

.card ul {
  padding-left: 20px;
}

.card ul li {
  font-size: 0.9rem;
  color: #444;
}

.card .form-control {
  border-radius: 8px;
  border: 1px solid #ccc;
  padding: 10px;
  font-size: 1rem;
  margin-bottom: 10px;
}

/* Estilos para botones */
button {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

button:focus {
  outline: none;
}

.btn-outline-primary {
  background-color: transparent;
  border: 1px solid #007bff;
  color: #007bff;
}

.btn-outline-primary:hover {
  background-color: #007bff;
  color: white;
}

.btn-success {
  background-color: #28a745;
  color: white;
  border: none;
}

.btn-success:hover {
  background-color: #218838;
}

.is-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #007bff;
}

.is-loading p {
  font-size: 1.25rem;
}

/* Estilos para las filas de series */
.row {
  margin-bottom: 10px;
}

.row .col-md-6 {
  margin-bottom: 15px;
}

.col-md-6 label {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.col-md-6 input {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #ccc;
  padding: 10px;
  font-size: 1rem;
  background-color: #f8f9fa;
}

.col-md-6 input:focus {
  border-color: #007bff;
  outline: none;
}

/* Estilos para el contenedor principal */
.container {
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Estilo para los textos de la fecha y duración */
p {
  font-size: 1rem;
  color: #444;
  margin: 5px 0;
}

p strong {
  font-weight: bold;
  color: #333;
}

</style>

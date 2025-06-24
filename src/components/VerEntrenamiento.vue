<template>
  <main class="entrenamiento-container">
    <div class="header-section">
      <h1 class="titulo-principal">{{ rutina.Nombre }}</h1>
      <p class="descripcion-principal">{{ rutina.Descripcion }}</p>
    </div>

    <div v-if="isLoading" class="loading-container">
      <p>Cargando datos...</p>
    </div>

    <div v-else>
      <div class="rutinas-grid">
        <div class="rutina-card">
          <div class="card-header">
            <h3 class="rutina-nombre">Ejercicios</h3>
          </div>
          <div class="card-content">
            <div v-if="rutina.ejercicios?.length" class="lista-ejercicios">
              <div
                v-for="ejercicio in rutina.ejercicios"
                :key="ejercicio._id"
                class="ejercicio-item"
              >
                <div class="ejercicio-info">
                  <h4>{{ ejercicio.Nombre }}</h4>
                  <p class="series-badge">{{ ejercicio.Num_Series }} series</p>
                  <p class="ejercicio-descripcion">{{ ejercicio.Descripcion }}</p>
                </div>
                <button class="btn-action btn-eliminar" @click="eliminarEjercicio(ejercicio.ejercicioRutina_id)">
                  <span>🗑</span> Eliminar
                </button>
              </div>
            </div>
            <div v-else>
              <p>No hay ejercicios disponibles para esta rutina.</p>
            </div>
            <button class="btn-action btn-agregar" @click="abrirModal">
              <span>➕</span> Agregar Ejercicio
            </button>
          </div>
        </div>
      </div>

      <form v-if="modalAgregar" @submit.prevent="addEjercicio" class="form-modal">
        <h2>Agregar Ejercicio</h2>
        <div class="form-group">
          <label for="grupo">Grupo Muscular</label>
          <select
            id="grupo"
            v-model="ejercicios[0].grupoSeleccionado"
            @change="getEjerciciosFiltrados($event.target.value, 0)"
            required
          >
            <option value="" disabled>Selecciona un grupo muscular</option>
            <option
              v-for="grupo in gruposMusculares"
              :key="grupo.id"
              :value="grupo.Categoria.trim()"
            >
              {{ grupo.Categoria.trim() }}
            </option>
          </select>
        </div>

        <div v-if="ejercicios[0].ejerciciosFiltrados.length > 0" class="form-group">
          <label for="ejercicio">Ejercicio</label>
          <select
            id="ejercicio"
            v-model="ejercicios[0].seleccionado"
            required
          >
            <option value="" disabled>Selecciona un ejercicio</option>
            <option
              v-for="ej in ejercicios[0].ejerciciosFiltrados"
              :key="ej.Nombre"
              :value="ej.Nombre"
            >
              {{ ej.Nombre }}
            </option>
          </select>
        </div>

        <div class="form-group" v-if="ejercicios[0].ejerciciosFiltrados.length > 0">
          <label for="series">Número de Series</label>
          <input
            type="number"
            id="series"
            v-model="ejercicios[0].series"
            min="1"
            placeholder="Ej: 3"
            required
          />
        </div>

        <div class="form-buttons">
          <button type="button" class="btn-cerrar" @click="modalAgregar = false">Cerrar</button>
          <button type="submit" class="btn-enviar">Añadir Ejercicio</button>
        </div>
      </form>

      <div v-if="fechaUsada" class="estadisticas-section">
        <h2 class="subtitulo">Última vez realizado: {{ fechaUsada || "No disponible" }}</h2>
        <p v-if="duracion">Duración: {{ duracion }}</p>

        <div class="mb-4">
          <label for="fecha">Seleccionar fecha:</label>
          <input
            type="date"
            id="fecha"
            v-model="fechaSeleccionada"
            @change="getRutina"
          />
        </div>

        <div v-if="rutina.ejercicios?.length && duracion">
          <div
            v-for="ejercicio in rutina.ejercicios"
            :key="ejercicio._id || ejercicio.ejercicioRutina_id"
            class="tarjeta-ejercicio"
          >
            <h4>{{ ejercicio.Nombre }}</h4>
            <p>Descripción: {{ ejercicio.Descripcion }}</p>
            <p>Veces Realizado hoy: {{ Object.keys(ejercicio.estadisticas || {}).length }}</p>

            <div class="estadisticas">
              <h4>Estadísticas</h4>
              <div v-if="Object.keys(ejercicio.estadisticas || {}).length">
                <div
                  v-for="(series, serieId) in ejercicio.estadisticas"
                  :key="serieId"
                  class="serie-block"
                >
                  <h5>Series {{ Object.keys(series || {}).length }}</h5>
                  <ul>
                    <li
                      v-for="(detalle, index) in series"
                      :key="detalle?.id || index"
                    >
                      Peso: {{ detalle.Peso }}kg - Reps: {{ detalle.Repeticiones }}
                    </li>
                  </ul>
                </div>
              </div>
              <div v-else>
                <p>No hay estadísticas disponibles.</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p>No hay estadísticas disponibles en este día.</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";

export default {
  name: "VerEntrenamiento",
  data() {
    return {
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
          `http://localhost:3000/api/rutinas/${this.$route.params.id}`
        );
        this.rutina = response.data[0];

        if(this.rutina.Usuario_id != localStorage.getItem("usuario")) {
          this.$router.push({ name: "error" });
          return;
        }
        if (!this.rutina?.ejercicios?.length) {
          this.isLoading = false;
          return;
        }

        const estadisticasPromises = this.rutina.ejercicios.map(async (ejercicio) => {
          try {
            const res = await axios.post(
              "http://localhost:3000/api/estadisticasEjercicio/getByDate",
              {
                id: ejercicio.ejercicioRutina_id,
                Rutina_id: this.rutina.id,
                fecha: this.fechaSeleccionada,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (!this.fechaUsada && res.data.fecha) {
              this.fechaUsada = res.data.fecha;
            } else if (!this.fechaUsada && this.fechaSeleccionada) {
              this.fechaUsada = this.fechaSeleccionada;
            }

            if (res.data.duracion?.Duracion) {
                const totalSeconds = res.data.duracion.Duracion;
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                this.duracion = `${hours}h ${minutes}m ${seconds}s`;
            } else {
              this.duracion = null;
            }

            ejercicio.estadisticas = res.data.estadisticas || {};
          } catch (error) {
            console.error("Error obteniendo estadísticas:", error);
            ejercicio.estadisticas = {};
          }
        });

        await Promise.all(estadisticasPromises);
      } catch (error) {
        console.error("Error cargando rutina:", error);
      } finally {
        this.isLoading = false;
      }
    },
    abrirModal() {
      this.modalAgregar = true;
      this.getEjercicios();
    },
    getEjercicios() {
      axios
        .get("http://localhost:3000/api/ejercicio/categorias")
        .then((response) => {
          this.gruposMusculares = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getEjerciciosFiltrados(categoria, index) {
      this.ejercicios[index].grupoSeleccionado = categoria;
      this.ejercicios[index].seleccionado = "";
      axios
        .get(`http://localhost:3000/api/ejercicio/${categoria}`)
        .then((response) => {
          this.ejercicios[index].ejerciciosFiltrados = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addEjercicio() {
      const ej = this.ejercicios[0];
      if (
        !ej.grupoSeleccionado ||
        !ej.seleccionado ||
        !ej.series
      ) {
        alert("Debes completar todos los campos");
        return;
      }

      axios
        .post(
          "http://localhost:3000/api/ejercicio",
          {
            Nombre_Rutina: this.rutina.Nombre,
            Nombre_Ejercicio: ej.seleccionado,
            Num_Series: ej.series,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(() => {
          this.modalAgregar = false;
          this.getRutina();
        })
        .catch((error) => {
          console.log("Error añadiendo ejercicio:", error);
        });
    },
    eliminarEjercicio(id) {
      axios
        .delete(`http://localhost:3000/api/ejercicio/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then(() => {
          this.getRutina();
        })
        .catch((error) => {
          console.error("Error eliminando ejercicio:", error);
        });
    },
  },
};
</script>

<style scoped>
.entrenamiento-container {
  margin: 0 2rem;
  padding: 1.2rem 0.5rem;
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
  box-sizing: border-box;
}

.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.titulo-principal {
  font-size: 1.7rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: #222;
}

.descripcion-principal {
  font-size: 1rem;
  color: #555;
  margin-bottom: 1.2rem;
}

.loading-container {
  text-align: center;
  font-size: 1.1rem;
}

.rutinas-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: stretch;
}

.rutina-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 100%;
}

.card-header {
  padding: 1.2rem 1rem 0.7rem 1rem;
  border-bottom: 1px solid #f1f1f1;
}

.rutina-nombre {
  font-size: 1.2rem;
  color: #222;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.card-content {
  padding: 0.7rem 1rem 1.2rem 1rem;
}

.lista-ejercicios {
  margin-top: 0.5rem;
  padding: 0.5rem 0;
  border-top: 1px solid #f1f1f1;
}

.ejercicio-item {
  padding: 0.7rem 0;
  border-bottom: 1px solid #f4f4f4;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-direction: column;
  gap: 0.2rem;
}

.ejercicio-item:last-child {
  border-bottom: none;
}

.ejercicio-info h4 {
  font-size: 1rem;
  color: #222;
  margin-bottom: 0.15rem;
  font-weight: 500;
}

.series-badge {
  display: inline-block;
  background-color: #007bff;
  color: #fff;
  padding: 0.18rem 0.7rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.18rem;
}

.ejercicio-descripcion {
  font-size: 0.95rem;
  color: #555;
  line-height: 1.5;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  margin-top: 0.5rem;
  font-size: 1rem;
  transition: background 0.2s;
}

.btn-agregar {
  background-color: #28a745;
  color: white;
  margin-top: 1rem;
}
.btn-agregar:hover {
  background-color: #218838;
}

.btn-eliminar {
  background-color: #dc3545;
  color: white;
}
.btn-eliminar:hover {
  background-color: #c82333;
}

.form-modal {
  margin: 2rem auto 0 auto;
  padding: 1.2rem;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #ccc;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-group label {
  font-weight: 600;
}

.form-group select,
.form-group input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ced4da;
  box-sizing: border-box;
  font-size: 1rem;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cerrar {
  background-color: #6c757d;
  color: white;
}
.btn-cerrar:hover {
  background-color: #5a6268;
}

.btn-enviar {
  background-color: #007bff;
  color: white;
}
.btn-enviar:hover {
  background-color: #0069d9;
}

.estadisticas-section {
  margin-top: 2rem;
}

.subtitulo {
  margin-top: 20px;
  font-weight: bold;
  color: #222;
  text-align: center;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.tarjeta-ejercicio {
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
}

.estadisticas {
  margin-top: 10px;
  padding-left: 15px;
}

.serie-block {
  margin-bottom: 10px;
  padding: 8px 12px;
  border-left: 4px solid #007bff;
  background-color: #f1f3f5;
  border-radius: 6px;
}
.serie-block h5 {
  margin: 0 0 6px;
  font-weight: 600;
}
.serie-block ul {
  padding-left: 20px;
  margin: 0;
}
.serie-block li {
  list-style-type: disc;
}

/* Tablet */
@media (min-width: 600px) {
  .entrenamiento-container {
    padding: 2rem 2.5rem;
  }
  .rutinas-grid {
    flex-direction: row;
    gap: 1.5rem;
  }
  .rutina-card {
    min-width: 320px;
  }
  .form-modal {
    max-width: 400px;
  }
  .lista-ejercicios {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
  }
  .ejercicio-item {
    flex: 1 1 calc(40% - 0.5rem);
  }
}

/* Desktop */
@media (min-width: 1100px) {
  .entrenamiento-container {
    padding: 2.5rem 0;
  }
  .ejercicio-item {
    flex: 1 1 calc(30% - 0.5rem);
  }
}
</style>
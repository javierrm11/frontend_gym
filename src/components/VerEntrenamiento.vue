<template>
  <div class="entrenamiento">
    <div v-if="isLoading" class="loading-container">
      <p>Cargando datos...</p>
    </div>
    <div v-else>
      <h1 class="titulo">{{ rutina.Nombre }}</h1>
      <p class="descripcion">{{ rutina.Descripcion }}</p>

      <details>
        <summary>Ejercicios</summary>
        <div v-if="rutina.ejercicios?.length">
          <div
            v-for="ejercicio in rutina.ejercicios"
            :key="ejercicio._id"
            class="tarjeta-ejercicio"
          >
            <h2>{{ ejercicio.Nombre }}</h2>
            <p><strong>Descripción:</strong> {{ ejercicio.Descripcion }}</p>
            <p><strong>Series:</strong> {{ ejercicio.Num_Series }}</p>
            <button class="btn-eliminar" @click="eliminarEjercicio(ejercicio.ejercicioRutina_id)">
              Eliminar Ejercicio
            </button>
          </div>
        </div>
        <div v-else>
          <p>No hay ejercicios disponibles para esta rutina.</p>
        </div>
        <button class="btn-agregar" @click="abrirModal">Agregar Ejercicio</button>
      </details>

      <form v-if="modalAgregar" @submit.prevent="addEjercicio" class="form-modal">
        <h2>Agregar Ejercicio</h2>
        <div class="form-group">
          <label for="grupo">Grupo Muscular</label>
          <select
            id="grupo"
            v-model="ejercicios[0].seleccionado"
            @change="getEjerciciosFiltrados($event.target.value, 0)"
          >
            <option value="" disabled selected>Selecciona un grupo muscular</option>
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
          <select v-model="ejercicios[0].ejerciciosFiltrados[0]">
            <option value="" disabled selected>Selecciona un ejercicio</option>
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
          />
        </div>

        <div class="form-buttons">
          <button type="button" class="btn-cerrar" @click="modalAgregar = false">Cerrar</button>
          <button type="submit" class="btn-enviar">Añadir Ejercicio</button>
        </div>
      </form>

      <div v-if="fechaUsada">
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
  </div>
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
          seleccionado: null,
          series: null,
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
      if (!this.ejercicios[0].ejerciciosFiltrados.length ||
          !this.ejercicios[0].seleccionado ||
          !this.ejercicios[0].series) {
        alert("Debes completar todos los campos");
        return;
      }

      axios
        .post(
          "http://localhost:3000/api/ejercicio",
          {
            Nombre_Rutina: this.rutina.Nombre,
            Nombre_Ejercicio: this.ejercicios[0].ejerciciosFiltrados[0],
            Num_Series: this.ejercicios[0].series,
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
.entrenamiento {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: 'Segoe UI', sans-serif;
  background: #f8f9fa;
  border-radius: 10px;
}

.loading-container {
  text-align: center;
  font-size: 1.2rem;
}

.titulo {
  font-size: 2rem;
  margin-bottom: 10px;
  font-weight: 700;
  color: #333;
}

.descripcion {
  margin-bottom: 20px;
  color: #555;
}

.subtitulo {
  margin-top: 20px;
  font-weight: bold;
  color: #222;
}

.tarjeta-ejercicio {
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
}

.btn-agregar,
.btn-eliminar,
.btn-cerrar,
.btn-enviar {
  margin: 10px 5px 0 0;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.btn-agregar {
  background-color: #28a745;
  color: white;
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

.form-modal {
  margin-top: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #ccc;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

.form-group select,
.form-group input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ced4da;
  box-sizing: border-box;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
</style>

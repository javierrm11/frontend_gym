<template>
  <main class="entrenamiento-container">
    <div class="header-section">
      <h2 class="titulo-principal">Detalles de la Rutina</h2>
      <div class="descripcion-principal-container">
        <h3 v-if="rutina.Nombre" class="rutina-nombre">{{ rutina.Nombre }}</h3>
        <p v-if="rutina.Descripcion" class="descripcion-principal">
          {{ rutina.Descripcion }}
        </p>
      </div>
    </div>

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
            </div>
          </div>
          <div v-else>
            <p>No hay ejercicios disponibles para esta rutina.</p>
          </div>
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
}

.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.titulo-principal {
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--color-secondary);
}

.descripcion-principal {
  font-size: 1rem;
  color: var(--color-secondary);
  margin-top: 0.5rem;
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
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 100%;
}

.card-header {
  padding: 1.2rem 1rem 0 1rem;
  text-align: center;
}
.descripcion-principal-container{
  text-align: center;
  font-size: 1rem;
  background: var(--color-accent);
  padding: 0.5rem 1rem;
  place-self: center;
  width: 400px;
  filter: drop-shadow(4px 4px 0px var(--color-secondary));

}
.rutina-nombre {
  font-size: 1.5rem;
  color: var(--color-secondary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card-content {
  padding: 0.7rem 1rem 1.2rem 1rem;
}

.lista-ejercicios {
  margin-top: 0.5rem;
  padding: 0.5rem 0;
  gap: 2rem;
}

.ejercicio-item {
  background: var(--color-secondary);
  padding: 0.8rem 1rem;
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
  font-size: 1.2rem;
  color: var(--color-primary);
  margin: 0.15rem 0;
  font-weight: 500;
}

.series-badge {
  display: inline-block;
  background-color: #007bff;
  color: var(--color-primary);
  padding: 0.18rem 0.7rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.18rem;
}

.ejercicio-descripcion {
  font-size: 0.95rem;
  color: var(--color-primary);
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
<template>
  <main class="entrenamiento-container">
    <div class="header-section">
      <h1 class="titulo-principal">Mis Rutinas</h1>
      <p class="descripcion-principal">Administra y ejecuta tus rutinas personalizadas</p>
      <router-link class="btn-agregar" to="/anadirEntrenamiento">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Nueva Rutina
      </router-link>
    </div>

    <div class="rutinas-grid">
      <div v-for="rutina in rutinas" :key="rutina.id" class="rutina-card">
        <div class="card-header">
          <h3 class="rutina-nombre">{{ rutina.Nombre }}</h3>
          <p class="rutina-descripcion">{{ rutina.Descripcion }}</p>
        </div>

        <div class="card-content">
          <details class="ejercicios-details">
            <summary class="ejercicios-summary">
              <span>Ver ejercicios</span>
              <svg class="dropdown-icon" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </summary>
            <div v-if="rutina.rutinaEjercicio?.length" class="lista-ejercicios">
              <div v-for="ejercicio in rutina.rutinaEjercicio" :key="ejercicio._id" class="ejercicio-item">
                <div class="ejercicio-info">
                  <h4>{{ ejercicio.ejercicio.Nombre }}</h4>
                  <p class="ejercicio-series">
                    <span class="series-badge">{{ ejercicio.Num_Series }} series</span>
                  </p>
                </div>
              </div>
            </div>
          </details>
        </div>

        <div class="card-actions">
          <button class="btn-action btn-ver" @click="verRutina(rutina.id)">
            <span>👁</span> Detalles
          </button>
          <button class="btn-action btn-comenzar" @click="comenzarRutina(rutina.id)">
            <span>🏋️‍♂️</span> Comenzar
          </button>
          <button class="btn-action btn-eliminar" @click="eliminarRutina(rutina.id)">
            <span>🗑</span> Eliminar
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";

export default {
  name: "EntrenamientoGym",
  data() {
    return {
      rutinas: [],
    };
  },
  mounted() {
    this.getRutinas();
  },
  methods: {
    getRutinas() {
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/rutinas/usuario/` + this.$store.state.usuario)
        .then((response) => {
          this.rutinas = response.data;
        })
        .catch((error) => {
          console.log(error);
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
            this.getRutinas();
          })
          .catch((error) => {
            console.log(error);
          });
      }
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
.entrenamiento-container {
  font-family: 'Poppins', sans-serif;
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.titulo-principal {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  background: linear-gradient(to right, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.descripcion-principal {
  font-size: 1.1rem;
  color: var(--color-quinto);
  margin-bottom: 1.5rem;
}

.btn-agregar {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--color-cuarto);
  color: var(--color-secondary);
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 600;
  transition: all var(--transition-speed);
  border: 2px solid transparent;
  text-decoration: none;
}

.btn-agregar:hover {
  background-color: var(--color-quinto);
  color: var(--color-secondary);
  transform: translateY(-2px);
}

/* FLEX en vez de GRID */
.rutinas-grid {
  background: linear-gradient(to right, var(--color-primary), var(--color-accent));
  padding: 2rem 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  align-items: baseline;
}

.rutina-card {
  background-color: var(--color-secondary);
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: transform var(--transition-speed), box-shadow var(--transition-speed);
  display: flex;
  flex-direction: column;
  width: 400px;
}

.rutina-card:hover {
  transform: translateY(-5px);
}

.card-header {
  padding: 0.5rem 1.5rem;
}

.rutina-nombre {
  font-size: 1.4rem;
  background: linear-gradient(to right, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.rutina-descripcion {
  font-size: 0.95rem;
  color: var(--color-quinto);
  line-height: 1.5;
  margin-bottom: 0;
}

.card-content {
  margin-bottom: 1rem;
}


.ejercicios-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-secondary);
  cursor: pointer;
  color: var(--color-accent);
  font-weight: 500;
  list-style: none;
}

.ejercicios-summary::-webkit-details-marker {
  display: none;
}

.dropdown-icon {
  width: 1.25rem;
  height: 1.25rem;
  fill: var(--color-accent);
  transition: transform var(--transition-speed);
}

.ejercicios-details[open] .dropdown-icon {
  transform: rotate(180deg);
}

.lista-ejercicios {
  padding: 0.5rem 1.5rem;
}

.ejercicio-item {
  padding: 0.75rem 0;
}

.ejercicio-item:last-child {
  border-bottom: none;
}

.ejercicio-info h4 {
  font-size: 1rem;
  background: linear-gradient(to right, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.series-badge {
  display: inline-block;
  background-color: var(--color-cuarto);
  color: var(--color-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.card-actions {
  display: flex;
  padding: 1rem 1.5rem;
  margin-top: auto;
  background-color: var(--color-secondary);
  gap: 0.75rem;
}

.btn-action {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: calc(var(--border-radius) / 2);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-speed);
  border: none;
}

.btn-action span {
  font-size: 1.1rem;
}

.btn-ver {
  background-color: var(--color-info);
  color: var(--color-secondary);
}

.btn-ver:hover {
  background-color: #126ab3;
}

.btn-comenzar {
  background-color: var(--color-success);
  color: var(--color-secondary);
}

.btn-comenzar:hover {
  background-color: #005c25;
}

.btn-eliminar {
  background-color: var(--color-error);
  color: var(--color-secondary);
}

.btn-eliminar:hover {
  background-color: #8b1513;
}

@media (max-width: 1100px) {
  .rutinas-grid {
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .entrenamiento-container {
    padding: 1.5rem 1rem;
  }
  .rutinas-grid {
    flex-direction: column;
    align-items: center;
  }
  .rutina-card {
    width: 100%;
    min-width: unset;
    max-width: 100%;
  }
  .card-actions {
    flex-direction: column;
  }
}
</style>
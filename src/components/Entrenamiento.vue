<template>
  <main class="entrenamiento-container">
    <div class="header-section">
      <h1 class="titulo-principal">Mis Rutinas</h1>
      <p class="descripcion-principal">Administra y ejecuta tus rutinas personalizadas</p>
      <router-link class="btn-agregar" to="/anadirEntrenamiento">
        <span>➕</span> Nueva Rutina
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
        .get("http://localhost:3000/api/rutinas/usuario/" + this.$store.state.usuario)
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
          .delete("http://localhost:3000/api/rutinas/" + rutinaId, {
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
  margin: 0 1rem;
  padding: 0 1.5rem;
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
}

.descripcion-principal {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.btn-agregar {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--color-primary);
  color: var(--text-primary);
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 600;
  transition: all var(--transition-speed);
  border: 2px solid transparent;
}

.btn-agregar:hover {
  background-color: var(--color-accent);
  color: var(--color-secondary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(163, 255, 18, 0.2);
}

/* FLEX en vez de GRID */
.rutinas-grid {
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform var(--transition-speed), box-shadow var(--transition-speed);
  display: flex;
  flex-direction: column;
  min-width: 280px;
  max-width: 100%;
}

.rutina-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.rutina-nombre {
  font-size: 1.4rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.rutina-descripcion {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.card-content {
  padding: 0 1.5rem;
}

.ejercicios-details {
  margin: 1rem 0;
}

.ejercicios-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
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
  margin-top: 0.5rem;
  padding: 0.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.ejercicio-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.ejercicio-item:last-child {
  border-bottom: none;
}

.ejercicio-info h4 {
  font-size: 1rem;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.series-badge {
  display: inline-block;
  background-color: var(--color-primary);
  color: var(--text-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.card-actions {
  display: flex;
  padding: 1rem 1.5rem;
  margin-top: auto;
  background-color: rgba(0, 0, 0, 0.1);
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
  background-color: var(--color-primary);
  color: var(--text-primary);
}

.btn-ver:hover {
  background-color: var(--color-accent);
  color: var(--color-secondary);
}

.btn-comenzar {
  background-color: var(--color-success);
  color: var(--text-primary);
}

.btn-comenzar:hover {
  background-color: #00b347;
}

.btn-eliminar {
  background-color: var(--color-error);
  color: var(--text-primary);
}

.btn-eliminar:hover {
  background-color: #e53935;
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
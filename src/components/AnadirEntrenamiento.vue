<template>
  <main class="create-workout-main">
    <!-- Header -->
    <div class="create-header">
      <div class="header-content">
        <h1 class="create-title">Crear Nueva Rutina</h1>
        <p class="create-subtitle">Diseña tu rutina personalizada con los ejercicios que elijas</p>
      </div>
    </div>

    <!-- Formulario -->
    <div class="create-content">
      <form @submit.prevent="onSubmit" class="workout-form">
        <!-- Información de la rutina -->
        <div class="form-section">
          <h2 class="section-title">Información de la Rutina</h2>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="nombre" class="form-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Nombre del entrenamiento
              </label>
              <input
                type="text"
                id="nombre"
                v-model="nombre"
                placeholder="Ej: Rutina de Pecho"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label for="descripcion" class="form-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Descripción
              </label>
              <input
                type="text"
                id="descripcion"
                v-model="descripcion"
                placeholder="Ej: Entrenamiento centrado en el desarrollo de pecho"
                class="form-input"
                required
              />
            </div>
          </div>
        </div>

        <!-- Ejercicios -->
        <div class="form-section">
          <h2 class="section-title">Ejercicios</h2>
          <p class="section-subtitle">Agrega los ejercicios que formarán parte de tu rutina</p>

          <div 
            v-for="(ejercicio, index) in ejercicios" 
            :key="index" 
            class="exercise-card"
          >
            <div class="exercise-header">
              <h3 class="exercise-number">Ejercicio {{ index + 1 }}</h3>
              <button
                v-if="ejercicios.length > 1"
                type="button"
                class="btn-remove-exercise"
                @click="removeExercise(index)"
                title="Eliminar ejercicio"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div class="exercise-content">
              <div class="form-group">
                <label :for="'grupo' + index" class="form-label">Grupo Muscular</label>
                <select
                  :id="'grupo' + index"
                  @change="getEjerciciosFiltrados($event.target.value, index)"
                  :value="ejercicio.grupoSeleccionado || ''"
                  class="form-select"
                  required
                >
                  <option value="" disabled>Selecciona un grupo</option>
                  <option
                    v-for="grupo in gruposMusculares"
                    :key="grupo.id"
                    :value="grupo.Categoria.trim()"
                  >
                    {{ grupo.Categoria.trim() }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label :for="'ejercicio-select' + index" class="form-label">Ejercicio</label>
                <select
                  :id="'ejercicio-select' + index"
                  v-model="ejercicio.seleccionado"
                  :disabled="!ejercicio.ejerciciosFiltrados.length"
                  class="form-select"
                  required
                >
                  <option value="" disabled>Selecciona un ejercicio</option>
                  <option
                    v-for="ej in ejercicio.ejerciciosFiltrados"
                    :key="ej.Nombre"
                    :value="ej.Nombre"
                  >
                    {{ ej.Nombre }}
                  </option>
                </select>
                <p v-if="!ejercicio.ejerciciosFiltrados.length" class="select-hint">
                  Primero selecciona un grupo muscular
                </p>
              </div>

              <div class="form-group">
                <label :for="'series' + index" class="form-label">Número de Series</label>
                <input
                  type="number"
                  :id="'series' + index"
                  v-model="ejercicio.series"
                  min="1"
                  max="20"
                  placeholder="Ej: 3"
                  class="form-input"
                  required
                />
              </div>
            </div>
          </div>

          <button type="button" @click="addExercise" class="btn-add-exercise">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Añadir Ejercicio
          </button>
        </div>

        <!-- Acciones -->
        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="$router.go(-1)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Cancelar
          </button>
          
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="btn-spinner"></span>
            <span v-else>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                <line x1="12" y1="11" x2="12" y2="17"></line>
                <line x1="9" y1="14" x2="15" y2="14"></line>
              </svg>
              Crear Rutina
            </span>
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import { updateLogro } from "@/services/logrosService";

export default {
  name: "AnadirEntrenamiento",
  data() {
    return {
      nombre: "",
      descripcion: "",
      gruposMusculares: [],
      ejercicios: [
        { grupoSeleccionado: "", ejerciciosFiltrados: [], seleccionado: "", series: "" },
      ],
      countRutines: 0,
      isSubmitting: false
    };
  },
  mounted() {
    this.getEjercicios();
  },
  methods: {
    getEjercicios() {
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/ejercicio/categorias`)
        .then(async (response) => {
          this.gruposMusculares = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    
    onSubmit() {
      // Validaciones
      if (this.ejercicios.some(
        (ejercicio) =>
          !ejercicio.seleccionado ||
          !ejercicio.series ||
          !ejercicio.grupoSeleccionado
      )) {
        alert("Debes completar todos los campos de cada ejercicio");
        return;
      }
      
      if (!this.nombre) {
        alert("Debes introducir un nombre para el entrenamiento");
        return;
      }
      
      if (!this.descripcion) {
        alert("Debes introducir una descripción para el entrenamiento");
        return;
      }

      this.isSubmitting = true;
      
      axios
        .post(
          `${process.env.VUE_APP_BASE_URL}/api/rutinas`,
          {
            Nombre: this.nombre,
            Descripcion: this.descripcion,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(async (response) => {
          console.log("Rutina creada:", response.data);
          this.fetchNumberRutines();
          const rutinaNombre = this.nombre;
          const peticiones = this.ejercicios.map((ejercicio) =>
            axios.post(
              `${process.env.VUE_APP_BASE_URL}/api/ejercicio`,
              {
                Nombre_Rutina: rutinaNombre,
                Nombre_Ejercicio: ejercicio.seleccionado,
                Num_Series: ejercicio.series,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
          );
          return Promise.all(peticiones);
        })
        .then(() => {
          alert("Rutina creada con éxito");
          this.$router.push("/entrenamiento");
        })
        .catch((error) => {
          console.log("Error creando rutina:", error);
          alert("Error al crear la rutina");
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
    
    getEjerciciosFiltrados(categoria, index) {
      this.ejercicios[index].grupoSeleccionado = categoria;
      this.ejercicios[index].seleccionado = "";
      
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/ejercicio/${categoria}`)
        .then((response) => {
          this.ejercicios[index].ejerciciosFiltrados = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    
    addExercise() {
      this.ejercicios.push({
        grupoSeleccionado: "",
        ejerciciosFiltrados: [],
        seleccionado: "",
        series: "",
      });
    },
    
    removeExercise(index) {
      this.ejercicios.splice(index, 1);
    },
    
    async fetchNumberRutines() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_BASE_URL}/api/rutinas/count/${this.$store.state.usuario}`, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        this.countRutines = response.data.count;
        console.log("Number of routines:", this.countRutines);
        
        if(this.countRutines == 1){
          updateLogro(3, this.$store.state.usuario);
        }
      } catch (error) {
        console.error("Error obteniendo conteo de rutinas:", error);
      }
    },
  },
};
</script>

<style scoped>
/* Variables de colores */
:root {
  --color-primary: #4a6cf7;
  --color-secondary: #ffffff;
  --color-terciario: #f8f9fa;
  --color-cuarto: #3a57e8;
  --color-quinto: #2d3748;
  --color-sexto: #718096;
  --color-success: #0abf53;
  --color-error: #e24d4c;
  --color-accent: #6c5ce7;
  --border-radius: 12px;
  --transition-speed: 0.3s;
  --shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  --shadow-hover: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.create-workout-main {
  min-height: 100vh;
  background: var(--color-terciario);
  padding-bottom: 2rem;
}

/* Header */
.create-header {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  color: var(--color-secondary);
  padding: 2rem 1rem;
  margin-bottom: 2rem;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.create-title {
  color: var(--color-secondary);
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.create-subtitle {
  color: var(--color-secondary);
  font-size: 1.1rem;
  opacity: 0.9;
}

/* Contenido principal */
.create-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.workout-form {
  background: var(--color-secondary);
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--shadow);
}

/* Secciones del formulario */
.form-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-quinto);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-subtitle {
  color: var(--color-sexto);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

/* Grid del formulario */
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Grupos de formulario */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: var(--color-quinto);
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-input,
.form-select {
  color: var(--color-sexto);
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-terciario);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: all var(--transition-speed);
  background: var(--color-secondary);
  font-family: inherit;
  width: -webkit-fill-available;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.form-input::placeholder {
  color: var(--color-sexto);
}

.form-select:disabled {
  background: var(--color-terciario);
  color: var(--color-sexto);
  cursor: not-allowed;
}

.select-hint {
  font-size: 0.8rem;
  color: var(--color-sexto);
  margin-top: 0.25rem;
  font-style: italic;
}

/* Tarjeta de ejercicio */
.exercise-card {
  background: var(--color-terciario);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.exercise-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #ced2d7;
}

.exercise-number {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-quinto);
  margin: 0;
}

.btn-remove-exercise {
  background: var(--color-error);
  color: var(--color-secondary);
  border: none;
  border-radius: var(--border-radius);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.btn-remove-exercise:hover {
  background: #d73737;
  transform: scale(1.05);
}

.exercise-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .exercise-content {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Botones */
.btn-add-exercise {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-success);
  color: var(--color-secondary);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-speed);
  width: 100%;
  justify-content: center;
}

.btn-add-exercise:hover {
  background: #089e45;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel,
.btn-submit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-speed);
  border: none;
  font-size: 1rem;
}

.btn-cancel {
  background: var(--color-terciario);
  color: var(--color-quinto);
  border: 1px solid #e2e8f0;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-submit {
  background: var(--color-primary);
  color: var(--color-secondary);
}

.btn-submit:hover:not(:disabled) {
  background: var(--color-cuarto);
}

.btn-submit:disabled {
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

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .workout-form {
    padding: 1.5rem;
  }
  
  .exercise-content {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-submit {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .create-header {
    padding: 1.5rem 1rem;
  }
  
  .create-title {
    font-size: 1.75rem;
  }
  
  .create-content {
    padding: 0 0.5rem;
  }
  
  .workout-form {
    padding: 1.25rem;
  }
}
</style>
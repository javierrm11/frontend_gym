<template>
  <main class="anadir-entrenamiento">
    <h1 class="titulo">Añadir Entrenamiento</h1>
    <p class="descripcion">Crea tu rutina desde cero con los ejercicios que elijas.</p>
    <form @submit.prevent="onSubmit" class="formulario">
      <div class="form-group">
        <label for="nombre">Nombre del entrenamiento</label>
        <input
          type="text"
          id="nombre"
          v-model="nombre"
          placeholder="Ej: Rutina de Pecho"
          required
        />
      </div>
      <div class="form-group">
        <label for="descripcion">Descripción</label>
        <input
          type="text"
          id="descripcion"
          v-model="descripcion"
          placeholder="Ej: Entrenamiento centrado en el desarrollo de pecho."
          required
        />
      </div>

      <div
        v-for="(ejercicio, index) in ejercicios"
        :key="index"
        class="ejercicio"
      >
        <div class="ejercicio-header">
          <label :for="'ejercicio' + index">Ejercicio {{ index + 1 }}</label>
          <button
            v-if="ejercicios.length > 1"
            type="button"
            class="btn-remove"
            @click="removeExercise(index)"
            aria-label="Eliminar ejercicio"
          >
            ✖
          </button>
        </div>

        <div class="grupo-muscular">
          <label :for="'grupo' + index">Grupo Muscular</label>
          <select
            :id="'grupo' + index"
            @change="getEjerciciosFiltrados($event.target.value, index)"
            :value="ejercicio.grupoSeleccionado || ''"
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

        <div class="ejercicio-select">
          <label :for="'ejercicio-select' + index">Ejercicio</label>
          <select
            :id="'ejercicio-select' + index"
            v-model="ejercicio.seleccionado"
            :disabled="!ejercicio.ejerciciosFiltrados.length"
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
        </div>

        <div class="form-group">
          <label :for="'series' + index">Número de Series</label>
          <input
            type="number"
            :id="'series' + index"
            v-model="ejercicio.series"
            min="1"
            placeholder="Ej: 3"
            required
          />
        </div>
      </div>

      <button type="button" @click="addExercise" class="btn-agregar">
        + Añadir Ejercicio
      </button>
      <button type="submit" class="btn-enviar">
        Crear Rutina
      </button>
    </form>
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
      if (
        this.ejercicios.some(
          (ejercicio) =>
            !ejercicio.seleccionado ||
            !ejercicio.series ||
            !ejercicio.grupoSeleccionado
        )
      ) {
        alert(
          "Debes seleccionar un grupo muscular, un ejercicio y el número de series para cada ejercicio"
        );
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
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/rutinas/count/${this.$store.state.usuario}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          this.countRutines = response.data.count;
          console.log("Number of routines:", this.countRutines);
          if(this.countRutines == 1){
            updateLogro(3, this.$store.state.usuario);
          }
          
        })
    },
  },
};
</script>

<style scoped>
.anadir-entrenamiento {
  margin: 0 1rem;
  padding: 1.5rem 0.75rem;
  font-family: 'Poppins', sans-serif;
  border-radius: 10px;
  box-sizing: border-box;
}

.titulo {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  background: linear-gradient(to right, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
}

.descripcion {
  margin-bottom: 1.5rem;
  color: var(--color-quinto);
  text-align: center;
}

.formulario {
  background-color: var(--color-secondary);
  padding: 1.25rem;
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  margin-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-group label {
  font-weight: 600;
  color: var(--color-primary);
}

.form-group input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid var(--color-terciario);
  box-sizing: border-box;
  font-size: 1rem;
  color: var(--color-quinto);
}
.form-group input:focus {
  border-color: var(--color-accent);
  outline: none;
}

.ejercicio {
  background-color: var(--color-terciario);
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}

.ejercicio-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn-remove {
  background: var(--color-error);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.btn-remove:hover {
  background: #b71c1c;
}

.grupo-muscular label,
.ejercicio-select label {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

select {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid var(--color-terciario);
  font-size: 1rem;
  background: var(--color-secondary);
}

select:disabled {
  background: var(--color-secondary);
  color: var(--color-quinto);
}
select:focus {
  border-color: var(--color-accent);
  outline: none;
}

.btn-agregar,
.btn-enviar {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-size: 1rem;
}

.btn-agregar {
  background-color: var(--color-success);
  color: var(--color-secondary);
  margin-top: 0.5rem;
}

.btn-agregar:hover {
  background-color: #218838;
}

.btn-enviar {
  background-color: var(--color-cuarto);
  color: var(--color-secondary);
  margin-top: 0.5rem;
}

.btn-enviar:hover {
  background-color: var(--color-quinto);
}

/* Tablet */
@media (min-width: 768px) {
  .anadir-entrenamiento {
    padding: 2rem 1.5rem;
  }
  .formulario {
    padding: 2rem;
    gap: 1.5rem;
  }
}

/* Desktop */
</style>
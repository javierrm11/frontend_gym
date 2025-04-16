<template>
  <div class="anadir-entrenamiento">
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

      <div v-for="(ejercicio, index) in ejercicios" :key="index" class="ejercicio">
        <label :for="'ejercicio' + index">Ejercicio {{ index + 1 }}</label>

        <div class="grupo-muscular">
          <p>Grupo Muscular</p>
          <select :id="'grupo' + index" @change="getEjerciciosFiltrados($event.target.value, index)">
            <option value="" disabled selected>Selecciona un grupo muscular</option>
            <option v-for="grupo in gruposMusculares" :key="grupo.id" :value="grupo.Categoria.trim()">
              {{ grupo.Categoria.trim() }}
            </option>
          </select>
        </div>

        <div class="ejercicio-select">
          <p>Ejercicio</p>
          <select v-if="ejercicio.ejerciciosFiltrados.length > 0" v-model="ejercicio.seleccionado">
            <option value="" disabled selected>Selecciona un ejercicio</option>
            <option v-for="ej in ejercicio.ejerciciosFiltrados" :key="ej.Nombre" :value="ej.Nombre">
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
        Añadir Ejercicio
      </button>
      <button type="submit" class="btn-enviar">
        Crear Rutina
      </button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AnadirEntrenamiento',
  data() {
    return {
      nombre: '',
      descripcion: '',
      gruposMusculares: [],
      ejercicios: [{ ejerciciosFiltrados: [], seleccionado: null }]
    };
  },
  mounted() {
    this.getEjercicios();
  },
  methods: {
    getEjercicios() {
      axios.get('http://localhost:3000/api/ejercicio/categorias')
        .then(response => {
          this.gruposMusculares = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    onSubmit() {
      if (this.ejercicios.some(ejercicio => ejercicio.seleccionado === null)) {
        alert('Debes seleccionar un ejercicio para cada grupo muscular');
        return;
      }
      if(this.ejercicios.some(ejercicio => !ejercicio.series)) {
        alert('Debes introducir el número de series para cada ejercicio');
        return;
      }
      if (!this.nombre) {
        alert('Debes introducir un nombre para el entrenamiento');
        return;
      }
      if(!this.descripcion) {
        alert('Debes introducir una descripción para el entrenamiento');
        return;
      }
      try {
        axios.post("http://localhost:3000/api/rutinas", {
          Nombre: this.nombre,
          Descripcion: this.descripcion
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(response => {
          console.log('Rutina creada:', response.data);
          this.ejercicios.forEach(ejercicio => {
            axios.post("http://localhost:3000/api/ejercicio", {
              Nombre_Rutina: this.nombre,
              Nombre_Ejercicio: ejercicio.seleccionado,
              Num_Series: ejercicio.series
            }, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            })
            .then(response => {
              console.log('Ejercicio añadido:', response.data);
            })
            .catch(error => {
              console.log('Error añadiendo ejercicio:', error);
            });
          });
          alert('Rutina creada con éxito');
          this.$router.push('/entrenamiento');
        })
        .catch(error => {
          console.log('Error creando rutina:', error);
        });
      } catch (error) {
        console.log(error);
      }
    },
    getEjerciciosFiltrados(categoria, index) {
      axios.get(`http://localhost:3000/api/ejercicio/${categoria}`)
        .then(response => {
          this.ejercicios[index].ejerciciosFiltrados = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    addExercise() {
      this.ejercicios.push({ ejerciciosFiltrados: [], seleccionado: null });
    }
  }
};
</script>

<style scoped>
.anadir-entrenamiento {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f8f9fa;
  border-radius: 10px;
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

.formulario {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
  display: block;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ced4da;
  box-sizing: border-box;
}

.ejercicio {
  background-color: #e0e0e0;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
}

.grupo-muscular p, .ejercicio-select p {
  margin: 10px 0;
}

select {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ced4da;
}

.btn-agregar,
.btn-enviar {
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
  margin-top: 15px;
}

.btn-agregar:hover {
  background-color: #218838;
}

.btn-enviar {
  background-color: #007bff;
  color: white;
  margin-top: 15px;
}

.btn-enviar:hover {
  background-color: #0069d9;
}
</style>

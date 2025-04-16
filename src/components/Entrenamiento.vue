<template>
  <div class="entrenamiento-container">
    <h1 class="titulo-principal">Entrenamientos</h1>
    <p class="descripcion-principal">Aquí puedes ver y administrar tus rutinas de entrenamiento.</p>
    <router-link class="btn-agregar" to="/anadirEntrenamiento">➕ Añadir Rutina</router-link>

    <div class="rutinas">
      <div v-for="rutina in rutinas" :key="rutina.id" class="rutina-card">
        <h3 class="rutina-nombre">{{ rutina.Nombre }}</h3>
        <p class="rutina-descripcion">{{ rutina.Descripcion }}</p>

        <div v-if="rutina.rutinaEjercicio?.length" class="lista-ejercicios">
          <div v-for="ejercicio in rutina.rutinaEjercicio" :key="ejercicio._id" class="ejercicio-item">
            <h4>{{ ejercicio.ejercicio.Nombre }}</h4>
            <p class="ejercicioSeries">Series: {{ ejercicio.Num_Series }}</p>
          </div>
        </div>

        <div class="botones-rutina">
          <button class="btn-ver" @click="verRutina(rutina.id)">👁 Ver Rutina</button>
          <button class="btn-comenzar" @click="comenzarRutina(rutina.id)">🏋️‍♂️ Comenzar</button>
          <button class="btn-eliminar" @click="eliminarRutina(rutina.id)">🗑 Eliminar</button>
        </div>
      </div>
    </div>
  </div>
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
      axios
        .delete("http://localhost:3000/api/rutinas/" + rutinaId, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          this.getRutinas();
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: 'Segoe UI', sans-serif;
  background-color: #121212;
  color: #f0f0f0;
}

.titulo-principal {
  font-size: 2.5rem;
  color: #ff4141;
  margin-bottom: 10px;
}

.descripcion-principal {
  font-size: 1rem;
  margin-bottom: 20px;
  color: #ccc;
}

.btn-agregar {
  display: inline-block;
  background-color: #ff4141;
  color: white;
  padding: 10px 16px;
  border-radius: 10px;
  text-decoration: none;
  margin-bottom: 30px;
  transition: 0.3s ease;
}

.btn-agregar:hover {
  background-color: #e63636;
}

.rutinas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  gap: 20px;
}

.rutina-card {
  background-color: #1e1e1e;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(255, 65, 65, 0.3);
  transition: transform 0.3s;
}

.rutina-card:hover {
  transform: scale(1.02);
}

.rutina-nombre {
  font-size: 1.5rem;
  color: #ff4141;
  margin-bottom: 10px;
}

.rutina-descripcion {
  font-size: 0.95rem;
  color: #aaa;
  margin-bottom: 15px;
}

.lista-ejercicios {
  margin-top: 10px;
}

.ejercicio-item {
  background-color: #2a2a2a;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
}

.ejercicioSeries {
  font-size: 0.9rem;
  color: #ccc;
}

.botones-rutina {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}

button {
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s ease;
}

.btn-ver {
  background-color: #444;
  color: #fff;
}

.btn-ver:hover {
  background-color: #666;
}

.btn-comenzar {
  background-color: #28a745;
  color: white;
}

.btn-comenzar:hover {
  background-color: #218838;
}

.btn-eliminar {
  background-color: #dc3545;
  color: white;
}

.btn-eliminar:hover {
  background-color: #c82333;
}
</style>

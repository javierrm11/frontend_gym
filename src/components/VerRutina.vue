<template>
    <main class="ver-rutina-container">
      <div class="header-section">
        <h1 class="titulo-principal">{{ rutina?.Nombre || "Cargando rutina..." }}</h1>
        <p class="descripcion-principal">
          {{ rutina?.Descripcion || "Por favor espera mientras cargamos los detalles de la rutina." }}
        </p>
      </div>
  
      <div v-if="ejercicios?.length" class="rutinas-grid">
        <div class="ejercicio-item" v-for="ejercicio in ejercicios" :key="ejercicio.id">
          <div class="ejercicio-info">
            <h4>{{ ejercicio.Nombre }}</h4>
            <p class="ejercicio-descripcion">Descripción: {{ ejercicio.Descripcion }}</p>
            <p class="ejercicio-categoria">Categoría: {{ ejercicio.Categoria }}</p>
            <p class="series-badge">Series: {{ ejercicio.Num_Series }}</p>
          </div>
        </div>
      </div>
  
      <div v-else class="empty-state">
        <p>Cargando ejercicios o no hay ejercicios disponibles para esta rutina.</p>
      </div>
  
      <div class="acciones">
        <button class="btn-copiar" @click="copiarRutina(rutina)">Copiar Rutina</button>
      </div>
    </main>
  </template>

<script>
import axios from "axios";

export default {
    name: 'VerRutina',
    mounted() {
        this.obtenerRutina();
    },
    data() {
        return {
            rutina: null,
            ejercicios: []
        }
    },
    methods: {
        obtenerRutina() {
            const id = this.$route.params.id;
            axios.get(`http://localhost:3000/api/rutinas/${id}`)
                .then(response => {
                    this.rutina = response.data[0];
                    this.ejercicios = response.data[0].ejercicios;
                })
                .catch(error => {
                    console.error("Error al obtener la rutina:", error);
                });
        },
        copiarRutina(rutina){
            axios.post("http://localhost:3000/api/rutinas", {
                Nombre: rutina.Nombre,
                Descripcion: rutina.Descripcion,
            },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => {
                this.rutina.ejercicios.forEach(ejercicio => {
                    axios.post("http://localhost:3000/api/ejercicio", {
                        Nombre_Rutina: response.data.Nombre,
                        Nombre_Ejercicio: ejercicio.Nombre,
                        Descripcion: ejercicio.Descripcion,
                        Num_Series: ejercicio.Num_Series
                    },{
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                    .then(response => {
                        console.log('Ejercicio copiado:', response.data);
                    })
                    .catch(error => {
                        console.log('Error copiando ejercicio:', error);
                    });
                })
            })
            .catch(error => {
                console.log('Error copiando rutina:', error);
            });
        }
    }
}
</script>

<style scoped>
.ver-rutina-container {
  font-family: 'Poppins', sans-serif;
  margin: 0 auto;
  padding: 2rem 1rem;
  max-width: 800px;
}

.header-section {
  text-align: center;
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: linear-gradient(to right, var(--color-primary), var(--color-accent));
  border-radius: var(--border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.titulo-principal {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-secondary);
  margin-bottom: 1rem;
}

.descripcion-principal {
  font-size: 1.1rem;
  color: var(--color-secondary);
  line-height: 1.6;
  margin-top: 0.5rem;
}

.rutinas-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.rutina-card {
  background-color: var(--color-secondary);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.rutina-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 1.5rem;
  text-align: center;
  border-bottom: 1px solid var(--color-terciario);
}

.rutina-nombre {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.card-content {
  padding: 1.5rem;
}

.lista-ejercicios {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.2rem;
  margin-top: 1rem;
}

.ejercicio-item {
  background: var(--color-primary);
  padding: 1.2rem;
  border-radius: calc(var(--border-radius) - 4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.ejercicio-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.ejercicio-info h4 {
  font-size: 1.2rem;
  color: var(--color-secondary);
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.series-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-secondary);
  color: var(--color-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.ejercicio-descripcion {
  font-size: 0.95rem;
  color: var(--color-secondary);
  line-height: 1.6;
  opacity: 0.9;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-secondary);
  opacity: 0.7;
}

/* Responsividad */
@media (min-width: 768px) {
  .lista-ejercicios {
    grid-template-columns: repeat(2, 1fr);
  }

  .titulo-principal {
    font-size: 2.2rem;
  }

  .descripcion-principal {
    font-size: 1.1rem;
  }
}

@media (min-width: 1024px) {
  .lista-ejercicios {
    grid-template-columns: repeat(3, 1fr);
  }

  .rutina-nombre {
    font-size: 1.6rem;
  }

  .ejercicio-info h4 {
    font-size: 1.25rem;
  }
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ejercicio-item {
  animation: fadeIn 0.4s ease forwards;
}

.ejercicio-item:nth-child(1) {
  animation-delay: 0.1s;
}
.ejercicio-item:nth-child(2) {
  animation-delay: 0.2s;
}
.ejercicio-item:nth-child(3) {
  animation-delay: 0.3s;
}
.ejercicio-item:nth-child(4) {
  animation-delay: 0.4s;
}
.ejercicio-item:nth-child(5) {
  animation-delay: 0.5s;
}
.ejercicio-item:nth-child(6) {
  animation-delay: 0.6s;
}

/* Loading Spinner */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-terciario);
  border-top: 4px solid var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
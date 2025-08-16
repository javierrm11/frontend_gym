<template>
    <main class="categoria-container">
      <div class="header-section">
        <h1 class="titulo-categoria">{{ nombre }}</h1>
        <p class="contador-ejercicios">{{ ejercicios.length }} ejercicios disponibles</p>
      </div>
  
      <div v-if="ejercicios.length === 0" class="sin-ejercicios">
        <p>No se encontraron ejercicios en esta categoría</p>
      </div>
  
      <div class="ejercicios-grid">
        <div 
          v-for="ejercicio in ejercicios" 
          :key="ejercicio.id" 
          class="ejercicio-card"
          @click="$router.push(`/ejercicio/${ejercicio.id}`)"
        >
          <div class="ejercicio-imagen-container">
            <img 
              :src="`/ejercicios/${ejercicio.Categoria}/${ejercicio.Foto}`" 
              :alt="`Imagen de ${ejercicio.Nombre}`"
              class="ejercicio-imagen"
              loading="lazy"
            />
          </div>
          <div class="ejercicio-content">
            <h3 class="ejercicio-nombre">{{ ejercicio.Nombre }}</h3>
            <p class="ejercicio-descripcion">{{ truncateDescription(ejercicio.Descripcion) }}</p>
          </div>
        </div>
      </div>
    </main>
  </template>
  
  <script>
  import axios from "axios";
  export default {
    name: 'CategoriaPage',
    data() {
      return {
        nombre: this.$route.params.nombre,
        ejercicios: []
      }
    },
    mounted() {
      this.obtenerEjerciciosPorCategoria();
    },
    methods: {
      obtenerEjerciciosPorCategoria() {
        const grupo = this.$route.params.nombre;
        axios.get(`${process.env.VUE_APP_BASE_URL}/api/ejercicio/${grupo}`)
        .then(response => {
          this.ejercicios = response.data;
        })
        .catch(error => {
          console.error("Error al obtener los ejercicios:", error);
        });
      },
      truncateDescription(desc) {
        if (!desc) return '';
        return desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
      }
    }
  }
  </script>
  
  <style scoped>
  .categoria-container {
    padding: 1rem;
    max-width: 1400px;
    margin: 0 auto;
    font-family: 'Poppins', sans-serif;
  }
  
  .header-section {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .titulo-categoria {
    font-size: 2rem;
    font-weight: 700;
    text-transform: capitalize;
    margin-bottom: 0.5rem;
  }
  
  .contador-ejercicios {
    font-size: 1rem;
    color: var(--text-secondary);
  }
  
  .sin-ejercicios {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
  }
  
  .ejercicios-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }
  
  .ejercicio-card {
    background-color: var(--color-secondary);
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    width: 100%;
    max-width: 350px;
    cursor: pointer;
  }
  
  .ejercicio-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  .ejercicio-imagen-container {
    width: 100%;
    height: 180px;
    overflow: hidden;
  }
  
  .ejercicio-imagen {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .ejercicio-card:hover .ejercicio-imagen {
    transform: scale(1.05);
  }
  
  .ejercicio-content {
    padding: 1.2rem;
  }
  
  .ejercicio-nombre {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }
  
  .ejercicio-descripcion {
    font-size: 0.9rem;
    color: var(--text-secondary);
    line-height: 1.5;
  }
  
  /* Media queries para responsive design */
  @media (min-width: 480px) {
    .ejercicios-grid {
      justify-content: flex-start;
    }
    
    .ejercicio-card {
      width: calc(50% - 0.5rem);
    }
  }
  
  @media (min-width: 768px) {
    .categoria-container {
      padding: 1.5rem;
    }
    
    .titulo-categoria {
      font-size: 2.5rem;
    }
    
    .ejercicio-card {
      width: calc(33.333% - 0.67rem);
    }
    
    .ejercicio-imagen-container {
      height: 200px;
    }
  }
  
  @media (min-width: 1024px) {
    .ejercicio-card {
      width: calc(25% - 0.75rem);
    }
    
    .ejercicio-imagen-container {
      height: 220px;
    }
  }
  
  @media (min-width: 1200px) {
    .categoria-container {
      padding: 2rem;
    }
  }
  </style>
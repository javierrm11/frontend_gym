<template>
  <main class="category-main">
    <!-- Header de la categoría -->
    <div class="category-header">
      <div class="header-content">
        <div class="breadcrumb">
          <div  class="breadcrumb-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Ejercicios
          </div>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">{{ formattedCategory }}</span>
        </div>
        
        <h1 class="category-title">{{ formattedCategory }}</h1>
        <p class="category-count">{{ ejercicios.length }} ejercicio{{ ejercicios.length !== 1 ? 's' : '' }} disponible{{ ejercicios.length !== 1 ? 's' : '' }}</p>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="category-content">
      <!-- Estado vacío -->
      <div v-if="ejercicios.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h2>No se encontraron ejercicios</h2>
        <p>No hay ejercicios disponibles en esta categoría en este momento.</p>
        <router-link to="/ejercicios" class="btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H6M12 5l-7 7 7 7"/>
          </svg>
          Volver a ejercicios
        </router-link>
      </div>

      <!-- Grid de ejercicios -->
      <div v-else class="exercises-grid">
        <div 
          v-for="ejercicio in ejercicios" 
          :key="ejercicio.id" 
          class="exercise-card"
          @click="$router.push(`/ejercicio/${ejercicio.id}`)"
        >
          <div class="exercise-image-container">
            <img 
              :src="getExerciseImage(ejercicio)" 
              :alt="`Imagen de ${ejercicio.Nombre}`"
              class="exercise-image"
              loading="lazy"
              @error="handleImageError"
            />
            <div class="exercise-overlay">
              <span class="view-button">Ver detalles</span>
            </div>
          </div>
          
          <div class="exercise-content">
            <h3 class="exercise-name">{{ ejercicio.Nombre }}</h3>
            <p class="exercise-description">{{ truncateDescription(ejercicio.Descripcion) }}</p>
            
            <div class="exercise-meta">
              <span class="exercise-category">{{ ejercicio.Categoria }}</span>
            </div>
          </div>
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
      ejercicios: [],
      loading: true
    }
  },
  computed: {
    formattedCategory() {
      // Convertir a formato título (primera letra mayúscula)
      return this.nombre.charAt(0).toUpperCase() + this.nombre.slice(1).toLowerCase();
    }
  },
  mounted() {
    this.obtenerEjerciciosPorCategoria();
  },
  methods: {
    obtenerEjerciciosPorCategoria() {
      const grupo = this.$route.params.nombre;
      this.loading = true;
      
      axios.get(`${process.env.VUE_APP_BASE_URL}/api/ejercicio/${grupo}`)
        .then(response => {
          this.ejercicios = response.data;
        })
        .catch(error => {
          console.error("Error al obtener los ejercicios:", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    
    getExerciseImage(ejercicio) {
      // Intentar cargar la imagen desde la ruta específica
      const imagePath = `/ejercicios/${ejercicio.Categoria}/${ejercicio.Foto}`;
      
      // Si no hay foto específica, usar una imagen por defecto
      
      return imagePath;
    },
    
    handleImageError(event) {
      event.target.src = require('@/assets/default.webp');
      
      
    },
    
    truncateDescription(desc) {
      if (!desc) return 'Este ejercicio no tiene descripción.';
      return desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
    }
  }
}
</script>

<style scoped>
.category-main {
  min-height: 100vh;
  background: var(--color-terciario);
}

/* Header de la categoría */
.category-header {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  color: var(--color-secondary);
  padding: 2rem 1rem;
  margin-bottom: 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-secondary);
  text-decoration: none;
  opacity: 0.8;
  transition: opacity var(--transition-speed);
}

.breadcrumb-link:hover {
  opacity: 1;
}

.breadcrumb-separator {
  opacity: 0.6;
}

.breadcrumb-current {
  font-weight: 500;
  opacity: 0.9;
}

.category-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.category-count {
  color: var(--color-secondary);
  font-size: 1.1rem;
  opacity: 0.9;
}

/* Contenido principal */
.category-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

/* Estado vacío */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-sexto);
}

.empty-state svg {
  margin-bottom: 1.5rem;
  color: #cbd5e0;
}

.empty-state h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-quinto);
}

.empty-state p {
  margin-bottom: 2rem;
  max-width: 400px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-primary);
  color: var(--color-secondary);
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 500;
  transition: all var(--transition-speed);
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background: var(--color-cuarto);
  transform: translateY(-2px);
}

/* Grid de ejercicios */
.exercises-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.exercise-card {
  background: var(--color-secondary);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: all var(--transition-speed);
  cursor: pointer;
}

.exercise-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-hover);
}

.exercise-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.exercise-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-speed);
}

.exercise-card:hover .exercise-image {
  transform: scale(1.05);
}

.exercise-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-speed);
}

.exercise-card:hover .exercise-overlay {
  opacity: 1;
}

.view-button {
  color: var(--color-secondary);
  background: var(--color-primary);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-weight: 500;
}

.exercise-content {
  padding: 1.25rem;
}

.exercise-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-quinto);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.exercise-description {
  color: var(--color-sexto);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.exercise-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.exercise-category {
  background: var(--color-terciario);
  color: var(--color-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .category-header {
    padding: 1.5rem 1rem;
  }
  
  .category-title {
    font-size: 1.75rem;
  }
  
  .exercises-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .exercise-image-container {
    height: 180px;
  }
}

@media (max-width: 480px) {
  .exercises-grid {
    grid-template-columns: 1fr;
  }
  
  .category-title {
    font-size: 1.5rem;
  }
  
  .breadcrumb {
    font-size: 0.8rem;
  }
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.exercise-card {
  animation: fadeIn 0.5s ease forwards;
}

.exercise-card:nth-child(1) { animation-delay: 0.1s; }
.exercise-card:nth-child(2) { animation-delay: 0.2s; }
.exercise-card:nth-child(3) { animation-delay: 0.3s; }
.exercise-card:nth-child(4) { animation-delay: 0.4s; }
.exercise-card:nth-child(5) { animation-delay: 0.5s; }
.exercise-card:nth-child(6) { animation-delay: 0.6s; }

/* Estado de carga */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(74, 108, 247, 0.1);
  border-radius: 50%;
  border-top-color: var(--color-primary);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
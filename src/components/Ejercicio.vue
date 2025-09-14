<template>
    <main class="exercise-main">
      <!-- Header del ejercicio -->
      <div class="exercise-header">
        <div class="header-content">
          <div class="breadcrumb">
            <router-link to="/ejercicios" class="breadcrumb-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Ejercicios
            </router-link>
            <span class="breadcrumb-separator">/</span>
            <router-link :to="`/categoria/${ejercicio?.Categoria}`" class="breadcrumb-link">
              {{ ejercicio?.Categoria || 'Categoría' }}
            </router-link>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">{{ ejercicio?.Nombre }}</span>
          </div>
        </div>
      </div>
  
      <!-- Contenido principal -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Cargando ejercicio...</p>
      </div>
  
      <div v-else-if="!ejercicio" class="error-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h2>Ejercicio no encontrado</h2>
        <p>El ejercicio que buscas no existe o no está disponible.</p>
        <router-link to="/ejercicios" class="btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H6M12 5l-7 7 7 7"/>
          </svg>
          Volver a ejercicios
        </router-link>
      </div>
  
      <div v-else class="exercise-content">
        <div class="exercise-details">
          <!-- Imagen del ejercicio -->
          <div class="exercise-image-container">
            <img 
              :src="getExerciseImage(ejercicio)" 
              :alt="`Imagen de ${ejercicio.Nombre}`"
              class="exercise-image"
              @error="handleImageError"
            />
          </div>
  
          <!-- Información del ejercicio -->
          <div class="exercise-info">
            <h1 class="exercise-title">{{ ejercicio.Nombre }}</h1>
            
            <div class="exercise-meta">
              <span class="exercise-category">{{ ejercicio.Categoria }}</span>
            </div>
  
            <div class="exercise-description">
              <h3>Descripción</h3>
              <p>{{ ejercicio.Descripcion || 'Este ejercicio no tiene descripción.' }}</p>
            </div>
  
            <div class="exercise-instructions">
              <h3>Instrucciones</h3>
              <ol v-if="ejercicio.Instrucciones && ejercicio.Instrucciones.length > 0">
                <li v-for="(step, index) in ejercicio.Instrucciones" :key="index">{{ step }}</li>
              </ol>
              <p v-else>No hay instrucciones disponibles para este ejercicio.</p>
            </div>
          </div>
        </div>
  
        <!-- Ejercicios relacionados -->
        <div v-if="relatedExercises.length > 0" class="related-exercises">
          <h2>Ejercicios relacionados</h2>
          <div class="related-grid">
            <div 
              v-for="related in relatedExercises" 
              :key="related.id" 
              class="related-card"
              @click="$router.push(`/ejercicio/${related.id}`)"
            >
              <div class="related-image-container">
                <img 
                  :src="getExerciseImage(related)" 
                  :alt="`Imagen de ${related.Nombre}`"
                  class="related-image"
                  loading="lazy"
                  @error="handleImageError"
                />
              </div>
              <div class="related-content">
                <h4 class="related-name">{{ related.Nombre }}</h4>
                <span class="related-category">{{ related.Categoria }}</span>
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
    name: 'EjercicioPage',
    data() {
      return {
        ejercicio: null,
        relatedExercises: [],
        loading: true,
        error: null
      }
    },
    mounted() {
      this.obtenerEjercicio();
    },
    watch: {
      '$route.params.id': function() {
        this.obtenerEjercicio();
      }
    },
    methods: {
      obtenerEjercicio() {
        const ejercicioId = this.$route.params.id;
        this.loading = true;
        this.ejercicio = null;
        this.error = null;
        
        axios.get(`${process.env.VUE_APP_BASE_URL}/api/ejercicio/detalle/${ejercicioId}`)
          .then(response => {
            this.ejercicio = response.data;
            this.obtenerEjerciciosRelacionados();
          })
          .catch(error => {
            console.error("Error al obtener el ejercicio:", error);
            this.error = error;
          })
          .finally(() => {
            this.loading = false;
          });
      },
      
      obtenerEjerciciosRelacionados() {
        if (!this.ejercicio) return;
        
        axios.get(`${process.env.VUE_APP_BASE_URL}/api/ejercicio/${this.ejercicio.Categoria}`)
          .then(response => {
            // Filtrar el ejercicio actual y limitar a 4 ejercicios relacionados
            this.relatedExercises = response.data
              .filter(ej => ej.id !== this.ejercicio.id)
              .slice(0, 3);
          })
          .catch(error => {
            console.error("Error al obtener ejercicios relacionados:", error);
          });
      },
      
      getExerciseImage(ejercicio) {
        // Intentar cargar la imagen desde la ruta específica
        const imagePath = `/ejercicios/${ejercicio.Categoria}/${ejercicio.Foto}`;
        
        // Si no hay foto específica, usar una imagen por defecto
        return imagePath;
      },
      
      handleImageError(event) {
        // Establecer una imagen por defecto si la carga falla
        event.target.src = '/images/ejercicio-default.jpg';
      },
      
      getDifficultyClass(dificultad) {
        const difficultyMap = {
          'Principiante': 'difficulty-beginner',
          'Intermedio': 'difficulty-intermediate',
          'Avanzado': 'difficulty-advanced'
        };
        
        return difficultyMap[dificultad] || 'difficulty-beginner';
      },
      
      getMusclesList(musculos) {
        if (!musculos) return [];
        // Suponiendo que los músculos vienen como string separado por comas
        return musculos.split(',').map(m => m.trim());
      }
    }
  }
  </script>
  
  <style scoped>

  
  .exercise-main {
    min-height: 100vh;
    background: var(--color-terciario);
    padding-bottom: 2rem;
  }
  
  /* Header del ejercicio */
  .exercise-header {
    background: var(--color-secondary);
    box-shadow: var(--shadow);
    padding: 1rem 0;
    margin-bottom: 2rem;
  }
  
  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }
  
  .breadcrumb-link {
    color: var(--color-primary);
    text-decoration: none;
    transition: color var(--transition-speed);
  }
  
  .breadcrumb-link:hover {
    color: var(--color-cuarto);
  }
  
  .breadcrumb-separator {
    color: var(--color-sexto);
  }
  
  .breadcrumb-current {
    color: var(--color-quinto);
    font-weight: 500;
  }
  
  /* Estados de carga y error */
  .loading-state, .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 3rem 1rem;
    color: var(--color-sexto);
  }
  
  .loading-state svg, .error-state svg {
    margin-bottom: 1.5rem;
    color: #cbd5e0;
  }
  
  .loading-state h2, .error-state h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--color-quinto);
  }
  
  .loading-state p, .error-state p {
    margin-bottom: 2rem;
    max-width: 400px;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(74, 108, 247, 0.1);
    border-radius: 50%;
    border-top-color: var(--color-primary);
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* Contenido del ejercicio */
  .exercise-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .exercise-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 3rem;
  }
  
  .exercise-image-container {
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: var(--shadow);
  }
  
  .exercise-image {
    width: 100%;
    height: auto;
    display: block;
  }
  
  .exercise-info {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .exercise-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-quinto);
    margin-bottom: 0.5rem;
  }
  
  .exercise-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .exercise-category {
    background: var(--color-terciario);
    color: var(--color-primary);
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .exercise-difficulty {
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .difficulty-beginner {
    background: rgba(10, 191, 83, 0.1);
    color: var(--color-success);
  }
  
  .difficulty-intermediate {
    background: rgba(247, 144, 9, 0.1);
    color: #f79009;
  }
  
  .difficulty-advanced {
    background: rgba(226, 77, 76, 0.1);
    color: var(--color-error);
  }
  
  .exercise-info h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-quinto);
    margin-bottom: 0.75rem;
  }
  
  .exercise-info p, .exercise-info ol {
    color: var(--color-sexto);
    line-height: 1.6;
  }
  
  .exercise-info ol {
    padding-left: 1.5rem;
  }
  
  .exercise-info li {
    margin-bottom: 0.5rem;
  }
  
  .muscles-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .muscle-tag {
    background: var(--color-terciario);
    color: var(--color-quinto);
    padding: 0.4rem 0.8rem;
    border-radius: 1rem;
    font-size: 0.85rem;
    font-weight: 500;
  }
  
  /* Ejercicios relacionados */
  .related-exercises {
    margin-top: 2rem;
  }
  
  .related-exercises h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-quinto);
    margin-bottom: 1.5rem;
  }
  
  .related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .related-card {
    background: var(--color-secondary);
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: all var(--transition-speed);
    cursor: pointer;
  }
  
  .related-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-hover);
  }
  
  .related-image-container {
    width: 100%;
    height: 160px;
    overflow: hidden;
  }
  
  .related-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-speed);
  }
  
  .related-card:hover .related-image {
    transform: scale(1.05);
  }
  
  .related-content {
    padding: 1rem;
  }
  
  .related-name {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-quinto);
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }
  
  .related-category {
    background: var(--color-terciario);
    color: var(--color-primary);
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  /* Responsive */
  @media (max-width: 968px) {
    .exercise-details {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .exercise-title {
      font-size: 1.75rem;
    }
  }
  
  @media (max-width: 768px) {
    .related-grid {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }
    
    .exercise-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }
  
  @media (max-width: 480px) {
    .exercise-title {
      font-size: 1.5rem;
    }
    
    .related-grid {
      grid-template-columns: 1fr;
    }
    
    .breadcrumb {
      font-size: 0.8rem;
      flex-wrap: wrap;
    }
  }
  </style>
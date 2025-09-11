<template>
  <main class="rutinas-container">
    <!-- Header con título y buscador -->
    <div class="rutinas-header">
      <h1 class="rutinas-titulo">Explora Rutinas de Entrenamiento</h1>
      <p class="rutinas-subtitulo">Descubre rutinas creadas por nuestra comunidad fitness</p>
      
      <form class="rutinas-buscar" @submit.prevent="rutinasUsuarios(busqueda)">
        <div class="buscar-container">
          <input
            type="text"
            v-model="busqueda"
            placeholder="Buscar rutinas por nombre, usuario o ejercicio..."
            class="rutinas-buscar-input"
          />
          <button type="submit" class="rutinas-buscar-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </form>
    </div>

    <div class="rutinas-content">
      <section class="rutinas-listado">
        <!-- Filtros móviles -->
        <div class="filtros-mobile">
          <h3 class="filtros-titulo">Categorías</h3>
          <select class="filtros-select" @change="ejerciciosCategoria($event.target.value)">
            <option v-for="grupo in grupos" :key="grupo.id" :value="grupo.grupo">
              {{ grupo.grupo }}
            </option>
          </select>
        </div>

        <!-- Estado de carga y vacío -->
        <div v-if="cargando" class="estado-carga">
          <div class="carga-spinner"></div>
          <p>Cargando rutinas...</p>
        </div>

        <div v-else-if="rutinas.length === 0" class="estado-vacio">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <h3>No se encontraron rutinas</h3>
          <p>Intenta con otros términos de búsqueda o crea la primera rutina.</p>
        </div>

        <!-- Listado de rutinas -->
        <div v-else class="rutinas-grid">
          <article
            v-for="rutina in rutinas"
            :key="rutina.id"
            class="rutina-card"
          > <div>
              <div class="rutina-card-header">
                <div class="rutina-user-info">
                  <img :src="rutina.Foto" alt="Foto usuario" class="rutina-avatar" />
                  <div>
                    <h3 class="rutina-nombre">{{ rutina.Nombre_Usuario }}</h3>
                    <p class="rutina-ejercicios-count">{{ rutina.rutinas.length }} ejercicios</p>
                  </div>
                </div>
                <button class="rutina-perfil-btn" @click="verUsuario(rutina.id)">
                  <span>Ver perfil</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </div>

              <div class="rutina-content">
                <h4 class="rutina-titulo">Rutinas de {{ rutina.Nombre_Usuario }}</h4>
                
                <ul class="rutina-ejercicios">
                  <li
                    v-for="ejercicio in rutina.rutinas.slice(0, 3)"
                    :key="ejercicio.id"
                    class="rutina-ejercicio"
                    @click="verRutina(ejercicio.id)"
                  >
                    <span class="ejercicio-nombre">{{ ejercicio.Nombre }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </li>
                  
                  <li v-if="rutina.rutinas.length > 3" class="rutina-mas-ejercicios">
                    +{{ rutina.rutinas.length - 3 }} más
                  </li>
                </ul>
              </div>
            </div>

            <div class="rutina-footer">
              <button class="rutina-ver-todas" @click="verUsuario(rutina.id)">
                Ver todas las rutinas
              </button>
            </div>
          </article>
        </div>
      </section>

      <aside class="rutinas-categorias">
        <div class="categorias-sticky">
          <h2 class="categorias-titulo">Grupos musculares</h2>
          
          <div class="categorias-lista">
            <button
              v-for="grupo in grupos"
              :key="grupo.id"
              class="categoria-btn"
              @click="ejerciciosCategoria(grupo.grupo)"
            >
              <span class="categoria-nombre">{{ grupo.grupo }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </div>
  </main>
</template>

<script>
import axios from "axios";

export default {
  name: "IndexPage",
  data() {
    return {
      grupos: [],
      rutinas: [],
      busqueda: "",
      cargando: false,
    };
  },
  mounted() {
    this.rutinasUsuarios();
    this.obtenerGrupos();
  },
  methods: {
    obtenerGrupos() {
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/rutinas/index`)
        .then((response) => {
          this.grupos = response.data;
        })
        .catch(console.error);
    },
    rutinasUsuarios(busqueda) {
      this.cargando = true;
      const url = busqueda
        ? `${process.env.VUE_APP_BASE_URL}/api/rutinas?busqueda=${busqueda}`
        : `${process.env.VUE_APP_BASE_URL}/api/rutinas`;

      axios
        .get(url)
        .then((response) => {
          this.rutinas = response.data.map((rutina) => ({
            ...rutina,
            Foto: rutina.Foto
              ? `${process.env.VUE_APP_BASE_URL}${rutina.Foto}`
              : require("@/assets/users/predeterminada.png"),
          }));
        })
        .catch(console.error)
        .finally(() => {
          this.cargando = false;
        });
    },
    ejerciciosCategoria(grupo) {
      if (!grupo) return;
      this.$router.push({ name: "Categoria", params: { nombre: grupo } });
    },
    verUsuario(id) {
      this.$router.push({ name: "OtherUser", params: { id } });
    },
    verRutina(id) {
      this.$router.push({ name: "VerRutina", params: { id } });
    },
  },
};
</script>

<style scoped>
.rutinas-container {
  min-height: 100vh;
  background: var(--color-terciario);
  padding: 0;
}

/* Header */
.rutinas-header {
  background: var(--color-primary);
  color: var(--color-secondary);
  padding: 2rem 1rem;
  text-align: center;
}

.rutinas-titulo {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  line-height: 1.2;
  text-wrap-style: balance;
}

.rutinas-subtitulo {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  color: var(--color-secondary);
  margin-right: auto;
}

/* Buscador */
.rutinas-buscar {
  max-width: 600px;
  margin: 0 auto;
}

.buscar-container {
  position: relative;
  display: flex;
  background: var(--color-secondary);
  border-radius: 50px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.rutinas-buscar-input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  font-size: 1rem;
  background: transparent;
  color: var(--color-quinto);
}

.rutinas-buscar-input:focus {
  outline: none;
}

.rutinas-buscar-input::placeholder {
  color: var(--color-sexto);
}

.rutinas-buscar-btn {
  padding: 1rem 1.5rem;
  background: var(--color-accent);
  border: none;
  cursor: pointer;
  color: var(--color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.rutinas-buscar-btn:hover {
  background: var(--color-quinto);
}

/* Contenido principal */
.rutinas-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 1rem;
  margin: 0 auto;
}

/* Filtros móviles */
.filtros-mobile {
  background: var(--color-secondary);
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.filtros-titulo {
  font-size: 1rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.filtros-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-terciario);
  border-radius: 8px;
  background: var(--color-secondary);
  color: var(--color-quinto);
  font-size: 0.95rem;
}

/* Estados */
.estado-carga,
.estado-vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  background: var(--color-secondary);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.carga-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--color-terciario);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.estado-vacio svg {
  color: var(--color-sexto);
  margin-bottom: 1rem;
}

.estado-vacio h3 {
  color: var(--color-quinto);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.estado-vacio p {
  color: var(--color-sexto);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Grid de rutinas */
.rutinas-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

/* Tarjeta de rutina */
.rutina-card {
  flex: 0 0 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  background: var(--color-secondary);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--color-terciario);
}

.rutina-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.rutina-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--color-terciario);
}

.rutina-user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.rutina-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-terciario);
}

.rutina-nombre {
  margin: 0;
  font-size: 1.1rem;
  color: var(--color-quinto);
  font-weight: 600;
}

.rutina-ejercicios-count {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-sexto);
}

.rutina-perfil-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid var(--color-cuarto);
  color: var(--color-cuarto);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rutina-perfil-btn:hover {
  background: var(--color-primary);
  color: var(--color-secondary);
}

.rutina-content {
  padding: 1.5rem;
}

.rutina-titulo {
  color: var(--color-quinto);
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.rutina-ejercicios {
  list-style: none;
  padding: 0;
  margin: 0;
}

.rutina-ejercicio {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: var(--color-terciario);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rutina-ejercicio:hover {
  background: var(--color-primary);
  color: var(--color-secondary);
}

.rutina-ejercicio:hover .ejercicio-nombre {
  color: var(--color-secondary);
}

.ejercicio-nombre {
  font-weight: 500;
  color: var(--color-quinto);
}

.rutina-mas-ejercicios {
  text-align: center;
  padding: 0.5rem;
  color: var(--color-sexto);
  font-size: 0.9rem;
  font-style: italic;
}

.rutina-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-terciario);
  text-align: center;
}

.rutina-ver-todas {
  border: 1px solid var(--color-primary);
  background: var(--color-secondary);
  color: var(--color-primary);
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.rutina-ver-todas:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(67, 97, 238, 0.3);
}

/* Categorías sidebar */
.rutinas-categorias {
  display: none;
}

.categorias-sticky {
  position: sticky;
  top: 2rem;
}

.categorias-titulo {
  color: var(--color-quinto);
  font-size: 1.4rem;
  font-weight: 700;
}

.categorias-descripcion {
  color: var(--color-sexto);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.categorias-lista {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.categoria-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-secondary);
  border: 1px solid var(--color-terciario);
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--color-quinto);
}

.categoria-btn:hover {
  background: var(--color-primary);
  color: var(--color-secondary);
  border-color: var(--color-primary);
  transform: translateX(5px);
}

.categoria-nombre {
  font-weight: 500;
}

/* Responsive */
@media (min-width: 768px) {
  .rutinas-header {
    padding: 3rem 2rem;
  }
  
  .rutinas-titulo {
    font-size: 2.5rem;
  }
  
  .rutinas-content {
    flex-direction: row;
    padding: 2rem;
  }
  
  .rutinas-listado {
    flex: 1;
  }
  
  
  .rutina-card{
    flex: 1 0 40%;
  }
  
}

@media (min-width: 1024px) {
  .rutinas-categorias {
    display: block;
    width: 280px;
    background: var(--color-secondary);
    border-radius: 16px;
    padding: 1.5rem;
    height: fit-content;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid var(--color-terciario);
  }
}

@media (min-width: 1200px) {
  
}

@media (min-width: 1400px) {´
  .rutinas-categorias {
    width: 300px;
  }
  .rutina-card {
    flex: 0 0 30%;
  }
}
</style>
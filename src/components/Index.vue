<template>
  <main class="rutinas-container">
    <section class="rutinas-listado">
      <form class="rutinas-buscar" @submit.prevent="rutinasUsuarios(busqueda)">
        <input
          type="text"
          v-model="busqueda"
          placeholder="Buscar rutinas..."
          class="rutinas-buscar-input"
        />
        <button type="submit" class="rutinas-buscar-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
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
      </form>

      <div class="rutinas-usuarios">
        <article
          v-for="rutina in rutinas"
          :key="rutina.id"
          class="rutina-card"
        >
          <a class="rutina-perfil-link" @click="verUsuario(rutina.id)">Visitar perfil</a>
          <div class="rutina-header">
            <img :src="rutina.Foto" alt="Foto usuario" class="rutina-avatar" />
            <h3 class="rutina-nombre">{{ rutina.Nombre_Usuario }}</h3>
          </div>
          <ul class="rutina-ejercicios">
            <li
              v-for="ejercicio in rutina.rutinas"
              :key="ejercicio.id"
              class="rutina-ejercicio"
              @click="verRutina(ejercicio.id)"
            >
              {{ ejercicio.Nombre }}
            </li>
          </ul>
        </article>
      </div>
    </section>

    <aside class="rutinas-categorias">
      <h2 class="categorias-titulo">Grupos musculares</h2>
      <div class="categorias-lista">
        <button
          v-for="grupo in grupos"
          :key="grupo.id"
          class="categoria-btn"
          @click="ejerciciosCategoria(grupo.grupo)"
        >
          {{ grupo.grupo }}
        </button>
      </div>
    </aside>
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
        .catch(console.error);
    },
    ejerciciosCategoria(grupo) {
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 100dvh;
  padding: 2rem 1rem;
  background: var(--color-terciario);
}
.rutinas-listado {
  padding: 1.5rem;
  border-radius: var(--border-radius);
}

/* Buscador */
.rutinas-buscar {
  display: flex;
  margin-bottom: 1rem;
  border: 1px solid var(--color-terciario);
  border-radius: 8px;
  overflow: hidden;
  background: var(--color-secondary);
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.rutinas-buscar-input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: none;
  font-size: 1rem;
  background: transparent;
  color: var(--color-primary);
}

.rutinas-buscar-input:focus {
  outline: none;
}

.rutinas-buscar-btn {
  padding: 0 1rem;
  background: var(--color-accent);
  border: none;
  cursor: pointer;
  color: var(--color-secondary);
  display: flex;
  align-items: center;
  transition: background 0.2s ease;
}

.rutinas-buscar-btn:hover {
  background: var(--color-quinto);
}

/* Listado de rutinas */
.rutinas-usuarios {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rutina-card {
  position: relative;
  border: 1px solid var(--color-terciario);
  border-radius: 12px;
  padding: 1.25rem;
  background: var(--color-secondary);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.rutina-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

.rutina-perfil-link {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5rem 0.75rem;
  background: var(--color-cuarto);
  color: var(--color-secondary);
  border-radius: 0 12px 0 12px;
  font-size: 0.85rem;
  text-decoration: none;
  cursor: pointer;
}

.rutina-perfil-link:hover {
  background: var(--color-quinto);
}

.rutina-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-accent);
}

.rutina-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
  border: 2px solid var(--color-terciario);
}

.rutina-nombre {
  margin: 0;
  font-size: 1.1rem;
  color: var(--color-primary);
  font-weight: 600;
}

/* Ejercicios */
.rutina-ejercicios {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.rutina-ejercicio {
  background: linear-gradient(to right, var(--color-primary), var(--color-accent));
  color: var(--color-secondary);
  border: 1px solid var(--color-terciario);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.rutina-ejercicio:hover {
  background: var(--color-quinto);
  color: var(--color-secondary);
}

/* Categorías */
.rutinas-categorias {
  display: none;
}

.categorias-titulo {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: var(--color-primary);
  font-weight: 700;
}

.categorias-lista {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.categoria-btn {
  background: var(--color-secondary);
  border: 1px solid var(--color-terciario);
  border-radius: 6px;
  padding: 0.75rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: var(--color-primary);
  font-weight: 500;
  transition: background 0.2s ease, border 0.2s ease;
}

.categoria-btn:hover {
  background: var(--color-cuarto);
  color: var(--color-secondary);
  border-color: var(--color-quinto);
}

/* Responsive */
@media (min-width: 768px) {
  .rutinas-container {
    flex-direction: row;
    gap: 2rem;
  }
  .rutinas-listado {
    flex: 1;
  }
  .rutinas-usuarios {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1.5rem;
  }
  .rutina-card {
    width: 300px;
  }
  .rutinas-categorias {
    display: block;
    background: var(--color-secondary);
    border: 1px solid var(--color-terciario);
    border-radius: 12px;
    padding: 1.25rem;
    height: fit-content;
    min-width: 220px;
  }
}

@media (min-width: 1100px) {
  .rutina-card {
    width: 260px;
  }
  .rutinas-categorias {
    min-width: 180px;
    padding: 1rem 1.5rem;
  }
}

</style>
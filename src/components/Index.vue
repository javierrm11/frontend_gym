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
          @click="verUsuario(rutina.id)"
        >
          <div class="rutina-header">
            <img :src="rutina.Foto" alt="Foto usuario" class="rutina-avatar" />
            <h3 class="rutina-nombre">{{ rutina.Nombre_Usuario }}</h3>
          </div>
          <ul class="rutina-ejercicios">
            <li
              v-for="ejercicio in rutina.rutinas"
              :key="ejercicio.id"
              class="rutina-ejercicio"
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
        .get("http://localhost:3000/api/rutinas/index")
        .then((response) => {
          this.grupos = response.data;
        })
        .catch(console.error);
    },
    rutinasUsuarios(busqueda) {
      const url = busqueda
        ? `http://localhost:3000/api/rutinas?busqueda=${busqueda}`
        : "http://localhost:3000/api/rutinas";

      axios
        .get(url)
        .then((response) => {
          this.rutinas = response.data.map((rutina) => ({
            ...rutina,
            Foto: rutina.Foto
              ? `http://localhost:3000${rutina.Foto}`
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
  },
};
</script>

<style scoped>
/* Mobile First */
.rutinas-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
  margin: 0 2rem;
}


.rutinas-buscar {
  display: flex;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.rutinas-buscar-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  font-size: 1rem;
  background: transparent;
}

.rutinas-buscar-input:focus {
  outline: none;
}

.rutinas-buscar-btn {
  padding: 0 1rem;
  background: var(--secondary-color, #334155);
  border: none;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  transition: background 0.2s;
}

.rutinas-buscar-btn:hover {
  background: #64748b;
}

.rutinas-usuarios {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rutina-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.25rem;
  background: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.rutina-card:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.rutina-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.rutina-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
  border: 2px solid #e2e8f0;
  background: #f1f5f9;
}

.rutina-nombre {
  margin: 0;
  font-size: 1.1rem;
  color: #1e293b;
  font-weight: 600;
}

.rutina-ejercicios {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.rutina-ejercicio {
  background: #f8fafc;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.92rem;
  text-align: center;
  color: #334155;
  border: 1px solid #e2e8f0;
}

.rutinas-categorias {
  display: none;
}

/* Tablet */
@media (min-width: 768px) {
  .rutinas-container {
    flex-direction: row;
    gap: 2rem;
    padding: 1rem;
  }
  .rutinas-listado {
    flex: 1 1 0%;
  }
  .rutinas-usuarios {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1.5rem;
  }
  .rutina-card {
    width: 320px;
    min-width: 240px;
    max-width: 100%;
  }
  .rutinas-categorias {
    display: block;
    background: #f8fafc;
    border-radius: 8px;
    padding: 1.25rem;
    height: fit-content;
    min-width: 220px;
    max-width: 300px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  }
}

/* Desktop */
@media (min-width: 1100px) {
  .rutinas-usuarios {
    gap: 1.5rem;
  }
  .rutina-card {
    width: 260px;
  }
  .rutinas-categorias {
    min-width: 180px;
    padding: 1rem;
  }
}

.categorias-titulo {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: #1e293b;
  font-weight: 700;
}

.categorias-lista {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.categoria-btn {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.75rem;
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
  text-align: center;
  font-size: 0.95rem;
  color: #334155;
  font-weight: 500;
}

.categoria-btn:hover {
  background: #e0e7ef;
  border-color: #94a3b8;
}
</style>
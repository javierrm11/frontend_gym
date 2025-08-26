<template>
  <main class="ver-rutina-container">
    <div class="header-section">
      <h1 class="titulo-principal">
        {{ rutina?.Nombre || "Cargando rutina..." }}
      </h1>
      <p class="descripcion-principal">
        {{
          rutina?.Descripcion ||
          "Por favor espera mientras cargamos los detalles de la rutina."
        }}
      </p>
    </div>
    <div class="rutina-container-flex">
      <div v-if="ejercicios?.length" class="rutinas-grid">
        <div
          class="ejercicio-item"
          v-for="ejercicio in ejercicios"
          :key="ejercicio.id"
        >
          <div class="ejercicio-info">
            <h4>{{ ejercicio.Nombre }}</h4>
            <p class="ejercicio-descripcion">
              Descripción: {{ ejercicio.Descripcion }}
            </p>
            <p class="ejercicio-categoria">
              Categoría: {{ ejercicio.Categoria }}
            </p>
            <p class="series-badge">Series: {{ ejercicio.Num_Series }}</p>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>
          Cargando ejercicios o no hay ejercicios disponibles para esta rutina.
        </p>
      </div>
      <div class="comentarios-container">
        <h2>Comentarios</h2>
        <div class="comentarios-actions">
          <button class="btn-comentar" @click="mostrarInput = !mostrarInput" v-if="this.$store.state.usuario">
            {{ mostrarInput ? "Cancelar" : "Agregar Comentario" }}
          </button>
        </div>

        <!-- Input dinámico -->
        <div v-if="mostrarInput" class="comentario-form">
          <input
            v-model="nuevoComentario"
            type="text"
            placeholder="Escribe tu comentario..."
          />
          <button @click="agregarComentario(rutina.id)">Enviar</button>
        </div>
        <p
          v-if="!rutina?.comentarios || rutina.comentarios.length === 0"
          class="comentarios-no"
        >
          No hay comentarios para esta rutina.
        </p>
        <div class="comentarios-list" v-else>
            <div v-for="comentario in rutina.comentarios" :key="comentario.id" class="comentario-item">
              <template v-if="comentarioAEditar === comentario.id">
                <p class="comentario-fecha">{{ new Date(comentario.fecha_creacion).toLocaleString() }}</p>
                <div class="comentario-flex">
                  <p class="comentario-usuario-edit"><strong>{{ comentario.usuario.Nombre_Usuario }}:</strong></p>
                  <input v-model="comentario.contenido" type="text" />
                </div>
                <div class="botones-comentario" v-if="this.$store.state.usuario && this.$store.state.usuario == comentario.id_usuario">
                  <button class="eliminar-comentario"
                  @click="editarInput = false; comentarioAEditar = null;">Cancelar</button>
                  <button @click="editarInput = false; comentarioAEditar = null; editarComentario(comentario.id)" class="editar-comentario">Guardar</button>
                </div>
              </template>
              <template v-else>
                <p class="comentario-usuario"><strong>{{ comentario.usuario.Nombre_Usuario }}:</strong> {{ comentario.contenido }}</p>
                <p class="comentario-fecha">{{ new Date(comentario.fecha_creacion).toLocaleString() }}</p>
                <div class="botones-comentario" v-if="this.$store.state.usuario && this.$store.state.usuario == comentario.id_usuario">
                  <button class="editar-comentario"
                  @click="editarInput = true; comentarioAEditar = comentario.id">Editar</button>
                  <button class="eliminar-comentario"
                  @click="eliminarComentario(comentario.id)"
                  >Eliminar</button>
                </div>
              </template>
            </div>
        </div>
      </div>
    </div>

    <div class="acciones" v-if="this.$store.state.usuario">
      <button class="btn-copiar" @click="copiarRutina(rutina)">
        Copiar Rutina
      </button>
      <button
        class="btn-favoritos"
        @click="agregarAFavoritos(rutina)"
        v-if="!favoritos.some((favorito) => favorito.id_rutina == rutina.id)"
      >
        Agregar a Favoritos
      </button>

      <button
        class="btn-eliminar-favoritos"
        @click="eliminarAFavoritos(rutina.id)"
        v-else
      >
        Eliminar de Favoritos
      </button>
    </div>
  </main>
</template>

<script>
import axios from "axios";

export default {
  name: "VerRutina",
  mounted() {
    this.obtenerRutina();
  },
  data() {
    return {
      rutina: null,
      ejercicios: [],
      favoritos: [],
      mostrarInput: false,
      nuevoComentario: "",
      editarInput: false,
      comentarioAEditar: null,
    };
  },
  methods: {
    obtenerRutina() {
      const id = this.$route.params.id;
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/rutinas/${id}`)
        .then((response) => {
          console.log("Rutina obtenida:", response.data[0]);

          this.rutina = response.data[0];
          this.ejercicios = response.data[0].ejercicios;
          this.favoritos = response.data[0].favoritos || [];
        })
        .catch((error) => {
          console.error("Error al obtener la rutina:", error);
        });
    },
    copiarRutina(rutina) {
      axios
        .post(
          `${process.env.VUE_APP_BASE_URL}/api/rutinas`,
          {
            Nombre: rutina.Nombre,
            Descripcion: rutina.Descripcion,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          this.rutina.ejercicios.forEach((ejercicio) => {
            axios
              .post(
                `${process.env.VUE_APP_BASE_URL}/api/ejercicio`,
                {
                  Nombre_Rutina: response.data.Nombre,
                  Nombre_Ejercicio: ejercicio.Nombre,
                  Descripcion: ejercicio.Descripcion,
                  Num_Series: ejercicio.Num_Series,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              )
              .then((response) => {
                console.log("Ejercicio copiado:", response.data);
              })
              .catch((error) => {
                console.log("Error copiando ejercicio:", error);
              });
          });
        })
        .catch((error) => {
          console.log("Error copiando rutina:", error);
        });
    },
    agregarAFavoritos(rutina) {
      axios
        .post(
          `${process.env.VUE_APP_BASE_URL}/api/favoritos`,
          {
            id_rutina: rutina.id,
            id_usuario: this.$store.state.usuario.id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          console.log("Rutina agregada a favoritos:", response.data);
          // Actualizar el usuario para reflejar los cambios
          this.favoritos.push(response.data);
        })
        .catch((error) => {
          console.error("Error al agregar rutina a favoritos:", error);
          alert("Error al agregar rutina a favoritos.");
        });
    },
    eliminarAFavoritos(favoriteId) {
      axios
        .delete(`${process.env.VUE_APP_BASE_URL}/api/favoritos/${favoriteId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          data: {
            id_rutina: favoriteId,
            id_usuario: this.$store.state.usuario?.id,
          },
        })
        .then((response) => {
          console.log("Rutina eliminada de favoritos:", response.data);
          // Actualizar el usuario para reflejar los cambios
          this.favoritos = this.favoritos.filter(
            (fav) => fav.id_rutina !== favoriteId
          );
        })
        .catch((error) => {
          console.error("Error al eliminar rutina de favoritos:", error);
          alert("Error al eliminar rutina de favoritos.");
        });
    },
    agregarComentario(rutinaId) {
      if (!this.nuevoComentario.trim()) return;
      axios
        .post(
          `${process.env.VUE_APP_BASE_URL}/api/comentarios`,
          {
            id_rutina: rutinaId,
            id_usuario: this.$store.state.usuario.id,
            contenido: this.nuevoComentario.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          console.log("Comentario agregado:", response.data);
          this.nuevoComentario = "";
          this.mostrarInput = false;
          this.obtenerRutina(); // Refrescar la rutina para mostrar el nuevo comentario
        })
        .catch((error) => {
          console.error("Error al agregar comentario:", error);
        });
    },
    eliminarComentario(comentarioId) {
      axios
      .delete(`${process.env.VUE_APP_BASE_URL}/api/comentarios/${comentarioId}`, {
        headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          console.log("comentario eliminado de favoritos:", response.data);
          // Actualizar el usuario para reflejar los cambios
          this.rutina.comentarios = this.rutina.comentarios.filter(
            (comentario) => comentario.id !== comentarioId
          );
        })
        .catch((error) => {
          console.error("Error al eliminar comentario:", error);
          alert("Error al eliminar comentario.");
        });
    },
    editarComentario(comentarioId) {
      const comentario = this.rutina.comentarios.find(c => c.id === comentarioId);
      if (!comentario || !comentario.contenido.trim()) return;

      axios
        .put(
          `${process.env.VUE_APP_BASE_URL}/api/comentarios/${comentarioId}`,
          {
            contenido: comentario.contenido.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          console.log("Comentario editado:", response.data);
          this.comentarioAEditar = null;
          this.editarInput = false;
          this.obtenerRutina(); // Refrescar la rutina para mostrar el comentario editado
        })
        .catch((error) => {
          console.error("Error al editar comentario:", error);
        });
    },
  },
};
</script>

<style scoped>
.ver-rutina-container {
  font-family: "Poppins", sans-serif;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.header-section {
  text-align: center;
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: linear-gradient(
    to right,
    var(--color-primary),
    var(--color-accent)
  );
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
.rutina-container-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin: 0 auto;
}

.rutinas-grid {
  flex: 0 0 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.comentarios-container {
  flex: 0 0 100%;
  background: var(--color-terciario);
  border-radius: var(--border-radius);
}
.btn-comentar{
  background-color: var(--color-accent);
  color: var(--color-secondary);
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-bottom: 1rem;
}
.comentario-form{
  display: flex;
}
.comentario-form input {
  width: 70%;
  padding: 0.5rem;
  margin-right: 0.5rem;
  border: 1px solid var(--color-quinto);
  border-radius: var(--border-radius);
}
.comentario-form button {
  background-color: var(--color-accent);
  color: var(--color-secondary);
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.comentarios-container h2 {
  font-size: 1.5rem;
  color: var(--color-primary);
  margin: 0rem;
}
.comentarios-no {
  font-size: 1rem;
  color: var(--color-quinto);
}
.comentarios-list{
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.comentario-item {
  padding: 1rem;
  border-radius: calc(var(--border-radius) - 4px);
  position: relative;
}
.comentario-flex{
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.comentario-usuario-edit{
  line-break:auto;
}
.comentario-flex input{
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--color-quinto);
  border-radius: var(--border-radius);
  font-size: 0.8rem;
}
.comentario-usuario{
  line-break: anywhere;
}
.comentario-fecha{
  position: absolute;
  top: 5px;
  font-size: 14px;
  color: var(--color-warning);
  margin: 0;
}
.botones-comentario{
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
}
.eliminar-comentario {
  background-color: var(--color-error);
  color: var(--color-secondary);
  padding: 0.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.eliminar-comentario:hover {
  background-color: #d32f2f;
  transform: translateY(-2px);
}
.editar-comentario {
  background-color: var(--color-success);
  color: var(--color-secondary);
  padding: 0.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.editar-comentario:hover {
  background-color: #009e3f;
  transform: translateY(-2px);
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
.ejercicio-categoria {
  font-size: 0.9rem;
  color: var(--color-terciario);
  margin-top: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-secondary);
  opacity: 0.7;
}
.acciones {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-top: 2rem;
}
.btn-copiar {
  background-color: var(--color-cuarto);
  color: var(--color-secondary);
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.btn-copiar:hover {
  background-color: var(--color-accent);
  transform: translateY(-2px);
}
.btn-favoritos {
  background-color: var(--color-success);
  color: var(--color-secondary);
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.btn-favoritos:hover {
  background-color: #009e3f;
  transform: translateY(-2px);
}
.btn-eliminar-favoritos {
  background-color: var(--color-error);
  color: var(--color-secondary);
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.btn-eliminar-favoritos:hover {
  background-color: #d32f2f;
  transform: translateY(-2px);
}

/* Responsividad */
@media (min-width: 768px) {
  .rutinas-grid {
    flex: 2;
  }
  .comentarios-container {
    flex: 1;
  }
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
  .rutinas-grid {
    flex: 4;
  }
  .comentarios-container {
    flex: 1;
  }
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

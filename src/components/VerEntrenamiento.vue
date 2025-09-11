<template>
  <main class="entrenamiento-container">
    <div class="header-section">
      <h2 class="titulo-principal">Detalles de la Rutina</h2>
      <div class="descripcion-principal-container">
        <h3 v-if="rutina.Nombre" class="rutina-nombre">{{ rutina.Nombre }}</h3>
        <p v-if="rutina.Descripcion" class="descripcion-principal">
          {{ rutina.Descripcion }}
        </p>
        <p class="profile-meGustas"><svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="red"
              class="bi bi-heart"
              viewBox="0 0 16 16"
            >
              <path
              d="M8 2.748-.717-1.737C5.6-.281 8 3.993 8 3.993s2.4-4.274 8.717-3.74C15.6-.281 8 2.748 8 2.748z"
              />
              <path
              d="M8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"
              fill-rule="evenodd"
              />
            </svg>{{ rutina.likes?.length || 0 }}</p>
      </div>
    </div>
    <div class="rutinas-ejercicios-comentarios-flex">
      <div class="rutinas-ejercicios-estadisticas">
        <div class="rutinas-ejercicios-grid">
          <div class="rutina-card">
            <div class="card-header">
              <h3 class="rutina-ejercicios-nombre">Ejercicios</h3>
            </div>
            <div class="card-content">
              <div v-if="rutina.ejercicios?.length" class="lista-ejercicios">
                <div
                  v-for="ejercicio in rutina.ejercicios"
                  :key="ejercicio._id"
                  class="ejercicio-item"
                  :class="[
                    `border-${ejercicio.Categoria?.toLowerCase() || 'border-default'}`,
                    `filter-${ejercicio.Categoria?.toLowerCase() || 'filter-default'}`
                  ]"
                >
                  <div class="ejercicio-info">
                    <h4 :class="`color-${ejercicio.Categoria?.toLowerCase() || 'color-default'}`">{{ ejercicio.Nombre }}</h4>
                    <p class="series-badge" :class="`${ejercicio.Categoria?.toLowerCase() || 'default'}`">{{ ejercicio.Num_Series }} series</p>
                    <p class="ejercicio-descripcion" :class="`color-${ejercicio.Categoria?.toLowerCase() || 'color-default'}`">{{ ejercicio.Descripcion }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="empty-state">
                <p>No hay ejercicios disponibles para esta rutina.</p>
              </div>
            </div>
          </div>
          
        </div>
        <div v-if="estadisticas.length" class="estadisticas-section">
          <h2 class="subtitulo">Historial de estadísticas</h2>

          <swiper :slides-per-view="1" :modules="modules" :space-between="20" navigation :pagination="{ clickable: true }" :auto-height="true" :centered-slides="true">
            <swiper-slide
              v-for="(item, index) in estadisticas"
              :key="index"
              class="slide-estadistica"
            >
              <!-- Fecha y ejecución -->
              <h3>{{ item.fecha }}</h3>
              <p v-if="item.duracion" class="duracion">
                Duración: {{ item.duracion }}
              </p>

              <div class="estadisticas-group">
                <div
                  v-for="ejercicio in rutina.ejercicios"
                  :key="ejercicio._id || ejercicio.ejercicioRutina_id"
                  class="tarjeta-ejercicio"
                >
                  <h4>{{ ejercicio.Nombre }}</h4>

                  <div class="estadisticas">
                    <ul v-if="item.estadisticas.length">
                      <li
                        v-for="(detalle, idx) in item.estadisticas"
                        :key="detalle?.id || idx"
                      >
                        Peso: {{ detalle.Peso }}kg - Reps: {{ detalle.Repeticiones }}
                      </li>
                    </ul>
                    <p v-else class="no-rutinas">No hay estadísticas disponibles.</p>
                  </div>
                </div>
              </div>
            </swiper-slide>

          </swiper>
        </div>
        <div v-else class=" no-rutinas">
          <p>No hay estadísticas disponibles.</p>
        </div>
      </div>
      <div class="rutina-comentarios">
        <h2>Comentarios</h2>
        <button class="btn-comentar" @click="mostrarInput = !mostrarInput" v-if="this.$store.state.usuario && !mostrarInput">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left-text" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v11.793l-2.5-2.5H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM3 3.5a.5.5 0 0 0 0 1h10a.5.5 0 0 0 0-1H3zm0 3a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1H3zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1H3z"/>
          </svg>
        </button>

        <!-- Input dinámico -->
        <div v-if="mostrarInput" class="comentario-form">
          <input
            v-model="nuevoComentario"
            type="text"
            placeholder="Escribe tu comentario..."
          />
          <button class="btn-comentar-cancelar" @click="mostrarInput = false">
            Cancelar
          </button>
          <button @click="agregarComentario(rutina.id)" class="btn-comentar-enviar">Enviar</button>
        </div>
        <p
          v-if="!rutina?.comentarios || rutina.comentarios.length === 0"
          class="comentarios-no"
        >
          No hay comentarios para esta rutina.
        </p>
        <div class="comentarios-list" v-else>
          <!-- Componente recursivo para comentarios y respuestas -->
          <comentario-item
            v-for="comentario in rutina.comentarios"
            :key="comentario.id"
            :comentario="comentario"
            :rutinaId="rutina.id"
            :nivel="0"
            @actualizar-rutina="getRutina"
          />
        </div>
      </div>
    </div>
    
  </main>
</template>

<script>
import axios from "axios";
import ComentarioItem from "@/components/ComentarioItem.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper";
import "swiper/css";           // estilos base de Swiper
import "swiper/css/navigation"; // estilos de navegación
import "swiper/css/pagination"; // estilos de paginación
import "../styles/slider-button.css";

export default {
  name: "VerEntrenamiento",
  components: {
    ComentarioItem,
    Swiper, SwiperSlide
  },
  data() {
    return {
      modules: [Navigation, Pagination],
      rutina: {},
      isLoading: true,
      fechaUsada: null,
      fechaSeleccionada: null,
      duracion: null,
      modalAgregar: false,
      gruposMusculares: [],
      ejercicios: [
        {
          ejerciciosFiltrados: [],
          grupoSeleccionado: "",
          seleccionado: "",
          series: "",
        },
      ],
      estadisticas: [],
    };
  },
  mounted() {
    this.getRutina();
  },
  methods: {
    async getRutina() {
      this.isLoading = true;
      this.fechaUsada = null;
      this.duracion = null;

      try {
        const response = await axios.get(
          `${process.env.VUE_APP_BASE_URL}/api/rutinas/${this.$route.params.id}`
        );
        this.rutina = response.data[0];

        if (this.rutina.Usuario_id != localStorage.getItem("usuario")) {
          this.$router.push({ name: "error" });
          return;
        }
        if (!this.rutina?.ejercicios?.length) {
          this.isLoading = false;
          return;
        }

          const fetchEstadisticas = async (ejercicio) => {
            try {
              const res = await axios.post(
                `${process.env.VUE_APP_BASE_URL}/api/estadisticasEjercicio/getByDate`,
                {
                  id: ejercicio.ejercicioRutina_id,
                  Rutina_id: this.rutina.id,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );

              this.estadisticas = res.data || {};
              if(this.estadisticas){
                this.estadisticas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                this.estadisticas.forEach(item => {
                    if (item.duracion) {
                    const duracionSegundos = item.duracion;
                    const horas = Math.floor(duracionSegundos / 3600);
                    const minutos = Math.floor((duracionSegundos % 3600) / 60);
                    const segundos = duracionSegundos % 60;

                    item.duracion = `${horas > 0 ? horas + 'h, ' : ''}${minutos > 0 ? minutos + 'm, ' : ''}${segundos}s`;
                    }
                });
              }
              console.log("Estadísticas obtenidas:", ejercicio.estadisticas);
              
            } catch (error) {
              console.error("Error obteniendo estadísticas:", error);
              ejercicio.estadisticas = {};
            }
          };

        await Promise.all(fetchEstadisticas(this.rutina.ejercicios[0]));
      } catch (error) {
        console.error("Error cargando rutina:", error);
      } finally {
        this.isLoading = false;
      }
    },
    abrirModal() {
      this.modalAgregar = true;
      this.getEjercicios();
    },
    onSwiper(swiper) {
      console.log(swiper)
    },
    onSlideChange() {
      console.log('slide change')
    },
    getEjercicios() {
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/ejercicio/categorias`)
        .then((response) => {
          this.gruposMusculares = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getEjerciciosFiltrados(categoria, index) {
      this.ejercicios[index].grupoSeleccionado = categoria;
      this.ejercicios[index].seleccionado = "";
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/ejercicio/${categoria}`)
        .then((response) => {
          this.ejercicios[index].ejerciciosFiltrados = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addEjercicio() {
      const ej = this.ejercicios[0];
      if (!ej.grupoSeleccionado || !ej.seleccionado || !ej.series) {
        alert("Debes completar todos los campos");
        return;
      }

      axios
        .post(
          `${process.env.VUE_APP_BASE_URL}/api/ejercicio`,
          {
            Nombre_Rutina: this.rutina.Nombre,
            Nombre_Ejercicio: ej.seleccionado,
            Num_Series: ej.series,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(() => {
          this.modalAgregar = false;
          this.getRutina();
        })
        .catch((error) => {
          console.log("Error añadiendo ejercicio:", error);
        });
    },
    eliminarEjercicio(id) {
      axios
        .delete(`${process.env.VUE_APP_BASE_URL}/api/ejercicio/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then(() => {
          this.getRutina();
        })
        .catch((error) => {
          console.error("Error eliminando ejercicio:", error);
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
.entrenamiento-container {
  font-family: "Poppins", sans-serif;
}

.header-section {
  text-align: center;
  margin-bottom: 2.5rem;
  position: relative;
  padding: 1.5rem;
  background: linear-gradient(
    to right,
    var(--color-primary),
    var(--color-accent)
  );
}

.titulo-principal {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-secondary);
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
}
.rutina-ejercicios-nombre {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-quinto);
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
}

.descripcion-principal-container {
  text-align: center;
  font-size: 1rem;
  margin: 0 auto;
  width: 90%;
  max-width: 800px;
  border-radius: var(--border-radius);
  overflow: hidden;
}

.descripcion-principal {
  font-size: 1.05rem;
  color: var(--color-secondary);
  line-height: 1.6;
  margin-top: 0.5rem;
}
.profile-meGustas{
  position: absolute;
  top: 0;
  right: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.5rem;
  color: var(--color-quinto);
  font-weight: bold;
}
.rutinas-ejercicios-comentarios-flex{
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}
.rutinas-ejercicios-estadisticas{
  display: grid;
}
.slide-estadistica {
  border-radius: 12px;
}
.swiper-button-next,
.swiper-button-prev {
  color: #ff5722 !important; /* color que quieras (primary o accent) */
  font-weight: bold;
  transition: color 0.3s ease, transform 0.2s ease;
}
.slide-estadistica h3 {
  font-size: 1.5rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  text-align: center;
}
.tarjeta-ejercicio {
  padding: 1rem;
  background: white;
}


.rutinas-ejercicios-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 0 0 100%;
}

.rutina-card {
  border-radius: var(--border-radius);
  overflow: hidden;
  border: 1px solid var(--color-terciario);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-header {
  text-align: center;
}

.rutina-nombre {
  font-size: 1.5rem;
  color: var(--color-secondary);
  font-weight: 600;
  margin-bottom: 1rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.card-content {
  padding: 1.5rem;
}

.lista-ejercicios {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.2rem;
  margin-top: 1rem;
  margin: 0 1rem;
}

.ejercicio-item {
  background: var(--color-terciario);
  padding: 1.2rem;
  border-radius: calc(var(--border-radius) - 4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  flex: 0 0 100%;
}
.estadisticas ul {
  padding-left: 1.2rem;
  margin: 0.5rem 0 0 0;
  list-style: disc;
}
.estadisticas ul li{
  color: var(--color-sexto);
}

.ejercicio-info h4 {
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.series-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  min-width: 80px;
}

.ejercicio-descripcion {
  font-size: 0.95rem;
  line-height: 1.6;
  opacity: 0.9;
}
.rutina-comentarios {
  flex: 0 0 100%;
  padding: 0 2rem;
  box-sizing: border-box;
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
}
.comentario-form{
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: space-between;
}
.btn-comentar-cancelar{
  background-color: var(--color-error);
  color: var(--color-secondary);
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.comentario-form input {
  width: 100%;
  padding: 0.5rem;
  margin-right: 0.5rem;
  color: var(--color-quinto);
  border: 1px solid var(--color-accent);
  border-radius: var(--border-radius);
  background: transparent;
}
.comentario-form input:focus {
  outline: none;
  border-color: var(--color-accent);
}
.btn-comentar-cancelar:hover {
  background-color: #d32f2f;
  transform: translateY(-2px);
}
.btn-comentar-enviar{
  background-color: var(--color-success);
  color: var(--color-secondary);
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.btn-comentar-enviar:hover {
  background-color: #009e3f;
  transform: translateY(-2px);
}
.rutina-comentarios h2 {
  display: inline-block;
  font-size: 1.5rem;
  color: var(--color-primary);
  margin: 0rem;
  margin-right: 1rem;
}
.comentarios-no {
  font-size: 1rem;
  color: var(--color-quinto);
}
.comentarios-list{
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}
.comentario-item {
  padding: 1rem 0;
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
  color: var(--color-quinto);
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
  color: var(--color-quinto);
}
.comentario-fecha{
  position: absolute;
  top: 13px;
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

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-secondary);
  opacity: 0.7;
}
.no-rutinas{
  flex: 0 0 100%;
  text-align: center;
}
.estadisticas-section{
  padding: 1rem;
  overflow: hidden;
}
.subtitulo{
  text-align: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-cuarto);
  font-size: 2rem;
  color: var(--color-quinto);
}
.duracion {
  place-self: center;
  font-size: 1.1rem;
  color: var(--color-quinto);
  margin-top: 0.5rem;
}
.container-fecha{
  place-self: center;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 300px;

}
.container-fecha label {
  font-size: 1rem;
  color: var(--color-quinto);
  place-self: center;
}
.container-fecha input {
  padding: 0.5rem;
  border-radius: var(--border-radius);
  border: none;
  font-size: 1rem;
  background-color: var(--color-primary);
  color: var(--color-secondary);
}
.rutina-card:hover {
  outline: none;
  transform: translateY(-5px);
}
.estadisticas-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.tarjeta-ejercicio {
  background: var(--color-secondary);
  border-radius: calc(var(--border-radius) - 4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  width: 100%;
}
.tarjeta-ejercicio h4{
  font-size: 1.2rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}
.tarjeta-ejercicio p{
  font-size: 0.95rem;
  color: var(--color-quinto);
  margin: 0.25rem 0;
}
.serie-block h5{
  font-size: 1.1rem;
  color: var(--color-cuarto);
  margin: 0.5rem 0;
}
.serie-block ul{
  padding: 0rem;
  margin: 0;
}
.serie-block li{
  list-style: none;
  color: var(--color-sexto);
}


/* Tablet */
@media (min-width: 568px) {
.ejercicio-item {
    flex: 1 1 27%;
  }
}
@media (min-width: 768px) {
  .titulo-principal {
    font-size: 2.2rem;
  }
  .tarjeta-ejercicio{
    flex: 1 1 39%;
  }


  .descripcion-principal {
    font-size: 1.1rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {

  .rutina-nombre {
    font-size: 1.6rem;
  }
  .rutinas-ejercicios-estadisticas{
    flex: 2;
  }

  .ejercicio-info h4 {
    font-size: 1.25rem;
  }
}

/* Animation */
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

/* Loading state */
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
/* Responsividad */
@media (min-width: 768px) {
}

@media (min-width: 1024px) {
  .rutinas-ejercicios-grid {
    flex: 2;
  }
  .rutina-comentarios {
    flex: 1;
    padding: 0;
  }
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

<template>
  <div class="comentario-item" :style="{marginLeft: nivel == 1 ? '1.0rem' : '0',  borderLeft: nivel == 1 ? '2px solid var(--color-accent)' : 'none', paddingLeft: nivel == 1 ? '1rem': '0'}">
    <template v-if="editando">
      <p class="comentario-fecha">{{ this.timeAgo(comentario.fecha_creacion) }}</p>
      <div class="comentario-flex">
        <p class="comentario-usuario-edit"><strong>{{ comentario?.usuario?.Nombre_Usuario }}:</strong></p>
        <input v-model="comentarioEditado" type="text" />
      </div>
      <div class="botones-comentario" v-if="this.$store.state.usuario">
        <button class="eliminar-comentario" @click="cancelarEdicion">Cancelar</button>
        <button @click="guardarEdicion" class="editar-comentario">Guardar</button>
      </div>
    </template>
    <template v-else>
      <div class="comentario-flex">
        <img :src="profileImageUrl" alt="Foto de perfil" class="comentario-avatar" />
        <p class="comentario-usuario">{{ comentario?.usuario?.Nombre_Usuario }}</p>
        <p class="comentario-fecha">{{ this.timeAgo(comentario.fecha_creacion) }}</p>
      </div>
      <p class="comentario-respuesta" v-if="nivel >= 1">Respuesta a: {{ comentario?.comentarioPadre.usuario?.Nombre_Usuario }}</p>
      <p class="comentario-contenido">{{ comentario.contenido }}</p>
      <div class="botones-comentario" v-if="this.$store.state.usuario">
        <button class="responder-comentario" @click="mostrarFormularioRespuesta = !mostrarFormularioRespuesta">
          Responder
        </button>
        <button class="editar-comentario" v-if="this.$store.state.usuario == comentario?.id_usuario" @click="iniciarEdicion">Editar</button>
        <button class="eliminar-comentario" v-if="this.$store.state.usuario == comentario?.id_usuario" @click="eliminarComentario">Eliminar</button>
      </div>
      
      <!-- Formulario para responder -->
      <div v-if="mostrarFormularioRespuesta" class="comentario-form">
        <input v-model="nuevaRespuesta" type="text" placeholder="Escribe tu respuesta..." />
        <button class="btn-comentar-cancelar" @click="mostrarFormularioRespuesta = false">Cancelar</button>
        <button @click="agregarRespuesta" class="btn-comentar-enviar">Enviar</button>
      </div>
      
      <!-- Respuestas (llamada recursiva dentro de <details>) -->
      <details class="respuestas-list" v-if="comentario.respuestas && comentario.respuestas.length">
        <summary>Ver respuestas ({{ comentario.respuestas.length }})</summary>
        <div>
          <comentario-item
            v-for="respuesta in comentario.respuestas"
            :key="respuesta.id"
            :comentario="respuesta"
            :rutinaId="rutinaId"
            :nivel="nivel + 1"
            @actualizar-rutina="$emit('actualizar-rutina')"
          />
        </div>
      </details>
    </template>
  </div>
</template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "ComentarioItem",
    props: {
      comentario: Object,
      rutinaId: Number,
      nivel: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        editando: false,
        comentarioEditado: "",
        mostrarFormularioRespuesta: false,
        nuevaRespuesta: ""
      };
    },
    computed: {
      profileImageUrl() {
        const baseUrl = process.env.VUE_APP_BASE_URL;
        return this.comentario?.usuario?.Foto ? `${baseUrl}${this.comentario.usuario.Foto}` : '/default-avatar.png';
      },
      usuarioAutenticado() {
        return this.$store.state.usuario;
      },
      usuarioPuedeEditar() {
        return this.usuarioAutenticado && this.$store.state.usuario.id === this.comentario.id_usuario;
      }
    },
    methods: {
      iniciarEdicion() {
        this.comentarioEditado = this.comentario.contenido;
        this.editando = true;
      },
      cancelarEdicion() {
        this.editando = false;
        this.comentarioEditado = "";
      },
      guardarEdicion() {
        if (!this.comentarioEditado.trim()) return;
        
        axios
          .put(
            `${process.env.VUE_APP_BASE_URL}/api/comentarios/${this.comentario.id}`,
            {
              contenido: this.comentarioEditado.trim(),
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then(() => {
            this.editando = false;
            this.$emit('actualizar-rutina');
          })
          .catch((error) => {
            console.error("Error al editar comentario:", error);
          });
      },
      eliminarComentario() {
        axios
          .delete(`${process.env.VUE_APP_BASE_URL}/api/comentarios/${this.comentario.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then(() => {
            this.$emit('actualizar-rutina');
          })
          .catch((error) => {
            console.error("Error al eliminar comentario:", error);
          });
      },
      agregarRespuesta() {
        if (!this.nuevaRespuesta.trim()) return;
        
        axios
          .post(
            `${process.env.VUE_APP_BASE_URL}/api/comentarios/respuesta`,
            {
              id_rutina: this.rutinaId,
              contenido: this.nuevaRespuesta.trim(),
              comentario_padre_id: this.comentario.id,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then(() => {
            this.nuevaRespuesta = "";
            this.mostrarFormularioRespuesta = false;
            this.$emit('actualizar-rutina');
          })
          .catch((error) => {
            console.error("Error al agregar respuesta:", error);
          });
      },
      timeAgo(fecha) {
        const now = new Date();
        const commentDate = new Date(fecha);
        const secondsAgo = Math.floor((now - commentDate) / 1000);
  
        if (secondsAgo < 60) return `${secondsAgo} segundos`;
        const minutesAgo = Math.floor(secondsAgo / 60);
        if (minutesAgo < 60) return `${minutesAgo} minutos`;
        const hoursAgo = Math.floor(minutesAgo / 60);
        if (hoursAgo < 24) return `${hoursAgo} horas`;
        const daysAgo = Math.floor(hoursAgo / 24);
        if (daysAgo < 30) return `${daysAgo} días`;
        const monthsAgo = Math.floor(daysAgo / 30);
        if (monthsAgo < 12) return `${monthsAgo} meses`;
        const yearsAgo = Math.floor(monthsAgo / 12);
        return `${yearsAgo} años`;
      }
    },
  };
  </script>
  
  <style scoped>
  .comentario-item {
    padding: 1rem 0;
    position: relative;
    transition: background-color 0.2s ease;
  }
  
  .comentario-item:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
  
  .comentario-flex {
    display: flex;
    align-items: center;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-sexto);
  }
  
  .comentario-usuario-edit {
    line-break: auto;
    color: var(--color-quinto);
  }
  
  .comentario-flex input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid var(--color-quinto);
    border-radius: var(--border-radius);
    font-size: 0.8rem;
  }
  
  .comentario-usuario {
    margin: 0;
    line-break: anywhere;
    color: var(--color-quinto);
  }
  .comentario-respuesta {
    font-size: 0.8rem;
    color: var(--color-sexto);
    margin: 0.25rem 0;
  }
  .comentario-contenido{
    margin: 0.25rem 0;
    line-break: anywhere;
    color: var(--color-sexto);
    margin-top: 0.5rem;
  }
  
  .comentario-fecha {
    font-size: 0.7rem;
    color: var(--color-sexto);
    margin: 0 0 0.5rem 0.5rem;
  }
  
  .respuestas-list {
    margin-top: 0.5rem;
    color: var(--color-primary);
  }
  .respuestas-list:open{
    animation: fadeIn 0.3s ease-in-out;
  }
  .respuestas-list summary {
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    padding: 0.5rem;
    list-style-type: none;
  }
  .respuestas-list summary::before {
    content: "—";
    margin-right: 0.5rem;
  }
  
  .botones-comentario {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .responder-comentario, .editar-comentario, .eliminar-comentario {
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: var(--border-radius);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .comentario-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 0.5rem;
    border: 2px solid var(--color-quinto);
  }
  
  .responder-comentario {
    background-color: var(--color-accent);
    color: var(--color-secondary);
  }
  
  .editar-comentario {
    background-color: var(--color-success);
    color: var(--color-secondary);
  }
  
  .eliminar-comentario {
    background-color: var(--color-error);
    color: var(--color-secondary);
  }
  
  .responder-comentario:hover, .editar-comentario:hover, .eliminar-comentario:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }
  
  .comentario-form {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .comentario-form input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid var(--color-quinto);
    border-radius: var(--border-radius);
    font-size: 0.8rem;
  }
  
  .btn-comentar-cancelar, .btn-comentar-enviar {
    padding: 0.5rem 0.75rem;
    border: none;
    border-radius: var(--border-radius);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .btn-comentar-cancelar {
    background-color: var(--color-error);
    color: var(--color-secondary);
  }
  
  .btn-comentar-enviar {
    background-color: var(--color-success);
    color: var(--color-secondary);
  }
  
  .btn-comentar-cancelar:hover, .btn-comentar-enviar:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }
  @keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
  </style>
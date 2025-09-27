<template>
  <main class="mensajes-container">
    <!-- Header con título -->
    <div class="mensajes-header">
      <div class="header-content">
        <div class="header-texto">
          <h1 class="mensajes-titulo">Mensajes</h1>
        </div>
        <span class="badge-total-no-leidos ">
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
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            ></path>
          </svg>
          {{ totalNoLeidos }}
        </span>
      </div>
    </div>

    <div class="mensajes-content">
      <!-- Overlay para cerrar el menú en móvil -->
      <div
        v-if="esMovil && menuAbierto"
        class="menu-overlay"
        @click="cerrarMenu"
      ></div>

      <!-- Lista de conversaciones -->
      <section
        class="conversaciones-listado"
        :class="{
          'menu-abierto': menuAbierto,
          'oculto-en-movil': conversacionActiva && esMovil,
        }"
      >
        <div class="conversaciones-header">
          <h2 class="conversaciones-titulo">Conversaciones</h2>
          <button class="nueva-conversacion-btn" @click="mostrarModalUsuarios">
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
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        <!-- Estado de carga -->
        <div v-if="cargandoConversaciones" class="estado-carga">
          <div class="carga-spinner"></div>
          <p>Cargando conversaciones...</p>
        </div>

        <!-- Lista de conversaciones -->
        <div v-else-if="conversaciones.length > 0" class="conversaciones-lista">
          <div
            v-for="conversacion in conversaciones"
            :key="conversacion.id"
            class="conversacion-item"
            :class="{
              activa:
                conversacionActiva && conversacionActiva.id === conversacion.id,
              'tiene-no-leidos': conversacion.noLeidos > 0,
            }"
            @click="seleccionarConversacion(conversacion)"
          >
            <div class="conversacion-avatar">
              <img
                :src="conversacion.avatar || avatarPredeterminado"
                alt="Avatar"
              />
              <span
                class="estado-conexion"
                :class="obtenerEstadoUsuario(conversacion.id)"
              ></span>
            </div>
            <div class="conversacion-info">
              <h3 class="conversacion-nombre">
                {{ conversacion.nombre || `Usuario ${conversacion.id}` }}
              </h3>
              <p
                class="conversacion-ultimo-msj"
                :class="{
                  'no-leido':
                    conversacion.noLeidos > 0 && !conversacion.esMioElUltimo,
                }"
              >
                {{ conversacion.ultimoMensaje || "Sin mensajes" }}
              </p>
            </div>
            <div class="conversacion-estado">
              <span class="conversacion-fecha">{{
                formatearFecha(conversacion.fechaUltimoMensaje) || ""
              }}</span>
              <div
                v-if="conversacion.noLeidos > 0 && !conversacion.esMioElUltimo"
                class="badge-conversacion"
              >
                {{ conversacion.noLeidos > 99 ? "99+" : conversacion.noLeidos }}
              </div>
              <div
                v-else-if="
                  conversacion.ultimoMensajeLeido !== undefined &&
                  conversacion.esMioElUltimo
                "
                class="estado-lectura"
              >
                <svg
                  v-if="conversacion.ultimoMensajeLeido"
                  class="icono-leido-doble"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M18.7 7.2c-.4-.4-1-.4-1.4 0L9.8 14.7 6.7 11.6c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l3.8 3.8c.2.2.5.3.7.3s.5-.1.7-.3l8.5-8.5c.4-.4.4-1 0-1.4z"
                  />
                  <path
                    d="M22.7 7.2c-.4-.4-1-.4-1.4 0L13.8 14.7l-2.1-2.1c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l3.8 3.8c.2.2.5.3.7.3s.5-.1.7-.3l9.5-9.5c.4-.4.4-1 0-1.4z"
                  />
                </svg>
                <svg
                  v-else
                  class="icono-leido"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M18.7 7.2c-.4-.4-1-.4-1.4 0L9.8 14.7 6.7 11.6c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l3.8 3.8c.2.2.5.3.7.3s.5-.1.7-.3l8.5-8.5c.4-.4.4-1 0-1.4z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="estado-vacio">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            ></path>
          </svg>
          <h3>No tienes conversaciones</h3>
          <p>Inicia una nueva conversación para comenzar a chatear.</p>
        </div>
      </section>

      <!-- Área de mensajes -->
      <section
        class="mensajes-area"
        v-if="conversacionActiva"
        :class="{ 'activo-en-movil': conversacionActiva && esMovil }"
      >
        <div class="mensajes-header-chat">
          <button v-if="esMovil" class="boton-atras-chat" @click="volverALista">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <div class="chat-info">
            <div class="chat-avatar">
              <img
                :src="conversacionActiva.avatar || avatarPredeterminado"
                alt="Avatar"
              />
              <span
                class="estado-conexion"
                :class="obtenerEstadoUsuario(conversacionActiva.id)"
              ></span>
            </div>
            <div>
              <h3 class="chat-nombre">
                {{
                  conversacionActiva.nombre ||
                  `Usuario ${conversacionActiva.id}`
                }}
              </h3>
              <p
                class="chat-estado"
                :class="obtenerEstadoUsuario(conversacionActiva.id)"
              >
                {{ formatoEstadoChat(conversacionActiva.id) }}
              </p>
            </div>
          </div>
          <button class="chat-acciones-btn" @click="toggleAccionesChat">
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
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </button>
        </div>

        <div
          class="mensajes-chat"
          ref="mensajesContainer"
          @scroll="manejarScrollChat"
        >
          <!-- Estado de carga de mensajes -->
          <div v-if="cargandoMensajes" class="estado-carga-chat">
            <div class="carga-spinner"></div>
            <p>Cargando mensajes...</p>
          </div>

          <!-- Lista de mensajes -->
          <div v-else class="mensajes-lista">
            <div
              v-for="mensaje in mensajes"
              :key="mensaje.id"
              class="mensaje"
              :class="{
                propio: mensaje.emisor_id === usuarioId,
                leido: mensaje.leido,
                'no-leido': !mensaje.leido && mensaje.emisor_id !== usuarioId,
              }"
              :data-mensaje-id="mensaje.id"
              ref="mensajesElements"
            >
              <div class="mensaje-contenido">
                <p class="mensaje-texto">{{ mensaje.texto }}</p>
                <div class="mensaje-metadata">
                  <span class="mensaje-fecha">{{
                    formatearFecha(mensaje.fecha_envio)
                  }}</span>
                  <div class="estado-lectura-mensaje">
                    <svg
                      v-if="mensaje.leido"
                      class="icono-leido-doble"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M18.7 7.2c-.4-.4-1-.4-1.4 0L9.8 14.7 6.7 11.6c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l3.8 3.8c.2.2.5.3.7.3s.5-.1.7-.3l8.5-8.5c.4-.4.4-1 0-1.4z"
                      />
                      <path
                        d="M22.7 7.2c-.4-.4-1-.4-1.4 0L13.8 14.7l-2.1-2.1c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l3.8 3.8c.2.2.5.3.7.3s.5-.1.7-.3l9.5-9.5c.4-.4.4-1 0-1.4z"
                      />
                    </svg>
                    <svg
                      v-else
                      class="icono-leido"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M18.7 7.2c-.4-.4-1-.4-1.4 0L9.8 14.7 6.7 11.6c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l3.8 3.8c.2.2.5.3.7.3s.5-.1.7-.3l8.5-8.5c.4-.4.4-1 0-1.4z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <button
                v-if="mensaje.emisor_id === usuarioId"
                class="mensaje-eliminar"
                @click="eliminarMensaje(mensaje.id)"
                title="Eliminar mensaje"
              >
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
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Indicador de nuevos mensajes no leídos -->
        <div
          v-if="hayMensajesNoLeidos && !todosMensajesVisibles"
          class="indicador-nuevos-mensajes"
        >
          <button
            @click="desplazarANuevosMensajes"
            class="boton-nuevos-mensajes"
          >
            <span
              >{{ mensajesNoLeidosCount }} nuevo{{
                mensajesNoLeidosCount !== 1 ? "s" : ""
              }}</span
            >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
              />
            </svg>
          </button>
        </div>

        <!-- Formulario de envío de mensajes -->
        <div class="mensajes-formulario">
          <form @submit.prevent="enviarMensaje">
            <div class="input-container">
              <input
                type="text"
                v-model="nuevoMensaje"
                placeholder="Escribe un mensaje..."
                class="mensaje-input"
                :disabled="cargandoEnvio"
              />
              <button
                type="submit"
                class="enviar-btn"
                :disabled="!nuevoMensaje.trim() || cargandoEnvio"
              >
                <svg
                  v-if="cargandoEnvio"
                  class="carga-spinner-mini"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                    stroke-dasharray="15.85 15.85"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 12 12"
                      to="360 12 12"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
                <svg
                  v-else
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
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- Estado cuando no hay conversación seleccionada -->
      <section
        v-else
        class="mensajes-vacio"
        :class="{ 'oculto-en-movil': esMovil }"
      >
        <div class="mensajes-vacio-contenido">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            ></path>
          </svg>
          <h3>Selecciona una conversación</h3>
          <p>
            Elige una conversación existente o inicia una nueva para comenzar a
            chatear.
          </p>
        </div>
      </section>
    </div>

    <!-- Modal para seleccionar usuario -->
    <div v-if="mostrarModal" class="modal-overlay" @click="cerrarModal">
      <div class="modal-contenido" @click.stop>
        <div class="modal-header">
          <h3>Seleccionar usuario</h3>
          <button class="modal-cerrar" @click="cerrarModal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <input
            type="text"
            v-model="busquedaUsuario"
            placeholder="Buscar usuario..."
            class="buscar-usuario-input"
          />
          <div v-if="cargandoUsuarios" class="estado-carga">
            <div class="carga-spinner"></div>
            <p>Cargando usuarios...</p>
          </div>
          <div v-else class="usuarios-lista">
            <div
              v-for="usuario in usuariosFiltrados"
              :key="usuario.id"
              class="usuario-item"
              @click="iniciarConversacion(usuario.id)"
            >
              <div class="usuario-avatar">
                <img :src="usuario.Foto" alt="Avatar" />
                <span
                  class="estado-conexion"
                  :class="obtenerEstadoUsuario(usuario.id)"
                ></span>
              </div>
              <div class="usuario-info">
                <h4>{{ usuario.Nombre_Usuario }}</h4>
                <p>{{ formatoEstadoModal(usuario.id) }}</p>
              </div>
            </div>
          </div>
          <div
            v-if="usuariosFiltrados.length === 0 && !cargandoUsuarios"
            class="estado-vacio"
          >
            <p>No se encontraron usuarios</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import socket from "@/services/socket";

export default {
  name: "MensajesPage",
  data() {
    return {
      conversaciones: [],
      conversacionActiva: null,
      mensajes: [],
      usuarios: [],
      mostrarModal: false,
      busquedaUsuario: "",
      nuevoMensaje: "",
      cargandoConversaciones: false,
      cargandoMensajes: false,
      cargandoUsuarios: false,
      cargandoEnvio: false,
      usuarioId: null,
      avatarPredeterminado: require("@/assets/users/predeterminada.png"),
      estadosUsuarios: {},
      menuAbierto: true,
      anchoVentana: window.innerWidth,
      totalNoLeidos: 0,
      observer: null,
      mensajesVisibles: new Set(),
      ultimoScrollTop: 0,
      timeoutMarcarLeido: null,
      usuariosConectados: new Set(),
    };
  },
  computed: {
    usuariosFiltrados() {
      if (!this.busquedaUsuario) return this.usuarios;
      return this.usuarios.filter((usuario) =>
        usuario.Nombre_Usuario.toString()
          .toLowerCase()
          .includes(this.busquedaUsuario.toLowerCase())
      );
    },
    esMovil() {
      return this.anchoVentana < 768;
    },
    mostrarBotonAtras() {
      return this.esMovil && this.conversacionActiva;
    },
    mensajesNoLeidos() {
      return this.mensajes.filter(
        (m) => !m.leido && m.emisor_id !== this.usuarioId
      );
    },
    mensajesNoLeidosCount() {
      return this.mensajesNoLeidos.length;
    },
    hayMensajesNoLeidos() {
      return this.mensajesNoLeidosCount > 0;
    },
    todosMensajesVisibles() {
      return (
        this.mensajesNoLeidosCount === 0 ||
        this.mensajesVisibles.size >= this.mensajesNoLeidosCount
      );
    },
  },
  mounted() {
    this.obtenerUsuarioId();
    this.cargarConversaciones();
    this.inicializarSocket();
    this.agregarListenerResize();
    this.cargarTotalNoLeidos();
    this.obtenerUsuariosActivos();
  },
  beforeUnmount() {
    if (socket.connected) {
      socket.disconnect();
    }
    this.removerListenerResize();
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.timeoutMarcarLeido) {
      clearTimeout(this.timeoutMarcarLeido);
    }
  },
  watch: {
    conversacionActiva(nuevoValor, viejoValor) {
      if (viejoValor && viejoValor.id !== nuevoValor?.id) {
        // Marcar mensajes como leídos al cambiar de conversación
        this.marcarMensajesComoLeidos(viejoValor.id);
      }

      if (nuevoValor) {
        this.cargarMensajes(nuevoValor.id);
        if (this.esMovil) {
          this.menuAbierto = false;
        }
        // Inicializar observer para detectar mensajes visibles
        this.$nextTick(() => {
          this.inicializarIntersectionObserver();
          this.programarMarcadoLeido();
        });
      }
    },
    mensajes: {
      handler() {
        this.$nextTick(() => {
          this.actualizarMensajesVisibles();
          this.programarMarcadoLeido();
        });
      },
      deep: true,
    },
  },
  methods: {
    // Métodos de navegación responsive
    agregarListenerResize() {
      window.addEventListener("resize", this.actualizarAnchoVentana);
    },
    obtenerUsuariosActivos() {
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/activeUsers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          console.log("Usuarios activos:", response.data);

          // Extraer solo los IDs de usuario
          const ids = response.data.activeUsers.map((u) => u.userId);

          // Guardar en un Set para evitar duplicados
          this.usuariosConectados = new Set(ids);

          // Actualizar estados
          this.estadosUsuarios = {};
          this.usuariosConectados.forEach((userId) => {
            this.estadosUsuarios[userId] = {
              status: "online",
              lastSeen: null,
            };
          });
        })
        .catch((error) => {
          console.error("Error al obtener estados de usuarios:", error);
        });
    },

    removerListenerResize() {
      window.removeEventListener("resize", this.actualizarAnchoVentana);
    },
    actualizarAnchoVentana() {
      this.anchoVentana = window.innerWidth;
      if (this.anchoVentana >= 768) {
        this.menuAbierto = true;
      }
    },
    toggleMenu() {
      this.menuAbierto = !this.menuAbierto;
    },
    cerrarMenu() {
      this.menuAbierto = false;
    },
    volverALista() {
      if (this.conversacionActiva) {
        this.marcarMensajesComoLeidos(this.conversacionActiva.id);
      }
      this.conversacionActiva = null;
      if (this.esMovil) {
        this.menuAbierto = true;
      }
    },

    // Métodos de conversaciones
    seleccionarConversacion(conversacion) {
      this.conversacionActiva = conversacion;
      if (this.esMovil) {
        this.menuAbierto = false;
      }
    },

    toggleAccionesChat() {
      console.log("Abrir menú de acciones del chat");
    },

    // Métodos de autenticación
    obtenerUsuarioId() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          this.usuarioId = payload.id;
        } catch (error) {
          console.error("Error al decodificar el token:", error);
          this.$router.push("/login");
        }
      } else {
        this.$router.push("/login");
      }
    },

    // Métodos de Socket.IO
    inicializarSocket() {
      socket.connect();

      socket.on("connect", () => {
        console.log("Conectado al servidor de mensajes");
        socket.emit("join", this.usuarioId);
      });

      socket.on("receiveMessage", this.manejarMensajeRecibido);
      socket.on("messageReadConfirmation", this.manejarConfirmacionLectura);
      
      socket.on("disconnect", () => {
        console.log("Desconectado del servidor de mensajes");
      });
      socket.on("activeUsersUpdated", (data) => {
        const ids = data.activeUsers; // lista de userIds online
        this.usuariosConectados = new Set(ids);

        // Actualizar estados de conexión
        this.estadosUsuarios = {};
        ids.forEach((userId) => {
          this.estadosUsuarios[userId] = {
            status: "online",
            lastSeen: null,
          };
        });
      });

      socket.on("messageDeleted", (data) => {
        const { messageId } = data;

        // Eliminar el mensaje de la lista local
        this.mensajes = this.mensajes.filter((mensaje) => mensaje.id !== messageId);

        // Actualizar la conversación activa si corresponde
        if (this.conversacionActiva) {
          this.actualizarConversaciones({
            id: messageId,
            texto: "",
            fecha_envio: new Date(),
            leido: true,
            emisor_id: this.usuarioId,
            receptor_id: this.conversacionActiva.id,
          });
        }
      });
      socket.on("connect_error", (error) => {
        console.error("Error de conexión con el servidor de mensajes:", error);
      });
    },

    manejarMensajeRecibido(mensaje) {
      const mensajeExistente = this.mensajes.find((m) => m.id === mensaje.id);
      if (!mensajeExistente) {
        this.mensajes.push(mensaje);

        if (
          this.conversacionActiva &&
          (mensaje.emisor_id === this.conversacionActiva.id ||
            mensaje.receptor_id === this.conversacionActiva.id)
        ) {
          this.$nextTick(() => {
            this.desplazarAlFinal();
            this.programarMarcadoLeido();
          });
        }

        this.actualizarConversaciones(mensaje);
        this.cargarTotalNoLeidos();
      }
    },

    manejarConfirmacionLectura(data) {
      const { messageId } = data;

      // Actualizar el mensaje como leído en la interfaz
      const mensajeIndex = this.mensajes.findIndex((m) => m.id === messageId);
      if (mensajeIndex !== -1) {
        this.mensajes[mensajeIndex].leido = true;
        this.mensajes[mensajeIndex].fecha_leido = new Date();

        // Actualizar también en las conversaciones si es el último mensaje
        this.actualizarEstadoLecturaConversaciones(messageId);
      }
    },

    // Métodos de mensajes leídos/no leídos
    async marcarMensajeComoLeido(mensajeId) {
      try {
        await axios.put(
          `${process.env.VUE_APP_BASE_URL}/api/mensajes/leer/${mensajeId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Emitir evento de lectura via socket
        socket.emit("messageRead", {
          messageId: mensajeId,
          readerId: this.usuarioId,
        });
      } catch (error) {
        console.error("Error al marcar mensaje como leído:", error);
      }
    },

    async marcarMensajesComoLeidos(conversacionId) {
      try {
        // Marcar todos los mensajes no leídos de la conversación
        const mensajesNoLeidos = this.mensajes.filter(
          (m) =>
            !m.leido &&
            m.emisor_id === conversacionId &&
            m.receptor_id === this.usuarioId
        );

        for (const mensaje of mensajesNoLeidos) {
          await this.marcarMensajeComoLeido(mensaje.id);
        }

        // Actualizar estado local
        this.conversaciones = this.conversaciones.map((conv) => {
          if (conv.id === conversacionId) {
            return { ...conv, noLeidos: 0 };
          }
          return conv;
        });

        this.cargarTotalNoLeidos();
      } catch (error) {
        console.error("Error al marcar mensajes como leídos:", error);
      }
    },

    programarMarcadoLeido() {
      if (this.timeoutMarcarLeido) {
        clearTimeout(this.timeoutMarcarLeido);
      }

      // Esperar 1 segundo después de la interacción para marcar como leído
      this.timeoutMarcarLeido = setTimeout(() => {
        if (this.conversacionActiva && this.hayMensajesNoLeidos) {
          this.marcarMensajesComoLeidos(this.conversacionActiva.id);
        }
      }, 1000);
    },

    async cargarTotalNoLeidos() {
      try {
        this.totalNoLeidos = this.conversaciones.reduce(
          (total, conv) => total + (conv.noLeidos || 0),
          0
        );
      } catch (error) {
        console.error("Error al cargar total de no leídos:", error);
      }
    },

    // Observer para detectar mensajes visibles
    inicializarIntersectionObserver() {
      if (this.observer) {
        this.observer.disconnect();
      }

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const mensajeId = parseInt(entry.target.dataset.mensajeId);
            if (entry.isIntersecting) {
              this.mensajesVisibles.add(mensajeId);
            } else {
              this.mensajesVisibles.delete(mensajeId);
            }
          });

          this.actualizarMensajesVisibles();
        },
        {
          root: this.$refs.mensajesContainer,
          threshold: 0.5,
        }
      );

      // Observar todos los mensajes
      if (this.$refs.mensajesElements) {
        this.$refs.mensajesElements.forEach((element) => {
          this.observer.observe(element);
        });
      }
    },

    actualizarMensajesVisibles() {
      // Marcar mensajes visibles como leídos después de un delay
      this.mensajesVisibles.forEach((mensajeId) => {
        const mensaje = this.mensajes.find((m) => m.id === mensajeId);
        if (mensaje && !mensaje.leido && mensaje.emisor_id !== this.usuarioId) {
          this.marcarMensajeComoLeido(mensajeId);
        }
      });
    },

    manejarScrollChat() {
      this.programarMarcadoLeido();
    },

    desplazarANuevosMensajes() {
      this.desplazarAlFinal();
    },

    // Resto de métodos existentes (cargarConversaciones, cargarMensajes, etc.)
    async cargarConversaciones() {
      this.cargandoConversaciones = true;
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_BASE_URL}/api/mensajes/usuarios`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Para cada conversación, cargar la cantidad de mensajes no leídos
        const conversacionesConNoLeidos = await Promise.all(
          response.data.map(async (usuario) => {
            const noLeidosResponse = await axios.get(
              `${process.env.VUE_APP_BASE_URL}/api/mensajes/no-leidos/count/${usuario.id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            // Obtener último mensaje para determinar si es mío
            const ultimoMensaje = await this.obtenerUltimoMensaje(usuario.id);

            return {
              id: usuario.id,
              nombre: usuario.nombre,
              avatar: usuario.foto
                ? `${process.env.VUE_APP_BASE_URL}${usuario.foto}`
                : this.avatarPredeterminado,
              ultimoMensaje: usuario.ultimoMensaje || "",
              fechaUltimoMensaje: ultimoMensaje
                ? ultimoMensaje.fecha_envio
                : null,
              noLeidos: noLeidosResponse.data.noLeidos,
              esMioElUltimo: ultimoMensaje
                ? ultimoMensaje.emisor_id === this.usuarioId
                : false,
              ultimoMensajeLeido: ultimoMensaje ? ultimoMensaje.leido : true,
            };
          })
        );

        this.conversaciones = conversacionesConNoLeidos;
        this.cargarTotalNoLeidos();
      } catch (error) {
        console.error("Error al cargar conversaciones:", error);
        this.mostrarError("No se pudieron cargar las conversaciones");
      } finally {
        this.cargandoConversaciones = false;
      }
    },

    async obtenerUltimoMensaje(usuarioId) {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_BASE_URL}/api/mensajes/${usuarioId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        return response.data.length > 0
          ? response.data[response.data.length - 1]
          : null;
      } catch (error) {
        console.error("Error al obtener último mensaje:", error);
        return null;
      }
    },

    async cargarMensajes(usuarioId) {
      this.cargandoMensajes = true;
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_BASE_URL}/api/mensajes/${usuarioId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        this.mensajes = response.data;
        this.$nextTick(() => {
          this.desplazarAlFinal();
          this.inicializarIntersectionObserver();
        });
      } catch (error) {
        console.error("Error al cargar mensajes:", error);
        this.mostrarError("No se pudieron cargar los mensajes");
      } finally {
        this.cargandoMensajes = false;
      }
    },

    actualizarEstadoLecturaConversaciones(messageId) {
      const mensaje = this.mensajes.find((m) => m.id === messageId);
      if (mensaje) {
        this.conversaciones = this.conversaciones.map((conv) => {
          if (conv.id === mensaje.emisor_id) {
            const nuevosNoLeidos = Math.max(0, (conv.noLeidos || 0) - 1);
            return {
              ...conv,
              noLeidos: nuevosNoLeidos,
              ultimoMensajeLeido: mensaje.leido,
            };
          }
          return conv;
        });
        this.cargarTotalNoLeidos();
      }
    },

    // ... (resto de métodos existentes: enviarMensaje, eliminarMensaje, etc.)
    async enviarMensaje() {
      if (!this.nuevoMensaje.trim() || !this.conversacionActiva) return;

      this.cargandoEnvio = true;
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_BASE_URL}/api/mensajes/${this.conversacionActiva.id}`,
          { texto: this.nuevoMensaje },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const mensajeEnviado = response.data;
        socket.emit("sendMessage", {
          ...mensajeEnviado,
          recipientId: this.conversacionActiva.id,
        });

        this.mensajes.push(mensajeEnviado);
        this.nuevoMensaje = "";
        this.actualizarConversaciones(mensajeEnviado);
        this.$nextTick(() => {
          this.desplazarAlFinal();
        });
      } catch (error) {
        console.error("Error al enviar mensaje:", error);
        this.mostrarError("No se pudo enviar el mensaje");
      } finally {
        this.cargandoEnvio = false;
      }
    },
    actualizarConversaciones(mensaje) {
      const usuarioId =
        mensaje.emisor_id === this.usuarioId
          ? mensaje.receptor_id
          : mensaje.emisor_id;
      const conversacionExistente = this.conversaciones.find(
        (c) => c.id === usuarioId
      );

      if (conversacionExistente) {
        conversacionExistente.ultimoMensaje = mensaje.texto;
        conversacionExistente.fechaUltimoMensaje = mensaje.fecha_envio;
        conversacionExistente.esMioElUltimo =
          mensaje.emisor_id === this.usuarioId;
        conversacionExistente.ultimoMensajeLeido = mensaje.leido;

        // Incrementar `noLeidos` solo si el mensaje no está marcado como leído
        if (mensaje.emisor_id !== this.usuarioId && !mensaje.leido) {
          conversacionExistente.noLeidos =
            (conversacionExistente.noLeidos || 0) + 1;
        }

        // Mover la conversación al inicio de la lista
        this.conversaciones = this.conversaciones.filter(
          (c) => c.id !== usuarioId
        );
        this.conversaciones.unshift(conversacionExistente);
      } else {
        this.agregarNuevaConversacion(mensaje, usuarioId);
      }

      this.cargarTotalNoLeidos();
    },
    async agregarNuevaConversacion(mensaje, usuarioId) {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_BASE_URL}/api/mensajes/usuario/${usuarioId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const usuario = response.data;
        const noLeidos = mensaje.emisor_id !== this.usuarioId ? 1 : 0;

        const nuevaConversacion = {
          id: usuarioId,
          nombre: usuario.Nombre_Usuario,
          avatar: usuario.Foto
            ? `${process.env.VUE_APP_BASE_URL}${usuario.Foto}`
            : this.avatarPredeterminado,
          ultimoMensaje: mensaje.texto,
          fechaUltimoMensaje: mensaje.fecha_envio,
          noLeidos: noLeidos,
          esMioElUltimo: mensaje.emisor_id === this.usuarioId,
          ultimoMensajeLeido: mensaje.leido,
        };

        this.conversaciones.unshift(nuevaConversacion);
        this.cargarTotalNoLeidos();
      } catch (error) {
        console.error("Error al cargar información del usuario:", error);
      }
    },

    // ... (otros métodos: eliminarMensaje, mostrarModalUsuarios, etc.)
    async eliminarMensaje(mensajeId) {
      if (!confirm("¿Estás seguro de que quieres eliminar este mensaje?"))
        return;

      try {
        await axios.delete(
          `${process.env.VUE_APP_BASE_URL}/api/mensajes/${mensajeId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        this.mensajes = this.mensajes.filter(
          (mensaje) => mensaje.id !== mensajeId
        );
      } catch (error) {
        console.error("Error al eliminar mensaje:", error);
        this.mostrarError("No se pudo eliminar el mensaje");
      }
    },

    desplazarAlFinal() {
  console.log('🔍 desplazarAlFinal llamado');
  this.$nextTick(() => {
    const container = this.$refs.mensajesContainer;
    console.log('📦 Contenedor de mensajes:', container);
    
    if (container) {
      console.log('📊 Dimensiones del contenedor:');
      console.log('- scrollHeight:', container.scrollHeight);
      console.log('- clientHeight:', container.clientHeight);
      console.log('- scrollTop:', container.scrollTop);
      
      setTimeout(() => {
        console.log('🔄 Intentando desplazar después de timeout...');
        console.log('- Nuevo scrollHeight:', container.scrollHeight);
        container.scrollTop = container.scrollHeight;
        console.log('- scrollTop después de desplazar:', container.scrollTop);
      }, 100);
    } else {
      console.log('❌ Contenedor no encontrado');
    }
  });
},

    // Métodos de utilidad
    formatearFecha(fecha) {
      const fechaObj = new Date(fecha);
      const ahora = new Date();
      const diferencia = ahora - fechaObj;
      const minutos = Math.floor(diferencia / (1000 * 60));
      const horas = Math.floor(diferencia / (1000 * 60 * 60));

      if (minutos < 1) return "Ahora";
      if (minutos < 60) return `Hace ${minutos} min`;
      if (horas < 24) return `Hace ${horas} h`;

      return fechaObj.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },

    mostrarError(mensaje) {
      alert(mensaje);
    },

    // Métodos de estado de conexión (si los tienes implementados)
    obtenerEstadoUsuario(userId) {
      const estado = this.estadosUsuarios[userId];
      if (!estado) return "offline";
      return estado.status;
    },

    formatoEstadoChat(userId) {
      const estado = this.estadosUsuarios[userId];
      if (!estado) return "Desconectado";

      if (estado.status === "online") {
        return "En línea";
      } else {
        return `Última vez ${this.formatearUltimaVez(estado.lastSeen)}`;
      }
    },

    formatoEstadoModal(userId) {
      const estado = this.estadosUsuarios[userId];
      if (!estado) return "Desconectado";

      if (estado.status === "online") {
        return "En línea";
      } else {
        return `Desconectado - Visto ${this.formatearUltimaVez(
          estado.lastSeen
        )}`;
      }
    },

    formatearUltimaVez(fechaString) {
      if (!fechaString) return "recientemente";

      const fecha = new Date(fechaString);
      const ahora = new Date();
      const diferencia = ahora - fecha;
      const minutos = Math.floor(diferencia / (1000 * 60));
      const horas = Math.floor(diferencia / (1000 * 60 * 60));
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

      if (minutos < 1) return "hace un momento";
      if (minutos < 60) return `hace ${minutos} min`;
      if (horas < 24) return `hace ${horas} h`;
      if (dias === 1) return "ayer";
      if (dias < 7) return `hace ${dias} días`;

      return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
      });
    },

    // Métodos del modal
    mostrarModalUsuarios() {
      this.mostrarModal = true;
      this.cargarTodosUsuarios();
    },

    async cargarTodosUsuarios() {
      this.cargandoUsuarios = true;
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_BASE_URL}/api/mensajes`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        this.usuarios = response.data.map((usuario) => ({
          ...usuario,
          Foto: usuario.Foto
            ? `${process.env.VUE_APP_BASE_URL}${usuario.Foto}`
            : this.avatarPredeterminado,
        }));
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        this.mostrarError("No se pudieron cargar los usuarios");
      } finally {
        this.cargandoUsuarios = false;
      }
    },

    cerrarModal() {
      this.mostrarModal = false;
      this.busquedaUsuario = "";
    },

    async iniciarConversacion(usuarioId) {
      const conversacionExistente = this.conversaciones.find(
        (c) => c.id === usuarioId
      );

      if (conversacionExistente) {
        this.conversacionActiva = conversacionExistente;
      } else {
        try {
          const response = await axios.get(
            `${process.env.VUE_APP_BASE_URL}/api/mensajes/usuario/${usuarioId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          let usuario = response.data;
          usuario.Foto = usuario.Foto
            ? `${process.env.VUE_APP_BASE_URL}${usuario.Foto}`
            : this.avatarPredeterminado;

          const nuevaConversacion = {
            id: usuarioId,
            nombre: usuario.Nombre_Usuario,
            avatar: usuario.Foto,
            ultimoMensaje: "",
            fechaUltimoMensaje: "",
            noLeidos: 0,
            esMioElUltimo: false,
            ultimoMensajeLeido: true,
          };

          this.conversaciones.unshift(nuevaConversacion);
          this.conversacionActiva = nuevaConversacion;
        } catch (error) {
          console.error("Error al cargar usuario:", error);
          this.mostrarError("No se pudo cargar la información del usuario");
        }
      }

      this.cerrarModal();
    },
  },
};
</script>

<style scoped>
/* Estilos base (se mantienen igual) */
.mensajes-container {
  padding: 0;
  min-height: 88vh;
  background: var(--color-terciario);
  display: flex;
  flex-direction: column;
}

.mensajes-header {
  background: var(--color-primary);
  color: var(--color-secondary);
  padding: 1rem;
  position: sticky;
  top: 57px;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.boton-atras,
.boton-menu {
  background: none;
  border: none;
  color: var(--color-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.boton-atras:hover,
.boton-menu:hover {
  background: rgba(255, 255, 255, 0.1);
}

.badge-notificacion {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-weight: bold;
  min-width: 18px;
  text-align: center;
}

.mensajes-titulo {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0.25rem 0;
  line-height: 1.2;
}
.badge-total-no-leidos {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.mensajes-subtitulo {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 0;
}

.mensajes-content {
  display: flex;
  flex: 1;
  height: -webkit-fill-available;
  position: relative;
}

/* Estilos para el menú desplegable en móvil */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 98;
}

.conversaciones-listado {
  width: 100%;
  background: var(--color-secondary);
  border-right: 1px solid var(--color-terciario);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  z-index: 99;
  position: relative;
}

/* Comportamiento en móvil */
@media (max-width: 767px) {
  .conversaciones-listado {
    position: fixed;
    top: 126px;
    left: 0;
    bottom: 0;

    transform: translateX(-100%);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }

  .conversaciones-listado.menu-abierto {
    transform: translateX(0);
  }

  .conversaciones-listado.oculto-en-movil {
    display: none;
  }

  .mensajes-area.activo-en-movil {
    width: 100%;
  }

  .mensajes-vacio.oculto-en-movil {
    display: none;
  }

  .boton-atras-chat {
    background: none;
    border: none;
    color: var(--color-sexto);
    cursor: pointer;
    padding: 0.5rem;
    margin-right: 1rem;
    border-radius: 50%;
    transition: background 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .boton-atras-chat:hover {
    background: var(--color-terciario);
  }
}

/* Comportamiento en tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  .conversaciones-listado {
    width: 300px;
    min-width: 300px;
  }

  .boton-menu,
  .boton-atras,
  .boton-atras-chat {
    display: none;
  }
}

/* Comportamiento en escritorio */
@media (min-width: 1024px) {
  .conversaciones-listado {
    width: 400px;
    min-width: 400px;
  }

  .boton-menu,
  .boton-atras,
  .boton-atras-chat {
    display: none;
  }
}

/* Estilos para mensajes no leídos */
.conversacion-item.tiene-no-leidos {
  background: rgba(var(--color-primary-rgb), 0.05);
  border-left: 3px solid var(--color-primary);
}

.conversacion-ultimo-msj.no-leido {
  font-weight: 600;
  color: var(--color-primary) !important;
}

.badge-conversacion {
  background: var(--color-primary);
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 0.7rem;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
  margin-top: 0.25rem;
}

.estado-lectura {
  display: flex;
  align-items: center;
  margin-top: 0.25rem;
}

.icono-leido,
.icono-leido-doble {
  color: var(--color-leido-uno);
}

.icono-leido-doble {
  color: var(--color-leido-dos);
}

/* Estilos para mensajes en el chat */
.mensaje.no-leido .mensaje-contenido {
  background: rgba(var(--color-primary-rgb), 0.1);
  border: 1px solid rgba(var(--color-primary-rgb), 0.2);
}

.mensaje-metadata {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
  justify-content: flex-end;
}

.estado-lectura-mensaje {
  display: flex;
  align-items: center;
}

/* Indicador de nuevos mensajes */
.indicador-nuevos-mensajes {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.boton-nuevos-mensajes {
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.boton-nuevos-mensajes:hover {
  background: var(--color-cuarto);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

/* Resto de estilos existentes... */
.conversaciones-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--color-terciario);
}

.conversaciones-titulo {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-quinto);
  margin: 0;
}

.nueva-conversacion-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-primary);
  color: var(--color-secondary);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.nueva-conversacion-btn:hover {
  background: var(--color-cuarto);
}

.conversaciones-lista {
  flex: 1;
  overflow-y: auto;
}

.conversacion-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--color-terciario);
  cursor: pointer;
  transition: background 0.3s ease;
}

.conversacion-item:hover {
  background: var(--color-terciario);
}

.conversacion-item.activa {
  background: var(--color-primary);
  color: var(--color-secondary);
}

.conversacion-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
  flex-shrink: 0;
  position: relative;
}

.conversacion-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.estado-conexion {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--color-secondary);
}

.estado-conexion.online {
  background-color: #4caf50;
}

.estado-conexion.offline {
  background-color: #9e9e9e;
}

.conversacion-info {
  flex: 1;
  min-width: 0;
}

.conversacion-nombre {
  color: var(--color-quinto);
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversacion-item.activa .conversacion-nombre {
  color: var(--color-secondary);
}

.conversacion-ultimo-msj {
  font-size: 0.85rem;
  margin: 0;
  color: var(--color-sexto);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversacion-item.activa .conversacion-ultimo-msj {
  color: var(--color-terciario);
}

.conversacion-estado {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}

.conversacion-fecha {
  font-size: 0.75rem;
  color: var(--color-sexto);
}

.conversacion-item.activa .conversacion-fecha {
  color: rgba(255, 255, 255, 0.7);
}

.mensajes-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--color-secondary);
  position: relative;
}

.mensajes-header-chat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 126px;
  width: 100%;
  z-index: 399;
  box-sizing: border-box;
  background: var(--color-terciario);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-bottom: 1px solid var(--color-terciario);
}

.chat-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.chat-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
}

.chat-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-nombre {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--color-quinto);
}

.chat-estado {
  font-size: 0.85rem;
  margin: 0;
  color: var(--color-sexto);
}

.chat-estado.online {
  color: #4caf50;
}

.chat-acciones-btn {
  background: none;
  border: none;
  color: var(--color-sexto);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.chat-acciones-btn:hover {
  background: var(--color-secondary);
}

.mensajes-chat {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
}

.estado-carga-chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--color-sexto);
}

.mensajes-lista {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mensaje {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  max-width: 70%;
}

.mensaje.propio {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.mensaje-contenido {
  background: var(--color-primary);
  padding: 0.75rem 1rem;
  border-radius: 18px;
  position: relative;
  line-break: anywhere;
}

.mensaje.propio .mensaje-contenido {
  background: var(--color-accent);
  color: var(--color-secondary);
}

.mensaje-texto {
  color: var(--color-secondary);
  margin: 0 0 0.25rem 0;
  word-wrap: break-word;
}

.mensaje-fecha {
  color: var(--color-terciario);
  font-size: 0.7rem;
  opacity: 0.7;
}

.mensaje-eliminar {
  background: none;
  border: none;
  color: var(--color-sexto);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease, background 0.3s ease;
}

.mensaje:hover .mensaje-eliminar {
  opacity: 1;
}

.mensaje-eliminar:hover {
  background: rgba(0, 0, 0, 0.1);
}

.mensajes-formulario {
  padding: 1rem;
  border-top: 1px solid var(--color-terciario);
}

.input-container {
  display: flex;
  gap: 0.5rem;
}

.mensaje-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-terciario);
  border-radius: 24px;
  font-size: 1rem;
  background: var(--color-secondary);
  color: var(--color-quinto);
}

.mensaje-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.enviar-btn {
  background: var(--color-primary);
  color: var(--color-secondary);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease;
  flex-shrink: 0;
}

.enviar-btn:disabled {
  background: var(--color-sexto);
  cursor: not-allowed;
}

.enviar-btn:not(:disabled):hover {
  background: var(--color-cuarto);
}

.carga-spinner-mini {
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

.mensajes-vacio {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-secondary);
}

.mensajes-vacio-contenido {
  text-align: center;
  color: var(--color-sexto);
  max-width: 300px;
}

.mensajes-vacio-contenido svg {
  margin-bottom: 1rem;
}

.mensajes-vacio-contenido h3 {
  margin-bottom: 0.5rem;
  color: var(--color-quinto);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-contenido {
  background: var(--color-secondary);
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-terciario);
}

.modal-header h3 {
  margin: 0;
  color: var(--color-quinto);
  font-weight: 600;
}

.modal-cerrar {
  background: none;
  border: none;
  color: var(--color-sexto);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.modal-cerrar:hover {
  background: var(--color-terciario);
}

.modal-body {
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
}

.buscar-usuario-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-terciario);
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 1rem;
  background: var(--color-secondary);
  color: var(--color-quinto);
}

.buscar-usuario-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.usuarios-lista {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.usuario-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.usuario-item:hover {
  background: var(--color-terciario);
}

.usuario-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
}

.usuario-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.usuario-info h4 {
  margin: 0 0 0.25rem 0;
  color: var(--color-quinto);
  font-weight: 600;
}

.estado-carga,
.estado-vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: var(--color-sexto);
}

.carga-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-terciario);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .conversaciones-listado {
    width: 350px;
    position: fixed;
    height: inherit;
  }
  .mensajes-area, .mensajes-vacio {
    margin-left: 22rem;
  }
}
@media (min-width: 900px) {
  .mensajes-header {
    top: 95.2px;
  }
  .mensajes-header-chat {
    top: 164px;
  }
}

@media (min-width: 1024px) {
  .conversaciones-listado {
    width: 400px;
  }
  .mensajes-area, .mensajes-vacio {
    margin-left: 25rem;
  }
}

/* Variables CSS para colores (ajusta según tu tema) */
:root {
  --color-primary: #007bff;
  --color-primary-rgb: 0, 123, 255;
  --color-secondary: #ffffff;
  --color-terciario: #f8f9fa;
  --color-cuarto: #0056b3;
  --color-quinto: #333333;
  --color-sexto: #666666;
  --color-accent: #28a745;
}
</style>

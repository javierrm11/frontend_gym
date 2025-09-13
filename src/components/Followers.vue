<template>
    <div class="followers">
        <main class="followers-container">
            <header class="followers-header">
                <div class="profile-info">
                    <img :src="userData?.Foto" alt="Foto de perfil" class="profile-avatar" />
                    <h2 class="followers-title">{{ userData.Nombre_Usuario || "Usuario" }}</h2>
                </div>
                <div class="followers-volver" @click="$router.push({ path: `/profile/${userData.id}` })">
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
                        class="icon-volver"
                    >
                        <polyline points="15 18 9 12 15 6"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span class="volver-texto">Volver</span>
                </div>
            </header>
            <div class="followers-sections">
                <section class="followers-section">
                    <div class="header-section active-section">
                        <h3 class="section-title">{{ this.type === 'Seguidores' ? 'Seguidores' : 'Seguidos' }}</h3>
                    </div>
                </section>
                <div class="followers-section" @click="handleFollow()">
                    <div class="header-section disabled-section">
                        <h3 class="section-title">{{ this.type === 'Seguidores' ? 'Seguidos' : 'Seguidores' }}</h3>
                    </div>
                </div>
                    
                <div class="followers-grid">
                    <div v-if="currentList && currentList.length > 0">
                        <div
                            v-for="item in currentList"
                            :key="item.seguidor_id || item.seguido_id"
                            class="follower-card"
                        >
                            <img
                                :src="item.seguido?.Foto ? item.seguido.Foto : item.seguidor?.Foto"
                                alt="Avatar"
                                class="follower-avatar"
                            />
                            <h3 class="follower-name">{{ item.seguido?.Nombre_Usuario ? item.seguido.Nombre_Usuario : item.seguidor.Nombre_Usuario }}</h3>
                            <div class="followers-actions" v-if="type === 'Seguidos' && userData.id == $store.state.usuario">
                                <button
                                    v-if="type === 'Seguidos' && userData.id == $store.state.usuario"
                                    class="btn-action btn-follow"
                                    @click.stop="dejarDeSeguir(item.seguidor?.id)"
                                >
                                    Dejar de Seguir
                                </button>
                                <button
                                    v-if="type === 'Seguidores' && userData.id == $store.state.usuario"
                                    class="btn-action btn-unfollow"
                                    @click.stop="suprimir(item.seguido?.id)"
                                >
                                    Suprimir Seguidor
                                </button>
                            </div>
                        </div>
                    </div>
                    <p v-else class="no-followers">
                        {{ type === 'Seguidores' ? 'No tienes seguidores.' : 'No sigues a nadie.' }}
                    </p>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "FollowersList",
    data() {
        return {
            userData: {}, // Datos completos del usuario
            type: this.$route.params.type, // Tipo de lista (seguidores o seguidos)
            defaultAvatar: require("@/assets/users/predeterminada.png"),
        };
    },
    computed: {
        currentList() {
            // Devuelve la lista actual según el tipo
            return this.type === "Seguidores" ? this.userData.seguidores : this.userData.seguidos;
        },
    },
    mounted() {
        this.fetchUserData();
    },
    watch: {
        // Observa los cambios en la ruta
        "$route.params.type"(newType) {
            this.type = newType; // Actualiza el tipo
            this.fetchUserData(); // Vuelve a cargar los datos
        },
        "$route.params.id"() {
            
            this.fetchUserData(); // Vuelve a cargar los datos si cambia el ID
        },
    },
    methods: {
        fetchUserData() {
            axios
                .get(`${process.env.VUE_APP_BASE_URL}/api/user/${this.$route.params.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })
                .then((response) => {
                    this.userData = response.data || {};
                    if (this.userData.Foto) {
                        this.userData.Foto = `${process.env.VUE_APP_BASE_URL}${this.userData.Foto}`;
                    } else {
                        this.userData.Foto = this.defaultAvatar;
                    }
                    // Procesar listas de seguidores y seguidos
                    // Procesar fotos para seguidores y seguidos
                    ["seguidores", "seguidos"].forEach((key) => {
                        if (this.userData[key]) {
                            this.userData[key].forEach((item) => {
                                if (item.seguido && item.seguido.Foto) {
                                    item.seguido.Foto = `${process.env.VUE_APP_BASE_URL}${item.seguido.Foto}`;
                                } else if (item.seguido) {
                                    item.seguido.Foto = this.defaultAvatar;
                                }
                                if (item.seguidor && item.seguidor.Foto) {
                                    item.seguidor.Foto = `${process.env.VUE_APP_BASE_URL}${item.seguidor.Foto}`;
                                } else if (item.seguidor) {
                                    item.seguidor.Foto = this.defaultAvatar;
                                }
                            });
                        }
                    });
                })
                .catch((error) => {
                    console.error("Error al obtener los datos del usuario:", error);
                });
        },
        handleFollow() {
            // Redirige a la lista de seguidos o seguidores según el tipo
            if (this.type === "Seguidores") {
                this.$router.push({ path: `/followers/${this.$route.params.id}/Seguidos` });
            } else {
                this.$router.push({ path: `/followers/${this.$route.params.id}/Seguidores` });
            }
        },
        dejarDeSeguir(id){
        const userId = this.$store.state.usuario;
        axios
            .delete(`${process.env.VUE_APP_BASE_URL}/api/seguidores/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            data: {
                seguido_id: id,
                seguidor_id: userId,
            },
            })
            .then((response) => {
            console.log("Seguido correctamente:", response.data);
            this.fetchUserData();
            })
            .catch((error) => {
            console.error("Error al seguir al usuario:", error);
            });
        },
        suprimir(id) {
            const userId = this.$store.state.usuario;
            axios
            .delete(`${process.env.VUE_APP_BASE_URL}/api/seguidores/suprimir/${id}`, {
                headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                data: {
                    seguido_id: id,
                    seguidor_id: userId,
                },
            })
            .then((response) => {
                console.log("Seguidor eliminado correctamente:", response.data);
                this.fetchUserData();
            })
            .catch((error) => {
                console.error("Error al eliminar al seguidor:", error);
            });
        }
    }
};
</script>

<style scoped>

.followers {
  background: var(--color-terciario);
  min-height: 100vh;
}

.followers-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Header mejorado */
.followers-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
  color: var(--color-secondary);
  box-shadow: var(--shadow);
}
.profile-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-secondary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.followers-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  flex: 1;
  text-align: center;
}

.followers-volver {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all var(--transition-speed);
  color: var(--color-secondary);
  text-decoration: none;
}

.followers-volver:hover {
  background: var(--color-cuarto);
  transform: translateY(-2px);
}

.icon-volver {
  width: 20px;
  height: 20px;
}

.volver-texto {
  font-weight: 500;
}

/* Secciones de navegación */
.followers-sections {
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
}

.followers-section {
  display: inline-block;
  width: 50%;
  text-align: center;
}

.header-section {
  padding: 1.5rem;
  cursor: pointer;
  transition: all var(--transition-speed);
}

.header-section:hover {
  background: var(--color-accent);
}

.active-section {
  background: var(--color-primary);
  color: var(--color-secondary);
}

.disabled-section {
  background: var(--color-sexto);
  color: var(--color-secondary);
}

.disabled-section:hover {
  background: var(--color-quinto);
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

/* Grid de seguidores */
.followers-grid {
  padding: 1.5rem 0;
}

.follower-card {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  background: var(--color-secondary);
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
  box-shadow: var(--shadow);
  transition: all var(--transition-speed);
}

.follower-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.follower-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
  border: 2px solid var(--color-terciario);
}

.follower-name {
  flex: 1;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-quinto);
  margin: 0;
}

.followers-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-action {
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-speed);
  border: none;
  font-size: 0.9rem;
}

.btn-follow {
  background: var(--color-terciario);
  color: var(--color-error);
  border: 1px solid var(--color-error);
}

.btn-follow:hover {
  background: var(--color-error);
  color: var(--color-secondary);
}

.btn-unfollow {
  background: var(--color-terciario);
  color: var(--color-sexto);
  border: 1px solid #e2e8f0;
}

.btn-unfollow:hover {
  background: #e2e8f0;
  color: var(--color-quinto);
}

.no-followers {
  text-align: center;
  padding: 3rem;
  color: var(--color-sexto);
  font-size: 1.1rem;
  background: var(--color-secondary);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

/* Responsive */
@media (max-width: 768px) {
  .followers-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding: 1.5rem;
  }
  .follower-avatar{
    width: 40px;
    height: 40px;
  }
  .followers-title {
    font-size: 1.5rem;
  }
  
  .followers-section {
    width: 100%;
    display: block;
  }
  
  
  .followers-actions {
    justify-content: center;
  }
  .profile-info {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .profile-avatar {
    width: 64px;
    height: 64px;
  }
}

@media (max-width: 480px) {
  .followers-container {
    padding: 1rem;
  }
  
  .followers-header {
    padding: 1.25rem;
  }
  
  .header-section {
    padding: 1rem;
  }
  
  .follower-card {
    padding: 1rem;
  }
  
  .btn-action {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }
}
</style>
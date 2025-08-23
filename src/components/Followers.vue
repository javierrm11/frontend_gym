<template>
    <div class="followers">
        <main class="followers-container">
            <header class="followers-header">
                <img :src="userData?.Foto" alt="Foto de perfil" class="profile-avatar" />
                <h2 class="followers-title">{{ userData.Nombre_Usuario || "Usuario" }}</h2>
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
                            <div class="followers-actions">
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
    background: linear-gradient(90deg, var(--color-secondary), var(--color-accent), var(--color-secondary));
    width: 100%;
    text-align: -webkit-center;
}

.followers-container {
    padding: 0;
    background: var(--color-terciario);
    max-width: 900px;
    min-height: 92.8vh;
    position: relative;
}
.followers-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 1rem;
    gap: 2rem;
}
.profile-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
}
.followers-title {
    color: var(--color-accent);
    font-size: 1.5rem;
    font-weight: 600;
}
.followers-volver{
    position: absolute;
    top: 1rem;
    right: 1rem;

    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}
.icon-volver {
    width: 24px;
    height: 24px;
    color: var(--color-quinto);
}
.followers-volver .volver-texto {
    color: var(--color-quinto);
    font-size: 1rem;
    font-weight: 600;
}
.followers-sections {
    display: flex;
    flex-wrap: wrap;
}
.followers-section {
    flex: 1;
}
.followers-grid {
    flex: 0 0 100%;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
    box-sizing: border-box;
}
.follower-card {
    display: flex;
    align-items: center;
    gap: 1rem;
}
.header-section {
    background: var(--color-primary);
    padding: 0.5rem;
}
.section-title {
    font-size: 1.2rem;
    color: var(--color-secondary);
    margin: 1rem;
}
.follower-avatar {
    flex: 1;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: contain;
}
.disabled-section {
    cursor: pointer;
}
.active-section {
    cursor: default;
    border-bottom: 3px solid var(--color-quinto);
}
.active-section .section-title {
    color: var(--color-secondary);
}
.disabled-section .section-title {
    color: var(--color-terciario);
}
.followers-actions{
    flex: 15;
    display: flex;
    justify-content: flex-end;
}
.follower-name{
    flex: 1;
}
.btn-follow, .btn-unfollow {
  background: transparent;
  color: var(--color-error);
  border: 1px solid var(--color-error);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 600;
}
.btn-follow:hover, .btn-unfollow:hover {
  background: var(--color-error);
  color: var(--color-terciario);
}
</style>

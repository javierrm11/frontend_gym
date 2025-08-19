<template>
    <div id="info">
        <p>{{ $route.query.msg }}</p>
        <a href="/" class="btn-volver">Volver al inicio</a>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "MensajeInfo",
    data() {
        return {
            mensaje: "",
        };
    },
    async created() {
        const token = this.$route.query.token;
        if (token) {
            try {
                const response = await axios.get(`${process.env.VUE_APP_BASE_URL}/api/auth/verify?token=${token}`);
                this.mensaje = response.data.message || "Cuenta activada con éxito.";
            } catch (error) {
                console.error("Error verificando el token:", error);
                this.mensaje = "Hubo un error al activar la cuenta. Por favor, inténtalo de nuevo.";
            }
        }
    },
};
</script>

<style scoped>
#info {
    text-align: center;
    margin-top: 2rem;
    font-family: 'Poppins', sans-serif;
}

#info p {
    font-size: 1.2rem;
    color: var(--color-primary);
    margin-bottom: 1rem;
}

.btn-volver {
    display: inline-block;
    padding: 0.5rem 1rem;
    background-color: var(--color-accent);
    color: var(--color-secondary);
    text-decoration: none;
    border-radius: 8px;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.btn-volver:hover {
    background-color: #e69500;
}
</style>
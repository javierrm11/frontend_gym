<template>
    <div class="other-user">
        <h1>Perfil de Usuario</h1>
        <div class="user-info">
            <h2>{{ user?.Nombre }}</h2>
            <img :src="user?.Foto" alt="Foto de usuario" />
            <p><strong>Nombre de Usuario:</strong> {{ user?.Nombre_Usuario }}</p>
            <p><strong>Correo Electrónico:</strong> {{ user?.Email }}</p>
            <div v-if="user?.rutinas.length > 0">
                <h3>Rutinas:</h3>
                <div v-for="rutina in user.rutinas" :key="rutina.id" class="rutina" @click="verRutina(rutina.id)">
                    <h4>{{ rutina.Nombre }}</h4>
                    <p>{{ rutina.Descripcion }}</p>
                    <div v-if="rutina.rutinaEjercicio">
                        <h5>Ejercicios:</h5>
                        <div v-for="ejercicio in rutina.rutinaEjercicio" :key="ejercicio.id" class="ejercicio">
                            <p>{{ ejercicio.ejercicio.Nombre }}</p>
                            <img :src="ejercicio.ejercicio.Foto" alt="Foto de ejercicio" />
                            <p>Series: {{ ejercicio.Num_Series }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'OtherUser',
    data() {
        return {
            user: null,
        };
    },
    created() {
        this.fetchUser();
    },
    methods: {
        fetchUser() {
            const userId = this.$route.params.id;
            axios.get(`http://localhost:3000/api/user/${userId}`)
                .then(response => {
                    this.user = response.data;
                    // Si tiene foto personalizada, agregamos el host si no está completo
                    if (this.user.Foto) {
                        this.user.Foto = `http://localhost:3000${this.user.Foto}`;
                    } else {
                        this.user.Foto = require('@/assets/users/predeterminada.png');
                    }
                })
                .catch(error => {
                    console.error("Error fetching user data:", error);
                });
        },
        verRutina(id) {
            this.$router.push({ name: 'VerRutina', params: { id } });
        },
    }
}
</script>

<style>
.other-user {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Poppins', sans-serif;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.user-info {
    text-align: center;
}

.user-info h2 {
    color: #ff4500;
    margin-bottom: 10px;
}

.user-info img {
    width: 160px;
    height: 160px;
    object-fit: cover;
    border-radius: 50%;
    border: 4px solid #ff758c;
    margin-top: 16px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.user-info img:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.user-info p {
    font-size: 16px;
    color: #333;
    margin: 8px 0;
}

.rutina {
    margin-top: 20px;
    padding: 16px;
    border: 1px solid #eee;
    border-radius: 12px;
    background-color: #fafafa;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease;
    cursor: pointer;
}

.rutina:hover {
    transform: scale(1.02);
}

.rutina h4 {
    color: #333;
    margin-bottom: 6px;
}

.rutina p {
    color: #666;
    font-size: 14px;
}

.ejercicio {
    margin-top: 12px;
    background-color: #fff;
    padding: 12px;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    text-align: left;
}

.ejercicio p {
    margin: 6px 0;
    font-size: 14px;
    color: #444;
}

.ejercicio img {
    width: 100%;
    max-width: 300px;
    height: auto;
    border-radius: 12px;
    margin-top: 10px;
    object-fit: cover;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}
</style>
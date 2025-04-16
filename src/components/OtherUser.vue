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

</style>
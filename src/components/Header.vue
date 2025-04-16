<template>
    <header>
        <h1>Gym</h1>
        <nav>
            <ul>
                <li><router-link to="/">Inicio</router-link></li>
                <li v-if="!isLoggedIn"><router-link to="/login">Iniciar Sesión</router-link></li>
                <li v-if="!isLoggedIn"><router-link to="/register">Registrarse</router-link></li>
                <li v-if="isLoggedIn"><router-link to="/entrenamiento">Entrenamiento</router-link></li>
                <li v-if="isLoggedIn"><router-link to="/profile">Perfil</router-link></li>
                <li v-if="isLoggedIn" @click="handleLogout"><a href="">Cerrar Sesión</a></li>
            </ul>
        </nav>
    </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'HeaderPages',
    computed: {
        ...mapGetters(['isLoggedIn', 'usuario']),
    },
    methods: {
        ...mapActions(['logout']),
        handleLogout() {
            this.logout();
            this.$router.push('/');
        }
    }
}
</script>

<style>
body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}

header {
    background-color: #333;
    color: #fff;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

header h1 {
    margin: 0;
    font-size: 24px;
    color: #ff4500;
    flex: 0 0 200px;
}

nav ul {
    list-style: none;
    display: flex;
    gap: 15px;
    margin: 0;
    padding: 0;
}

nav ul li {
    margin: 0;
}

nav ul li a {
    text-decoration: none;
    color: #fff;
    font-size: 18px;
    padding: 8px 12px;
    transition: background-color 0.3s, color 0.3s;
    border-radius: 4px;
}

nav ul li a:hover {
    background-color: #ff4500;
    color: #fff;
}
</style>

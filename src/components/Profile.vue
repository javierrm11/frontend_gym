<template>
    <div id="profile">
        <h2>Perfil de Usuario</h2>
        <div class="profile-container">
            <div class="profile-info">
                <p><strong>Nombre de Usuario:</strong> {{ usuario.Nombre_Usuario }}</p>
                <p><strong>Nombre:</strong> {{ usuario.Nombre }}</p>
                <p><strong>Correo Electrónico:</strong> {{ usuario.Email }}</p>
                <p><strong>Descripción:</strong> {{ usuario.Descripcion }}</p>
                <div id="acciones">
                    <router-link to="/edit-profile">Editar Perfil</router-link>
                    <router-link to="/delete-profile">Eliminar Perfil</router-link>
                </div>
            </div>
            <div id="imagen">
                <img :src="usuario.Foto" alt="Imagen de Perfil">
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"

export default ({
    name: 'ProfileUser',
    data() {
        return {
            usuario: {}
        }
    },
    mounted() {
        axios.get('http://localhost:3000/api/user', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            this.usuario = response.data;
            if (!this.usuario.Foto) {
                this.usuario.Foto = require('@/assets/users/predeterminada.png');
            }
            console.log(this.usuario);
        })
        .catch(error => {
            console.error("Error al obtener el usuario:", error);
        });
    },
})
</script>

<style>
body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}

#profile {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
    color: #ff4500;
    margin-bottom: 20px;
    text-align: center;
}

.profile-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
}

.profile-info {
    flex: 1;
    padding: 10px;
}

.profile-info p {
    margin: 8px 0;
    color: #333;
}

#acciones {
    margin-top: 15px;
}

#acciones a {
    text-decoration: none;
    color: #fff;
    background-color: #ff4500;
    padding: 8px 12px;
    margin-right: 8px;
    border-radius: 4px;
    transition: background-color 0.3s;
}

#acciones a:hover {
    background-color: #e03e00;
}

#imagen {
    flex-shrink: 0;
}

#imagen img {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>

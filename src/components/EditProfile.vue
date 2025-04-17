<template>
    <div id="editar">
        <h2>Editar Perfil</h2>
        <form method="post" @submit.prevent="updateProfile">
            <div>
                <label for="nombre_usuario">Nombre de Usuario:</label>
                <input type="text" id="nombre_usuario" v-model="usuario.Nombre_Usuario" value="usuario.Nombre_Usuario">
            </div>
            <div>
                <label for="nombre">Nombre:</label>
                <input type="text" id="nombre" v-model="usuario.Nombre" value="usuario.Nombre">
            </div>
            <div>
                <label for="email">Correo Electrónico:</label>
                <input type="email" id="email" v-model="usuario.Email">
            </div>
            <div>
                <label for="imagen">Imagen de Perfil</label>
                <input type="file" id="imagen" @change="handleFileUpload">
            </div>
            <div>
                <label for="descripcion">Descripción:</label>
                <textarea id="descripcion" v-model="usuario.Descripcion"></textarea>
            </div>
            <div>
                <label for="password">Contraseña:</label>
                <input type="password" id="password" v-model="usuario.Password">
            </div>
            <button type="submit">Guardar Cambios</button>
        </form>
    </div>
</template>
<script>
import axios from "axios"

export default {
    name: 'EditProfile',
    data(){
        return {
            usuario: {},
            imagen: null
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
            console.log(this.usuario);
        })
        .catch(error => {
            console.error("Error al obtener el usuario:", error);
        });
    },
    methods: {
        handleFileUpload(event) {
            this.imagen = event.target.files[0];
        },
        updateProfile() {
            const formData = new FormData();

            formData.append('Nombre_Usuario', this.usuario.Nombre_Usuario);
            formData.append('Nombre', this.usuario.Nombre);
            formData.append('Email', this.usuario.Email);
            formData.append('Descripcion', this.usuario.Descripcion);
            formData.append('Password', this.usuario.Password);

            if (this.imagen) {
                formData.append('fotoPerfil', this.imagen);
            }

            axios.put('http://localhost:3000/api/user', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                console.log("Perfil actualizado:", response.data);
                this.$router.push('/profile');
            })
            .catch(error => {
                console.error("Error al actualizar el perfil:", error);
            });
        }

    }
}
</script>
<style>

</style>
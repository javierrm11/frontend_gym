<template>
    <main class="edit-main">
        <h2 class="edit-title">Editar Perfil</h2>
        <form class="edit-form" @submit.prevent="updateProfile">
            <div class="form-group">
                <label for="nombre_usuario" class="form-label">Nombre de Usuario:</label>
                <input 
                    type="text" 
                    id="nombre_usuario" 
                    v-model="usuario.Nombre_Usuario"
                    class="form-input"
                >
            </div>
            <div class="form-group">
                <label for="nombre" class="form-label">Nombre:</label>
                <input 
                    type="text" 
                    id="nombre" 
                    v-model="usuario.Nombre"
                    class="form-input"
                >
            </div>
            <div class="form-group">
                <label for="email" class="form-label">Correo Electrónico:</label>
                <input 
                    type="email" 
                    id="email" 
                    v-model="usuario.Email"
                    class="form-input"
                >
            </div>
            <div class="form-group">
                <label for="imagen" class="form-label">Imagen de Perfil</label>
                <input 
                    type="file" 
                    id="imagen" 
                    @change="handleFileUpload"
                    class="form-input"
                >
            </div>
            <div class="form-group full-width">
                <label for="descripcion" class="form-label">Descripción:</label>
                <textarea 
                    id="descripcion" 
                    v-model="usuario.Descripcion"
                    class="form-textarea"
                ></textarea>
            </div>
            <div class="form-group">
                <label for="password" class="form-label">Contraseña:</label>
                <input 
                    type="password" 
                    id="password" 
                    v-model="usuario.Password" 
                    placeholder="Dejar en blanco para no cambiar"
                    class="form-input"
                >
            </div>
            <div class="button-group">
                <button type="submit" class="form-button">Guardar Cambios</button>
            </div>
        </form>
    </main>
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
            
            if (this.usuario.Password) {
                formData.append('Password', this.usuario.Password);
            }

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
                console.log("Perfil actualizado exitosamente:", response.data);
                this.$router.push('/profile');
            })
            .catch(error => {
                console.error("Error al actualizar el perfil:", error);
            });
        }
    }
}
</script>

<style scoped>
.edit-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background-color: var(--background-light);
    min-height: 100vh;
}

.edit-title {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: var(--color-primary);
}

.edit-form {
    max-width: 800px;
    width: 100%;
    background-color: var(--color-secondary);
    border: 2px solid var(--color-primary);
    padding: 2rem;
    border-radius: var(--border-radius);
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.form-group {
    flex: 1 1 calc(50% - 1.5rem);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.full-width {
    flex: 1 1 100%;
}

.form-label {
    font-weight: bold;
    color: var(--text-secondary);
    font-size: 0.95rem;
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #444;
  border-radius: var(--border-radius);
  background-color: #2C2C2E;
  color: var(--text-primary);
  transition: border var(--transition-speed);
}

.form-input:focus,
.form-textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(163, 255, 18, 0.2);
}

.form-textarea {
    min-height: 120px;
    resize: vertical;
}

.button-group {
    flex: 1 1 100%;
    display: flex;
    justify-content: center;
    margin-top: 1rem;
}

.form-button {
    background-color: var(--color-primary);
    color: var(--text-primary);
    border: none;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: all var(--transition-speed);
    font-weight: 600;
    width: 100%;
    max-width: 300px;
}

.form-button:hover {
    background-color: var(--color-accent);
    color: var(--color-secondary);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(163, 255, 18, 0.3);
}

@media (max-width: 768px) {
    .edit-form {
        padding: 1.5rem;
    }
    
    .form-group {
        flex: 1 1 100%;
    }
    
    .edit-title {
        font-size: 1.75rem;
    }
}

@media (max-width: 480px) {
    .edit-main {
        padding: 1.5rem;
    }
    
    .edit-form {
        padding: 1.25rem;
    }
}
</style>
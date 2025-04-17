<template>
    <div id="main">
        <div class="rutinas-left">
            <form class="busqueda-form" @submit.prevent="rutinasUsuarios(busqueda)">
                <input type="text" v-model="busqueda" placeholder="Buscar rutina..." class="busqueda-input" />
                <button type="submit" class="busqueda-btn">Buscar</button>
            </form>
            <div class="rutina" v-for="rutina in rutinas" :key="rutina.id" @click="verUsuario(rutina.id)">
                <h2>{{ rutina.Nombre_Usuario }}</h2>
                <img :src="rutina.Foto" alt="Foto de rutina" />
                <div class="ejercicios">
                    <div class="ejercicio" v-for="ejercicio in rutina.rutinas" :key="ejercicio.id">
                        <h3>{{ ejercicio.Nombre }}</h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="rutinas-right">
            <div class="rutina grupo" v-for="grupo in grupos" :key="grupo.id" @click="ejerciciosCategoria(grupo.grupo)">
                <h2>{{ grupo.grupo }}</h2>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"

export default {
    name: 'IndexPage',
    data() {
        return {
            grupos: [],
            rutinas: [],
            busqueda: '',
        }
    },
    mounted() {
        this.rutinasUsuarios();

        axios.get('http://localhost:3000/api/rutinas/index')
        .then(response => {
            this.grupos = response.data;
        })
        .catch(error => {
            console.error("Error al obtener las rutinas:", error);
        });
    },
    methods: {
        rutinasUsuarios(busqueda) {
            axios.get(busqueda ? 'http://localhost:3000/api/rutinas?busqueda=' + busqueda : 'http://localhost:3000/api/rutinas')
            .then(response => {
                this.rutinas = response.data;
                this.rutinas.forEach(rutina => {
                    if (rutina.Foto) {
                        rutina.Foto = `http://localhost:3000${rutina.Foto}`;
                    } else {
                        rutina.Foto = require('@/assets/users/predeterminada.png');
                    }
                });
            })
            .catch(error => {
                console.error("Error al obtener las rutinas:", error);
            });
        },
        ejerciciosCategoria(grupo) {
            this.$router.push({ name: 'Categoria', params: { nombre: grupo } });
        },
        verRutina(id) {
            this.$router.push({ name: 'VerRutina', params: { id } });
        },
        verUsuario(id) {
            this.$router.push({ name: 'OtherUser', params: { id } });
        }
    }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

body {
    font-family: 'Poppins', sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #ff7eb3, #ff758c);
    color: #333;
}

#main {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: flex-start;
    height: 100vh;
    padding: 20px;
    gap: 20px;
}

.rutinas-left {
    flex: 2;
    height: 100%;
    padding: 20px;
    background: linear-gradient(135deg, #ffffff, #f3f3f3);
    border-radius: 16px;
    overflow-y: auto;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
.rutina img {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 50%;
    border: 4px solid #ff758c;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    margin-top: 10px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.rutina:hover img {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}
.busqueda-form {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    background: #fff;
    padding: 12px 16px;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
    align-items: center;
}

.busqueda-input {
    flex: 1;
    padding: 10px 14px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    background-color: #f3f3f3;
    transition: background-color 0.3s ease;
}

.busqueda-input:focus {
    outline: none;
    background-color: #eaeaea;
}

.busqueda-btn {
    padding: 10px 16px;
    background: linear-gradient(135deg, #ff7eb3, #ff758c);
    border: none;
    color: #fff;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.2s ease;
}

.busqueda-btn:hover {
    background: linear-gradient(135deg, #ff4e92, #ff2d6f);
    transform: scale(1.05);
}

.rutinas-right {
    flex: 1;
    height: 100%;
    padding: 20px;
    background: linear-gradient(135deg, #ffe6e6, #ffcccc);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.grupo {
    margin: 10px 0;
    padding: 20px;
    background: linear-gradient(135deg, #ff7eb3, #ff758c);
    border-radius: 16px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
    color: #fff;
    font-weight: 600;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.grupo:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.rutina {
    background: linear-gradient(135deg, #ffffff, #f9f9f9);
    margin: 10px;
    padding: 20px;
    border-radius: 16px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.rutina:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.ejercicios {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 10px;
    margin-top: 10px;
}

.ejercicio {
    margin: 8px 0;
    flex: 1 1 45%;
    padding: 12px;
    background: linear-gradient(135deg, #f9f9f9, #ffffff);
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.ejercicio:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

h2 {
    color: #ff4500;
    margin: 5px 0;
}

h3 {
    color: #555;
}

img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    margin-top: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
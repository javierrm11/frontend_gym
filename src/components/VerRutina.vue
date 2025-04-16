<template>
    <div>
        <h1>Rutina Detallada</h1>
        <div v-if="rutina">
            <h2>{{ rutina.Nombre }}</h2>
            <div class="ejercicios">
                <div class="ejercicio" v-for="ejercicio in ejercicios" :key="ejercicio.id">
                    <h3>{{ ejercicio.Nombre }}</h3>
                    <p>Descripción: {{ ejercicio.Descripcion }}</p>
                    <p>Categoria: {{ ejercicio.Categoria }}</p>
                    <p>Series: {{ ejercicio.Num_Series }}</p>
                </div>
            </div>
            <button @click="copiarRutina(this.rutina)">Copiar Rutina</button>
        </div>
        <div v-else>
            <p>Cargando rutina...</p>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: 'VerRutina',
    mounted() {
        this.obtenerRutina();
    },
    data() {
        return {
            rutina: null,
            ejercicios: []
        }
    },
    methods: {
        obtenerRutina() {
            const id = this.$route.params.id;
            axios.get(`http://localhost:3000/api/rutinas/${id}`)
                .then(response => {
                    this.rutina = response.data[0];
                    this.ejercicios = response.data[0].ejercicios;
                })
                .catch(error => {
                    console.error("Error al obtener la rutina:", error);
                });
        },
        copiarRutina(rutina){
            axios.post("http://localhost:3000/api/rutinas", {
                Nombre: rutina.Nombre,
                Descripcion: rutina.Descripcion,
            },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => {
                this.rutina.ejercicios.forEach(ejercicio => {
                    axios.post("http://localhost:3000/api/ejercicio", {
                        Nombre_Rutina: response.data.Nombre,
                        Nombre_Ejercicio: ejercicio.Nombre,
                        Descripcion: ejercicio.Descripcion,
                        Num_Series: ejercicio.Num_Series
                    },{
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                    .then(response => {
                        console.log('Ejercicio copiado:', response.data);
                    })
                    .catch(error => {
                        console.log('Error copiando ejercicio:', error);
                    });
                })
            })
            .catch(error => {
                console.log('Error copiando rutina:', error);
            });
        }
    }
}
</script>

<style>

</style>
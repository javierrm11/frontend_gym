<template>
    <div>
        <h1>{{ nombre }}</h1>
        <div class="ejercicios">
            <div class="ejercicio" v-for="ejercicio in ejercicios" :key="ejercicio.id">
                <h3>{{ ejercicio.Nombre }}</h3>
                <img :src="`/ejercicios/${ejercicio.Categoria}/${ejercicio.Foto}`" alt="Foto de ejercicio"/>
                <p>{{ ejercicio.Descripcion }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name: 'CategoriaPage',
    data() {
        return {
            nombre: this.$route.params.nombre,
            ejercicios: []
        }
    },
    mounted() {
        this.obtenerEjerciciosPorCategoria();
    },
    methods: {
        obtenerEjerciciosPorCategoria() {
            const grupo = this.$route.params.nombre;
            axios.get(`http://localhost:3000/api/ejercicio/${grupo}`)
            .then(response => {
                this.ejercicios = response.data;
            })
            .catch(error => {
                console.error("Error al obtener los ejercicios:", error);
            });
        }
    }
}
</script>

<style>

</style>
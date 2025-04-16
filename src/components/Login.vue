<template>
    <div id="login">
        <form action="" method="post" @submit.prevent="login">
            <h2>Login de Usuario</h2>
            <div class="form-group">
                <label for="nombreUsuario">Nombre de Usuario</label>
                <input type="text" name="nombreUsuario" id="nombreUsuario" class="form-control" v-model="nombreUsuario">
            </div>
            <div class="form-group">
                <label for="password">Contraseña</label>
                <input type="password" name="password" id="password" class="form-control" v-model="password">
            </div>
            <button type="submit" class="btn btn-primary">Iniciar Sesión</button>

        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default ({
    name: 'LoginUser',
    data(){
        return {
            nombreUsuario: '',
            password: '',
            errores: []
        }
    },
    methods: {
        login(){
            this.errores = [];
            if(this.nombreUsuario === ''){
                this.errores.push('El nombre de usuario es obligatorio');
            }
            if(this.password === ''){
                this.errores.push('La contraseña es obligatoria');
            }
            if(this.errores.length === 0){
                // Petición POST a la API
                axios.post('http://localhost:3000/api/auth/login', {
                    nombreUsuario: this.nombreUsuario,
                    password: this.password
                })
                .then(response => {
                    // expiración del token de 1 hora
                    const token = response.data.token;
                    const usuario = response.data.idUser;
                    const payload = token.split('.')[1];
                    const decoded = atob(payload);
                    const jwtData = JSON.parse(decoded);
                    const exp = jwtData.exp;
                    const expirationDate = new Date(exp * 1000);

                   this.$store.dispatch('login', { token, usuario, expirationDate });
                    // Redirigir a la página de inicio
                    this.$router.push('/');
                })
                .catch(error => {
                    console.log(error);
                    this.errores.push('Error al iniciar sesión');
                });
            }
        }
    }
})
</script>

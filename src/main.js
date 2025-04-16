// Importaciones principales
import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Register from './components/Register.vue';
import Login from './components/Login.vue';
import Mensaje from './components/Mensaje.vue';
import Index from './components/Index.vue';
import Logout from './components/Logout.vue';
import Profile from './components/Profile.vue';
import EditProfile from './components/EditProfile.vue';
import DeleteProfile from './components/DeleteProfile.vue';
import Entrenamiento from './components/Entrenamiento.vue';
import AnadirEntrenamiento from './components/AnadirEntrenamiento.vue';
import VerEntrenamiento from './components/VerEntrenamiento.vue';
import EjecutarEntrenamiento from './components/EjecutarEntrenamiento.vue';
import Categoria from './components/Categoria.vue';
import VerRutina from './components/VerRutina.vue';
import OtherUser from './components/OtherUser.vue';
import store from './store';


// Definir rutas directamente en main.js
const routes = [
  {
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/register',
    name: 'RegisterUser',
    component: Register
  },
  {
    path: '/login',
    name: 'LoginUser',
    component: Login
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/profile/:id',
    name: 'OtherUser',
    component: OtherUser,
    props: true
  },
  {
    path: '/edit-profile',
    name: 'EditProfile',
    component: EditProfile,
  },
  {
    path: '/delete-profile',
    name: 'DeleteProfile',
    component: DeleteProfile,
  },
  {
    path: '/logout',
    name: 'LogoutUser',
    component: Logout
  },
  {
    path: '/mensaje',
    name: 'Mensaje',
    component: Mensaje,
    props: true
  },
  {
    path: '/entrenamiento',
    name: 'Entrenamiento',
    component: Entrenamiento
  },
  {
    path: '/anadirEntrenamiento',
    name: 'AnadirEntrenamiento',
    component: AnadirEntrenamiento
  },
  {
    path: '/verEntrenamiento/:id',
    name: 'VerEntrenamiento',
    component: VerEntrenamiento,
    props: true
  },
  {
    path: '/ejecutarEntrenamiento/:id',
    name: 'EjecutarEntrenamiento',
    component: EjecutarEntrenamiento,
    props: true
  },
  {
    path: '/categoria/:nombre',
    name: 'Categoria',
    component: Categoria,
    props: true
  },
  {
    path: '/verRutina/:id',
    name: 'VerRutina',
    component: VerRutina,
    props: true
  }
];

// Crear el enrutador
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Crear la aplicación Vue
const app = createApp(App);

// Usar el enrutador
app.use(router);

app.use(store); // Usar el store

// Montar la aplicación
app.mount('#app');
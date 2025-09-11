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
import Followers from './components/Followers.vue';
import Inicio from './components/Inicio.vue';
import error from './components/404.vue';
import store from './store';


// Definir rutas directamente en main.js
const routes = [
  {
    path: '/inicio',
    name: 'index',
    component: Index
  },
  {
    path: '/',
    name: 'Inicio',
    component: Inicio
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
    component: Profile,
    meta: { requiereAuth: true }
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
    meta: { requiereAuth: true }
  },
  {
    path: '/delete-profile',
    name: 'DeleteProfile',
    component: DeleteProfile,
    meta: { requiereAuth: true }
  },
  {
    path: '/logout',
    name: 'LogoutUser',
    component: Logout,
    meta: { requiereAuth: true }
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
    component: Entrenamiento,
    meta: { requiereAuth: true }
  },
  {
    path: '/anadirEntrenamiento',
    name: 'AnadirEntrenamiento',
    component: AnadirEntrenamiento,
    meta: { requiereAuth: true }
  },
  {
    path: '/verEntrenamiento/:id',
    name: 'VerEntrenamiento',
    component: VerEntrenamiento,
    props: true,
    meta: { requiereAuth: true }
  },
  {
    path: '/ejecutarEntrenamiento/:id',
    name: 'EjecutarEntrenamiento',
    component: EjecutarEntrenamiento,
    props: true,
    meta: { requiereAuth: true }
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
  },
  {
    path: '/error',
    name: 'error',
    component: error
  },
  {
    path: '/followers/:id/:type',
    name: 'Followers',
    component: Followers,
    props: true
  }
];

// Crear el enrutador
const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Si requiere login y no hay usuario → redirigir a /login
  if (to.meta.requiereAuth && !usuario) {
    return next("/login");
  }

  // Evitar que un usuario acceda a rutas de otro
  if (to.name === "OtherUser" && usuario) {
    if (to.params.id === usuario.id) {
      // Si intenta acceder a su propio perfil con /profile/:id lo mandamos a /profile
      return next("/profile");
    }
  }

  if (to.name === "Profile" && usuario) {
    // Aquí puedes reforzar que siempre vea solo su perfil
    // Si no está logueado ya lo frenamos arriba
    return next();
  }

  next();
});

// Crear la aplicación Vue
const app = createApp(App);

// Usar el enrutador
app.use(router);

app.use(store); // Usar el store

// Montar la aplicación
app.mount('#app');
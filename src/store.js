import { createStore } from 'vuex';
import socket from './services/socket';

const store = createStore({
    state: {
        isLoggedIn: !!localStorage.getItem('token'),
        usuario: localStorage.getItem('usuario') || null,
    },
    mutations: {
        login(state, usuario) {
            state.isLoggedIn = true;
            state.usuario = usuario;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.usuario = null;
        }
    },
    actions: {
        login({ commit }, { token, usuario, expirationDate }) {
            localStorage.setItem('token', token);
            localStorage.setItem('usuario', usuario);
            localStorage.setItem('expirationDate', expirationDate);
            commit('login', usuario);
        },
        logout({ commit }) {
            const usuarioId = localStorage.getItem('usuario'); // si tienes el usuario en el state
            console.log('Desconectando usuario:', usuarioId);
            
      // Notificar al servidor que el usuario se desconecta (opcional)


      // Desconectar el socket
      socket.disconnect();
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            localStorage.removeItem('expirationDate');
            commit('logout');
        },
    },
    getters: {
        isLoggedIn: (state) => state.isLoggedIn,
        usuario: (state) => state.usuario,
    }
});

export default store;

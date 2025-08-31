import { createStore } from 'vuex';

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

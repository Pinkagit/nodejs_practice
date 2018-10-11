import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)

const state = {
    TOKEN: window.sessionStorage.getItem('token') || window.localStorage.getItem('token'),
    USER: window.sessionStorage.getItem('user') || window.localStorage.getItem('user'),
}

const mutations = {
    // 用户登入
    LOGIN: (state, params) => {
        state.TOKEN = params.token;
        state.USER = params.username;
        window.sessionStorage.setItem('token', params.token);
        window.sessionStorage.setItem('user', params.username);
    },

    // 保持登入
    KEEP_LOGIN:(state, params) => {
        window.localStorage.setItem('token', params.token);
        window.localStorage.setItem('user', params.username);
    },

    // 不保持登入
    NOT_KEEP_LOGIN: (state) => {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user');
    },
    
    // 用户登出
    LOGOUT: (state) => {
        state.TOKEN = null;
        state.USER = null;
        window.sessionStorage.removeItem('token');
        window.sessionStorage.removeItem('user');
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user');
    },
}

export default new vuex.Store({
    state,
    mutations,
})
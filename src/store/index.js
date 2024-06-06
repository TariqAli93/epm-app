import Vue from 'vue'
import Vuex from 'vuex'
import localStoragePlugin from '../plugins/localStoragePlugin.js'

const persistedState = localStorage.getItem('store')

Vue.use(Vuex)

export default new Vuex.Store({
  state: persistedState
    ? JSON.parse(persistedState)
    : {
        user: {},
        token: null,
        selected_project: null,
      },
  getters: {
    isLoggedIn: (state) => state.token !== null,
    user: (state) => state.user,
    token: (state) => state.token,
    selected_project: (state) => state.selected_project,
  },
  mutations: {
    login: (state, payload) => {
      state.user = payload.user
      state.token = payload.token
    },
    logout: (state) => {
      state.user = {}
      state.token = null
    },
    select_project: (state, payload) => {
      state.selected_project = payload.selected_project
    },
  },
  actions: {
    login: ({ commit }, payload) => {
      commit('login', payload)
    },
    logout: ({ commit }) => {
      commit('logout')
    },
    select_project: ({ commit }, payload) => {
      commit('select_project', payload)
    },
  },
  modules: {},
  plugins: [localStoragePlugin],
})

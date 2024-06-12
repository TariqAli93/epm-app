import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Toasted from 'vue-toasted'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { EventBus } from './plugins/eventBus'

Vue.config.productionTip = false

Vue.use(Toasted)
Vue.use(VueAxios, axios)

Vue.axios.defaults.baseURL = 'http://localhost:5678/api/'
// Vue.axios.defaults.baseURL = 'http://200.234.231.226:5678/api/'

axios.interceptors.request.use(
  function (config) {
    // Set loading to true before any request is made
    EventBus.$emit('loading', true)
    // You can do other configurations here, such as adding headers
    return config
  },
  function (error) {
    // Do something with request error
    EventBus.$emit('loading', false)
    return Promise.reject(error)
  },
)

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    EventBus.$emit('loading', false)
    return response
  },
  function (error) {
    // Do something with response error
    EventBus.$emit('loading', false)
    return Promise.reject(error)
  },
)

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
  created() {
    // Prevent blank screen in Electron builds
    if (this.$route.path !== '/') {
      this.$router.push('/')
    }
  },
}).$mount('#app')

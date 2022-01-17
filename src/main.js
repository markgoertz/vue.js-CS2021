import Vue from 'vue'
import App from './App.vue'
import axios from "axios"
import vuetify from './plugins/vuetify'
import router from "./router";

Vue.config.productionTip = false

axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Accept'] = '*/*';
axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, DELETE, PUT';

Vue.config.productionTip = false
export const appurl = 'http://localhost:8080';

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

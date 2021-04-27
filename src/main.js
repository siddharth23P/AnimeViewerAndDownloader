import Vue from 'vue'
import App from './App.vue'
import VueSwal from 'vue-swal';
Vue.use(VueSwal);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')


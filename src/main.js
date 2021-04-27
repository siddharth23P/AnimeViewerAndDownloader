import Vue from 'vue'
import App from './App.vue'
import VueSwal from 'vue-swal';
import VueCookies from 'vue-cookies'
Vue.use(VueCookies);
Vue.use(VueSwal);
Vue.config.productionTip = false
Vue.$cookies.config('30d')
new Vue({
  render: h => h(App),
}).$mount('#app')


import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import lcordCommon from './server_API/index'
import lcordAPI from './server_API/functions'

Vue.config.productionTip = false

Vue.prototype.$commAPI = lcordCommon.comFunction
Vue.prototype.$defs = lcordCommon.defs
Vue.prototype.$lcordAPI = lcordAPI.apis

import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

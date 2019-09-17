// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import lcordCommon from './server_API/index'
import lcordAPI from './server_API/functions'
Vue.prototype.$commAPI = lcordCommon.comFunction
Vue.prototype.$lcordAPI = lcordAPI.apis

import VueCookie from 'vue-cookie'
Vue.use(VueCookie)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

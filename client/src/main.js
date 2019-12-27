// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import 'es6-promise/auto'
import Vue from 'vue'
import App from './App'
import router from './router'

import store from './store'

import lcordCommon from './server_API/index'
import lcordAPI from './server_API/functions'
Vue.prototype.$commAPI = lcordCommon.comFunction
Vue.prototype.$defs = lcordCommon.defs
Vue.prototype.$lcordAPI = lcordAPI.apis

import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
Vue.use(VueSidebarMenu)

import VModal from 'vue-js-modal'
Vue.use(VModal, { dynamic: true })

Vue.component('vue-multiselect', window.VueMultiselect.default)

import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router, store,
  components: { App },
  template: '<App/>'
})

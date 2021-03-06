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

import "vue-navigation-bar/dist/vue-navigation-bar.css";
import VueNavigationBar from "vue-navigation-bar";
Vue.component("vue-navigation-bar", VueNavigationBar);

import VModal from 'vue-js-modal'
Vue.use(VModal, { dynamic: true, dialog: true })

Vue.component('vue-multiselect', window.VueMultiselect.default)

import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)


import ModalLoading from './components/module/loading'
Vue.component('modal-loading', ModalLoading)

import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/index.css';
Vue.use(VueToast);

Vue.prototype.$EventBus = new Vue();

import VueHtml2Canvas from 'vue-html2canvas'

Vue.config.productionTip = false
Vue.use(VueHtml2Canvas)

import VueGoodTablePlugin from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css'
Vue.use(VueGoodTablePlugin);

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router, store,
  components: { App },
  template: '<App/>'
})

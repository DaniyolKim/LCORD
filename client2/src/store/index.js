import Vue from 'vue'
import Vuex from 'vuex'

import storeUser from './storeUser'
import storePlayers from './storePlayers'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    storeUser, storePlayers,
  }
})

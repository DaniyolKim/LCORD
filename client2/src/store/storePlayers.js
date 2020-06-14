const state = {
  playerList: []
}

const getters = {
  getPlayerList: state => {
    return state.playerList
  },
}

const mutations = {
  clearPlayerList(state) {
    state.playerList = []
  },
  updatePlayerList(state, value) {
    state.playerList = value
  },
}

const actions = {
  clearPlayerList({commit}) {
    commit('clearPlayerList')
  },
  updatePlayerList ({commit}, value) {
    commit('updatePlayerList', value)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

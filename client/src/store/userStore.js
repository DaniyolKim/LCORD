const state = {
  userId: '',
  userToken: '',
}

const getters = {
  getUserId: state => {
    return state.userId
  },
  getUserToken: state => {
    return state.userToken;
  }
}

const mutations = {
  updateUserId(state, value) {
    state.userId = value
  },
  updateUserToken(state, value) {
    state.userToken = value
  },
  clearUserInfo(state) {
    state.userId = ''
    state.userToken = ''
  }
}

const actions = {
  updateUserId ({commit}, value) {
    commit('updateUserId', value)
  },
  updateUserToken({commit}, value) {
    commit('updateUserToken', value)
  },
  clearUserInfo({commit}) {
    commit('clearUserInfo')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
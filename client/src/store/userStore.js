const state = {
  userDBIndex: '',
  userId: '',
  userToken: '',
}

const getters = {
  getUserDBIndex: state => {
    return state.userDBIndex
  },
  getUserId: state => {
    return state.userId
  },
  getUserToken: state => {
    return state.userToken;
  }
}

const mutations = {
  updateUserDBIndex(state, value) {
    state.userDBIndex = value
  },
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
  updateUserDBIndex ({commit}, value) {
    commit('updateUserDBIndex', value)
  },
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

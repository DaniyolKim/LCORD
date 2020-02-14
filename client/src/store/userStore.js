const state = {
  userDBIndex: '',
  userId: '',
  userToken: '',
}

const getters = {
  getUserDBIndex: state => {
    return state.userDBIndex
    //return localStorage.getItem('userDBIndex')
  },
  getUserId: state => {
    return state.userId
    //return localStorage.getItem('userId')
  },
  getUserToken: state => {
    return state.userToken;
    //return localStorage.getItem('userToken')
  }
}

const mutations = {
  updateUserDBIndex(state, value) {
    state.userDBIndex = value
    //localStorage.setItem('userDBIndex', value)
  },
  updateUserId(state, value) {
    state.userId = value
    //localStorage.setItem('userId', value)
  },
  updateUserToken(state, value) {
    state.userToken = value
    //localStorage.setItem('userToken', value)
  },
  clearUserInfo(state) {
    state.userId = ''
    state.userToken = ''
    //localStorage.clear()
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

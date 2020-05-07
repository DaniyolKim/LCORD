const state = {
  userInfo: ''
}

const getters = {
  getUserDBIndex: state => {
    return state.userInfo._id
  },
  getUserId: state => {
    return state.userInfo.userId
  },
  getUserToken: state => {
    return state.userInfo.token
  },
  getUserRole: state => {
    return state.userInfo.role
  },
  getUserInfo: state => {
    return state.userInfo
  }
}

const mutations = {
  clearUserInfo(state) {
    localStorage.clear()
    state.userInfo = ''
  },
  updateUserInfo(state, value) {
    state.userInfo = value
  },
}

const actions = {
  clearUserInfo({commit}) {
    commit('clearUserInfo')
  },
  updateUserInfo ({commit}, value) {
    commit('updateUserInfo', value)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

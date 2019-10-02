import axios from "axios"
import comm from './index'
import store from '../store'
const urls = comm.urls

const apis = {
  /*async sample () {
    return await axios.get(comm.urls.getToken)
      .then(resp =>{
        console.log(resp.data)
        return resp
      })
      .catch(error => {
        console.log(error.response)
        return error
      })
  },*/
  async getUserToken (loginInfo) {
    return await axios.post(urls.getToken, loginInfo)
      .then(resp =>{
        store.dispatch('updateUserId', loginInfo.userId)
        store.dispatch('updateUserToken', resp.data.token)
        axios.defaults.headers.common['Authorization'] = store.getters.getUserToken

        return resp.data
      })
      .catch(error => {
        return error
      })
  },

  async createAccount (accountInfo) {
    return await axios.post(urls.getUser, accountInfo)
      .then(resp =>{
        return resp
      })
      .catch(error => {
        return error
      })
  },

  async getUserInfo (userId) {
    //axios.defaults.headers.common['Authorization'] = store.getters.getUserToken
    return await axios.get(urls.getUser + userId)
      .then(resp =>{
        return resp.data
      })
      .catch(error => {
        return error
      })
  },
}

export default {
  apis,
}

import axios from "axios";
import comm from './index'

import Vue from 'vue'
import VueCookie from 'vue-cookie'
Vue.use(VueCookie)

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
    return await axios.post(comm.urls.getToken, loginInfo)
      .then(resp =>{
        axios.defaults.withCredentials = true
        Vue.cookie.set('userId', loginInfo.userId, 1)
        Vue.cookie.set('userToken', resp.data.token, 1)

        return resp.data
      })
      .catch(error => {
        return error
      })
  },

  async createAccount (accountInfo) {
    return await axios.post(comm.urls.getUser, accountInfo)
      .then(resp =>{
        return resp
      })
      .catch(error => {
        return error
      })
  },

  async getUserInfo (userId) {
    return await axios.get(comm.urls.getUser + userId,
      { headers: {
          Cookie: Vue.cookie.get('userToken'),
          withCredentials: true,
        }
      })
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

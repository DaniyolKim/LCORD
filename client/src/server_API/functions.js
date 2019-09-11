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
      })
      .catch(error => {
        console.log(error.response)
      })
  },*/
  async getUserToken (loginInfo) {
    return await axios.post(comm.urls.getToken, loginInfo)
      .then(resp =>{
        //console.log(resp.data)
        axios.defaults.withCredentials = true
        Vue.cookie.set('userToken', resp.data.token, 1)

        //go to main page
      })
      .catch(error => {
        console.log(error.response)
      })
  },
  async getUserInfo (userId) {
    return await axios.get(comm.urls.getUser + userId, {headers: { Cookie: Vue.cookie.get('userToken') }})
      .then(resp =>{
        console.log(resp.data)
      })
      .catch(error => {
        console.log(error.response)
      })
  },
}

export default {
  apis,
}

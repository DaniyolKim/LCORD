import axios from "axios";
import comm from './index'
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
        localStorage.userToken = resp.data.token
        localStorage.userId = loginInfo.userId
        axios.defaults.headers.common['Authorization'] = localStorage.userToken

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

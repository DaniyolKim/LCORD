import axios from "axios"
import comm from './index'
import store from '../store'
const urls = comm.urls

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

const apis = {
  user: {
    async getToken (loginInfo) {
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

    async create (accountInfo) {
      return await axios.post(urls.getUser, accountInfo)
        .then(resp =>{
          return resp
        })
        .catch(error => {
          return error
        })
    },

    async getAllUsers () {
      return await axios.get(urls.getUser)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          return error
        })
    },

    async getInfo (userId) {
      return await axios.get(urls.getUser + userId)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          return error
        })
    },
  },

  league: {
    async create (leagueData) {
      return await axios.post(comm.urls.league, leagueData)
        .then(resp =>{
        console.log(resp.data)
        return resp
      })
      .catch(error => {
        console.log(error.response)
        return error
      })
    },

    async getInfo (leagueName) {
      return await axios.get(comm.urls.league + leagueName)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    },

    async getListByProgress (isGoing) {
      return await axios.get(comm.urls.league + '/onProgressing/' + isGoing)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    },

    async getListByType (type) {
      return await axios.get(comm.urls.league + '/type/' + type)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    },

    async update (reqInfo) {

    },

    async delete (reqInfo) {

    },
  },

  map: {
    async create (mapName) {
      return await axios.post(comm.urls.maps, {name: mapName})
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    },

    async getAllMaps () {
      return await axios.get(comm.urls.maps)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    },
  },

  record: {
    async create (recordData) {
      recordData.winners = getUserIds(recordData.winners)
      recordData.losers = getUserIds(recordData.losers)

      return await axios.post(comm.urls.record, recordData)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    },

    async getAllRecords() {
      return await axios.get(comm.urls.record)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    }
  }
}

function getUserIds (userList) {
  let userIdLst = []
  for (let i = 0; i < userList.length; i++) {
    userIdLst.push(userList[i]._id)
  }
  return userIdLst
}

export default {
  apis,
}

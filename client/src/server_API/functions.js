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
          let data = resp.data
          store.dispatch('updateUserDBIndex', data._id)
          store.dispatch('updateUserId', data.userId)
          store.dispatch('updateUserToken', data.token)
          axios.defaults.headers.common['Authorization'] = store.getters.getUserToken

          return resp.data
        })
        .catch(error => {
          return error
        })
    },

    async checkId (userId) {
      return await axios.post(urls.getUser + 'checkId', userId)
        .then(resp =>{
          return resp
        })
        .catch(error => {
          return error
        })
    },

    async create (accountInfo) {
      let reqBody = accountInfo
      reqBody.tribe = accountInfo.tribe.val
      reqBody.tier = accountInfo.tier.type
      reqBody.optionalInfo.grade = (accountInfo.optionalInfo.grade == '') ? '' : accountInfo.optionalInfo.grade.val
      return await axios.post(urls.getUser, reqBody)
        .then(resp =>{
          return resp
        })
        .catch(error => {
          return error
        })
    },

    async update (accountInfo) {
      let reqBody = accountInfo
      reqBody.tribe = accountInfo.tribe
      reqBody.tier = accountInfo.tier
      reqBody.optionalInfo.grade = (accountInfo.optionalInfo.grade == '') ? '' : accountInfo.optionalInfo.grade
      delete reqBody.abilityScore
      return await axios.put(urls.getUser + accountInfo._id, reqBody)
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
          let allUsers = resp.data
          for (let i = 0; i < allUsers.length; i++) {
            allUsers[i].winCount = 0
            allUsers[i].loseCount = 0
            allUsers[i].winRate = 0
          }
          return allUsers
        })
        .catch(error => {
          return error
        })
    },

    async getSortedAllUsers (sortArg) {
      return await axios.get(urls.getUser + '/sortBy/' + sortArg.key + '/' + sortArg.order)
        .then(resp =>{
          let allUsers = resp.data
          return allUsers
        })
        .catch(error => {
          return error
        })
    },

    async getInfo (userDBIndex) {
      return await axios.get(urls.getUser + userDBIndex)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          return error
        })
    },
  },

  battle: {
    async create (battleData) {
      return await axios.post(comm.urls.battle, battleData)
        .then(resp =>{
        console.log(resp.data)
        return resp
      })
      .catch(error => {
        console.log(error.response)
        return error
      })
    },

    async getInfo (battleName) {
      return await axios.get(comm.urls.battle + battleName)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    },

    async getListByProgress (isGoing) {
      return await axios.get(comm.urls.battle + '/onProgressing/' + isGoing)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    },

    async getListByType (type) {
      return await axios.get(comm.urls.battle + '/type/' + type)
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
      recordData.battleId = recordData.battleId._id
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

    async update (recordData) {
      recordData.battleId = recordData.battleId._id
      recordData.winners = getUserIds(recordData.winners)
      recordData.losers = getUserIds(recordData.losers)
      recordData.map = recordData.map._id
      recordData.writer = recordData.writer._id

      return await axios.put(comm.urls.record + recordData._id, recordData)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    },

    async delete (recordId) {
      return await axios.delete(comm.urls.record + recordId)
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
    },

    async getAllRecordsByBattleId(battleId) {
      return await axios.get(comm.urls.record + 'byBattle/' + battleId)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    },

    async getRankersByBattleId(battleId) {
      return await axios.get(comm.urls.record + 'rankOfBattle/' + battleId)
        .then(resp =>{
          let retResp = resp.data
          retResp.forEach(function (ranker) {
            ranker.total.winRate = parseFloat(ranker.total.winRate)
            ranker.vsTerran.winRate = parseFloat(ranker.vsTerran.winRate)
            ranker.vsProtoss.winRate = parseFloat(ranker.vsProtoss.winRate)
            ranker.vsZerg.winRate = parseFloat(ranker.vsZerg.winRate)
          })
          return retResp
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    },

    async getWinRateOfUser(userId) {
      return await axios.get(comm.urls.record + 'userWinRate/' + userId)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    }
  },

  ability:{
    async create (abilityData) {
      return await axios.post(comm.urls.ability, abilityData)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    },

    async getAbilityOfUser (userId) {
      return await axios.get(comm.urls.ability + 'userId/' + userId)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    },

    async delete (abilityId, score, targetUserId, abilityCount) {
      return await axios.delete(comm.urls.ability + abilityId + '/' + score + '/' + targetUserId + '/' + abilityCount)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    },
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

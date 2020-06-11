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

          axios.defaults.headers.common['Authorization'] = data.token

          let userInfo = {
            _id: data._id,
            userId: data.userId,
            token: data.token,
            role: data.role,
          }
          let strUserInfo = JSON.stringify(userInfo)

          store.dispatch('updateUserInfo', userInfo)
          localStorage.setItem('userInfo', strUserInfo)

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
      /*let reqBody = JSON.parse(JSON.stringify(accountInfo))
      reqBody.tribe = reqBody.tribe.val
      reqBody.tier = reqBody.tier.type
      reqBody.eloScore = 1000 + (reqBody.tier * 300)
      reqBody.optionalInfo.grade = (reqBody.optionalInfo.grade == '') ? '' : reqBody.optionalInfo.grade.val*/
      accountInfo.eloScore = 1000 + (accountInfo.tier * 300)
      return await axios.post(urls.getUser, accountInfo)
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
      reqBody.eloScore = 1000 + (accountInfo.tier * 300)
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

    async updatePwd (userDBIndex, reqData) {
      return await axios.put(urls.getUser + userDBIndex, reqData)
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
      return await axios.get(urls.getUser + 'sortBy/' + sortArg.key + '/' + sortArg.order)
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

    async initELO () {
      return await axios.post(urls.getUser + 'initELO')
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

    async getAll () {
      return await axios.get(comm.urls.battle)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    },

    async getListByProgress (isGoing) {
      return await axios.get(comm.urls.battle + 'onProgressing/' + isGoing)
        .then(resp =>{
          resp.data.sort((a, b) => {
              return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
            })
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    },

    async getListByType (type) {
      return await axios.get(comm.urls.battle + 'type/' + type)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    },

    async getBattleById (battleId) {
      return await axios.get(comm.urls.battle + battleId)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    },

    async update (reqInfo) {
      delete reqInfo.__v
      return await axios.put(comm.urls.battle + reqInfo._id, reqInfo)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
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
      let reqData = JSON.parse(JSON.stringify(recordData))
      reqData.battleId = reqData.battleId._id
      reqData.winners = getUserIds(reqData.winners)
      reqData.losers = getUserIds(reqData.losers)

      return await axios.post(comm.urls.record, reqData)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    },

    async createMany (recordDataList) {
      let reqDataList = JSON.parse(JSON.stringify(recordDataList))
      let dataList = []
      reqDataList.forEach(data => {
        let tempObj = data
        tempObj.battleId = data.battleId._id
        tempObj.winners = getUserIds(data.winners)
        tempObj.losers = getUserIds(data.losers)
        dataList.push(tempObj)
      })

      return await axios.post(comm.urls.record + 'many', dataList)
        .then(resp =>{
          return resp.data.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    },

    async update (recordData) {
      let updateRecord = JSON.parse(JSON.stringify(recordData))
      updateRecord.battleId = updateRecord.battleIndex
      updateRecord.winners = getUserIds(updateRecord.winners)
      updateRecord.losers = getUserIds(updateRecord.losers)
      updateRecord.map = updateRecord.mapId
      updateRecord.writer = updateRecord.writer._id

      return await axios.put(comm.urls.record + updateRecord._id, updateRecord)
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

    async getAllRecordsOfUser(userId) {
      return await axios.get(comm.urls.record + 'byUser/' + userId)
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
    },

    async calELO (index) {
      return await axios.post(urls.record + 'calELO/' + index)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          return error
        })
    },
  },

  recordTeam: {
    async create (reqData) {
      return await axios.post(comm.urls.recordTeam, reqData)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    },

    async getByBattleId (battleId) {
      return await axios.get(comm.urls.recordTeam + 'byBattle/' + battleId)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    },

    async delete (recordTeamId) {
      return await axios.delete(comm.urls.recordTeam + recordTeamId)
        .then(resp =>{
          return resp.data
        })
        .catch(error => {
          console.log(error.response)
          return error
        })
    },
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

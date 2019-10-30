import store from '../store'
const API_URL = process.env.LCORD_API_Url

const urls = {
  getToken: API_URL + '/auth',
  getUser: API_URL + '/users/',
  league: API_URL + '/leagues/',
  maps: API_URL + '/maps/',
  record: API_URL + '/record/',
}

const defs = {
  leagueTypeList: ['개인 리그', '팀 리그', '이벤트 리그'],
  tierList: ['None', 'AMOEBA', 'ANIMAL', 'HUMAN', 'GOD'],
  battleTypeList: [{name:'1 vs 1', type: 0}, {name:'2 vs 2', type: 1}, {name:'3 vs 3', type: 2}, {name:'4 vs 4', type: 3}]
}


const comFunction = {
  isAuth () {
    if (store.getters.getUserToken == '') {
      return false
    } else {
      return true
    }
  }
}

export default {
  urls, comFunction, defs,
}

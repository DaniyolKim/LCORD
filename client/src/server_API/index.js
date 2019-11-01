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
  leagueTypeList: [ { name: '개인리그', type: 0}, { name: '팀리그', type: 1}, { name: '이벤트', type: 2}],
  tierList: [ { name: 'NONE', type: 0}, { name: 'GOD', type: 4}, { name: 'HUMAN', type: 3}, { name: 'ANIMAL', type: 2}, { name: 'AMOEBA', type: 1} ],
  battleTypeList: [{name:'1 vs 1', type: 0}, {name:'2 vs 2', type: 1}, {name:'3 vs 3', type: 2}, {name:'4 vs 4', type: 3}],
  tribes: [{name: '저그', val: 'zerg'}, {name: '테란', val: 'terran'}, {name: '프로토스', val: 'protoss'}, {name: '랜덤', val: 'random'} ],
  grades: [{name: 'S', val: 's'}, {name: 'A', val: 'a'}, {name: 'B', val: 'b'}, {name: 'C', val: 'c'}, {name: 'D', val: 'd'}, {name: 'E', val: 'e'}, {name: 'F', val: 'f'},]
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

import store from '../store'
const API_URL = process.env.LCORD_API_Url

const urls = {
  getToken: API_URL + '/auth',
  getUser: API_URL + '/users/',
  battle: API_URL + '/battles/',
  maps: API_URL + '/maps/',
  record: API_URL + '/record/',
  ability: API_URL + '/ability/',
}

const defs = {
  battleTypeList: [ { name: '개인리그', type: 0}, { name: '팀리그', type: 1}, { name: '이벤트', type: 2}],
  isRoundList: [ { name: '풀 라운드 방식', type: true}, { name: '자유 방식', type: false}],
  tierList: [ { name: 'NONE', type: 0}, { name: 'AMOEBA', type: 1}, { name: 'ANIMAL', type: 2}, { name: 'HUMAN', type: 3}, { name: 'GOD', type: 4} ],
  gameTypeList: [ {name:'1 vs 1', type: 0}, {name:'2 vs 2', type: 1}, {name:'3 vs 3', type: 2}, {name:'4 vs 4', type: 3} ],
  tribes: [ {name: '저그', val: 'zerg'}, {name: '테란', val: 'terran'}, {name: '프로토스', val: 'protoss'}, {name: '랜덤', val: 'random'} ],
  grades: [ {name: 'S', val: 's'}, {name: 'A', val: 'a'}, {name: 'B', val: 'b'}, {name: 'C', val: 'c'}, {name: 'D', val: 'd'}, {name: 'E', val: 'e'}, {name: 'F', val: 'f'} ]
}


const comFunction = {
  isAuth () {
    if (store.getters.getUserInfo == '') {
      if (localStorage.getItem('userInfo') == null) {
        return false
      } else {
        store.dispatch('updateUserInfo', JSON.parse(localStorage.getItem('userInfo')))
        return true
      }
    } else {
      return true
    }
  }
}

export default {
  urls, comFunction, defs,
}

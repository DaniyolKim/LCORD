import store from '../store'
const API_URL = process.env.LCORD_API_Url

const urls = {
  getToken: API_URL + '/auth',
  getUser: API_URL + '/users/',
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
  urls, comFunction,
}

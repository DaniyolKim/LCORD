import Vue from 'vue'
import VueCookie from 'vue-cookie'
Vue.use(VueCookie)

import router from '../router/index'

const API_URL = process.env.LCORD_API_Url

const urls = {
  getToken: API_URL + '/auth',
  getUser: API_URL + '/users/',
}

const comFunction = {
  isAuth () {
    if (Vue.cookie.get('userToken') == null) {
      router.push({name: 'Login'})
    } else {
      return true
    }
  }
  /*async getToken () {
    return await axios.post(urls.postToken, {},
      { params: signageLoginParams,
        headers: {
          'Authorization': `Basic YWlyLWNvbmRpdGlvbi1kaXNwbGF5LW1haW5BcHA6RU45Z0JSMUtILw==`
        }
      })
      .then(resp => {
        this.setSuccess()
        let dataLogin = resp.data

        localStorage.access_token = dataLogin.access_token
        localStorage.expires_in = dataLogin.expires_in
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.access_token

        return resp
      })
      .catch(error => {
        this.setError(error.response)
        return error
      })
  },*/

  /*setSuccess() {
    store.commit('updateErrorStatus', '')
  },

  setError(errorResp) {
    if (errorResp == undefined) {
      store.commit('updateErrorStatus', 'error')
    } else {
      if (errorResp.status == 401) {
        store.commit('updateErrorStatus', 'auth error')
        if (localStorage.bo_email == undefined) {
          this.getToken()
        } else {
          router.push({name: 'page-auth'})
        }
      } else if (errorResp.status == 403) { //access denied
        //this.getToken()
      }
    }
  },*/
}

export default {
  urls, comFunction,
}

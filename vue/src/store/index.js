import { createStore } from 'vuex'
import jwtDecode from 'jwt-decode'

if (localStorage.token) {
  var userData = decodeToken(localStorage.token)
}

export default createStore({
  state: {
    ...userData
  },
  mutations: {
    setToken(state, token) {
      let userData = decodeToken(token)
      localStorage.setItem('token', token)
      state.token = userData.token
      state.user = userData.user
    }
  },
  actions: {
    login(store, token) {
      this.commit('setToken', token)
    },
    logout(store) {
      delete store.state.token
      delete store.state.user
      localStorage.removeItem('token')
    }
  },
  modules: {
  }
})

function decodeToken(token) {
  let payload = jwtDecode(token)
  return {
    token: token,
    user: {
      username: payload.user
    }
  }
}

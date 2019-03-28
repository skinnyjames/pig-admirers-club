import Vue from 'vue'
import Vuex from 'vuex'
import artists from './modules/artists'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    artists
  }
})
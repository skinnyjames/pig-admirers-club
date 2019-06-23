import Vue from 'vue'
import Vuex from 'vuex'
import artist from './modules/artists'
Vue.config.devtools = true
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    artist
  }
})
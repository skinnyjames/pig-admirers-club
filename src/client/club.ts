import Vue from 'vue'
import Vuex from 'vuex'
import Club from './components/club.vue'
import store from './store/index'

Vue.use(Vuex)

new Vue({
  el: '#app',
  store, 
  render: h => h(Club)
})
import Vue from 'vue'
import Vuex from 'vuex'
import Vuikit from 'vuikit'
import VuikitIcons from '@vuikit/icons'
import Router from 'vue-router'
import Club from './components/club.vue'
import store from './store/index'
// components
import Home from './components/home.vue'
import Artist from './components/artist/artist.vue'
import ArtistLogin from './components/artist/login.vue'
import '@vuikit/theme'
Vue.config.devtools = true
Vue.use(Vuikit)
Vue.use(VuikitIcons)
Vue.use(Router)
Vue.use(Vuex)

const routes = [
  { path: '/', component: Home }, 
  { path: '/artist', component: Artist },
  { path: '/artist/login', component: ArtistLogin }
]

export const router = new Router({
  routes
})

new Vue({
  el: '#app',
  store, 
  router,
  render: h => h(Club)
})
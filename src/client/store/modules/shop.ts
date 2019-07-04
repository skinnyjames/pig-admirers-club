import { router } from './../../club'

const state = {
  concepts: [],
}
const getters = {
  firstImage(state) {
    return (image) => {
      if (image.images && image.images[0])
      return image.images[0].image_name
    }
  }
}
const actions = {
  async fetchConcepts(context) {
    let response = await fetch('/concepts/all', { method: 'get'})
    if (response.status == 200) {
      let body = await response.json()
      context.commit('setConcepts', body)
    } else {
      console.log('cant load concepts')
    }
  },
}
const mutations = {
  setConcepts(state, concepts) {
    state.concepts = concepts
  }
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
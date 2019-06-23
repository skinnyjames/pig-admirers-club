import axios from 'axios'
import { router } from './../../club'

const state = {
  data: null,
  meta: {
    error: {},
    success: null,
    messages: []
  }, 
  login: {
    email: null,
    password: null,
  },
  loginErrors: {
    email: null,
    password: null,
  }, 
  concepts: [],
  showNewConcept: false,
  newConcept: {
    title: 'Untitled',
    media: null,
    description: null,
    price: null,
    images: []
  },
  newConceptErrors: {
    title: null,
    media: null,
    description: null,
    price: null,
  }
}

const getters = {
  data(state) {
    return state.data
  },
  login(state) {
    return state.login
  },
  loginErrors(state): Object {
    return state.loginErrors
  },
  newConcept(state) {
    return state.newConcept
  },
  conceptErrors(state) {
    return state.newConceptErrors
  }
}

const actions = {
  async get(context) {
    try {
      let response = await fetch('/artists/me', { method: 'get' })
      if (response.status == 302) {
        router.push('/artist/login')
      } else {
        let body = await response.json()
        context.commit('set', body)
      }
    } catch(err) {
      console.log(err)
    }
  },
  async login(context) {
    try {
      let response = await fetch('/artists/login', { method: 'post', headers: { 'Content-type': 'application/json'}, body: JSON.stringify(context.state.login) })
      if (response.status == 401) {
        let errors = await response.json()
        context.commit('resetLoginErrors')
        context.commit('loginErrors', errors.errors)
      } else {
        router.push('/artist')
      }
    } catch(err) {
      context.commit('error', err)
    }
  },
  async deleteConcept(context, id) {
    try {
      let response = await fetch(`/concepts/${id}`, {method: 'delete'})
      if (response.status == 200) {
        context.commit('messages', ['Concept deleted'])
      } else {
        context.commit('messages', ['Error occured'])
      }
    } catch(err) {
      context.commit('error', err)
    }
  },
  async getConcepts(context) {
    let response = await fetch('/concepts/fetch', { method: 'get'})
    if (response.status == 200) {
      let body = await response.json()
      context.commit('concepts', body)
    } else {
      let body = await response.json()
      context.commit('error', body)
    }
  },
  async newConcept(context) {
    try {
      context.commit('confirm', false)

      let response = await fetch('/concepts/new', { 
        method: 'post', 
        headers: { 'Content-type': 'application/json'}, 
        body: JSON.stringify(context.state.newConcept) 
      })
      if (response.status == 401) {
        let errors = await response.json()
        context.commit('resetNewConceptErrors')
        context.commit('newConceptErrors', errors.errors)
        context.commit('confirm', false)
      } else {
        context.commit('resetNewConceptErrors')
        context.commit('resetNewConcept')
        context.commit('confirm', true)
        context.commit('hideNewConcept')
        context.dispatch('getConcepts')
      }
    } catch (err) {
      context.commit('error', err)
    }
  },
}

const mutations = {
  set(state, artist) {
    state.data = artist
  },
  error(state, meta) {
    state.meta.error = meta
  },
  email(state, value) {
    state.login.email = value
  },
  password(state, value) {
    state.login.password = value
  },
  title(state, value) {
    state.newConcept.title = value
  },
  media(state, value) {
    state.newConcept.media = value
  },
  description(state, value) {
    state.newConcept.description = value
  },
  price(state, value) {
    state.newConcept.price = value
  },
  updateImages(state, value) {
    state.newConcept.images = value
  },
  removeImage(state, id) {
    state.newConcept.images = state.newConcept.images.filter(image => {
      return image.id != id
    })
  },
  loginErrors(state, errors) {
    errors.forEach(err => {
      state.loginErrors[err.field] = err.message
    })
  },
  resetLoginErrors(state) {
    state.loginErrors = { 
      email: null,
      password: null
    }
  },
  newConceptErrors(state, errors) {
    errors.forEach(err => {
      state.newConceptErrors[err.field] = err.message
    })
  },
  resetNewConceptErrors(state) {
    state.newConceptErrors = {
      title: null,
      media: null,
      description: null,
      price: null,
    }
  },
  resetNewConcept(state) {
    state.newConcept = {
      title: 'Untitled',
      media: null,
      description: null,
      price: null,
      images: []
    }
  },
  showNewConcept(state) {
    state.showNewConcept = true
  },
  hideNewConcept(state) {
    state.showNewConcept = false
  },
  confirm(state, value: boolean) {
    state.meta.success = value
  },
  messages(state, messages) {
    state.meta.messages = messages
  },
  concepts(state, concepts) {
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
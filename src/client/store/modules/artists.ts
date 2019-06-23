import axios from 'axios'
import { router } from './../../club'

const state = {
  data: null,
  meta: {
    error: {}
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
    title: null,
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
  async newConcept(context) {
    try {
      let response = await fetch('/concepts/new', { 
        method: 'post', 
        headers: { 'Content-type': 'application/json'}, 
        body: JSON.stringify(context.state.newConcept) 
      })
      if (response.status == 401) {
        let errors = await response.json()
        context.commit('resetNewConceptErrors')
        context.commit('newConceptErrors', errors.errors)
      } else {
        
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
  showNewConcept(state) {
    state.showNewConcept = true
  },
  hideNewConcept(state) {
    state.showNewConcept = false
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
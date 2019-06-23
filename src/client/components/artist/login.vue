<template>
  <div id="login">
    <div id="login__form">
      <h1>Welcome</h1>
      <div class="uk-margin">
        <input v-bind:class="{'uk-input': true, 'uk-form-large': true, 'uk-form-danger': !!emailError }" 
          v-model="email"
          type="text" 
          placeholder="email">
        <span v-if="!!emailError" class="error">{{ emailError }}</span>
      </div>
      <div class="uk-margin">
        <input type="password" 
          v-bind:class="{'uk-input': true, 'uk-form-large': true, 'uk-form-danger': !!passwordError}"
          v-model="password" 
          placeholder="Password">
          <span v-if="!!emailError" class="error">{{ passwordError }}</span>
      </div>
      <button @click="login" class="uk-button uk-button-primary uk-button-large uk-width-1-1">Login</button>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    computed: {
      email: {
        get() {
          return this.$store.getters['artist/login'].email
        },
        set (value: string) {
          this.$store.commit('artist/email', value)
        }
      },
      password: {
        get() {
          return this.$store.getters['artist/login'].password
        },
        set (value: string) {
          this.$store.commit('artist/password', value)
        }
      },
      emailError() {
        let error = this.$store.getters['artist/loginErrors'].email
        return error
      },
      passwordError() {
        return this.$store.getters['artist/loginErrors'].password
      }
    },
    methods: {
      login() {
        this.$store.dispatch('artist/login')
      },
    }
  }
</script>

<style>
  div#login {
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  div#login__form {
    width: 50%;
    margin: 0 auto
  }
  span.error {
    margin-left: 12px;
    color: red;
  }
</style>
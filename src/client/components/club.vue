<template>
  <club-header></club-header>
</template>

<script lang="ts">
  import Header from './header'
  import { mapState } from 'vuex'
  export default {
    mounted() {
      console.log('hello')
    },
    components: {
      'club-header': Header
    },
    computed: {
      hello(): string {
        return this.$store.state.artists.details.hello
      }
    }
  }
</script>

<style>
  div {
    text-transform: uppercase;
  }
  html, body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    width: 100vw;
    font-family: 'Slabo 27px', serif;
  }

  body {
    background: 
    linear-gradient(
      rgba(134, 141, 238, 0.25), 
      rgba(134, 141, 238, 0.15)
    ),
    url('/img/doodles.png') repeat;
    transition: background-color 5s linear;
  }
</style>
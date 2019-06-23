<template>
  <div id="container">
    <club-header></club-header>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
  import Header from './header.vue'
  import { mapState } from 'vuex'
  export default {
    mounted() {
      console.log('hello')
    },
    components: {
      'club-header': Header
    },
    computed: {
    }
  }
</script>

<style>
  div#container {
    min-height: calc(100vh - 50px);
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
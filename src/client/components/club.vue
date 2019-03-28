<template>
  <div> 
    Hi, {{ hello }}
  </div>
</template>

<script lang="ts">
  import { mapState } from 'vuex'
  export default {
    mounted() {
      console.log('hello')
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
</style>
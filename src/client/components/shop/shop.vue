<template>
  <div v-if="concepts" id="shop">
    <div class="shop__concept" :style="backgroundStyle(concept)" v-for="concept in concepts" v-bind:key="concept.id">
      {{ concept.title }}
    </div>

  </div>
</template>

<script lang="ts">
export default {
  mounted() {
    this.$store.dispatch('shop/fetchConcepts')
  },
  computed: {
    concepts() {
      return this.$store.state.shop.concepts
    },
    backgroundStyle() {
      return (concept: any) => {
        return {
          'background-image': this.background(concept),
          'background-position': 'center',
          'background-size': 'cover'
        }
      }
    },
    background() {
      return (concept: any) => {
        return `url('/gallery/${this.$store.getters['shop/firstImage'](concept)}')`
      }
    }
  }
}
</script>

<style>
  .shop__concept{ 
    height: 400px;
  }
</style>
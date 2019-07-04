<template>
  <div class="concept">
    <div class="concept__details">
      <span class="concept__title">
        {{ concept.title }}
      </span>
      <span class="concept__media">
        {{concept.media}}
      </span>
      <span class="concept__date"> 
        {{ made(concept.created_at )}} 
      </span> 
    </div>
    <div class="concept__actions">
      <span>Edit</span>
      <span @click="destroy">Delete</span>
    </div>
  </div>
</template>

<script lang="ts">
  import * as moment from 'moment'
  export default {
    props: {
      concept: {
        type: Object
      }
    },
    computed: {
      made() {
        return (date: any) => {
          //@ts-ignore
          return moment(date).format('MM/DD/YYYY')
        }
      }
    },
    methods: {
      async destroy() {
        await this.$store.dispatch('artist/deleteConcept', this.concept.id)
        this.$emit('refresh')
      }
    }
  }
</script>

<style> 
  div.concepts{
    display: flex;
    flex-wrap: wrap;
  }
  div.concept {
    display: flex;
    margin: 20px;
    width: 200px;
    height: 200px;
    flex-direction: column;
    align-items: center;
    border: 1px solid #ccc;
    position: relative;
    box-shadow: 2px 2px 2px rgba(0,0,0,.3);
  }
  .concept__title {
    font-size: 20px;
    font-weight: bold;
    text-overflow: ellipsis;
    padding: 10px;
    height: 100px;
    overflow: hidden;
    text-align: center;
    display: flex;
    align-items: center;
  }
  .concept__details {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(200px - 42px);
  }
  .concept__media {
    font-size: 16px;
    font-variant: small-caps;
  }
  .concept__actions {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
  }
  .concept__actions span {
    width: 50%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

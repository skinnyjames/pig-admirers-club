<template>
  <div v-if="artist" class="dashboard">
    <div class="dashboard__control">
        <vk-notification position="bottom-center" status="success" :messages.sync="messages"></vk-notification>      
        <div class="dashboard__welcome">
        <h1>Welcome, {{ artist.first_name }} {{ artist.last_name}}</h1>
        <div class="dashboard__actions">
          <vk-button v-on:click="newConcept" type="primary">
            New Concept
          </vk-button>
          <vk-button type="secondary">
            Edit Profile
          </vk-button>
        </div>
      </div>
      <div class="concepts">
        <concept @refresh="refresh" v-bind:key="concept.id" v-for="concept in concepts" v-bind:concept="concept">
        </concept>
      </div>  
    </div>

    <div v-if="showNewConcept" class="concept__modal">
      <div class="concept__modal__body uk-panel-scrollable">
        <h3 style="display:flex;justify-content:space-between">
          <span>New Concept</span>
          <span @click="hideConcept"><vk-icons-close></vk-icons-close></span>
        </h3>
        <div class="concept__modal__form">
          <div class="concept__form uk-form-stacked">
            <div>
              <label class="uk-form-label" for="title">Title</label>
              <div class="uk-form-controls">
                <input type="text" v-model="title" :class="{'uk-input': true, 'uk-form-danger': !!titleError}" id="title">
              </div>
              <span v-if="!!titleError" class="error">{{ titleError }}</span>
            </div>
            <div>
              <label class="uk-form-label" for="media">Media</label>
              <div class="uk-form-controls">
                <input type="text" v-model="media" :class="{'uk-input': true, 'uk-form-danger': !!mediaError}" id="media">
              </div>
              <span v-if="!!mediaError" class="error">{{ mediaError }}</span>
            </div>
            <div>
              <label class="uk-form-label" for="description">Description</label>
              <div class="uk-form-controls">
                <textarea v-model="description" :class="{'uk-textarea': true, 'uk-form-danger': !!descriptionError}" id="description" rows="5"></textarea>
              </div>
              <span v-if="!!descriptionError" class="error">{{ descriptionError }}</span>
            </div>
            <div>
              <label class="uk-form-label" for="price">Price</label>
              <div class="uk-form-controls">
                <input type="text" v-model="price" :class="{'uk-input': true, 'uk-form-danger': !!priceError}" id="price">
              </div>
              <span v-if="!!priceError" class="error">{{ priceError }}</span>
            </div>
          </div>
          <div class="concept__images">
            <div class="concept__images__files">
              <ul>
                <li v-for="(file) in images" :key="file.id">
                  <span>{{file.name}}</span> -
                  <span>{{file.size | formatSize}}</span> -
                  <span v-if="file.error">{{file.error}}</span>
                  <span v-else-if="file.success">success 
                    <span @click="removeImage(file.id)">(remove)</span>
                  </span>
                  <span v-else-if="file.active">active</span>
                </li>
              </ul>
            </div>
            <div class="concept__images__upload">
              <file-upload
                class="uk-button"
                post-action="/concepts/upload"
                extensions="gif,jpg,jpeg,png,webp"
                accept="image/png,image/gif,image/jpeg,image/webp"
                :multiple="true"
                :size="1024 * 1024 * 10"
                :value="images"
                @input="updateImages"
                ref="upload">
                <i class="fa fa-plus"></i>
                Select files
              </file-upload>
              <button type="button" class="uk-button uk-button-secondary" v-if="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true">
                Start Upload
              </button>
            </div>
          </div>
        </div>
        <vk-button @click="submitConcept" style="margin-top: 20px;" class="uk-width-1-1 uk-button-primary">Submit</vk-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import FileUpload from 'vue-upload-component'
  //@ts-ignore
  import mime from 'mime-types'
  import Concept from './concept.vue'
  export default {
    components: {
      'concept': Concept,
      'file-upload': FileUpload
    },
    async mounted() {
      await this.$store.dispatch('artist/get')
      await this.$store.dispatch('artist/getConcepts')
    },
    computed: {
      messages: {
        get() {
          return this.$store.state.artist.meta.messages
        }, 
        set(value: any) {
          this.$store.commit('artist/messages', value)
        }
      },
      title: {
        get() {
          return this.$store.getters['artist/newConcept'].title
        },
        set(value: string) {
          this.$store.commit('artist/title', value)
        }
      },
      media: {
        get() {
          return this.$store.getters['artist/newConcept'].media
        },
        set(value: string) {
          this.$store.commit('artist/media', value)
        }
      },
      description: {
        get() {
          return this.$store.getters['artist/newConcept'].description
        },
        set(value: string) {
          this.$store.commit('artist/description', value)
        }
      },
      price: {
        get() {
          let price = this.$store.getters['artist/newConcept'].price
          if (price) {
            return parseFloat(price).toString()
          }
        },
        set(value: string) {
          this.$store.commit('artist/price', value)
        }
      },
      titleError() {
        return this.$store.getters['artist/conceptErrors'].title
      },
      mediaError() {
        return this.$store.getters['artist/conceptErrors'].media
      },
      descriptionError() {
        return this.$store.getters['artist/conceptErrors'].description
      },
      priceError() {
        return this.$store.getters['artist/conceptErrors'].price
      },
      artist() {
        return this.$store.getters['artist/data']
      },
      showNewConcept() {
        return this.$store.state.artist.showNewConcept
      },
      images() {
        return this.$store.state.artist.newConcept.images
      },
      success() {
        return this.$store.state.artist.meta.success
      },
      concepts() {
        return this.$store.state.artist.concepts
      }
    },
    methods: {
      newConcept() {
        console.log('click button')
        this.$store.commit('artist/showNewConcept')
      },
      hideConcept() {
        this.$store.commit('artist/hideNewConcept')
      },
      updateImages(files: Array<any>) {
        this.$store.commit('artist/updateImages', files)
      },
      doNothing() {

      },
      async refresh() {
        await this.$store.dispatch('artist/getConcepts')
      },
      async submitConcept() {
        await this.$store.dispatch('artist/newConcept')
        if (this.success) {
          this.$store.commit('artist/messages', ['Added new concept!'])
        }
      },
      removeImage(id: any) {
        this.$store.commit('artist/removeImage', id)
      }
    }
  }
</script>
<style>
  div.dashboard {
    width: 100%;
    min-height: calc(100vh - 50px);
    background-color: white;
    display: flex;
  }
  div.dashboard__control {
    padding: 20px 0px;
    width: 80%;
    margin: 0 auto;
    min-height: 100%;
    border-bottom: 1px solid #ccc;
  }
  div.dashboard__welcome {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  div.concept__modal {
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 2;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.8);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  div.concept__modal__body {
    background-color: white;
    width: 60%;
    height: 80%;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }
  div.concept__modal__form {
    display: flex;
  }
  div.concept__form, div.concept__images {
    width: 50%;
  }
  div.concept__images {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
</style>
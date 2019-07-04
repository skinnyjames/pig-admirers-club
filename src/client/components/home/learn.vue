<template>
  <div class="learn slides">
    <div class="hero slide">
      <img src="/img/box.png" style="height: 50%;">
      <h2>
        from the Studio to your Front Door.
      </h2>
      <div class="actions">
        <button class="shop">Shop NOw</button>
        <button id="next" @click="navigateTo(2)" class="learn-more">Learn More</button>
      </div>
    </div>
    <div class="slide">
      <div class="step-1">
        <a id="home" @click="navigateTo(1, true)">
          <i class="fas fa-chevron-left"></i>
        </a>
        <img src="/img/waldo-topic.png" height="70%">
        <div>
          <h2>Step 1: Pick a Concept and put down a deposit.</h2>
          <p>
            Choose which concept that you'd like to see made into an Artwork.
            Pay a 50% deposit and an Artist will begin the work.
          </p>
        </div>
        <a id="step-2"  @click="navigateTo(3)">
          <i class="fas fa-chevron-right"></i>
        </a>
      </div>
    </div>
    <div class="slide tracking">
      <a @click="navigateTo(2, true)">
        <i class="fas fa-chevron-left"></i>
      </a>
      <div class="track">
        <h2>Track the progress of your order online</h2>
        <p>
          You will recieve an email with a tracking code 
          that you can use to view live updates on the progress of your artwork.
        </p>
      </div>
      <img src="/img/waldo.jpg" height="50%"/>
      <a @click="navigateTo(4)">
        <i class="fas fa-chevron-right"></i>
      </a>
    </div>
    <div class="slide finish">
      <a @click="navigateTo(3, true)">
          <i class="fas fa-chevron-left"></i>
        </a>
      <div>
        <h2>Finish your Order</h2>
        <p>
          You will recieve an email when your order is complete.
          Pay the remaining 50%, and we will ship the Artwork to your address.
        </p>
      </div>
      <img src="img/box.png" height="50%"/>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    methods: {
      navigateTo(idx: number, from: boolean = false) {
        const slides = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName('slide')
        if (from) {
          slides[idx - 1].style.marginLeft = '0vw'
        } else {
          slides[idx - 2].style.marginLeft = '-100vw'
        } 
      }
    }
  }
</script>
<style>
.slides {
  width: 100vw;
  overflow:hidden;
  display: flex;
}
.slide {
  min-width: 100vw;
  height: 650px;
  transition: all 1s ease-in-out;
}
div.hero {
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Amatic SC', cursive;
}
div.hero h1 img {
  height: 300px;
}
div.hero h2 {
  margin-top: 0;
  font-size: 60px;
}

div.actions {
  width: 300px;
  display: flex;
  justify-content: space-between;
}
</style>
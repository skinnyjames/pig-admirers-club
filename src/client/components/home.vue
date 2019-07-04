<template>
  <div class="landing">
    <learn></learn>
    <div class="about about2">
      <div class="words">
        <h2>Original Art + Your choice.</h2>
        <p>
          Pick from a variety of available <span>concepts</span>, and filter by <span>cost</span>, <span>Artist</span>, or <span>media</span>.
        </p>
        <button class="shop">Shop NOw</button>
      </div>
    </div>
    <div class="about">
      <div class="words">
        <h2>A variety of style and media</h2>
        <p>
          We are a <span>diverse</span> collective of <span>makers</span>
          with a history of <span>making things happen</span>. 
        </p>
        <button class="shop">Shop NOw</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import About from './home/about.vue'
  import Learn from './home/learn.vue'
  export default {
    components: {
      Learn,
      About
    }

  }
</script>


<style>

h1, h2, .hero h2 {
  font-family: 'Amatic SC', cursive;
}

h1 {
  font-size: 100px;
}
h2 {
  font-size: 60px;
}

.landing button {
  cursor: pointer;
  height: 36px;
  font-family: 'Slabo 27px', serif;

  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  border: 1px solid rgba(134, 141, 238, .8);
  text-transform: uppercase;
  transition: background-color .2s ease-in-out;
}
.landing button:hover {
  background-color: rgba(134, 141, 238, 1);
}

div.about {
  padding: 3em 0;
  width: 100%;
  height: 620px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  background: 
  linear-gradient(
    rgba(0, 0, 0, .5),
    rgba(0, 0, 0, .5)
  ),
  url('/img/performance.png');
  background-position: center;
  background-size: cover;
  box-shadow: 3px 3px 3px inset rgba(0, 0, 0, .3);
  color: white;
}

div.about2 {
  background: url('/img/thumb-bg.jpg');
  background-position: top;
}
div.about3 {
  background: url('/img/balloons.png');
  background-position: center;
}

div.about img {
  box-shadow: 1px 2px 2px rgba(0, 0, 0, .3);
}

div.about h2 {
  font-size: 63px;
  font-family: 'Amatic SC', cursive;
}

div.about p {
  width: 400px;
  font-size: 24px;
}
div.about p span {
  font-family: 'Open Sans', sans-serif;
  font-weight: bold;
  font-size: 32px;
  color: rgba(146, 202, 187, 0.8);
  text-shadow: 1px 2px 2px #000;
}
div.about2 p span {
  color: rgba(218, 150, 150, .8);
}
div.words {
  width: 650px;
}
div.about button {
  color: white;
}

div.about button:hover {
  background-color: rgba(0, 0, 0, .8);
}

footer {
  width: 100%;
  height: 400px;
  background:
  linear-gradient(
    rgba(134, 141, 238, .2),
    rgba(134, 141, 238, .2)
  ),
  url('/img/felt.png') repeat;  
}
.step-1 {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.step-1 div {
  width: 30%;
}
.slide p {
  font-size: 28px;
}
.step-2 {
  cursor: pointer;
}

div.tracking {
  display: flex;
  justify-content: center;
  align-items: center;
}

div.track { 
  width: 30%;
}

.finish {
  display:flex;
  align-items: center;
  justify-content: center;
  width: 80%;
}

.finish div {
 
  width: 30%;
}
</style>

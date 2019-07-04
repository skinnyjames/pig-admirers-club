<template>
  <header>
    <nav>
      <ul class="left">
        <li><router-link to="/"><img src='img/logo.png' style="height:40px;"></router-link></li>
        <li>About</li>
        <li><router-link to="/shop">Shop</router-link></li>
        <li>Gallery</li>
        <li>Artists</li>
      </ul>
      <ul class="right">
        <li><i class="fas fa-shopping-cart"></i></li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts">
  export default {

  }
</script>

<style>
  header {
    height: 50px;
  }
  nav {
    z-index: 2;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: 'Oswald';
    font-family: 'Slabo 27px', serif;

    color: rgba(255, 255, 255, .8);
    width: 100%;
    height: 50px;
    box-shadow: 1px 2px 2px rgba(0, 0, 0, .3);
    border-bottom: 1px solid rgba(255, 255, 255, .3);
    background:
    linear-gradient(
      rgba(134, 141, 238, .2),
      rgba(134, 141, 238, .2)
    ),
    url('/img/felt.png') repeat; 
  }
  nav ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    /*justify-content: flex-end;*/
  }
  nav ul.right {
    justify-content: flex-end;
  }
  nav ul li {
    margin: 0 10px;
    font-size: 18px;
  }

  nav ul li:hover {
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, .8);
  }
</style>

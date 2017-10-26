<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
html,body {
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 0;
  height: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
        box-sizing: border-box;
  font-size: 15px;
}
</style>

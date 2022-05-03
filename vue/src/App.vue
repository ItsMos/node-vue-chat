<template>
  <nav-bar v-if="$route.name != 'Home'"/>
  <router-view/>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
  components: {
    NavBar
  }
}
</script>

<style>
@import url(assets/style.css)
</style>

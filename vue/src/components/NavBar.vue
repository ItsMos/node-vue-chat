<template>
  <nav>
    <div class="wrapper">
      <router-link to="/home" id="logo">N</router-link>
      <ul class="nav">
        <li v-if="!isLoggedIn && this.$route.name !== 'Login'">
          <router-link :to="{name: 'Login'}">Login</router-link>
        </li>
        <li v-if="!isLoggedIn && this.$route.name != 'Register'">
          <router-link :to="{name: 'Register'}">Register</router-link>
        </li>
        <li v-if="isLoggedIn" @click="logout"><a href="#">Logout ({{user.username}})</a></li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapState } from "vuex"

export default {
  computed: {
    ...mapState(['user']),

    isLoggedIn() {
      return !!this.user
    }
  },

  methods: {
    logout() {
      this.$store.dispatch('logout')
        .then(()=> this.$router.push('/'))
    }
  }

  // created() {
  //   console.log(JSON.stringify(this.user, '', 2))
  // }
}
</script>

<style lang="sass" scoped>
nav
  background-color: tomato
  color: #f8f8f8
  width: 100%
  height: 60px
  position: fixed
  top: 0
  user-select: none

  #logo
    font-size: 2em
    font-family: Magneto, Forte

  a
    color: inherit
    text-decoration: none
    &:hover
      opacity: 0.7

  & > .wrapper
    list-style: none
    height: 100%
    align-items: center
    justify-content: space-between

  .nav
    list-style: none
    display: flex
    align-items: center
    a
      padding: 0 13px
      display: block
      line-height: 51px
      height: 100%
</style>
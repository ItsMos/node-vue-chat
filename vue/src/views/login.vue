<template>
  <main>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <p id="error">{{ error }}</p>
      <p>
        <label for="user">Username: </label>
        <input v-model="user" type="text" name="user" id="user" placeholder="Username">
      </p>
      <p>
        <label for="pass">Password: </label>
        <input v-model="pass" type="password" name="pass" id="pass" placeholder="Password">
      </p>
      <button type="submit">Login</button>
      <p>New? <router-link to="register">Create an account</router-link></p>
    </form>
  </main>
</template>

<style lang="sass" scoped>
  main
    padding: 5em 0
    text-align: center

  form > *
    padding: 0.5em 0
</style>

<script>

export default {
  data() {
    return {
      user: '',
      pass: '',
      error: null
    }
  },

  methods: {
    async login() {
      let res = await fetch('apiLogin', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
          user: this.user,
          pass: this.pass
        })
      })

      try {
        let body = await res.json()
        if (res.status != 200 && body.error) {
          this.error = 'Error: ' + body.error

        } else if (body && body.token) {
          this.$store.dispatch('login', body.token)
          this.$router.push('/chat')

        }
      } catch (err) {
        console.error(err)
      }

      
    }
  }
}
</script>

<template>
  <main>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <p id="error">{{ error }}</p>
      <p>
        <label for="user">Username: </label>
        <input v-model="user" type="text" name="user" id="user" placeholder="Username">
      </p>
      <p>
        <label for="pass">Password: </label>
        <input v-model="pass" type="password" name="pass" id="pass" placeholder="Password">
      </p>
      <p>
        <label for="pass2">Confirm Password: </label>
        <input v-model="passConfirm" type="password" name="pass2" id="pass2" placeholder="Password">
      </p>
      <button type="submit">Register</button>
      <p>Already registered? <router-link to="/">Log in</router-link></p>
    </form>
  </main>
</template>

<script>
export default {
  data() {
    return {
      user: '',
      pass: '',
      passConfirm: '',
      error: null
    }
  },

  methods: {
    async register() {
      let res = await fetch('apiRegister', {
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
          alert('yea');
          localStorage.setItem('token', body.token)
          this.$router.push('/chat')

        }
      } catch (err) {
        
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  main
    padding: 5em 0
    text-align: center
  form > *
    padding: 0.5em 0
</style>
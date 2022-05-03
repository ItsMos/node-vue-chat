<template>
  <main class="wrapper">
    <div id="chat" ref="chat">
      <p v-for="msg in messages" class="msg">
        <strong>{{ msg.sender }}</strong>
        <span :title="msg.time.toLocaleDateString()">{{ msg.time.toLocaleTimeString() }}</span>
        <br/>
        {{ msg.text }}
      </p>
      <!-- <p class="msg">
        <strong>Me</strong></br>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vel quasi reprehenderit labore eaque doloremque blanditiis libero necessitatibus. Explicabo itaque numquam necessitatibus, eligendi quaerat labore
      </p> -->
    </div>
    <ul id="online">
      <li><strong>Online:</strong></li>
      <li v-for="user in onlineUsers"> {{ user }} </li>
    </ul>


    <form @submit.prevent="sendMsg">
      <input v-model="msg" type="text" placeholder="Type a message .." :disabled='!online'>
      <button :disabled='!online'>Send</button>
    </form>
  </main>
  <span></span>
</template>

<script>

import io from 'socket.io'

export default {
  data() {
    return {
      messages: [],
      msg: '',
      onlineUsers: [],
      online: false,
      socket: null
    }
  },

  mounted() {
    console.log('on mounted()')
    let socket = io()
    this.socket = socket
    this.online = true
    this.onlineUsers.push(this.user)

    let token = this.$store.state.token
    socket.emit('token', token)

    socket.on('msg', (msg, user) => {
      this.messages.push({
        sender: user,
        text: msg,
        time: new Date()
      })

      this.$nextTick(this.scrollDown)
    })

    socket.on('disconnect', ()=> {
      this.online = false
      alert('Disconnected')
    })

    socket.on('userJoined', (user)=> {
      // createNotice(`<strong>${user}</strong> joined`)
      this.onlineUsers.push(user)
    })

    socket.on('userLeft', (user)=> {
      // createNotice(`<strong>${user}</strong> left`)
      // removeFromOnlineList(user)
      let index = this.onlineUsers.indexOf(user)
      this.onlineUsers.splice(index, 1)
    })

    socket.on('onlineList', list => {
      this.onlineUsers.push(
        ...list.filter(_user => _user !== this.user)
      )
    })
  },

  computed: {
    trimmedMsg() {
      return this.msg.trim()
    },

    user() {
      return this.$store.state.user.username
    }
  },

  methods: {
    sendMsg() {
      if (this.trimmedMsg) {
        this.socket.emit('msg', this.trimmedMsg)
        this.messages.push({
          sender: this.user,
          text: this.trimmedMsg,
          time: new Date()
        })
        this.msg = ''
        this.$nextTick(this.scrollDown)
        // setTimeout(markSent, 1000, el)
      }
    },

    scrollDown() {
      this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight
    }
  }
}
</script>

<style>
  html, body, #app {height: 100%}
</style>

<style lang="scss" scoped>
  main.wrapper {height: calc(100% - 65px)}

  #chat {
    /* background-color: rgba(0,0,0,.05); */
    /* padding: 10px 18px; */
    height: 100%;
    width: 85%;
    overflow-y: scroll;
  }
  .msg {
    /* direction: rtl;
    text-align: left; */
    padding: 5px 0;

    &:nth-child(odd) {
      background-color: snow;
    }
    & > span {
      color: dimgray;
      font-size: 0.8em;
      margin-left: 0.5em;
      float: right;
      margin-right: 1em;
    }
    &.sending {
      color: gray;
    }
  }
  #online {
    background-color: rgb(240, 234, 248);
    width: 15%;
    height: 100%;
    overflow: auto;
    list-style: none;
    padding: 5px 0 5px 8px;

    & > li {
      padding: 2px 0;
    }
  }
  form {
    width: 100%;
    /* flex-grow: 100%; */
    /* position: fixed;
    bottom: 5px;
    width: 100%; */

    input {
      padding: 0 10px;
      width: calc(91% - 5px);
      height: 65px;
    }
    button {
      width: 9%;
      height: 65px
    }
  }
</style>
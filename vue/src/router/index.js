import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login.vue'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: {
      requireGuest: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "register" */ '../views/register.vue'),
    meta: {
      requireGuest: true
    }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import(/* webpackChunkName: "chat" */ '../views/chat.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/home.vue'),
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

function isLoggedIn() {
  return !!store.state.user
}

router.beforeEach((to, from, next)=> {
  let { requireGuest, requireAuth } = to.meta
  if (requireAuth && isLoggedIn()) {
    next()

  } else if (requireAuth) {
    router.push('/')

  } else if (requireGuest && !isLoggedIn()) {
    next()

  } else if (requireGuest) {
    router.push('/chat')
  } else {
    next()
  }
})

export default router

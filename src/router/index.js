import Vue from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'


const routes = [
  {
    path: '/',
    name: "Login",
    component: Login,
    meta: { guest: true },
  },
  {
    path: '/home',
    name: "Home",
    component: Home,
    meta: { guest: true },
  },
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isAuthenticated) {
      next()
      return
    }
    next('/')
  } else {
    next()
  }
})

export default router;

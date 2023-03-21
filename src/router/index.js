import Vue from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'


const routes = [
  {
    path: '/',
    redirect: { path: "/login" }
  },
  {
    path: '/login',
    name: "Login",
    component: Login,
  },
  {
    path: '/home',
    name: "Home",
    component: Home,
    children: [
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router;

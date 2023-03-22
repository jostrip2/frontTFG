import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../components/LoginView'
import HomeView from '../components/HomeView'
import UsuarisView from '../components/UsuarisView'


const routes = [
  {
    path: '/',
    redirect: { path: "/login" }
  },
  {
    path: '/login',
    name: "LoginView",
    component: LoginView
  },
  {
    path: '/home',
    name: "HomeView",
    component: HomeView
  },
  {
    path: '/users',
    name: "UsuarisView",
    component: UsuarisView
  },
]

const router = createRouter({
  history: createWebHistory("/"),
  routes
})

export default router;

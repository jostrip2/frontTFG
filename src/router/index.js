import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../components/LoginView'
import HomeView from '../components/assignacionsClient/HomeView'
import UsuarisView from '../components/usuarisAdmin/UsuarisView'
import VideosView from '../components/videosAdmin/VideosView'
import AssignacionsView from '../components/assignacionsAdmin/AssignacionsView'

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
  {
    path: '/videos',
    name: "VideosView",
    component: VideosView
  },
  {
    path: '/assignacions',
    name: "AssignacionsView",
    component: AssignacionsView
  }
]

const router = createRouter({
  history: createWebHistory("/"),
  routes
})

export default router;

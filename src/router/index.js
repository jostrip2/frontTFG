import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../components/LoginView'
import UsuarisView from '../components/usuarisComp/UsuarisView'
import VideosView from '../components/videosComp/VideosView'


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
    path: '/users',
    name: "UsuarisView",
    component: UsuarisView
  },
  {
    path: '/videos',
    name: "VideosView",
    component: VideosView
  }
]

const router = createRouter({
  history: createWebHistory("/"),
  routes
})

export default router;

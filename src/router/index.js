import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../components/LoginView'
import AssignacionsClientView from '../components/assignacionsClient/AssignacionsClientView'
import UsuarisView from '../components/usuarisAdmin/UsuarisView'
import VideosView from '../components/videosAdmin/VideosView'
import AssignacionsView from '../components/assignacionsAdmin/AssignacionsView'
import MissatgesView from '../components/missatges/MissatgesView'
import PerfilView from '../components/PerfilView'

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
    name: "AssignacionsClientView",
    component: AssignacionsClientView
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
  },
  {
    path: '/missatges',
    name: "MissatgesView",
    component: MissatgesView
  },
  {
    path: '/perfil',
    name: "PerfilView",
    component: PerfilView
  },
]

const router = createRouter({
  history: createWebHistory("/"),
  routes
})

export default router;

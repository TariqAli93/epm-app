import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UsersView from '@/views/UsersView.vue'
import ProjectsView from '@/views/ProjectsView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/planning',
    name: 'planning',
    component: () => import('../views/sections/PlanningView.vue'),
  },
  {
    path: '/accountent',
    name: 'accountent',
    component: () => import('../views/sections/AccountentView.vue'),
  },
  {
    path: '/contracts',
    name: 'contracts',
    component: () => import('../views/sections/ContractView.vue'),
  },
  {
    path: '/legal',
    name: 'legal',
    component: () => import('../views/sections/LegalView.vue'),
  },
  {
    path: '/library',
    name: 'library',
    component: () => import('../views/sections/LibraryView.vue'),
  },
  {
    path: '/users',
    name: 'users',
    component: UsersView,
  },
  {
    path: '/projects',
    name: 'projects',
    component: ProjectsView,
  },
]

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router

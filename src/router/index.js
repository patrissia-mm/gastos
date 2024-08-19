import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ItemView from '../views/item/ItemView'
import CategoriaView from '../views/categoria/CategoriaView.vue'
import GastoView from '../views/gasto/GastoView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/item',
    name: 'item',
    component: ItemView
  },
  {
    path: '/categoria',
    name: 'categoria',
    component: CategoriaView
  },
  {
    path: '/gasto',
    name: 'gasto',
    component: GastoView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

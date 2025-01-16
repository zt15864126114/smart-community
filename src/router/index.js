import { createRouter, createWebHistory } from 'vue-router'
import MonitoringView from '../components/MonitoringView.vue'
import ElevatorView from '../components/ElevatorView.vue'

const routes = [
  {
    path: '/',
    redirect: '/monitoring'
  },
  {
    path: '/monitoring',
    name: 'Monitoring',
    component: MonitoringView
  },
  {
    path: '/elevator',
    name: 'Elevator',
    component: ElevatorView
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
}) 
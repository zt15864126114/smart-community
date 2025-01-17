import { createRouter, createWebHistory } from 'vue-router'
import DashboardPanel from '../components/DashboardPanel.vue'
import MonitoringView from '../components/MonitoringView.vue'
import ElevatorView from '../components/ElevatorView.vue'
import AlarmDetail from '../components/AlarmDetail.vue'
import DeviceManagement from '../components/DeviceManagement.vue' 
import UserManagement from '../components/UserManagement.vue'
import SystemSettings from '../components/SystemSettings.vue'
import VideoMonitoring from '../components/VideoMonitoring.vue'
import MonitoringDashboard from '../components/MonitoringDashboard.vue'

const routes = [
  {
    path: '/',
    redirect: '/smart-community/dashboard'  // 修改重定向路径
  },
  {
    path: '/smart-community/dashboard',     // 添加基础路径
    name: 'Dashboard',
    component: DashboardPanel
  },
  {
    path: '/smart-community/monitoring',    // 添加基础路径
    name: 'Monitoring',
    component: MonitoringView
  },
  {
    path: '/smart-community/elevator',      // 添加基础路径
    name: 'Elevator',
    component: ElevatorView
  },
  {
    path: '/smart-community/alarm',         // 添加基础路径
    name: 'Alarm',
    component: AlarmDetail
  },
  {
    path: '/smart-community/device',
    name: 'Device',
    component: DeviceManagement
  },
  {
    path: '/smart-community/users',
    name: 'Users',
    component: UserManagement
  },
  {
    path: '/smart-community/settings',
    name: 'Settings',
    component: SystemSettings
  },
  {
    path: '/smart-community/monitoring',
    name: 'Monitoring',
    component: VideoMonitoring
  },
  {
    path: '/smart-community/dashboard',
    name: 'Dashboard',
    component: MonitoringDashboard
  }
]

export const router = createRouter({
  history: createWebHistory('/smart-community/'),
  routes
})
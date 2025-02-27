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
import ElevatorMonitoring from '../components/ElevatorMonitoring.vue'
import VisitorManagement from '../components/VisitorManagement.vue'
import VehicleManagement from '../components/VehicleManagement.vue'
import VideoShare from "../components/VideoShare.vue";
import EventReview from "../components/EventReview.vue";
import VideoDispatch from "../components/VideoDispatch.vue";
import VideoAnalysis from '../components/VideoAnalysis.vue'
import VideoNetwork from "../components/VideoNetwork.vue";
import DispatchCenter from "../components/DispatchCenter.vue";
import Welcome from "../components/Welcome.vue";

const routes = [
  {
    path: '/',
    redirect: '/smart-community/welcome'  // 修改重定向路径
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
  },
  {
    path: '/smart-community/elevator',
    name: 'Elevator',
    component: ElevatorMonitoring
  },
  {
    path: '/smart-community/visitor',
    name: 'Visitor',
    component: VisitorManagement
  },
  {
    path: '/smart-community/vehicle',
    name: 'Vehicle',
    component: VehicleManagement
  },
  {
    path: '/smart-community/videoshare',
    name: 'VideoShare',
    component: VideoShare
  },
  {
    path: '/smart-community/eventreview',
    name: 'EventReview',
    component: EventReview
  },
  {
    path: '/smart-community/videodispatch',
    name: 'VideoDispatch',
    component: VideoDispatch
  },
  {
    path: '/smart-community/videoanalysis',
    name: 'VideoAnalysis',
    component: VideoAnalysis
  },
  {
    path: '/smart-community/videonetwork',
    name: 'VideoNetwork',
    component: VideoNetwork
  },
  {
    path: '/smart-community/dispatchcenter',
    name: 'DispatchCenter',
    component: DispatchCenter
  },
  {
    path: '/smart-community/welcome',
    name: 'Welcome',
    component: Welcome
  },
]

export const router = createRouter({
  history: createWebHistory('/smart-community/'),
  routes
})
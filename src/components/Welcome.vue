<template>
  <div class="welcome-container">
    <!-- 顶部欢迎信息添加装饰线 -->
    <div class="welcome-header">
      <div class="welcome-title">
        <div class="title-decoration"></div>
        <h1>太阳八区智慧社区管理平台</h1>
        <div class="title-decoration"></div>
        <p class="subtitle">{{ getCurrentTime() }}</p>
      </div>
    </div>

    <!-- 数据概览卡片添加渐变背景 -->
    <div class="data-overview">
      <el-row :gutter="24">
        <el-col :span="6" v-for="item in statistics" :key="item.title">
          <el-card shadow="hover" :body-style="{ padding: '20px' }" class="stat-card-wrapper">
            <div class="stat-card">
              <div class="stat-icon-wrapper" :class="item.iconClass">
                <el-icon :size="40">
                  <component :is="item.icon" />
                </el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ item.value }}</div>
                <div class="stat-title">{{ item.title }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 快捷入口添加悬浮效果 -->
    <div class="quick-access">
      <h2>功能导航</h2>
      <el-row :gutter="24">
        <el-col :span="6" v-for="entry in quickEntries" :key="entry.title">
          <el-card 
            shadow="hover" 
            :body-style="{ padding: '30px 20px' }" 
            class="quick-entry-card"
            @click="handleQuickEntry(entry.path)"
          >
            <div class="entry-icon-wrapper" :class="entry.iconClass">
              <el-icon :size="40">
                <component :is="entry.icon" />
              </el-icon>
            </div>
            <h3>{{ entry.title }}</h3>
            <p>{{ entry.desc }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 调整最新动态的位置，增加上边距 -->
    <div class="latest-updates" style="margin-top: 40px;">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-card class="update-card" style="height: 350px;">
            <template #header>
              <div class="card-header">
                <span class="header-title">最新告警</span>
                <el-button type="primary" link>查看更多</el-button>
              </div>
            </template>
            <el-scrollbar height="250px">
              <el-timeline>
                <el-timeline-item
                  v-for="alarm in latestAlarms"
                  :key="alarm.id"
                  :type="alarm.status === '未处理' ? 'danger' : alarm.status === '处理中' ? 'warning' : 'success'"
                  :timestamp="alarm.time"
                  :hollow="true"
                >
                  {{ alarm.type }} - {{ alarm.location }}
                </el-timeline-item>
              </el-timeline>
            </el-scrollbar>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="update-card" style="height: 350px;">
            <template #header>
              <div class="card-header">
                <span class="header-title">今日工单</span>
                <el-button type="primary" link>查看更多</el-button>
              </div>
            </template>
            <el-scrollbar height="250px">
              <el-timeline>
                <el-timeline-item
                  v-for="task in todayTasks"
                  :key="task.id"
                  :type="task.priority"
                  :timestamp="task.time"
                  :hollow="true"
                >
                  {{ task.title }}
                </el-timeline-item>
              </el-timeline>
            </el-scrollbar>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  DataLine,
  House,
  VideoPlay,
  Bell,
  Operation,
  Document,
  User,
  Monitor,
  Setting,
  Cpu,
  Calendar,
  Warning,
  Tools,
  Location,
  Management
} from '@element-plus/icons-vue'

const router = useRouter()

// 统计数据
const statistics = ref([
  { title: '住户总数', value: '1,234', icon: 'House', iconClass: 'text-blue' },
  { title: '在线设备', value: '86', icon: 'Monitor', iconClass: 'text-green' },
  { title: '待处理告警', value: '3', icon: 'Warning', iconClass: 'text-red' },
  { title: '今日工单', value: '12', icon: 'Calendar', iconClass: 'text-orange' }
])

// 快捷入口
const quickEntries = ref([
  {
    title: '视频监控',
    desc: '实时查看监控画面',
    icon: 'VideoPlay',
    path: '/smart-community/monitoring',
    iconClass: 'text-blue'
  },
  {
    title: '调度指挥',
    desc: '人员调度管理',
    icon: 'Management',
    path: '/smart-community/dispatchcenter',
    iconClass: 'text-green'
  },
  {
    title: '告警处理',
    desc: '处理各类告警',
    icon: 'Bell',
    path: '/smart-community/alarm',
    iconClass: 'text-red'
  },
  {
    title: '视频分享',
    desc: '分享警告视频',
    icon: 'Tools',
    path: '/smart-community/videoshare',
    iconClass: 'text-orange'
  }
])

// 最新告警
const latestAlarms = ref([
  {
    id: 1,
    time: '14:30:25',
    type: '高空抛物',
    location: 'A栋1单元西侧',
    status: '未处理'
  },
  {
    id: 2,
    time: '14:15:12',
    type: '人员闯入',
    location: 'B栋地下车库',
    status: '处理中'
  },
  {
    id: 3,
    time: '13:45:30',
    type: '异常聚集',
    location: 'C栋楼下广场',
    status: '已处理'
  }
])

// 今日工单
const todayTasks = ref([
  {
    id: 1,
    time: '09:00',
    title: '1号楼电梯维保',
    priority: 'primary'
  },
  {
    id: 2,
    time: '10:30',
    title: '绿化带修剪',
    priority: 'info'
  },
  {
    id: 3,
    time: '14:00',
    title: '消防设施检查',
    priority: 'warning'
  }
])

// 获取当前时间
const getCurrentTime = () => {
  const now = new Date()
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return `${now.toLocaleDateString('zh-CN')} ${days[now.getDay()]}`
}

// 快捷入口点击处理
const handleQuickEntry = (path) => {
  router.push(path)
}
</script>

<style scoped>
.welcome-container {
  padding: 30px;
  background-color: #f5f7fa;
  background-image: 
    radial-gradient(circle at 100% 100%, rgba(64, 158, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 0% 0%, rgba(103, 194, 58, 0.1) 0%, transparent 50%);
  min-height: calc(100vh - 60px);
  scrollbar-width: thin;
  scrollbar-color: #409EFF #f5f7fa;
}

.welcome-header {
  text-align: center;
  margin-bottom: 50px;
  position: relative;
}

.welcome-title {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

.title-decoration {
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #409EFF, transparent);
  margin: 15px 0;
  position: relative;
  overflow: hidden;
}

.title-decoration::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  animation: shine 2s infinite;
}

@keyframes shine {
  to {
    left: 100%;
  }
}

.welcome-title h1 {
  margin: 0;
  font-size: 36px;
  background: linear-gradient(120deg, #409EFF, #67C23A);
  -webkit-background-clip: text;
  color: transparent;
  font-weight: bold;
  position: relative;
  animation: slideIn 1s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.subtitle {
  margin: 10px 0 0;
  color: #606266;
  font-size: 16px;
  letter-spacing: 1px;
}

.stat-card-wrapper {
  transition: all 0.3s;
  border: none;
  background: linear-gradient(145deg, #ffffff, #f5f7fa);
  box-shadow: 5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff;
  position: relative;
  overflow: hidden;
}

.stat-card-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, rgba(64, 158, 255, 0.1), rgba(103, 194, 58, 0.1));
  opacity: 0;
  transition: opacity 0.3s;
}

.stat-card-wrapper:hover::before {
  opacity: 1;
}

.stat-icon-wrapper {
  padding: 15px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.text-blue { background: rgba(64, 158, 255, 0.1); }
.text-green { background: rgba(103, 194, 58, 0.1); }
.text-red { background: rgba(245, 108, 108, 0.1); }
.text-orange { background: rgba(230, 162, 60, 0.1); }

.text-blue :deep(svg) {
  fill: url(#blue-gradient);
}

.text-green :deep(svg) {
  fill: url(#green-gradient);
}

.text-red :deep(svg) {
  fill: url(#red-gradient);
}

.text-orange :deep(svg) {
  fill: url(#orange-gradient);
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  background: linear-gradient(120deg, #409EFF, #67C23A);
  -webkit-background-clip: text;
  color: transparent;
  margin-bottom: 8px;
}

.quick-entry-card {
  background: linear-gradient(145deg, #ffffff, #f5f7fa);
  border: none;
  box-shadow: 5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff;
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.quick-entry-card::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(120deg, rgba(64, 158, 255, 0.05), rgba(103, 194, 58, 0.05));
  opacity: 0;
  transition: all 0.3s;
}

.quick-entry-card:hover::after {
  opacity: 1;
}

.entry-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  position: relative;
  z-index: 1;
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.entry-icon-wrapper::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: inherit;
  filter: blur(5px);
  opacity: 0;
  transition: all 0.3s;
  z-index: -1;
}

.quick-entry-card:hover .entry-icon-wrapper::before {
  opacity: 0.7;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  position: relative;
  padding-left: 15px;
}

.header-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background: #409EFF;
  border-radius: 2px;
}

.update-card {
  border: none;
  box-shadow: 5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff;
  transition: all 0.3s;
  background: linear-gradient(145deg, #ffffff, #f5f7fa);
}

.update-card:hover {
  transform: translateY(-5px);
}

:deep(.el-scrollbar__view) {
  padding: 10px 0;
}

:deep(.el-timeline) {
  padding: 0 20px;
}

:deep(.el-timeline-item__node) {
  width: 12px;
  height: 12px;
  border-width: 2px;
  transition: all 0.3s;
}

:deep(.el-timeline-item:hover .el-timeline-item__node) {
  transform: scale(1.2);
}

:deep(.el-timeline-item__content) {
  transition: all 0.3s;
}

:deep(.el-timeline-item:hover .el-timeline-item__content) {
  transform: translateX(5px);
}

/* 添加响应式布局 */
@media screen and (max-width: 1400px) {
  .stat-value {
    font-size: 28px;
  }
  
  .entry-icon-wrapper {
    width: 70px;
    height: 70px;
  }
}

@media screen and (max-width: 1200px) {
  .welcome-title h1 {
    font-size: 32px;
  }
  
  .stat-value {
    font-size: 24px;
  }
}

/* SVG渐变定义 */
:deep(svg) {
  width: 100%;
  height: 100%;
}

:deep(defs) {
  position: absolute;
}

:deep(linearGradient#blue-gradient) {
  --color-1: #409EFF;
  --color-2: #36cfc9;
}

:deep(linearGradient#green-gradient) {
  --color-1: #67C23A;
  --color-2: #95de64;
}

:deep(linearGradient#red-gradient) {
  --color-1: #F56C6C;
  --color-2: #ff7875;
}

:deep(linearGradient#orange-gradient) {
  --color-1: #E6A23C;
  --color-2: #ffc53d;
}

.latest-updates {
  margin-bottom: 30px;
  padding: 0 20px;
}
</style> 
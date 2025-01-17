<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in statistics" :key="item.title">
        <el-card class="stat-card" :class="item.type">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="24"><component :is="item.icon"/></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ item.value }}</div>
              <div class="stat-title">{{ item.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>事件统计</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart" ref="eventChart"></div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>处理情况</span>
            </div>
          </template>
          <div class="chart" ref="statusChart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { 
  VideoCamera, 
  Warning, 
  Bell, 
  Check
} from '@element-plus/icons-vue'

const timeRange = ref('week')

const statistics = ref([
  {
    title: '监控设备',
    value: '24',
    icon: 'VideoCamera',
    type: 'primary'
  },
  {
    title: '今日告警',
    value: '5',
    icon: 'Warning',
    type: 'danger'
  },
  {
    title: '待处理',
    value: '3',
    icon: 'Bell',
    type: 'warning'
  },
  {
    title: '已处理',
    value: '128',
    icon: 'Check',
    type: 'success'
  }
])

const eventChart = ref(null)
const statusChart = ref(null)

onMounted(() => {
  const eventChartInstance = echarts.init(eventChart.value)
  eventChartInstance.setOption({
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['高空抛物', '电梯违规']
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '高空抛物',
        type: 'line',
        data: [5, 3, 6, 4, 2, 7, 3]
      },
      {
        name: '电梯违规',
        type: 'line',
        data: [2, 4, 3, 5, 3, 2, 4]
      }
    ]
  })

  const statusChartInstance = echarts.init(statusChart.value)
  statusChartInstance.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: [
          { value: 128, name: '已处理' },
          { value: 3, name: '处理中' },
          { value: 2, name: '未处理' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  })

  window.addEventListener('resize', () => {
    eventChartInstance.resize()
    statusChartInstance.resize()
  })
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  padding: 20px;
  border-radius: 8px;
  margin-right: 15px;
}

.stat-info {
  flex-grow: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-title {
  color: #666;
}

.chart-row {
  margin-top: 20px;
}

.chart {
  height: 300px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 统计卡片主题样式 */
.primary .stat-icon {
  background-color: #ecf5ff;
  color: #409eff;
}

.danger .stat-icon {
  background-color: #fef0f0;
  color: #f56c6c;
}

.warning .stat-icon {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.success .stat-icon {
  background-color: #f0f9eb;
  color: #67c23a;
}
</style> 
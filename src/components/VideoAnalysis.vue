<template>
  <div class="video-analysis">
    <!-- 左侧监控点列表 -->
    <div class="camera-list">
      <!-- 系统状态卡片 -->
      <div class="status-card">
        <div class="status-header">
          <h4>系统状态</h4>
          <span class="update-time">更新时间: {{ systemStatus.lastUpdate }}</span>
        </div>
        <div class="status-grid">
          <div class="status-item">
            <span class="label">在线摄像头</span>
            <span class="value success">{{ systemStatus.onlineCameras }}/{{ systemStatus.totalCameras }}</span>
          </div>
          <div class="status-item">
            <span class="label">AI分析任务</span>
            <span class="value">{{ analysisStatus.activeTask }}/{{ analysisStatus.totalTask }}</span>
          </div>
          <div class="status-item">
            <span class="label">GPU使用率</span>
            <span class="value warning">{{ analysisStatus.gpuUsage }}</span>
          </div>
          <div class="status-item">
            <span class="label">系统状态</span>
            <span class="value">{{ systemStatus.systemStatus }}</span>
          </div>
        </div>
      </div>

      <!-- 搜索框 -->
      <div class="search-box">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索监控点位"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <!-- 监控点树形列表 -->
      <div class="camera-tree">
        <el-scrollbar>
          <el-tree
            :data="cameraList"
            :props="defaultProps"
            node-key="id"
            :default-expanded-keys="['1', '2', '3']"
            @node-click="handleCameraSelect"
          >
            <template #default="{ node, data }">
              <div class="camera-node">
                <el-icon v-if="data.type === 'area'"><FolderOpened /></el-icon>
                <el-icon v-else><VideoCamera /></el-icon>
                <span>{{ node.label }}</span>
                <el-tag 
                  v-if="data.type === 'camera'" 
                  :type="data.status === 'online' ? 'success' : 'danger'"
                  size="small"
                >
                  {{ data.status === 'online' ? '在线' : '离线' }}
                </el-tag>
              </div>
            </template>
          </el-tree>
        </el-scrollbar>
      </div>
    </div>

    <!-- 右侧分析区域 -->
    <div class="analysis-area">
      <!-- 分析类型选择 - 改用按钮组 -->
      <div class="analysis-header">
        <el-button-group>
          <el-button 
            :type="currentAnalysis === 'face' ? 'primary' : 'default'"
            @click="currentAnalysis = 'face'"
          >
            <el-icon><Avatar /></el-icon>人脸检测
          </el-button>
          <el-button 
            :type="currentAnalysis === 'behavior' ? 'primary' : 'default'"
            @click="currentAnalysis = 'behavior'"
          >
            <el-icon><View /></el-icon>行为分析
          </el-button>
          <el-button 
            :type="currentAnalysis === 'vehicle' ? 'primary' : 'default'"
            @click="currentAnalysis = 'vehicle'"
          >
            <el-icon><Van /></el-icon>车辆识别
          </el-button>
          <el-button 
            :type="currentAnalysis === 'crowd' ? 'primary' : 'default'"
            @click="currentAnalysis = 'crowd'"
          >
            <el-icon><User /></el-icon>人群密度
          </el-button>
          <el-button 
            :type="currentAnalysis === 'perimeter' ? 'primary' : 'default'"
            @click="currentAnalysis = 'perimeter'"
          >
            <el-icon><AlarmClock /></el-icon>周界防范
          </el-button>
        </el-button-group>
      </div>

      <!-- 主要内容区域 -->
      <div class="main-content">
        <!-- 视频预览区域 -->
        <div class="video-preview">
          <div class="video-box">
            <!-- 未选择摄像头 -->
            <div v-if="!selectedCamera" class="placeholder-text">
              <el-icon><VideoCamera /></el-icon>
              <span>请选择监控点</span>
            </div>
            <!-- 连接中状态 -->
            <div v-else-if="isConnecting" class="placeholder-text connecting">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span>正在连接摄像头...</span>
              <div class="camera-info">
                <p>{{ selectedCamera.label }}</p>
                <p>IP: {{ selectedCamera.ip }}</p>
              </div>
            </div>
            <!-- 离线状态 -->
            <div v-else-if="selectedCamera.status === 'offline'" class="placeholder-text">
              <el-icon><VideoCamera /></el-icon>
              <span>摄像头离线</span>
              <div class="camera-info">
                <p>{{ selectedCamera.label }}</p>
                <p>IP: {{ selectedCamera.ip }}</p>
              </div>
            </div>
            <!-- 在线状态 -->
            <div v-else class="video-player">
              <div class="camera-info">
                <span class="camera-name">{{ selectedCamera.label }}</span>
                <el-tag size="small" type="success">在线</el-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- 分析结果区域 -->
        <div class="analysis-result">
          <div class="result-header">
            <span>分析结果</span>
            <el-switch
              v-model="analysisEnabled"
              inline-prompt
              active-text="开"
              inactive-text="关"
              @change="handleAnalysisSwitch"
            />
          </div>
          <div class="result-content">
            <el-empty v-if="!analysisEnabled || !selectedCamera" description="请开启分析" />
            <div v-else-if="isAnalyzing" class="analyzing">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span>分析中...</span>
            </div>
            <div v-else class="analysis-data">
              <!-- 人脸检测结果 -->
              <template v-if="currentAnalysis === 'face'">
                <div class="result-item">
                  <div class="result-title">检测到的人脸</div>
                  <div class="result-value">5</div>
                  <div class="result-details">
                    <el-tag size="small" type="success">已识别: 3</el-tag>
                    <el-tag size="small" type="warning">陌生人: 2</el-tag>
                  </div>
                </div>
              </template>

              <!-- 行为分析结果 -->
              <template v-if="currentAnalysis === 'behavior'">
                <div class="result-item">
                  <div class="result-title">检测到的行为</div>
                  <div class="result-list">
                    <el-tag type="warning" effect="dark">跌倒</el-tag>
                    <el-tag type="danger" effect="dark">打架</el-tag>
                    <el-tag type="info" effect="dark">奔跑</el-tag>
                  </div>
                </div>
              </template>

              <!-- 车辆识别结果 -->
              <template v-if="currentAnalysis === 'vehicle'">
                <div class="result-item">
                  <div class="result-title">车辆统计</div>
                  <div class="result-stats">
                    <div class="stat-item">
                      <span class="label">小型车</span>
                      <span class="value">12</span>
                    </div>
                    <div class="stat-item">
                      <span class="label">大型车</span>
                      <span class="value">3</span>
                    </div>
                  </div>
                </div>
              </template>

              <!-- 人群密度结果 -->
              <template v-if="currentAnalysis === 'crowd'">
                <div class="result-item">
                  <div class="result-title">区域人数</div>
                  <div class="result-value">127</div>
                  <el-progress 
                    :percentage="85" 
                    :color="crowdDensityColor"
                    :format="() => '密度: 85%'"
                  />
                </div>
              </template>

              <!-- 周界防范结果 -->
              <template v-if="currentAnalysis === 'perimeter'">
                <div class="result-item">
                  <div class="result-title">警戒状态</div>
                  <div class="alert-status">
                    <el-alert
                      title="发现入侵行为"
                      type="error"
                      :closable="false"
                      show-icon
                    />
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { 
  Search,
  FolderOpened,
  VideoCamera,
  Loading,
  Monitor,
  Avatar,
  View,
  Van,
  User,
  AlarmClock
} from '@element-plus/icons-vue'
import { getCameraData, getSystemStatus } from './camera-data'
import { ElMessage } from 'element-plus'

// 状态数据
const cameraList = ref([])
const systemStatus = ref({})
const searchKeyword = ref('')
const selectedCamera = ref(null)
const isConnecting = ref(false)
const currentAnalysis = ref('face')
const analysisEnabled = ref(false)
const isAnalyzing = ref(false)

// 分析状态数据
const analysisStatus = ref({
  activeTask: 3,
  totalTask: 5,
  gpuUsage: '85%'
})

// 初始化数据
onMounted(() => {
  cameraList.value = getCameraData()
  systemStatus.value = getSystemStatus()
})

// 树形控件配置
const defaultProps = {
  children: 'children',
  label: 'label'
}

// 选择摄像头
const handleCameraSelect = (data) => {
  if (data.type === 'camera') {
    selectedCamera.value = data
    if (data.status === 'online') {
      // 显示连接中状态
      isConnecting.value = true
      ElMessage({
        message: `正在连接: ${data.label}`,
        type: 'info'
      })
      
      // 模拟连接过程
      setTimeout(() => {
        isConnecting.value = false
        ElMessage({
          message: `已连接: ${data.label}`,
          type: 'success'
        })
      }, 2000)
    } else {
      ElMessage({
        message: `${data.label} 离线`,
        type: 'warning'
      })
    }
  }
}

// 处理分析开关
const handleAnalysisSwitch = (value) => {
  if (value && selectedCamera.value) {
    isAnalyzing.value = true
    setTimeout(() => {
      isAnalyzing.value = false
    }, 2000)
  }
}

// 人群密度颜色
const crowdDensityColor = ref('#e6a23c')

// 监听分析类型变化
watch(currentAnalysis, () => {
  if (analysisEnabled.value && selectedCamera.value) {
    isAnalyzing.value = true
    setTimeout(() => {
      isAnalyzing.value = false
    }, 1000)
  }
})
</script>

<style scoped>
.video-analysis {
  display: flex;
  height: 100%;
  gap: 20px;
  padding: 20px;
  background: #f0f2f5;
}

.camera-list {
  width: 300px;
  background: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.analysis-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.analysis-header {
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.main-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 15px;
  flex: 1;
}

.video-preview {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.video-box {
  width: 100%;
  height: 100%;
  background: #000;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.analysis-result {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
  margin-bottom: 12px;
}

.result-content {
  flex: 1;
  display: flex;
  padding: 0;
  overflow-y: auto;
}

.placeholder-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #909399;
}

.placeholder-text .el-icon {
  font-size: 48px;
}

/* 调整按钮组样式 */
.el-button-group {
  display: flex;
  justify-content: flex-start;
}

.el-button-group .el-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.el-button-group .el-button .el-icon {
  margin-right: 4px;
}

.status-card {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.status-header h4 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.update-time {
  font-size: 12px;
  color: #909399;
}

.status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.status-item .label {
  font-size: 12px;
  color: #909399;
}

.status-item .value {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.status-item .value.success {
  color: #67c23a;
}

.status-item .value.warning {
  color: #e6a23c;
}

.camera-tree {
  flex: 1;
  overflow: hidden;
  padding: 15px;
}

.search-box {
  padding: 0 15px 15px 15px;
}

.camera-node {
  display: flex;
  align-items: center;
  gap: 8px;
}

.camera-node .el-icon {
  font-size: 16px;
  color: #909399;
}

.camera-node span {
  flex: 1;
}

.connecting .el-icon {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.camera-info {
  text-align: center;
  margin-top: 10px;
  color: #909399;
}

.camera-info p {
  margin: 5px 0;
}

.video-player {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #fff;
  padding: 20px;
}

.camera-name {
  margin-right: 10px;
  font-size: 14px;
}

.analyzing {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #909399;
}

.analyzing .el-icon {
  font-size: 32px;
  animation: rotating 2s linear infinite;
}

.analysis-data {
  width: 100%;
  padding: 0;
}

.result-item {
  padding: 12px;
  border-radius: 6px;
  background: #f8f9fa;
  margin-bottom: 8px;
}

.result-title {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}

.result-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  text-align: center;
  margin: 8px 0;
}

.result-details {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.result-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.result-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.stat-item .label {
  font-size: 12px;
  color: #909399;
}

.stat-item .value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.alert-status {
  margin-top: 10px;
}

/* 添加滚动条样式 */
.result-content::-webkit-scrollbar {
  width: 6px;
}

.result-content::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

.result-content::-webkit-scrollbar-track {
  background: #f5f7fa;
}
</style> 
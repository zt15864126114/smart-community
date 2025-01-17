<template>
  <div class="video-monitoring">
    <el-row :gutter="20">
      <!-- 左侧设备树 -->
      <el-col :span="6">
        <el-card class="device-tree">
          <template #header>
            <div class="tree-header">
              <span>监控点位</span>
              <el-input
                v-model="searchKey"
                placeholder="搜索设备"
                prefix-icon="Search"
                size="small"
              />
            </div>
          </template>
          
          <el-tree
            ref="treeRef"
            :data="treeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            node-key="id"
            highlight-current
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node">
                <el-icon><component :is="data.icon" /></el-icon>
                <span>{{ node.label }}</span>
                <el-tag 
                  size="small" 
                  :type="data.status === '在线' ? 'success' : 'danger'"
                  v-if="data.type === 'camera'"
                >
                  {{ data.status }}
                </el-tag>
              </div>
            </template>
          </el-tree>
        </el-card>
      </el-col>

      <!-- 右侧视频区域 -->
      <el-col :span="18">
        <el-card class="video-wall">
          <template #header>
            <div class="wall-header">
              <div class="header-left">
                <span>视频预览</span>
                <el-radio-group v-model="layout" size="small">
                  <el-radio-button label="1">1×1</el-radio-button>
                  <el-radio-button label="4">2×2</el-radio-button>
                  <el-radio-button label="9">3×3</el-radio-button>
                </el-radio-group>
              </div>
              <div class="header-right">
                <el-button-group>
                  <el-button 
                    type="primary" 
                    :icon="VideoPlay"
                    @click="startAllVideo"
                  >
                    全部播放
                  </el-button>
                  <el-button 
                    type="danger" 
                    :icon="VideoPause"
                    @click="stopAllVideo"
                  >
                    全部停止
                  </el-button>
                </el-button-group>
              </div>
            </div>
          </template>

          <div class="video-container" :class="'layout-' + layout">
            <div 
              v-for="n in +layout" 
              :key="n" 
              class="video-item"
              @click="handleVideoClick(n - 1)"
              :class="{ active: currentVideoIndex === n - 1 }"
            >
              <div class="video-placeholder" v-if="!videos[n-1]">
                <el-icon><VideoCamera /></el-icon>
                <span>无视频信号</span>
              </div>
              <template v-else>
                <div class="video-content">
                  <div class="mock-video">模拟视频画面 {{ n }}</div>
                  <div class="video-info">
                    <span>{{ videos[n-1].name }}</span>
                    <span>{{ videos[n-1].location }}</span>
                  </div>
                </div>
                <div class="video-controls">
                  <el-button-group>
                    <el-button 
                      size="small" 
                      :icon="VideoPlay"
                      @click.stop="playVideo(n-1)"
                    />
                    <el-button 
                      size="small" 
                      :icon="VideoPause"
                      @click.stop="pauseVideo(n-1)"
                    />
                    <el-button 
                      size="small" 
                      :icon="Camera"
                      @click.stop="snapshot(n-1)"
                    />
                  </el-button-group>
                </div>
              </template>
            </div>
          </div>
        </el-card>

        <!-- 云台控制 -->
        <el-card class="ptz-control" v-if="currentVideoIndex !== null">
          <template #header>
            <div class="control-header">
              <span>云台控制</span>
              <span class="current-camera">
                {{ videos[currentVideoIndex]?.name || '未选择摄像头' }}
              </span>
            </div>
          </template>

          <div class="control-panel">
            <div class="direction-control">
              <el-button-group class="vertical-group">
                <el-button @click="ptzControl('up')">
                  <el-icon><CaretTop /></el-icon>
                </el-button>
                <el-button @click="ptzControl('down')">
                  <el-icon><CaretBottom /></el-icon>
                </el-button>
              </el-button-group>
              <el-button-group class="horizontal-group">
                <el-button @click="ptzControl('left')">
                  <el-icon><CaretLeft /></el-icon>
                </el-button>
                <el-button @click="ptzControl('right')">
                  <el-icon><CaretRight /></el-icon>
                </el-button>
              </el-button-group>
            </div>

            <div class="zoom-control">
              <el-button-group>
                <el-button @click="ptzControl('zoomIn')">
                  <el-icon><ZoomIn /></el-icon>
                </el-button>
                <el-button @click="ptzControl('zoomOut')">
                  <el-icon><ZoomOut /></el-icon>
                </el-button>
              </el-button-group>
            </div>

            <div class="preset-control">
              <el-select v-model="currentPreset" placeholder="预置点">
                <el-option
                  v-for="item in presetPoints"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-button-group>
                <el-button 
                  type="primary" 
                  @click="callPreset"
                  :disabled="!currentPreset"
                >
                  调用
                </el-button>
                <el-button 
                  type="success" 
                  @click="savePreset"
                  :disabled="!currentPreset"
                >
                  设置
                </el-button>
              </el-button-group>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { 
  VideoPlay, 
  VideoPause, 
  VideoCamera,
  Camera,
  CaretTop,
  CaretBottom,
  CaretLeft,
  CaretRight,
  ZoomIn,
  ZoomOut,
  FolderOpened,
  Monitor
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 搜索关键字
const searchKey = ref('')
const treeRef = ref(null)

// 监视搜索关键字变化
watch(searchKey, (val) => {
  treeRef.value?.filter(val)
})

// 设备树数据
const treeData = [
  {
    id: 1,
    label: 'A栋',
    icon: 'FolderOpened',
    children: [
      {
        id: 11,
        label: '1号摄像头',
        type: 'camera',
        icon: 'Monitor',
        status: '在线'
      },
      {
        id: 12,
        label: '2号摄像头',
        type: 'camera',
        icon: 'Monitor',
        status: '离线'
      }
    ]
  },
  {
    id: 2,
    label: 'B栋',
    icon: 'FolderOpened',
    children: [
      {
        id: 21,
        label: '3号摄像头',
        type: 'camera',
        icon: 'Monitor',
        status: '在线'
      },
      {
        id: 22,
        label: '4号摄像头',
        type: 'camera',
        icon: 'Monitor',
        status: '在线'
      }
    ]
  }
]

const defaultProps = {
  children: 'children',
  label: 'label'
}

// 过滤节点方法
const filterNode = (value, data) => {
  if (!value) return true
  return data.label.includes(value)
}

// 视频墙布局
const layout = ref('4')
const currentVideoIndex = ref(null)
const videos = ref([])
const currentPreset = ref('')

// 预置点列表
const presetPoints = [
  { value: '1', label: '预置点1' },
  { value: '2', label: '预置点2' },
  { value: '3', label: '预置点3' },
  { value: '4', label: '预置点4' }
]

// 处理设备树节点点击
const handleNodeClick = (data) => {
  if (data.type === 'camera' && data.status === '在线') {
    if (currentVideoIndex.value !== null && !videos.value[currentVideoIndex.value]) {
      videos.value[currentVideoIndex.value] = {
        id: data.id,
        name: data.label,
        location: getLocationPath(data),
        status: 'playing'
      }
      ElMessage.success(`已添加到窗口 ${currentVideoIndex.value + 1}`)
    }
  }
}

// 获取摄像头位置完整路径
const getLocationPath = (node) => {
  let path = []
  let current = node
  while (current) {
    path.unshift(current.label)
    current = current.parent
  }
  return path.join(' / ')
}

// 处理视频窗口点击
const handleVideoClick = (index) => {
  currentVideoIndex.value = index
}

// 播放视频
const playVideo = (index) => {
  if (videos.value[index]) {
    videos.value[index].status = 'playing'
    ElMessage.success('开始播放')
  }
}

// 暂停视频
const pauseVideo = (index) => {
  if (videos.value[index]) {
    videos.value[index].status = 'paused'
    ElMessage.success('已暂停')
  }
}

// 截图
const snapshot = (index) => {
  if (videos.value[index]) {
    ElMessage.success('截图已保存')
  }
}

// 开始所有视频
const startAllVideo = () => {
  videos.value.forEach((video, index) => {
    if (video) {
      playVideo(index)
    }
  })
}

// 停止所有视频
const stopAllVideo = () => {
  videos.value.forEach((video, index) => {
    if (video) {
      pauseVideo(index)
    }
  })
}

// 云台控制
const ptzControl = (direction) => {
  ElMessage.success(`云台控制：${direction}`)
}

// 调用预置点
const callPreset = () => {
  ElMessage.success(`调用预置点：${currentPreset.value}`)
}

// 保存预置点
const savePreset = () => {
  ElMessage.success(`保存预置点：${currentPreset.value}`)
}
</script>

<style scoped>
.video-monitoring {
  padding: 20px;
}

.device-tree {
  height: calc(100vh - 140px);
  overflow-y: auto;
}

.tree-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.custom-tree-node .el-tag {
  margin-left: auto;
}

.video-wall {
  margin-bottom: 20px;
}

.wall-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.video-container {
  display: grid;
  gap: 10px;
  aspect-ratio: 16/9;
  background: #000;
  padding: 10px;
}

.layout-1 {
  grid-template-columns: 1fr;
}

.layout-4 {
  grid-template-columns: repeat(2, 1fr);
}

.layout-9 {
  grid-template-columns: repeat(3, 1fr);
}

.video-item {
  position: relative;
  background: #1a1a1a;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.video-item.active {
  border-color: var(--el-color-primary);
}

.video-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  gap: 10px;
}

.video-content {
  height: 100%;
  position: relative;
}

.mock-video {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
}

.video-info {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #fff;
  text-shadow: 0 0 2px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.video-controls {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: none;
}

.video-item:hover .video-controls {
  display: block;
}

.ptz-control {
  height: 200px;
}

.control-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.current-camera {
  color: var(--el-color-primary);
  font-size: 14px;
}

.control-panel {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20px;
}

.direction-control {
  display: flex;
  gap: 10px;
}

.vertical-group {
  display: flex;
  flex-direction: column;
}

.preset-control {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.el-button-group .el-button {
  margin-left: -1px;
}
</style> 
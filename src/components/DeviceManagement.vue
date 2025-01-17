<template>
  <div class="device-management">
    <el-row :gutter="20">
      <!-- 设备状态概览 -->
      <el-col :span="24">
        <el-row :gutter="20">
          <el-col :span="6" v-for="stat in deviceStats" :key="stat.title">
            <el-card class="stat-card" :class="stat.type">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon :size="24"><component :is="stat.icon"/></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ stat.value }}</div>
                  <div class="stat-title">{{ stat.title }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>

      <!-- 设备列表 -->
      <el-col :span="24" class="mt-20">
        <el-card>
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <span class="title">设备列表</span>
                <el-radio-group v-model="deviceType" size="small">
                  <el-radio-button label="camera">摄像头</el-radio-button>
                  <el-radio-button label="elevator">电梯</el-radio-button>
                </el-radio-group>
              </div>
              <el-button type="primary" @click="handleAddDevice">
                <el-icon><Plus /></el-icon>添加设备
              </el-button>
            </div>
          </template>

          <el-table :data="filteredDevices" style="width: 100%">
            <el-table-column prop="id" label="设备ID" width="120" />
            <el-table-column prop="name" label="设备名称" width="180" />
            <el-table-column prop="location" label="安装位置" width="180" />
            <el-table-column prop="type" label="设备类型" width="120">
              <template #default="scope">
                <el-tag :type="scope.row.type === 'camera' ? 'success' : 'warning'">
                  {{ scope.row.type === 'camera' ? '摄像头' : '电梯' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="120">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="lastMaintenance" label="最后维护时间" width="180" />
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button-group>
                  <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button 
                    size="small" 
                    type="primary"
                    @click="handleMaintenance(scope.row)">
                    维护
                  </el-button>
                  <el-button 
                    size="small" 
                    type="danger"
                    @click="handleDelete(scope.row)">
                    删除
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加/编辑设备对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加设备' : '编辑设备'"
      width="500px">
      <el-form :model="deviceForm" label-width="100px">
        <el-form-item label="设备名称">
          <el-input v-model="deviceForm.name" placeholder="请输入设备名称"/>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select v-model="deviceForm.type" placeholder="请选择设备类型">
            <el-option label="摄像头" value="camera"/>
            <el-option label="电梯" value="elevator"/>
          </el-select>
        </el-form-item>
        <el-form-item label="安装位置">
          <el-input v-model="deviceForm.location" placeholder="请输入安装位置"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="deviceForm.status" placeholder="请选择设备状态">
            <el-option label="正常" value="正常"/>
            <el-option label="故障" value="故障"/>
            <el-option label="维护中" value="维护中"/>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 维护记录对话框 -->
    <el-dialog
      v-model="maintenanceDialogVisible"
      title="设备维护"
      width="500px">
      <el-form :model="maintenanceForm" label-width="100px">
        <el-form-item label="维护类型">
          <el-select v-model="maintenanceForm.type" placeholder="请选择维护类型">
            <el-option label="定期检查" value="regular"/>
            <el-option label="故障维修" value="repair"/>
            <el-option label="设备升级" value="upgrade"/>
          </el-select>
        </el-form-item>
        <el-form-item label="维护说明">
          <el-input
            type="textarea"
            v-model="maintenanceForm.description"
            rows="3"
            placeholder="请输入维护说明"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="maintenanceDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleMaintenanceSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  VideoCamera, 
  Connection, 
  Warning, 
  Check,
  Plus
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 设备统计数据
const deviceStats = ref([
  {
    title: '设备总数',
    value: '48',
    icon: 'Connection',
    type: 'primary'
  },
  {
    title: '在线设备',
    value: '45',
    icon: 'Check',
    type: 'success'
  },
  {
    title: '故障设备',
    value: '2',
    icon: 'Warning',
    type: 'danger'
  },
  {
    title: '维护中',
    value: '1',
    icon: 'Tools',
    type: 'warning'
  }
])

// 设备列表数据
const devices = ref([
  {
    id: 'CAM001',
    name: '1号楼监控',
    type: 'camera',
    location: 'A栋1单元',
    status: '正常',
    lastMaintenance: '2024-03-15 14:30'
  },
  {
    id: 'ELE001',
    name: '1号电梯',
    type: 'elevator',
    location: 'A栋1单元',
    status: '维护中',
    lastMaintenance: '2024-03-18 09:30'
  },
  // ... 更多设备数据
])

const deviceType = ref('camera')
const dialogVisible = ref(false)
const dialogType = ref('add')
const maintenanceDialogVisible = ref(false)

const deviceForm = ref({
  name: '',
  type: '',
  location: '',
  status: '正常'
})

const maintenanceForm = ref({
  type: '',
  description: ''
})

// 根据设备类型筛选设备列表
const filteredDevices = computed(() => {
  return devices.value.filter(device => device.type === deviceType.value)
})

// 获取状态标签类型
const getStatusType = (status) => {
  const types = {
    '正常': 'success',
    '故障': 'danger',
    '维护中': 'warning'
  }
  return types[status] || 'info'
}

// 添加设备
const handleAddDevice = () => {
  dialogType.value = 'add'
  deviceForm.value = {
    name: '',
    type: deviceType.value,
    location: '',
    status: '正常'
  }
  dialogVisible.value = true
}

// 编辑设备
const handleEdit = (row) => {
  dialogType.value = 'edit'
  deviceForm.value = { ...row }
  dialogVisible.value = true
}

// 删除设备
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除设备 ${row.name} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 这里添加删除逻辑
    ElMessage.success('删除成功')
  })
}

// 设备维护
const handleMaintenance = (row) => {
  maintenanceForm.value = {
    type: '',
    description: ''
  }
  maintenanceDialogVisible.value = true
}

// 提交设备表单
const handleSubmit = () => {
  // 这里添加提交逻辑
  ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
  dialogVisible.value = false
}

// 提交维护记录
const handleMaintenanceSubmit = () => {
  // 这里添加维护记录提交逻辑
  ElMessage.success('维护记录已提交')
  maintenanceDialogVisible.value = false
}
</script>

<style scoped>
.device-management {
  padding: 20px;
}

.mt-20 {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.title {
  font-size: 16px;
  font-weight: bold;
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

/* 统计卡片主题样式 */
.primary .stat-icon {
  background-color: #ecf5ff;
  color: #409eff;
}

.success .stat-icon {
  background-color: #f0f9eb;
  color: #67c23a;
}

.warning .stat-icon {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.danger .stat-icon {
  background-color: #fef0f0;
  color: #f56c6c;
}
</style> 
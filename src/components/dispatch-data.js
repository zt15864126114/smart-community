// 摄像头型号
const CAMERA_MODELS = {
  dome: { name: 'DS-2DC6223IW-A', desc: '200万球型摄像机' },
  bullet: { name: 'DS-2CD3T25D-I5', desc: '200万筒型摄像机' },
  ptz: { name: 'DS-2DE7230IW-AE', desc: '300万PTZ摄像机' },
  panoramic: { name: 'DS-2CD6924F-IS', desc: '全景摄像机' }
}

// 生成摄像头数据
export const getCameraData = () => {
  return [
    {
      id: '1',
      label: 'A栋',
      value: 'aBuilding',
      type: 'area',
      children: [
        {
          id: 'a-1',
          label: 'A栋大门',
          type: 'camera',
          status: 'online',
          area: 'A栋',
          location: '大门入口处',
          model: CAMERA_MODELS.ptz,
          ip: '192.168.1.101',
          resolution: '2048×1536',
          installTime: '2023-12-01',
          lastMaintenance: '2024-02-15',
          presets: [
            { id: 1, name: '大门全景' },
            { id: 2, name: '人行通道' },
            { id: 3, name: '车辆通道' },
            { id: 4, name: '访客等候区' }
          ]
        },
        {
          id: 'a-2',
          label: 'A栋1单元门厅',
          type: 'camera',
          status: 'online',
          area: 'A栋',
          location: '1单元大堂',
          model: CAMERA_MODELS.dome,
          ip: '192.168.1.102',
          resolution: '1920×1080',
          installTime: '2023-12-01',
          lastMaintenance: '2024-02-15',
          presets: [
            { id: 1, name: '大堂全景' },
            { id: 2, name: '电梯等候区' },
            { id: 3, name: '信报箱区域' }
          ]
        },
        {
          id: 'a-3',
          label: 'A栋1单元电梯间',
          type: 'camera',
          status: 'online',
          area: 'A栋',
          location: '1单元电梯间',
          model: CAMERA_MODELS.bullet,
          ip: '192.168.1.103',
          resolution: '1920×1080',
          installTime: '2023-12-01',
          lastMaintenance: '2024-02-15',
          presets: [
            { id: 1, name: '电梯门口' },
            { id: 2, name: '楼梯间' }
          ]
        }
      ]
    },
    {
      id: '2',
      label: '地下车库',
      value: 'parking',
      type: 'area',
      children: [
        {
          id: 'p-1',
          label: '地库入口',
          type: 'camera',
          status: 'online',
          area: '地下车库',
          location: '车库主入口',
          model: CAMERA_MODELS.ptz,
          ip: '192.168.1.201',
          resolution: '2048×1536',
          installTime: '2023-12-01',
          lastMaintenance: '2024-02-15',
          presets: [
            { id: 1, name: '入口全景' },
            { id: 2, name: '车牌识别区' },
            { id: 3, name: '道闸区域' }
          ]
        },
        {
          id: 'p-2',
          label: '地库A区',
          type: 'camera',
          status: 'online',
          area: '地下车库',
          location: 'A区中心',
          model: CAMERA_MODELS.panoramic,
          ip: '192.168.1.202',
          resolution: '4096×1800',
          installTime: '2023-12-01',
          lastMaintenance: '2024-02-15',
          presets: [
            { id: 1, name: '区域全景' },
            { id: 2, name: '消防通道' },
            { id: 3, name: '充电桩区域' }
          ]
        }
      ]
    },
    {
      id: '3',
      label: '公共区域',
      value: 'public',
      type: 'area',
      children: [
        {
          id: 'pub-1',
          label: '中心广场',
          type: 'camera',
          status: 'online',
          area: '公共区域',
          location: '小区中心广场',
          model: CAMERA_MODELS.ptz,
          ip: '192.168.1.301',
          resolution: '2048×1536',
          installTime: '2023-12-01',
          lastMaintenance: '2024-02-15',
          presets: [
            { id: 1, name: '广场全景' },
            { id: 2, name: '儿童游乐区' },
            { id: 3, name: '休息座椅区' },
            { id: 4, name: '健身器材区' }
          ]
        },
        {
          id: 'pub-2',
          label: '篮球场',
          type: 'camera',
          status: 'online',
          area: '公共区域',
          location: '小区篮球场',
          model: CAMERA_MODELS.bullet,
          ip: '192.168.1.302',
          resolution: '1920×1080',
          installTime: '2023-12-01',
          lastMaintenance: '2024-02-15',
          presets: [
            { id: 1, name: '球场全景' },
            { id: 2, name: '观众座席' }
          ]
        },
        {
          id: 'pub-3',
          label: '垃圾投放点',
          type: 'camera',
          status: 'online',
          area: '公共区域',
          location: '垃圾分类投放点',
          model: CAMERA_MODELS.dome,
          ip: '192.168.1.303',
          resolution: '1920×1080',
          installTime: '2023-12-01',
          lastMaintenance: '2024-02-15',
          presets: [
            { id: 1, name: '投放区全景' },
            { id: 2, name: '分类箱特写' }
          ]
        }
      ]
    }
  ]
}

// 生成随机状态数据
export const generateStatusData = () => {
  return {
    totalCameras: 15,
    onlineCameras: 14,
    offlineCameras: 1,
    storageUsage: '78%',
    networkStatus: '正常',
    systemStatus: '运行中',
    lastUpdate: new Date().toLocaleString('zh-CN')
  }
} 
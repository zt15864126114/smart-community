<template>
  <el-container>
    <el-aside width="200px">
      <el-menu
        router
        :default-active="$route.path"
        class="el-menu-vertical">
        <el-menu-item index="/monitoring">
          <el-icon><VideoCamera /></el-icon>
          <span>高空抛物监控</span>
        </el-menu-item>
        <el-menu-item index="/elevator">
          <el-icon><Connection /></el-icon>
          <span>电梯与电瓶车管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header>
        <h2>太阳八区智慧社区平台</h2>
      </el-header>
      
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

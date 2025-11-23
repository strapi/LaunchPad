<template>
  <div class="navbar">
    <div class="logo">
      <router-link to="/">Open Hands Vue</router-link>
    </div>
    <div class="nav-links">
      <router-link to="/" v-if="isLoggedIn">首页</router-link>
      <router-link to="/mindmap" v-if="isLoggedIn">思维导图</router-link>
      <router-link to="/demo" v-if="isLoggedIn">演示</router-link>
      <a @click="handleLogout" v-if="isLoggedIn">登出</a>
      <router-link to="/auth" v-if="!isLoggedIn">登录</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import auth from '@/services/auth';

const router = useRouter();
const isLoggedIn = ref(auth.isLoggedIn());

// 监听存储变化，更新登录状态
const handleStorageChange = () => {
  isLoggedIn.value = auth.isLoggedIn();
};

// 处理登出
const handleLogout = () => {
  auth.logout();
  message.success('已成功登出');
  isLoggedIn.value = false;
  router.push('/auth');
};

onMounted(() => {
  window.addEventListener('storage', handleStorageChange);
  // 初始检查登录状态
  isLoggedIn.value = auth.isLoggedIn();
});

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange);
});
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 64px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  
  .logo {
    font-size: 18px;
    font-weight: bold;
    
    a {
      color: #1890ff;
      text-decoration: none;
    }
  }
  
  .nav-links {
    display: flex;
    gap: 20px;
    
    a {
      color: #333;
      text-decoration: none;
      cursor: pointer;
      
      &:hover {
        color: #1890ff;
      }
      
      &.router-link-active {
        color: #1890ff;
        font-weight: 500;
      }
    }
  }
}
</style>
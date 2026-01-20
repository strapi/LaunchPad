<template>
    <div class="redirect-container">
      <a-result
        status="success"
        title="登录成功"
        sub-title="正在为你打开客户端，请在浏览器提示中点击“打开”。"
      >
        <template #icon>
          <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        </template>
        <template #extra>
          <a-button type="primary" size="large" @click="openApp">
            手动打开客户端
          </a-button>
          <p class="tip-text">若未看到弹窗，请手动点击上方按钮。</p>
        </template>
      </a-result>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  
  function openApp() {
    const code = route.query.code;
    if (code) {
      const deeplink = `lemonai://auth?code=${encodeURIComponent(code)}`;
      window.location.href = deeplink;
    }
  }
  
  onMounted(() => {
    openApp();
  
    // fallback 不做跳转，可留空等用户手动点击按钮
  });
  </script>
  
  <style scoped>
  .redirect-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #f0f2f5;
  }
  
  .tip-text {
    margin-top: 1rem;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
  </style>
  
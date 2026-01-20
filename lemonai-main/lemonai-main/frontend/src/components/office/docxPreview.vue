<template>
    <div class="docx-viewer">
      <div class="docx-content">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading">loading DOCX...</div>
        <!-- 错误提示 -->
        <div v-if="error" class="error">{{ error }}</div>
        <!-- 文档渲染 -->
        <iframe v-if="!isLoading && !error" ref="docxIframe" class="docx-iframe" :srcdoc="iframeContent"></iframe>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue';
  import mammoth from 'mammoth';
  
  // 定义 props
  const props = defineProps({
    docxArrayBuffer: {
      type: [ArrayBuffer, null],
      default: null
    }
  });
  
  // 响应式变量
  const isLoading = ref(false);
  const error = ref(null);
  const docxIframe = ref(null);
  const iframeContent = ref('');
  
  // 定义 iframe 的 CSS 样式，与 XLSXViewer 一致
  const iframeStyles = `
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: unset;
      },      
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        border: 1px solid #cdcccc;
        padding: 8px;
        text-align: left;
        min-width: 100px;
        white-space: normal;
        word-break: break-all;
      }
      th {
        background-color: #333;
        font-weight: bold;
      }
      td:empty::after {
        content: '-';
        color: #999;
      }
      p {
        margin: 0 0 10px 0;
      }
    </style>
  `;
  
  // 解析 DOCX 文件
  const parseDOCX = async (arrayBuffer) => {
    if (!arrayBuffer || !(arrayBuffer instanceof ArrayBuffer) || arrayBuffer.byteLength === 0) {
      error.value = 'Invalid DOCX Data';
      return;
    }
    isLoading.value = true;
    error.value = null;
  
    try {
      const uint8Array = new Uint8Array(arrayBuffer);
      if (!uint8Array.buffer || uint8Array.buffer.byteLength === 0) {
        throw new Error('ArrayBuffer already decorated');
      }
  
      // 使用 mammoth.js 转换为 HTML
      const result = await mammoth.convertToHtml({ arrayBuffer });
      // 组合 HTML 和样式
      iframeContent.value = `
        <!DOCTYPE html>
        <html>
        <head>
          ${iframeStyles}
        </head>
        <body>
          ${result.value}
        </body>
        </html>
      `;
  
      isLoading.value = false;
    } catch (err) {
      isLoading.value = false;
      error.value = `Error DOCX: ${err.message}`;
      console.error('DOCX error:', err);
    }
  };
  
  // 监听 docxArrayBuffer 变化
  watch(() => props.docxArrayBuffer, (newBuffer) => {
    if (newBuffer) {
      parseDOCX(newBuffer);
    }
  });
  
  // 组件挂载时解析
  onMounted(() => {
    if (props.docxArrayBuffer) {
      parseDOCX(props.docxArrayBuffer);
    }
  });
  </script>
  
  <style scoped>
  .docx-viewer {
    height: 100%;
    width: 100%;
    margin: 0 auto;
    padding: 0;
  }
    
  .docx-content {
    height: 100%;
  }
  
  .docx-iframe {
    width: 100%;
    height: 100%;
    border: 1px solid #cdcccc; /* 与 XLSXViewer 一致的边框 */
    background-color: #fff;
    border-radius: 4px;
  }
  
  .loading {
    text-align: center;
    padding: 20px;
    font-size: 16px;
    color: #666;
  }
  
  .error {
    text-align: center;
    padding: 20px;
    color: #d32f2f;
    font-size: 14px;
  }
  </style>
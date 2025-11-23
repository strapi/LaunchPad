<template>
  <div class="xlsx-viewer">
    <div class="xlsx-content">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading">Loading XLSX...</div>
      <!-- 错误提示 -->
      <div v-if="error" class="error">{{ error }}</div>
      <!-- 表格渲染 -->
      <div v-if="tableData.length" class="table-container">
        <table class="xlsx-table">
          <thead>
            <tr>
              <th v-for="(header, index) in tableData[0]" :key="index">{{ header || 'column' + (index + 1) }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in tableData.slice(1)" :key="rowIndex">
              <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell ?? '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import * as XLSX from 'xlsx';

// 定义 props
const props = defineProps({
  xlsxArrayBuffer: {
    type: [ArrayBuffer, null],
    default: null
  }
});

// 响应式变量
const isLoading = ref(false);
const error = ref(null);
const tableData = ref([]);

// 解析 XLSX 文件
const parseXLSX = async (arrayBuffer) => {
  if (!arrayBuffer || !(arrayBuffer instanceof ArrayBuffer) || arrayBuffer.byteLength === 0) {
    error.value = 'InValid XLSX data';
    return;
  }
  isLoading.value = true;
  error.value = null;

  try {
    const uint8Array = new Uint8Array(arrayBuffer);
    if (!uint8Array.buffer || uint8Array.buffer.byteLength === 0) {
      throw new Error('ArrayBuffer already disposed');
    }

    // 解析 XLSX
    const workbook = XLSX.read(uint8Array, { type: 'array', defval: '' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // 转换为 JSON 数据，设置 defval 确保空值为空字符串
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    tableData.value = jsonData;

    isLoading.value = false;
  } catch (err) {
    isLoading.value = false;
    error.value = `Error XLSX: ${err.message}`;
    console.error('XLSX Error:', err);
  }
};

// 监听 xlsxArrayBuffer 变化
watch(() => props.xlsxArrayBuffer, (newBuffer) => {
  if (newBuffer) {
    parseXLSX(newBuffer);
  }
});

// 组件挂载时解析
onMounted(() => {
  if (props.xlsxArrayBuffer) {
    parseXLSX(props.xlsxArrayBuffer);
  }
});
</script>

<style scoped>
.xlsx-viewer {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  padding: 0;
}

.table-container {
  max-height: 100%;
  overflow: auto;
}

.xlsx-table {
  width: 100%;
  border-collapse: collapse;
  /* 移除 table-layout: fixed，允许自适应宽度 */
}

.xlsx-table th,
.xlsx-table td {
  border: 1px solid #9e9e9e; /* 确保边框 */
  padding: 8px;
  text-align: left;
  min-width: 30px; /* 最小宽度 */
  white-space: normal; /* 允许换行 */
  word-break: break-all; /* 长文本自动换行 */
  /* 可选：限制最大宽度，超出显示省略号 */
  /* max-width: 200px; */
  /* overflow: hidden; */
  /* text-overflow: ellipsis; */
}

.xlsx-table th {
  background-color: #d4d4d4;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 1;
}

.xlsx-table td:empty::after {
  content: ''; /* 空单元格占位符 */
  color: #999;
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
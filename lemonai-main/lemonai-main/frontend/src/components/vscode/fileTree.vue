<template>
  <div class="files-container">
      <div class="file-tree-container">
        <div v-for="item in items" :key="item" class="file-item">
          <!-- 渲染图标 -->
        <div :class="['file-entry', { 'is-directory': isDirectory(item) }]" @click.stop="handleClick(item)">
          <span class="file-icon">{{ getFileIcon(item) }}</span>
          <span class="file-name">{{ getFileName(item) }}</span>
        </div>

        <div v-if="isDirectory(item) && expandedDirs[fullPath(item)]" class="subdirectory">
          <file-tree
            :items="subDirectories[fullPath(item)] || []" :base-path="fullPath(item)" :conversation-id="conversationId"
            @item-click="emit('item-click', $event)" />
        </div>
      </div>
      </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import service from '@/services/workspace';
import { useChatStore } from '@/store/modules/chat'
import emitter from '@/utils/emitter'
// 定义 props
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  basePath: {
    type: String,
    default: ''
  },
  conversationId: {
    type: String,
    default: () => useChatStore().conversationId
  }
});



const expandedDirs = reactive({});
const subDirectories = reactive({});
const loadingSubDir = reactive({});

function isDirectory(path) {
  return path.endsWith('/');
}

function getFileName(path) {
  // 获取路径的最后一个部分作为文件名
  const cleanPath = path.replace(/\/$/, '');
  const parts = cleanPath.split('/');
  return parts[parts.length - 1] || cleanPath;
}

function fullPath(item) {
  // 规范化路径，并与basePath组合
  return item;
}

function getFileIcon(path) {
  // 根据路径获取文件类型图标
  const fullItemPath = fullPath(path);// 完整的路径
  if (isDirectory(path)) {
    // 如果是目录,根据是否展开来返回不同的图标
    return expandedDirs[fullItemPath] ? '📂' : '📁';
  }
  // 获取文件扩展名
  const extension = path.split('.').pop().toLowerCase();
  switch (extension) {
    case 'js': return '📜';
    case 'vue': return '🟢';
    case 'html': return '🌐';
    case 'css': return '🎨';
    case 'json': return '⚙️';
    case 'md': return '📝';
    default: return '📄';
  }
}

async function handleClick(item) {
  
  const path = fullPath(item);
  if (isDirectory(item)) {
    if (!expandedDirs[path]) {
      expandedDirs[path] = true;
      await loadSubDirectory(path);
    } else {
      expandedDirs[path] = false;
    }
  }else{
    emitter.emit('file-path', path)
  }
  
}
// 加载子目录
async function loadSubDirectory(dirPath) {
  if (dirPath in subDirectories) {
    console.log(`${dirPath} 已加载过，直接使用缓存:`, subDirectories[dirPath]);
    return;
  }
  loadingSubDir[dirPath] = true;
  try {
    console.log(props.conversationId)
    const result = await service.getFiles(props.conversationId, dirPath);
    // console.log(`加载 ${dirPath} 的原始结果:`, result);
    let normalizedResult = [];
    if (Array.isArray(result)) {
      normalizedResult = result;
    } else if (result && typeof result === 'object') {
      normalizedResult = [];
    } else {
      console.warn(`${dirPath} 返回的数据格式异常:`, result);
      normalizedResult = [];
    }
    subDirectories[dirPath] = normalizedResult;
    // console.log(`规范化后的 ${dirPath} 数据:`, normalizedResult);
    // console.log('更新后的 subDirectories:', subDirectories);
  } catch (err) {
    // console.error('加载子目录失败:', err);
    subDirectories[dirPath] = [];
  } finally {
    loadingSubDir[dirPath] = false;
  }
}

// // 初始加载根目录
// onMounted(async () => {
//   // error.value = null;
// });
</script>

<style scoped>
.files-container{
  display: flex;
  flex-direction: column;
}
/* .file-tree-container{
  display: flex;
  flex-direction: column;
} */

.file-entry {
  display: flex;
  align-items: center;
  /* padding: 5px 8px; */
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.file-entry:hover {
  background-color: #646464;
}

.file-icon {
  margin-right: 6px;
  width: 16px;
  text-align: center;
}
/* 
.is-directory {
  font-weight: 500;
} */

.subdirectory {
  margin-left: 16px;
  border-left: 1px dashed #ccc;
  padding-left: 8px;
}
</style>
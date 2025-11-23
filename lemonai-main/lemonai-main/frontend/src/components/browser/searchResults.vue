<template>
  <div class="search-result-list-container">
    <!-- 遍历搜索结果 -->
    <div class="result-item" v-for="(result, index) in props.searchResults" :key="index">
      <div class="header">
        <!-- <img :src="result.icon" alt="favicon" class="icon"> -->
        <a :href="result.url" target="_blank">{{ result.title }}</a>
      </div>
      <div class="summary-container">
        <span class="summary">{{ result.content }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// props
const props = defineProps({
  searchResults: {
    type: Array,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.search-result-list-container {
  padding: 0.75rem 1rem; // 上下内边距为 0.75rem，左右内边距为 1rem
  max-height: 100%; // 确保容器高度适配父级
  overflow-y: auto; // 如果内容过多，显示滚动条
  display: flex;
  flex-direction: column; // 垂直排列子元素
}
.search-result-list-container::-webkit-scrollbar  { 
  width: 0;
  height: 0;
}


.result-item {
  padding: 0.75rem 0; // 每个结果项的上下内边距
  border-bottom: 1px solid #e5e7eb; // 底部边框分隔线

  .header {
    display: flex; // 图标和标题水平排列
    align-items: center; // 垂直居中对齐
    margin-bottom: 0.5rem; // 标题与摘要之间的间距

    .icon {
      width: 1rem; // 图标宽度
      height: 1rem; // 图标高度
      margin-right: 0.5rem; // 图标与标题之间的间距
      flex-shrink: 0; // 防止图标被压缩
    }

    a {
      color: #34322d; // 链接默认颜色
      text-decoration: none; // 去掉下划线
      font-size: 0.875rem; // 字体大小
      line-height: 1.25rem; // 行高
      font-weight: 500; // 字体加粗
      transition: color 0.3s ease; // 鼠标悬停时的颜色变化效果
      cursor: pointer; // 鼠标悬停时显示手型

      &:hover {
        text-decoration: underline; // 鼠标悬停时显示下划线
      }
    }
  }

  .summary-container {
    .summary {
      color: #858481; // 摘要文字颜色
      font-size: 0.75rem; // 字体大小
      line-height: 1rem; // 行高
      margin-top: 0.125rem; // 摘要与标题之间的间距
      word-wrap: break-word; // 自动换行
      overflow: hidden; // 防止内容溢出
      text-overflow: ellipsis; // 超出部分省略号表示
      display: -webkit-box; // 允许多行省略
      -webkit-line-clamp: 3; // 最多显示 3 行
      -webkit-box-orient: vertical; // 垂直排列
    }
  }
}
</style>
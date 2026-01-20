<template>
  <div class="image-container">
    <img :src="formattedImageData" alt="Displaying image" />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  content: {
    type: Array, // 期望这里是包含 Base64 字符串的数组
    required: true
  },
  // 增加一个 prop 来指定图片类型，默认为 'image/jpeg'
  imageType: {
    type: String,
    default: 'image/jpeg' // 根据你的实际图片类型调整，'image/png', 'image/gif' 等
  }
});

// 使用 computed 属性来动态生成完整的 Data URI
const formattedImageData = computed(() => {
  //数组非空校验
  if (!props.content || props.content.length === 0) {
    return '';
  }
  const base64Data = props.content[props.content.length-1]; // 获取 Base64 字符串

  if (!base64Data) {
    console.warn("ImageDisplay component received empty or invalid content.");
    return ''; // 如果没有数据，返回空字符串
  }

  // 拼接 Data URI 前缀和 Base64 数据
  // 确保 base64Data 不包含任何 Data URI 前缀，如果包含，需要先移除
  if (base64Data.startsWith('data:')) {
    // 如果传进来的 Base64 字符串已经包含了 Data URI 前缀，则直接使用
    return base64Data;
  } else {
    // 否则，手动添加前缀
    return `data:${props.imageType};base64,${base64Data}`;
  }
});
</script>

<style lang="scss" scoped>
.image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  
  img {
    max-width: 100%;
    height: auto;
    object-fit: contain;
    border: 1px solid #dadada;
  }
}
</style>
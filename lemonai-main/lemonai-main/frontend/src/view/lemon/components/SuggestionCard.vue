<template>
  <div class="suggestion-card">
    <div class="card-icon">
      <!-- <i :class="icon"></i> -->
      <img src="" style="aspect-ratio: 4 / 3;width: 100%;" alt="icon"
        class="card-icon-img">
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-desc">{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  title: String,
  description: String
})
</script>

<style lang="scss" scoped>
.suggestion-card {
  background: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  width: calc((100% - 4rem) / 5);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.card-icon {
  border-radius: 8px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;

  i {
    font-size: 24px;
    color: #1f2329;
  }
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  color: #1f2329;
  margin: 0 0 8px;
}

.card-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

@media screen and (max-width: 768px) {
  .suggestion-card {
    width: calc((100% - 0.5rem) / 2)!important;
  }
}
</style>
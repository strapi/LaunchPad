<template>
    <div class="loading-dots">
      <span class="dot">·</span>
      <span class="dot">·</span>
      <span class="dot">·</span>
    </div>
  </template>
  
  <script>
  export default {
    name: "LoadingDots",
  };
  </script>
  
  <style scoped>
  .loading-dots {
    font-size: 24px;
    color: #333;
    white-space: nowrap;
    display: flex;
    align-items: center;
    height: 36px;
  }
  
  .dot {
    display: inline-block;
    animation: dot-jump 1s infinite ease-in-out both;
  }
  .dot:nth-child(1){
    animation-delay: 0s;
  }
  
  .dot:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .dot:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes dot-jump {
    0%,
    80%,
    100% {
      transform: scale(1);
    }
    40% {
      transform: scale(1.5);
    }
  }
  </style>
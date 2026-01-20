<template>
  <div>
    <h1>demo</h1>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { io } from "socket.io-client";
const socket = ref(null)

const connectWebSocket = () => {
  // Connect to WebSocket with specific parameters
  socket.value = io('ws://localhost:3000', {
    path: '/socket.io/',
    query: {
      latest_event_id: -1,
      conversation_id: 'b0316208a2054a16968a90f14f50da3c',
      EIO: 4,
      transport: 'websocket'
    }
  });

  // Listen for messages
  socket.value.on('message', (data) => {
    console.log('Received message:', data);
    // Handle the message here
  });

  // Handle connection events
  socket.value.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  socket.value.on('oh_event', (data) => {
    console.log('oh_event', data);
  });

  socket.value.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
  });

  socket.value.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
}

onMounted(() => {
  connectWebSocket();
});

</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

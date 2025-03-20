<script setup lang="ts">
// Remove test page imports as we're using router now
</script>

<template>
  <router-view></router-view>
</template>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

:root[data-theme="dark"] {
  --primary-color: #f29100;
  --sidebar-color: #1e2a38;
  --sidebar-hover: #2c3e50;
  --card-blue: #405e7e;
  --card-green: #4b6455;
  --text-primary: #e0e0e0;
  --text-light: #ffffff;
  --background-light: #2c3e50;
  --chart-red: #d35f5f;
  --chart-green: #9ab86c;
  --chart-purple: #8669b4;
  --chart-blue-completed: #4b7298;
  --chart-blue-pending: #6a8fb5;
}
</style>

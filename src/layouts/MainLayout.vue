<template>
  <div class="dashboard-layout">
    <AppHeader />
    <div class="dashboard-container">
      <AppSidebar @class-change="handleClassChange" />
      <main class="main-content">
        <router-view ref="dashboardRef"></router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppSidebar from '@/components/layout/AppSidebar.vue';

const dashboardRef = ref(null);

// Method to pass the selected class ID to the child component
// const handleClassChange = (classId) => {
//   // If the current route component exposes handleClassChange, call it
//   if (dashboardRef.value && typeof dashboardRef.value.handleClassChange === 'function') {
//     dashboardRef.value.handleClassChange(classId);
//   }
// };
let handleClassChange;
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.dashboard-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow: hidden;
  background-color: var(--background-light);
  display: flex;
  width: 100%;
}
</style>
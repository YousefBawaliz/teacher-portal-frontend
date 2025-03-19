<template>
  <div class="main-layout">
    <AppHeader />
    
    <div class="layout-container">
      <AppSidebar 
        v-model="sidebarCollapsed"
        class="layout-sidebar" 
      />
      
      <main 
        class="layout-main"
        :class="{ 'sidebar-collapsed': sidebarCollapsed }"
      >
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '../components/layout/AppHeader.vue'
import AppSidebar from '../components/layout/AppSidebar.vue'

const sidebarCollapsed = ref(false)
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  background-color: var(--color-background);
}

.layout-container {
  display: grid;
  grid-template-columns: auto 1fr;
  min-height: calc(100vh - 64px);
  margin-top: 64px;
}

.layout-sidebar {
  position: fixed;
  height: calc(100vh - 64px);
  z-index: 900;
}

.layout-main {
  margin-left: 250px;
  padding: var(--spacing-6);
  transition: margin-left var(--transition);
}

.layout-main.sidebar-collapsed {
  margin-left: 0;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .layout-container {
    display: block;
  }

  .layout-main {
    margin-left: 0;
    padding: var(--spacing-4);
  }

  .layout-sidebar {
    position: fixed;
    transform: translateX(-100%);
    transition: transform var(--transition);
  }

  .layout-sidebar.open {
    transform: translateX(0);
  }
}
</style>


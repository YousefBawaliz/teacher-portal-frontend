<template>
  <aside 
    class="app-sidebar"
    :class="{ 'collapsed': modelValue }"
  >
    <button class="collapse-button" @click="toggleCollapse">
      <i-chevron-left :class="{ 'rotate-180': modelValue }" />
    </button>
    
    <!-- Navigation items will be added here later -->
    <nav class="sidebar-nav">
      <!-- Placeholder for future navigation -->
    </nav>
  </aside>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const toggleCollapse = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>

<style scoped>
.app-sidebar {
  width: 250px;
  background-color: white;
  border-right: 1px solid #E5E7EB;
  transition: width 0.3s ease;
}

.app-sidebar.collapsed {
  width: 0;
  overflow: hidden;
}

.collapse-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  margin: 16px;
  color: var(--color-text-secondary);
}

:deep(svg) {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.rotate-180 :deep(svg) {
  transform: rotate(180deg);
}

.sidebar-nav {
  padding: 16px;
}
</style>

<template>
  <div :class="['spinner-wrapper', { 'spinner-overlay': overlay }]">
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      :class="['spinner', `text-${color}`]"
    >
      <circle
        class="spinner-track"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="3"
        fill="none"
      />
      <circle
        class="spinner-head"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="3"
        fill="none"
      />
    </svg>
    <span v-if="text" class="spinner-text">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  size: {
    type: Number,
    default: 24
  },
  color: {
    type: String,
    default: 'primary'
  },
  text: {
    type: String,
    default: ''
  },
  overlay: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.spinner-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-surface);
  opacity: 0.8;
  z-index: 9999;
  transition: opacity 0.2s;
}

.spinner {
  animation: rotate 1.5s linear infinite;
}

.spinner-track {
  opacity: 0.2;
}

.spinner-head {
  stroke-dasharray: 80;
  stroke-dashoffset: 60;
  animation: dash 1.5s ease-in-out infinite;
}

.spinner-text {
  margin-top: 8px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dashoffset: 60;
  }
  50% {
    stroke-dashoffset: 20;
  }
  100% {
    stroke-dashoffset: 60;
  }
}
</style>
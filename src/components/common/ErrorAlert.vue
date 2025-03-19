<template>
  <div class="error-alert" role="alert">
    <svg
      class="error-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clip-rule="evenodd"
      />
    </svg>
    <div class="error-content">
      <h4 v-if="title" class="error-title">{{ title }}</h4>
      <p class="error-message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.error-alert {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  margin: 16px 0;
  background-color: var(--color-error);
  opacity: 0.1;
  border: 1px solid var(--color-error);
  border-radius: 8px;
}

.error-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  color: var(--color-error);
}

.error-content {
  flex: 1;
}

.error-title {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-error);
}

.error-message {
  margin: 0;
  font-size: 14px;
  color: var(--color-error);
  opacity: 0.9;
}
</style>
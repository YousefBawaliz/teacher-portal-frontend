<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="auth-header">
        <img src="@/assets/images/logo.png" alt="Logo" class="auth-logo" />
        <h1 class="auth-title">Learning Management System</h1>
      </div>
      
      <div class="auth-content">
        <router-view></router-view>
      </div>

      <footer class="auth-footer">
        <p>© {{ new Date().getFullYear() }} Learning Management System. All rights reserved.</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for this layout
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #EBF5FF 0%, #F0F9FF 100%);
}

.auth-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-6);
}

.auth-header {
  text-align: center;
  margin-bottom: var(--spacing-8);
}

.auth-logo {
  height: 48px;
  margin-bottom: var(--spacing-4);
}

.auth-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
}

.auth-content {
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
}

.auth-footer {
  text-align: center;
  padding: var(--spacing-6);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}

@media (max-width: 768px) {
  .auth-container {
    padding: var(--spacing-4);
  }

  .auth-title {
    font-size: var(--text-xl);
  }
}
</style>


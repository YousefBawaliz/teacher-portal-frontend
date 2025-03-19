<template>
  <header class="app-header">
    <div class="header-left">
      <img src="@/assets/images/logo.png" alt="Logo" class="header-logo" />
    </div>

    <div class="header-right">
      <button class="theme-toggle" @click="toggleTheme">
        <i-sun v-if="theme === 'dark'" />
        <i-moon v-else />
      </button>

      <div class="profile-dropdown" v-click-outside="closeDropdown">
        <button class="profile-button" @click="toggleDropdown">
          <span class="user-name">{{ userFullName }}</span>
          <i-chevron-down :class="{ 'rotate-180': isDropdownOpen }" />
        </button>

        <div v-show="isDropdownOpen" class="dropdown-menu">
          <button class="dropdown-item" @click="handleLogout">
            <i-logout class="item-icon" />
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useTheme } from '@/composables/useTheme'
import { computed } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const { theme, toggleTheme } = useTheme()

const isDropdownOpen = ref(false)
const userFullName = computed(() => authStore.userFullName)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: white;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 1000;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-logo {
  height: 36px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-dropdown {
  position: relative;
}

.profile-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #1F2937;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
}

/* Add these new styles for icons */
:deep(svg) {
  width: 20px;
  height: 20px;
}

.item-icon {
  width: 16px !important;
  height: 16px !important;
}

/* Update dropdown styles to use CSS variables */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  min-width: 200px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  text-align: left;
}

.dropdown-item:hover {
  background-color: var(--color-background);
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>

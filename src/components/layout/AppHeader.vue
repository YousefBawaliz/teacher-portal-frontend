<template>
  <header class="app-header">
    <div class="university-logo">
      <span class="logo-dot"></span>
      <span class="logo-dot"></span>
      <h1>Jordan University</h1>
    </div>
    <div class="header-controls">
      <div class="theme-toggle">
        <input 
          type="checkbox" 
          id="theme-toggle" 
          v-model="isDarkTheme" 
          @change="toggleTheme" 
          class="toggle-input"
        />
        <label for="theme-toggle" class="toggle-label">
          <span class="visually-hidden">Toggle dark theme</span>
        </label>
      </div>
      <div class="notification-bell">
        <button class="bell-button" aria-label="Notifications">
          <i class="notification-icon">🔔</i>
        </button>
      </div>
      <div class="user-profile" @click="toggleProfileMenu">
        <span class="username">{{ userName }}</span>
        <div class="profile-icon">
          <i class="user-icon">👤</i>
          <i class="dropdown-icon">▼</i>
        </div>
        <div class="profile-menu" v-if="showProfileMenu">
          <ul>
            <li><a href="#">Profile</a></li>
            <li><a href="#">Settings</a></li>
            <li><a href="#" @click.prevent="logout">Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const userName = computed(() => authStore.userFullName || 'John Doe');
const isDarkTheme = ref(false);
const showProfileMenu = ref(false);

const toggleTheme = () => {
  const theme = isDarkTheme.value ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  // Save preference to user profile if needed
};

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value;
};

const logout = async () => {
  try {
    await authStore.logout();
    // Redirect to login page
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout failed', error);
  }
};
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--primary-color);
  color: var(--text-light);
  padding: 0 1.25rem;
  height: 3.5rem;
  width: 100%;
}

.university-logo {
  display: flex;
  align-items: center;
}

.logo-dot {
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
  margin-right: 5px;
}

.university-logo h1 {
  font-size: 1.2rem;
  margin-left: 0.5rem;
}

.header-controls {
  display: flex;
  align-items: center;
}

.theme-toggle {
  margin-right: 1.5rem;
}

.toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-label {
  position: relative;
  display: inline-block;
  width: 2.5rem;
  height: 1.25rem;
  background-color: #806d9e;
  border-radius: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.toggle-label::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 1rem;
  height: 1rem;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

.toggle-input:checked + .toggle-label::after {
  transform: translateX(1.25rem);
}

.notification-bell {
  margin-right: 1.5rem;
}

.bell-button {
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  font-size: 1.25rem;
}

.user-profile {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.username {
  margin-right: 0.5rem;
}

.profile-icon {
  display: flex;
  align-items: center;
}

.user-icon {
  margin-right: 0.25rem;
}

.dropdown-icon {
  font-size: 0.75rem;
}

.profile-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 150px;
  z-index: 10;
  margin-top: 0.5rem;
}

.profile-menu ul {
  list-style: none;
  padding: 0.5rem 0;
}

.profile-menu li {
  padding: 0.5rem 1rem;
}

.profile-menu a {
  color: var(--text-primary);
  text-decoration: none;
  display: block;
}

.profile-menu a:hover {
  color: var(--primary-color);
}

@media (max-width: 600px) {
  .username {
    display: none;
  }
}
</style>
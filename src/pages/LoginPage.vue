<template>
  <div class="login-container">
    <div class="login-card">
      <img 
        src="@/assets/images/logo.png" 
        alt="Logo" 
        class="login-logo"
      />
      
      <div v-if="alert.show" :class="['alert', `alert-${alert.type}`]">
        {{ alert.message }}
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="Enter your email"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="Enter your password"
            :disabled="loading"
          />
        </div>

        <button 
          type="submit" 
          class="login-button"
          :disabled="loading"
        >
          <span v-if="!loading">Login</span>
          <span v-else>Logging in...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()
const { login } = useAuth()

const loading = ref(false)
const alert = reactive({
  show: false,
  type: 'success',
  message: ''
})

const form = reactive({
  email: '',
  password: ''
})

const showAlert = (type: 'success' | 'error', message: string) => {
  alert.show = true
  alert.type = type
  alert.message = message
  
  // Hide alert after 5 seconds
  setTimeout(() => {
    alert.show = false
  }, 5000)
}

const handleLogin = async () => {
  try {
    loading.value = true
    await login({
      email: form.email,
      password: form.password
    })
    showAlert('success', 'Login successful!')
    await router.push({ name: 'dashboard' })
  } catch (err) {
    const errorMessage = err instanceof Error 
      ? err.message 
      : 'Login failed. Please try again.'
    showAlert('error', errorMessage)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px); /* Account for potential header/footer */
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 450px;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  padding: 32px;
}

.login-logo {
  display: block;
  height: 60px;
  margin: 0 auto 24px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  color: #6B7280;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  background: #F5F7FA;
  font-size: 16px;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #3B82F6;
  background: #FFFFFF;
}

.login-button {
  width: 100%;
  padding: 12px;
  background: #3B82F6;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.login-button:hover {
  background: #60A5FA;
}

.login-button:active {
  transform: scale(0.98);
}

.login-button:disabled {
  background: #93C5FD;
  cursor: not-allowed;
}

.alert {
  margin-bottom: 20px;
  padding: 12px;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.alert-success {
  background: #DEF7EC;
  color: #03543F;
  border: 1px solid #0F766E;
}

.alert-error {
  background: #FEF2F2;
  color: #B91C1C;
  border: 1px solid #EF4444;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .login-card {
    padding: 24px;
  }

  .login-logo {
    height: 48px;
  }
}
</style>


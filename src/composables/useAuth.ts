import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import type { LoginRequest, User } from '@/types/api.types'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const currentUser = computed(() => authStore.currentUser)
  const isAdmin = computed(() => authStore.isAdmin)
  const isTeacher = computed(() => authStore.isTeacher)

  const login = async (credentials: LoginRequest) => {
    try {
      await authStore.login(credentials)
      const redirect = router.currentRoute.value.query.redirect as string
      await router.push(redirect || '/')
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authStore.logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      // Still redirect to login page even if logout fails
      router.push('/login')
    }
  }

  const checkPermission = (requiredRole: User['role']) => {
    if (!currentUser.value) return false
    if (currentUser.value.role === 'admin') return true
    return currentUser.value.role === requiredRole
  }

  const refreshUserSession = async () => {
    try {
      await authStore.refreshToken()
      return true
    } catch (error) {
      console.error('Session refresh failed:', error)
      return false
    }
  }

  return {
    isAuthenticated,
    currentUser,
    isAdmin,
    isTeacher,
    login,
    logout,
    checkPermission,
    refreshUserSession
  }
}
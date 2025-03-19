import { defineStore } from 'pinia'
import type { AuthState, ApiError } from '@/types/store.types'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'
import type { LoginRequest } from '@/types/api.types'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    currentUser: null,
    isAuthenticated: !!AuthService.getAccessToken(),
    loading: false,
    error: null
  }),

  getters: {
    isAdmin(): boolean {
      return this.currentUser?.role === 'admin' || false
    },
    isTeacher(): boolean {
      return this.currentUser?.role === 'teacher' || false
    },
    userFullName(): string {
      if (!this.currentUser) return ''
      return `${this.currentUser.first_name} ${this.currentUser.last_name}`
    }
  },

  actions: {
    async login(credentials: LoginRequest) {
      this.loading = true
      this.error = null
      try {
        const response = await AuthService.login(credentials)
        this.isAuthenticated = true
        await this.fetchUserProfile()
        return response
      } catch (error) {
        this.error = (error as ApiError).message
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      try {
        await AuthService.logout()
      } catch (error) {
        this.error = (error as ApiError).message
      } finally {
        this.currentUser = null
        this.isAuthenticated = false
        this.loading = false
      }
    },

    async fetchUserProfile() {
      this.loading = true
      try {
        const user = await UserService.getCurrentUser()
        this.currentUser = user
        return user
      } catch (error) {
        this.error = (error as ApiError).message
        throw error
      } finally {
        this.loading = false
      }
    },

    async refreshToken() {
      try {
        const newToken = await AuthService.refreshToken()
        this.isAuthenticated = true
        return newToken
      } catch (error) {
        this.error = (error as ApiError).message
        this.isAuthenticated = false
        throw error
      }
    }
  }
})

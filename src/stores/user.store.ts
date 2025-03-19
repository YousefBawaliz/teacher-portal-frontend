import { defineStore } from 'pinia'
import type { ApiError } from '@/types/store.types'
import { UserService, type UpdateUserProfile } from '@/services/user.service'
import type { User } from '@/types/api.types'

interface UserState {
  users: User[]
  selectedUser: User | null
  loading: boolean
  error: null | string
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    selectedUser: null,
    loading: false,
    error: null
  }),

  getters: {
    getUserById: (state) => {
      return (userId: number) => state.users.find(user => user.id === userId)
    }
  },

  actions: {
    async fetchAllUsers(page = 1, perPage = 10) {
      this.loading = true
      this.error = null
      try {
        const response = await UserService.getAllUsers(page, perPage)
        this.users = response.data
        return response
      } catch (error) {
        this.error = (error as ApiError).message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUserProfile(data: UpdateUserProfile) {
      this.loading = true
      this.error = null
      try {
        const updatedUser = await UserService.updateProfile(data)
        
        // Update in users array if exists
        const index = this.users.findIndex(u => u.id === updatedUser.id)
        if (index !== -1) {
          this.users[index] = updatedUser
        }
        
        // Update selected user if it's the same user
        if (this.selectedUser?.id === updatedUser.id) {
          this.selectedUser = updatedUser
        }
        
        return updatedUser
      } catch (error) {
        this.error = (error as ApiError).message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
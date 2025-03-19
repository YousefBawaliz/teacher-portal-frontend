import { defineStore } from 'pinia'
import type { ClassState, ApiError } from '@/types/store.types'
import { ClassService } from '@/services/class.service'

export const useClassStore = defineStore('class', {
  state: (): ClassState => ({
    classes: [],
    selectedClass: null,
    loading: false,
    error: null
  }),

  getters: {
    classesByCourse: (state) => {
      if (!state.classes) return () => []
      return (courseId: string) => state.classes.filter(cls => cls.course_id === courseId)
    },
    teacherClasses: (state) => {
      if (!state.classes) return () => []
      return (teacherId: string) => state.classes.filter(cls => cls.teacher_id === teacherId)
    }
  },

  actions: {
    async fetchClasses() {
      this.loading = true
      this.error = null
      try {
        const classes = await ClassService.getAllClasses()
        this.classes = classes.data
        return classes
      } catch (error) {
        this.error = (error as ApiError).message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchClassById(id: string) {
      this.loading = true
      this.error = null
      try {
        const classDetails = await ClassService.getClass(id)
        this.selectedClass = classDetails
        return classDetails
      } catch (error) {
        this.error = (error as ApiError).message
        throw error
      } finally {
        this.loading = false
      }
    },

    clearSelectedClass() {
      this.selectedClass = null
    }
  }
})





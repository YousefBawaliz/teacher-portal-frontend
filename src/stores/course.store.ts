import { defineStore } from 'pinia'
import type { CourseState, ApiError } from '@/types/store.types'
import { CourseService } from '@/services/course.service'

export const useCourseStore = defineStore('course', {
  state: (): CourseState => ({
    courses: [],
    selectedCourse: null,
    loading: false,
    error: null
  }),

  getters: {
    coursesByCode: (state) => {
      return state.courses.sort((a, b) => a.course_code.localeCompare(b.course_code))
    },
    activeCourses: (state) => {
      return state.courses.filter(course => course.is_active)
    }
  },

  actions: {
    async fetchCourses() {
      this.loading = true
      this.error = null
      try {
        const courses = await CourseService.getAllCourses()
        this.courses = courses
        return courses
      } catch (error) {
        this.error = (error as ApiError).message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCourseById(id: string) {
      this.loading = true
      this.error = null
      try {
        const course = await CourseService.getCourse(id)
        this.selectedCourse = course
        return course
      } catch (error) {
        this.error = (error as ApiError).message
        throw error
      } finally {
        this.loading = false
      }
    },

    clearSelectedCourse() {
      this.selectedCourse = null
    }
  }
})
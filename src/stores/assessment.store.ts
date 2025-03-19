import { defineStore } from 'pinia'
import type { AssessmentState, ApiError } from '@/types/store.types'
import { AssessmentService, type Assessment } from '@/services/assessment.service'

export const useAssessmentStore = defineStore('assessment', {
  state: (): AssessmentState => ({
    assessments: [],
    selectedAssessment: null,
    loading: false,
    error: null
  }),

  getters: {
    assessmentsByClass: (state) => {
      return (classId: number) => state.assessments.filter(assessment => assessment.class_id === classId)
    },
    upcomingAssessments: (state) => {
      const now = new Date()
      return state.assessments.filter(assessment => new Date(assessment.date) > now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    },
    recentAssessments: (state) => {
      const now = new Date()
      return state.assessments.filter(assessment => new Date(assessment.date) <= now)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
  },

  actions: {
    async fetchAssessments() {
      this.loading = true
      this.error = null
      try {
        const assessments = await AssessmentService.getAllAssessments()
        this.assessments = assessments
        return assessments
      } catch (error) {
        this.error = (error as ApiError).message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchAssessmentById(id: number) {
      this.loading = true
      this.error = null
      try {
        const assessment = await AssessmentService.getAssessment(id)
        this.selectedAssessment = assessment
        return assessment
      } catch (error) {
        this.error = (error as ApiError).message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createAssessment(assessment: Omit<Assessment, 'id'>) {
      this.loading = true
      this.error = null
      try {
        const newAssessment = await AssessmentService.createAssessment(assessment)
        this.assessments.push(newAssessment)
        return newAssessment
      } catch (error) {
        this.error = (error as ApiError).message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateAssessment(id: number, assessment: Partial<Assessment>) {
      this.loading = true
      this.error = null
      try {
        const updatedAssessment = await AssessmentService.updateAssessment(id, assessment)
        const index = this.assessments.findIndex(a => a.id === id)
        if (index !== -1) {
          this.assessments[index] = updatedAssessment
        }
        if (this.selectedAssessment?.id === id) {
          this.selectedAssessment = updatedAssessment
        }
        return updatedAssessment
      } catch (error) {
        this.error = (error as ApiError).message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteAssessment(id: number) {
      this.loading = true
      this.error = null
      try {
        await AssessmentService.deleteAssessment(id)
        this.assessments = this.assessments.filter(a => a.id !== id)
        if (this.selectedAssessment?.id === id) {
          this.selectedAssessment = null
        }
      } catch (error) {
        this.error = (error as ApiError).message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})

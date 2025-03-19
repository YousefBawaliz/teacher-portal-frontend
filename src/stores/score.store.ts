import { defineStore } from 'pinia'
import type { ScoreState, ApiError } from '@/types/store.types'
import { ScoreService, type Score, type CreateScoreData, type UpdateScoreData } from '@/services/score.service'

export const useScoreStore = defineStore('score', {
  state: (): ScoreState => ({
    scores: [] as Score[],
    loading: false,
    error: null
  }),

  getters: {
    averageScoreByClass: (state) => {
      return (classId: number) => {
        const classScores = state.scores.filter(score => score.assessment_id === classId)
        if (!classScores.length) return 0
        return classScores.reduce((sum, score) => sum + score.score_value, 0) / classScores.length
      }
    },
    lowPerformingStudents: (state) => {
      return (threshold: number) => {
        const studentAverages = new Map<number, { sum: number; count: number }>()
        
        state.scores.forEach(score => {
          const current = studentAverages.get(score.student_id) || { sum: 0, count: 0 }
          studentAverages.set(score.student_id, {
            sum: current.sum + score.score_value,
            count: current.count + 1
          })
        })

        return Array.from(studentAverages.entries())
          .filter(([_, stats]) => (stats.sum / stats.count) < threshold)
          .map(([studentId]) => studentId)
      }
    }
  },

  actions: {
    async fetchScoresByStudent(studentId: number) {
      this.loading = true
      this.error = null
      try {
        const scores = await ScoreService.getStudentScores(studentId)
        this.scores = scores
        return scores
      } catch (error) {
        this.error = (error as ApiError).message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchScoresByAssessment(assessmentId: number) {
      this.loading = true
      this.error = null
      try {
        const scores = await ScoreService.getStudentScoreByAssessment(assessmentId, '')  // Note: This needs assessment title
        this.scores = [scores]  // Wrapping in array since the service returns a single score
        return scores
      } catch (error) {
        this.error = (error as ApiError).message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createScore(data: CreateScoreData) {
      this.loading = true
      this.error = null
      try {
        const newScore = await ScoreService.createScore(data)
        this.scores.push(newScore)
        return newScore
      } catch (error) {
        this.error = (error as ApiError).message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateScore(id: number, data: UpdateScoreData) {
      this.loading = true
      this.error = null
      try {
        const updatedScore = await ScoreService.updateScore(id, data)
        const index = this.scores.findIndex(s => s.id === id)
        if (index !== -1) {
          this.scores[index] = updatedScore
        }
        return updatedScore
      } catch (error) {
        this.error = (error as ApiError).message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})

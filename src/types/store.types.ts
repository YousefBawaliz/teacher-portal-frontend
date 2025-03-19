import type { User } from '@/types/api.types'
import type { Score } from '@/services/score.service'
import type { Assessment } from '@/services/assessment.service'
import type { Course } from '@/services/course.service'
import type { Class, ClassDetails } from '@/services/class.service'

export interface AuthState {
  currentUser: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export interface CourseState {
  courses: Course[]
  selectedCourse: Course | null
  loading: boolean
  error: string | null
}

export interface ClassState {
  classes: Class[]
  selectedClass: ClassDetails | null
  loading: boolean
  error: string | null
}

export interface AssessmentState {
  assessments: Assessment[]
  selectedAssessment: Assessment | null
  loading: boolean
  error: string | null
}

export interface ScoreState {
  scores: Score[]
  loading: boolean
  error: string | null
}

// Common state interface for reusability
export interface BaseState {
  loading: boolean
  error: string | null
}

// Common API error type
export interface ApiError {
  message: string
  status?: number
  code?: string
}
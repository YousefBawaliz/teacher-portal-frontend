import api from './api';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';

export interface Assessment {
  id: number;  // Changed from string to number to match backend
  class_id: number;  // Changed from string to number
  title: string;
  description?: string;
  type: 'quiz' | 'assignment' | 'exam';
  date: string;  // Changed from due_date to date to match backend
  created_by: number;  // Added to match backend
  created_at: string;
  updated_at: string;
  // Removed total_points and is_published as they're not in backend schema
}

export interface CreateAssessmentData {
  class_id: number;  // Changed from string to number
  title: string;
  description?: string;
  type: 'quiz' | 'assignment' | 'exam';
  date: string;  // Changed from due_date to date
  // Removed total_points as it's not in backend schema
}

export interface UpdateAssessmentData {
  title?: string;
  description?: string;
  type?: 'quiz' | 'assignment' | 'exam';
  date?: string;  // Changed from due_date to date
  // Removed total_points and is_published
}

export class AssessmentService {
  static async getAllAssessments(): Promise<Assessment[]> {  // Modified to match backend
    const response = await api.get<Assessment[]>('/api/assessments/');
    return response.data;
  }

  static async getAssessment(assessmentId: number): Promise<Assessment> {  // Changed param type to number
    const response = await api.get<Assessment>(`/api/assessments/${assessmentId}`);
    return response.data;
  }

  static async createAssessment(data: CreateAssessmentData): Promise<Assessment> {
    const response = await api.post<Assessment>('/api/assessments/', data);
    return response.data;
  }

  static async updateAssessment(assessmentId: number, data: UpdateAssessmentData): Promise<Assessment> {  // Changed param type to number
    const response = await api.put<Assessment>(`/api/assessments/${assessmentId}`, data);
    return response.data;
  }

  static async deleteAssessment(assessmentId: number): Promise<{ message: string }> {  // Changed return type and param type
    const response = await api.delete<{ message: string }>(`/api/assessments/${assessmentId}`);
    return response.data;
  }

  // Remove publishAssessment and getAssessmentStats as they're not in backend
}

export default AssessmentService;
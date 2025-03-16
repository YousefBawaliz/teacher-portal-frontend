import api from './api';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';

interface Assessment {
  id: string;
  class_id: string;
  title: string;
  description?: string;
  type: 'quiz' | 'assignment' | 'exam';
  due_date: string;
  total_points: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateAssessmentData {
  class_id: string;
  title: string;
  description?: string;
  type: 'quiz' | 'assignment' | 'exam';
  due_date: string;
  total_points: number;
}

interface UpdateAssessmentData {
  title?: string;
  description?: string;
  due_date?: string;
  total_points?: number;
  is_published?: boolean;
}

interface AssessmentStats {
  submission_count: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  score_distribution: Record<string, number>;
}

export class AssessmentService {
  static async getAllAssessments(classId: string, page = 1, perPage = 10): Promise<PaginatedResponse<Assessment>> {
    const response = await api.get<PaginatedResponse<Assessment>>(`/api/classes/${classId}/assessments`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  static async getAssessment(assessmentId: string): Promise<Assessment> {
    const response = await api.get<Assessment>(`/api/assessments/${assessmentId}`);
    return response.data;
  }

  static async createAssessment(data: CreateAssessmentData): Promise<Assessment> {
    const response = await api.post<Assessment>('/api/assessments', data);
    return response.data;
  }

  static async updateAssessment(assessmentId: string, data: UpdateAssessmentData): Promise<Assessment> {
    const response = await api.put<Assessment>(`/api/assessments/${assessmentId}`, data);
    return response.data;
  }

  static async deleteAssessment(assessmentId: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/api/assessments/${assessmentId}`);
    return response.data;
  }

  static async publishAssessment(assessmentId: string): Promise<Assessment> {
    const response = await api.post<Assessment>(`/api/assessments/${assessmentId}/publish`);
    return response.data;
  }

  static async getAssessmentStats(assessmentId: string): Promise<AssessmentStats> {
    const response = await api.get<AssessmentStats>(`/api/assessments/${assessmentId}/stats`);
    return response.data;
  }
}

export default AssessmentService;
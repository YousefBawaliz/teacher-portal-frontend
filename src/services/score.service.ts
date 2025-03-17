import api from './api';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';

export interface Score {
  id: string;
  assessment_id: string;
  student_id: string;
  score: number;
  feedback?: string;
  submitted_at: string;
  graded_at?: string;
}

export interface CreateScoreData {
  assessment_id: string;
  student_id: string;
  score: number;
  feedback?: string;
}

export interface UpdateScoreData {
  score?: number;
  feedback?: string;
}

export interface BatchScoreData {
  scores: Array<{
    student_id: string;
    score: number;
    feedback?: string;
  }>;
}

export class ScoreService {
  static async getScores(assessmentId: string, page = 1, perPage = 10): Promise<PaginatedResponse<Score>> {
    const response = await api.get<PaginatedResponse<Score>>(`/api/assessments/${assessmentId}/scores`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  static async getStudentScore(assessmentId: string, studentId: string): Promise<Score> {
    const response = await api.get<Score>(`/api/assessments/${assessmentId}/scores/${studentId}`);
    return response.data;
  }

  static async createScore(data: CreateScoreData): Promise<Score> {
    const response = await api.post<Score>('/api/scores', data);
    return response.data;
  }

  static async updateScore(scoreId: string, data: UpdateScoreData): Promise<Score> {
    const response = await api.put<Score>(`/api/scores/${scoreId}`, data);
    return response.data;
  }

  static async deleteScore(scoreId: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/api/scores/${scoreId}`);
    return response.data;
  }

  static async batchCreateScores(assessmentId: string, data: BatchScoreData): Promise<ApiResponse<void>> {
    const response = await api.post<ApiResponse<void>>(`/api/assessments/${assessmentId}/scores/batch`, data);
    return response.data;
  }

  static async getStudentScores(studentId: string, classId?: string): Promise<Score[]> {
    const params = classId ? { class_id: classId } : {};
    const response = await api.get<Score[]>(`/api/students/${studentId}/scores`, { params });
    return response.data;
  }
}

export default ScoreService;
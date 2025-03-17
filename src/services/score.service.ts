import api from './api';
import type { ApiResponse } from '@/types/api.types';

export interface Score {
  id: number;
  student_id: number;
  assessment_id: number;
  score_value: number;
  submission_date: string;
  feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateScoreData {
  student_id: number;
  assessment_id: number;
  score_value: number;
  feedback?: string;
}

export interface UpdateScoreData {
  score_value?: number;
  feedback?: string;
}

export class ScoreService {
  // Create a new score (teacher only)
  static async createScore(data: CreateScoreData): Promise<Score> {
    const response = await api.post<Score>('/api/scores/', data);
    return response.data;
  }

  // Get a specific score
  static async getScore(scoreId: number): Promise<Score> {
    const response = await api.get<Score>(`/api/scores/${scoreId}`);
    return response.data;
  }

  // Update a score (teacher only)
  static async updateScore(scoreId: number, data: UpdateScoreData): Promise<Score> {
    const response = await api.put<Score>(`/api/scores/${scoreId}`, data);
    return response.data;
  }

  // Delete a score (teacher only)
  static async deleteScore(scoreId: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/api/scores/${scoreId}`);
    return response.data;
  }

  // Get all scores for a student
  static async getStudentScores(studentId: number): Promise<Score[]> {
    const response = await api.get<Score[]>(`/api/scores/student/${studentId}`);
    return response.data;
  }

  // Get a student's score by assessment title
  static async getStudentScoreByAssessment(studentId: number, assessmentTitle: string): Promise<Score> {
    const response = await api.get<Score>(`/api/scores/student/${studentId}/assessment`, {
      params: { title: assessmentTitle }
    });
    return response.data;
  }
}

export default ScoreService;
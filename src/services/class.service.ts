import api from './api';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';

interface Class {
  id: string;
  course_id: string;
  teacher_id: string;
  name: string;
  section: string;
  schedule?: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  student_count: number;
}

interface ClassDetails extends Class {
  course: {
    course_code: string;
    title: string;
  };
  teacher: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface CreateClassData {
  course_id: string;
  name: string;
  section: string;
  schedule?: string;
  start_date: string;
  end_date: string;
}

interface UpdateClassData {
  name?: string;
  section?: string;
  schedule?: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

interface ClassStats {
  average_score: number;
  assessment_count: number;
  completion_rate: number;
  grade_distribution: Record<string, number>;
  recent_activities: Array<{
    type: string;
    date: string;
    description: string;
  }>;
}

export class ClassService {
  static async getAllClasses(page = 1, perPage = 10): Promise<PaginatedResponse<Class>> {
    const response = await api.get<PaginatedResponse<Class>>('/api/classes', {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  static async getClass(classId: string): Promise<ClassDetails> {
    const response = await api.get<ClassDetails>(`/api/classes/${classId}`);
    return response.data;
  }

  static async createClass(data: CreateClassData): Promise<Class> {
    const response = await api.post<Class>('/api/classes', data);
    return response.data;
  }

  static async updateClass(classId: string, data: UpdateClassData): Promise<Class> {
    const response = await api.put<Class>(`/api/classes/${classId}`, data);
    return response.data;
  }

  static async deleteClass(classId: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/api/classes/${classId}`);
    return response.data;
  }

  static async getClassStats(classId: string): Promise<ClassStats> {
    const response = await api.get<ClassStats>(`/api/classes/${classId}/stats`);
    return response.data;
  }

  static async getClassStudents(classId: string, page = 1, perPage = 10) {
    const response = await api.get(`/api/classes/${classId}/students`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  }

  static async addStudentToClass(classId: string, studentId: string): Promise<ApiResponse<void>> {
    const response = await api.post<ApiResponse<void>>(`/api/classes/${classId}/students`, {
      student_id: studentId
    });
    return response.data;
  }

  static async removeStudentFromClass(classId: string, studentId: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/api/classes/${classId}/students/${studentId}`);
    return response.data;
  }
}

export default ClassService;
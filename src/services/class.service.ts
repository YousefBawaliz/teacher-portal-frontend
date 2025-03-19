import api from './api';
import type { AxiosError } from 'axios';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';

export interface Class {
  id: string | number;
  course_id: string | number;
  teacher_id: string | number;
  section_number: string;
  semester: string;
  year: number;
  created_at: string;
  updated_at: string;
  course: {
    id: number;
    course_code: string;
    title: string;
  };
  teacher: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

export interface ClassDetails extends Class {
  course: {
    id: number;
    course_code: string;
    title: string;
    // Add any additional course fields specific to ClassDetails
  };
  teacher: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;  // Additional field for ClassDetails
  };
}

export interface CreateClassData {
  course_id: string;
  section_number: string;
  semester: string;
  year: number;
}

export interface UpdateClassData {
  section_number?: string;
  semester?: string;
  year?: number;
}

export interface ClassStats {
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
  static async getAllClasses(page = 1, perPage = 10): Promise<Class[]> {
    try {
      console.log('ClassService: Initiating API call to /api/classes/');
      
      const response = await api.get<Class[]>('/api/classes/', {
        params: { page, per_page: perPage }
      });

      console.log('ClassService: Raw API response:', {
        status: response.status,
        data: response.data
      });

      // Simplify the response handling since we're getting a direct array
      const classes = Array.isArray(response.data) ? response.data : [];
      
      if (classes.length === 0) {
        console.warn('ClassService: No classes found in response');
      }

      // Transform the data
      const transformedClasses = this.transformClassData(classes);
      console.log('ClassService: Transformed classes:', transformedClasses);

      return transformedClasses;

    } catch (error) {
      console.error('ClassService: Error in getAllClasses:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        response: (error as AxiosError)?.response?.data
      });
      throw error;
    }
  }

  private static transformClassData(data: any[]): Class[] {
    return data.map(cls => ({
      id: String(cls.id),
      course_id: String(cls.course_id),
      teacher_id: String(cls.teacher_id),
      section_number: cls.section_number,
      semester: cls.semester,
      year: cls.year,
      created_at: cls.created_at,
      updated_at: cls.updated_at,
      course: {
        id: Number(cls.course.id),
        course_code: cls.course.course_code,
        title: cls.course.title
      },
      teacher: {
        id: Number(cls.teacher.id),
        first_name: cls.teacher.first_name,
        last_name: cls.teacher.last_name
      }
    }));
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









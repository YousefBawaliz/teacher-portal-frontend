import api from './api';
import type { ApiResponse } from '@/types/api.types';

interface Course {
  id: string;
  course_code: string;
  title: string;
  description?: string;
  is_active: boolean;
}

interface CreateCourseData {
  course_code: string;
  title: string;
  description?: string;
}

interface UpdateCourseData {
  title?: string;
  description?: string;
  is_active?: boolean;
}

export class CourseService {
  static async getAllCourses(): Promise<Course[]> {
    const response = await api.get<Course[]>('/api/courses');
    return response.data;
  }

  static async getCourse(courseId: string): Promise<Course> {
    const response = await api.get<Course>(`/api/courses/${courseId}`);
    return response.data;
  }

  static async createCourse(data: CreateCourseData): Promise<Course> {
    const response = await api.post<Course>('/api/courses', data);
    return response.data;
  }

  static async updateCourse(courseId: string, data: UpdateCourseData): Promise<Course> {
    const response = await api.put<Course>(`/api/courses/${courseId}`, data);
    return response.data;
  }

  static async deleteCourse(courseId: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/api/courses/${courseId}`);
    return response.data;
  }
}

export default CourseService;
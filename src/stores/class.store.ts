import { defineStore } from 'pinia'
import type { ClassState, ApiError } from '@/types/store.types'
import { ClassService, type Class } from '@/services/class.service'

export const useClassStore = defineStore('class', {
  state: (): ClassState => ({
    classes: [] as Class[],
    selectedClass: null,
    loading: false,
    error: null
  }),

  getters: {
    classesByCourse: (state) => {
      if (!state.classes) return () => []
      return (courseId: string | number) => 
        state.classes.filter(cls => String(cls.course_id) === String(courseId))
    },
    teacherClasses: (state) => {
      if (!state.classes) return () => []
      return (teacherId: string | number) => 
        state.classes.filter(cls => String(cls.teacher_id) === String(teacherId))
    }
  },

  actions: {
    async fetchClasses() {
      console.log('ClassStore: Starting fetchClasses');
      this.loading = true;
      this.error = null;
      
      try {
        const classes = await ClassService.getAllClasses();
        
        console.log('ClassStore: Received classes:', {
          count: classes.length,
          sample: classes[0]
        });

        // Simple validation
        if (!Array.isArray(classes)) {
          throw new Error('Expected array of classes from service');
        }

        this.classes = classes;
        return this.classes;
        
      } catch (error) {
        console.error('ClassStore: Error in fetchClasses:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error'
        });
        this.error = error instanceof Error ? error.message : 'Unknown error';
        throw error;
      } finally {
        this.loading = false;
      }
    },

     validateClassObject(cls: any): cls is Class {
      const isValid = cls &&
        typeof cls === 'object' &&
        'id' in cls &&
        'course_id' in cls &&
        'teacher_id' in cls &&
        'course' in cls &&
        'teacher' in cls;

      console.log('ClassStore: Class validation result:', {
        isValid,
        missingProperties: isValid ? [] : [
          !cls?.id && 'id',
          !cls?.course_id && 'course_id',
          !cls?.teacher_id && 'teacher_id',
          !cls?.course && 'course',
          !cls?.teacher && 'teacher'
        ].filter(Boolean)
      });

      return isValid;
    },

    async fetchClassById(id: string) {
      this.loading = true
      this.error = null
      try {
        const classDetails = await ClassService.getClass(id)
        this.selectedClass = classDetails
        return classDetails
      } catch (error) {
        this.error = (error as ApiError).message
        throw error
      } finally {
        this.loading = false
      }
    },

    clearSelectedClass() {
      this.selectedClass = null
    }
  }
})





















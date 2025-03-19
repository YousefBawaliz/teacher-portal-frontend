import { computed, ref, onMounted } from 'vue'
import { useClassStore } from '@/stores/class.store'
import { useCourseStore } from '@/stores/course.store'
import { useAuthStore } from '@/stores/auth.store'
// import type { Class } from '@/services/class.service'
// import type { Course } from '@/services/course.service'

export function useClassStats() {
  const classStore = useClassStore()
  const courseStore = useCourseStore()
  const authStore = useAuthStore()

  const activeClassesCount = ref(0)
  const averageClassSize = ref(0)

  const getClassStats = async (classId: string) => {
    await classStore.fetchClasses()
    
    const teacherClasses = classStore.teacherClasses(String(authStore.currentUser?.id || ''))
    const classData = teacherClasses.find(c => c.id === classId)
    if (!classData) return null

    const courseData = courseStore.courses.find(c => c.id === classData.course_id)
    
    return {
      studentCount: classData.student_count,
      courseTitle: courseData?.title || '',
      courseCode: courseData?.course_code || ''
    }
  }

  const updateStats = async () => {
    await classStore.fetchClasses()
    const teacherClasses = classStore.teacherClasses(String(authStore.currentUser?.id || ''))
    
    // Update active classes count
    activeClassesCount.value = teacherClasses.filter(c => c.is_active).length

    // Update average class size
    const activeClasses = teacherClasses.filter(c => c.is_active)
    if (!activeClasses.length) {
      averageClassSize.value = 0
    } else {
      const totalStudents = activeClasses.reduce((sum, c) => sum + c.student_count, 0)
      averageClassSize.value = Math.round(totalStudents / activeClasses.length)
    }
  }

  onMounted(async () => {
    await updateStats()
  })

  return {
    getClassStats,
    activeClassesCount,
    averageClassSize,
    updateStats
  }
}




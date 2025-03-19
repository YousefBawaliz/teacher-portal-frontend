<template>
  <div class="class-card" :class="{ 'is-active': isActive }">
    <div class="card-status-indicator" :class="statusClass"></div>
    <div class="class-header">
      <div class="class-code">{{ classStats?.courseCode }}</div>
      <div class="class-title">{{ classStats?.courseTitle }}</div>
    </div>

    <div class="class-metrics">
      <div class="metric">
        <UserGroupIcon class="metric-icon" />
        <div class="metric-value">{{ classStats?.studentCount || 0 }}</div>
        <div class="metric-label">Students</div>
      </div>
      <div class="metric">
        <DocumentTextIcon class="metric-icon" />
        <div class="metric-value">{{ getAssignmentCount }}</div>
        <div class="metric-label">Assignments</div>
      </div>
      <div class="metric">
        <ChartBarIcon class="metric-icon" />
        <div class="metric-value">{{ getAverageScore }}%</div>
        <div class="metric-label">Avg. Score</div>
      </div>
    </div>

    <div class="completion-section">
      <div class="completion-label">
        <span>Completion</span>
        <span>{{ getCompletionRate }}%</span>
      </div>
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: `${getCompletionRate}%` }"
          :class="getCompletionClass"
        ></div>
      </div>
    </div>

    <div class="class-footer">
      <div class="last-activity">
        <ClockIcon class="icon-small" />
        <span>Last updated {{ getLastUpdateTime }}</span>
      </div>
      <router-link :to="`/class/${classData.id}`" class="btn-view">
        <ArrowRightIcon class="icon-small" />
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useClassStats } from '@/composables/useClassStats'
import type { Class } from '@/services/class.service'
import { 
  UserGroupIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

interface ClassStats {
  studentCount: number
  courseTitle: string
  courseCode: string
}

const props = defineProps<{
  classData: {
    id: string
    is_active: boolean
    course_id: string
  }
}>()

const { getClassStats } = useClassStats()
const classStats = ref<ClassStats | null>(null)

const isActive = computed(() => props.classData.is_active)

const statusClass = computed(() => ({
  'status-active': isActive.value,
  'status-inactive': !isActive.value
}))

const loadClassStats = async () => {
  classStats.value = await getClassStats(props.classData.id)
}

onMounted(() => {
  loadClassStats()
})

// Mock data for demonstration
const getAssignmentCount = computed(() => {
  return Math.floor(Math.random() * 10) + 1
})

const getAverageScore = computed(() => {
  return Math.floor(Math.random() * 30) + 70
})

const getCompletionRate = computed(() => {
  return Math.floor(Math.random() * 40) + 60
})

const getCompletionClass = computed(() => {
  const rate = getCompletionRate.value
  if (rate >= 80) return 'completion-high'
  if (rate >= 60) return 'completion-medium'
  return 'completion-low'
})

const getLastUpdateTime = computed(() => {
  return '2 hours ago'
})
</script>

<style scoped>
.class-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.class-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.card-status-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.status-active {
  background: linear-gradient(90deg, #56ab2f, #a8e063);
}

.status-inactive {
  background: linear-gradient(90deg, #FF416C, #FF4B2B);
}

.class-header {
  padding: 20px 20px 15px 20px;
  border-bottom: 1px solid #F3F4F6;
}

.class-code {
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
  margin-bottom: 5px;
}

.class-title {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}

.class-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 15px 20px;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.metric-icon {
  width: 20px;
  height: 20px;
  color: #6B7280;
  margin-bottom: 5px;
}

.metric-value {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}

.metric-label {
  font-size: 12px;
  color: #6B7280;
}

.completion-section {
  padding: 0 20px 15px 20px;
}

.completion-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 5px;
}

.progress-bar {
  height: 6px;
  background-color: #F3F4F6;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.completion-high {
  background: linear-gradient(90deg, #56ab2f, #a8e063);
}

.completion-medium {
  background: linear-gradient(90deg, #f39c12, #f1c40f);
}

.completion-low {
  background: linear-gradient(90deg, #FF416C, #FF4B2B);
}

.class-footer {
  margin-top: auto;
  padding: 15px 20px;
  border-top: 1px solid #F3F4F6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.last-activity {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #9CA3AF;
}

.icon-small {
  width: 14px;
  height: 14px;
  margin-right: 5px;
}

.btn-view {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #3B82F6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-view:hover {
  background-color: #2563EB;
  transform: scale(1.05);
}

.btn-view .icon-small {
  width: 16px;
  height: 16px;
  margin-right: 0;
}
</style>


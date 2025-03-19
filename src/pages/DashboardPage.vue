<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Dashboard</h1>
      <div class="header-actions">
        <button class="btn-refresh" @click="refreshData">
          <ArrowPathIcon class="icon" :class="{ 'rotating': isLoading }" />
          Refresh
        </button>
      </div>
    </header>

    <div v-if="isLoading" class="loading-state">
      <LoadingSpinner />
    </div>

    <div v-else-if="error" class="error-state">
      <ErrorAlert :message="error" />
    </div>

    <template v-else>
      <div class="stats-grid">
        <StatsCard
          title="Active Classes"
          :value="stats.activeClassesCount"
          type="info"
        >
          <template #icon>
            <AcademicCapIcon />
          </template>
        </StatsCard>

        <StatsCard
          title="Average Class Size"
          :value="stats.averageClassSize"
          type="success"
        >
          <template #icon>
            <UsersIcon />
          </template>
        </StatsCard>

        <!-- <StatsCard
          title="Overall Completion"
          :value="stats.overallCompletion"
          :format="'percentage'"
          type="warning"
          :trend="stats.completionTrend"
        >
          <template #icon>
            <ChartBarIcon />
          </template>
        </StatsCard> -->
      </div>

      <div class="classes-section">
        <h2>Your Classes</h2>
        <div class="classes-grid">
          <ClassCard
            v-for="classItem in activeClasses"
            :key="classItem.id"
            :class-data="classItem"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useClassStore } from '@/stores/class.store'
import { useCourseStore } from '@/stores/course.store'
import { useClassStats } from '@/composables/useClassStats'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorAlert from '@/components/common/ErrorAlert.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import ClassCard from '@/components/class/ClassCard.vue'
import { 
  ArrowPathIcon, 
  AcademicCapIcon, 
  UsersIcon,
  ChartBarIcon 
} from '@heroicons/vue/24/outline'

const classStore = useClassStore()
const courseStore = useCourseStore()
const { activeClassesCount, averageClassSize } = useClassStats()

const isLoading = ref(false)
const error = ref<string | null>(null)

const stats = computed(() => ({
  activeClassesCount: activeClassesCount.value,
  averageClassSize: averageClassSize.value,
  completionTrend: calculateCompletionTrend()
}))

const activeClasses = computed(() => {
  return classStore.classes?.filter(c => c.is_active) ?? []
})

function calculateCompletionTrend() {
  return 5
}

async function refreshData() {
  isLoading.value = true
  error.value = null
  
  try {
    await Promise.all([
      classStore.fetchClasses(),
      courseStore.fetchCourses()
    ])
  } catch (e) {
    error.value = 'Failed to refresh dashboard data'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await refreshData()
})
</script>

<style scoped>
.dashboard {
  padding: 24px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.header-actions {
  display: flex;
  gap: 16px;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-refresh:hover {
  background-color: var(--color-surface-hover);
}

.icon {
  width: 16px;
  height: 16px;
}

.rotating {
  animation: rotate 1s linear infinite;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.classes-section {
  margin-top: 40px;
}

.classes-section h2 {
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.classes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.loading-state,
.error-state {
  display: flex;
  justify-content: center;
  padding: 48px;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>


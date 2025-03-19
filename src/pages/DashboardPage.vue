<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Dashboard</h1>
      <div class="header-actions">
        <div class="search-container">
          <input type="text" placeholder="Search..." class="search-input" />
          <button class="search-button">
            <MagnifyingGlassIcon class="search-icon" />
          </button>
        </div>
        <button class="btn-refresh" @click="refreshData">
          <ArrowPathIcon class="icon" :class="{ 'rotating': isLoading }" />
        </button>
        <div class="notification-badge">
          <BellIcon class="notification-icon" />
          <span class="badge">3</span>
        </div>
      </div>
    </header>

    <div v-if="isLoading" class="loading-state">
      <LoadingSpinner />
    </div>

    <div v-else-if="error" class="error-state">
      <ErrorAlert :message="error" />
    </div>

    <template v-else>
      <!-- Main statistics cards with charts -->
      <div class="metric-cards">
        <div class="metric-card pink">
          <div class="metric-header">
            <h3>Class Performance</h3>
            <p>Last Campaign Performance</p>
          </div>
          <div class="chart-container">
            <BarChart :chartData="performanceData" />
          </div>
          <div class="metric-footer">
            <small>updated 10 minutes ago</small>
          </div>
        </div>

        <div class="metric-card green">
          <div class="metric-header">
            <h3>Daily Submissions</h3>
            <p>+55% increase in today's submissions</p>
          </div>
          <div class="chart-container">
            <LineChart :chartData="dailySubmissionsData" />
          </div>
          <div class="metric-footer">
            <small>updated 4 minutes ago</small>
          </div>
        </div>

        <div class="metric-card blue">
          <div class="metric-header">
            <h3>Completed Assignments</h3>
            <p>Last 24 Hour Performance</p>
          </div>
          <div class="chart-container">
            <LineChart :chartData="completedAssignmentsData" />
          </div>
          <div class="metric-footer">
            <small>campaign sent 26 minutes ago</small>
          </div>
        </div>
      </div>

      <!-- Statistics counters -->
      <div class="stats-counters">
        <div class="stat-counter">
          <div class="counter-icon twitter">
            <UserGroupIcon />
          </div>
          <div class="counter-content">
            <h4>Students</h4>
            <div class="counter-value">+{{ stats.totalStudents }}</div>
          </div>
          <div class="counter-footer">
            <small>Just Updated</small>
          </div>
        </div>

        <div class="stat-counter">
          <div class="counter-icon analytics">
            <AcademicCapIcon />
          </div>
          <div class="counter-content">
            <h4>Active Classes</h4>
            <div class="counter-value">{{ stats.activeClassesCount }}</div>
          </div>
          <div class="counter-footer">
            <small>Weekly Average</small>
          </div>
        </div>

        <div class="stat-counter">
          <div class="counter-icon revenue">
            <DocumentTextIcon />
          </div>
          <div class="counter-content">
            <h4>Assignments</h4>
            <div class="counter-value">{{ stats.totalAssignments }}</div>
          </div>
          <div class="counter-footer">
            <small>Last 24 Hours</small>
          </div>
        </div>

        <div class="stat-counter">
          <div class="counter-icon bookings">
            <CheckBadgeIcon />
          </div>
          <div class="counter-content">
            <h4>Completion Rate</h4>
            <div class="counter-value">{{ stats.completionRate }}%</div>
          </div>
          <div class="counter-footer">
            <small>This Week</small>
          </div>
        </div>
      </div>

      <!-- Classes section -->
      <div class="classes-section">
        <div class="section-header">
          <h2>Your Classes</h2>
          <button class="btn-add">
            <PlusIcon class="icon-small" /> Add Class
          </button>
        </div>
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
import BarChart from '../components/charts/BarChart.vue'
import LineChart from '../components/charts/LineChart.vue'
import { 
  ArrowPathIcon, 
  AcademicCapIcon, 
  UsersIcon,
  ChartBarIcon,
  BellIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'

const classStore = useClassStore()
const courseStore = useCourseStore()
const { activeClassesCount, averageClassSize } = useClassStats()

const isLoading = ref(false)
const error = ref<string | null>(null)

// Mock data for charts
const performanceData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [{
    label: 'Performance',
    data: [200, 300, 280, 400, 300, 350, 400, 380, 300, 400, 500, 600],
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  }]
})

const dailySubmissionsData = ref({
  labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  datasets: [{
    label: 'Submissions',
    data: [12, 19, 8, 15, 28, 12, 40],
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 2,
    pointBackgroundColor: 'rgba(255, 255, 255, 0.8)',
    fill: false,
    tension: 0.4
  }]
})

const completedAssignmentsData = ref({
  labels: ['12am', '3pm', '6pm', '9pm', '12pm', '3am', '6am', '9am'],
  datasets: [{
    label: 'Completed',
    data: [200, 650, 450, 350, 250, 200, 180, 200],
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 2,
    pointBackgroundColor: 'rgba(255, 255, 255, 0.8)',
    fill: false,
    tension: 0.4
  }]
})

const stats = computed(() => ({
  activeClassesCount: activeClassesCount.value,
  averageClassSize: averageClassSize.value,
  totalStudents: 245,
  totalAssignments: 85,
  completionRate: 76
}))

const activeClasses = computed(() => {
  return classStore.classes?.filter(c => c.is_active) ?? []
})

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
  max-width: 1600px;
  margin: 0 auto;
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
  color: #1F2937;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-container {
  position: relative;
  width: 240px;
}

.search-input {
  width: 100%;
  padding: 8px 16px;
  padding-right: 40px;
  border-radius: 20px;
  border: 1px solid #E5E7EB;
  background-color: #F9FAFB;
}

.search-button {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-icon {
  width: 18px;
  height: 18px;
}

.btn-refresh {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: #F3F4F6;
  color: #4B5563;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.notification-badge {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-icon {
  width: 20px;
  height: 20px;
  color: #4B5563;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #EF4444;
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.icon {
  width: 20px;
  height: 20px;
}

.icon-small {
  width: 16px;
  height: 16px;
}

.rotating {
  animation: rotate 1s linear infinite;
}

/* Main metric cards with charts */
.metric-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.metric-card {
  border-radius: 12px;
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.metric-card.pink {
  background: linear-gradient(45deg, #FF416C, #FF4B2B);
}

.metric-card.green {
  background: linear-gradient(45deg, #56ab2f, #a8e063);
}

.metric-card.blue {
  background: linear-gradient(45deg, #2193b0, #6dd5ed);
}

.metric-header {
  margin-bottom: 10px;
}

.metric-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.metric-header p {
  margin: 5px 0 0 0;
  font-size: 14px;
  opacity: 0.8;
}

.chart-container {
  flex: 1;
  height: 200px;
  margin: 10px 0;
}

.metric-footer {
  font-size: 12px;
  opacity: 0.7;
}

/* Statistics counters */
.stats-counters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(22%, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-counter {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  position: relative;
}

.counter-icon {
  position: absolute;
  top: -15px;
  left: 16px;
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.counter-icon svg {
  width: 24px;
  height: 24px;
}

.counter-icon.twitter {
  background: linear-gradient(45deg, #1DA1F2, #19b5fe);
}

.counter-icon.analytics {
  background: linear-gradient(45deg, #56ab2f, #a8e063);
}

.counter-icon.revenue {
  background: linear-gradient(45deg, #3498db, #2980b9);
}

.counter-icon.bookings {
  background: linear-gradient(45deg, #f39c12, #f1c40f);
}

.counter-content {
  margin-top: 20px;
  margin-left: 10px;
}

.counter-content h4 {
  color: #6B7280;
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 5px 0;
}

.counter-value {
  font-size: 24px;
  font-weight: 600;
  color: #1F2937;
}

.counter-footer {
  margin-top: 10px;
  font-size: 12px;
  color: #9CA3AF;
}

/* Classes section */
.classes-section {
  margin-top: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: #3B82F6;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add:hover {
  background-color: #2563EB;
}

.classes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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

/* Responsive adjustments */
@media (max-width: 1024px) {
  .metric-cards {
    grid-template-columns: 1fr;
  }
  
  .stats-counters {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-counters {
    grid-template-columns: 1fr;
  }
  
  .search-container {
    display: none;
  }
}
</style>
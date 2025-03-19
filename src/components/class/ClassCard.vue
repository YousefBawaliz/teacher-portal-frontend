<template>
  <div class="class-card" :class="{ 'is-active': isActive }">
    <div class="class-header">
      <div class="class-info">
        <h3 class="class-title">{{ stats?.courseCode }}</h3>
        <p class="class-subtitle">{{ stats?.courseTitle }}</p>
      </div>
      <div class="class-status" :class="statusClass">
        {{ isActive ? 'Active' : 'Inactive' }}
      </div>
    </div>

    <div class="class-stats">
      <div class="stat-item">
        <span class="stat-label">Students</span>
        <span class="stat-value">{{ stats?.studentCount || 0 }}</span>
      </div>
    </div>

    <div class="class-actions">
      <router-link :to="`/class/${classData.id}`" class="btn-view">
        View Details
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useClassStats } from '@/composables/useClassStats'
import type { Class } from '@/services/class.service'

const props = defineProps<{
  classData: {
    id: string
    is_active: boolean
    course_id: string
  }
}>()

const { getClassStats } = useClassStats()

const stats = ref<{ studentCount: number; courseTitle: string; courseCode: string; } | null>(null)

const isActive = computed(() => props.classData.is_active)

const statusClass = computed(() => ({
  'status-active': isActive.value,
  'status-inactive': !isActive.value
}))

onMounted(async () => {
  stats.value = await getClassStats(props.classData.id)
})
</script>

<style scoped>
.class-card {
  background-color: var(--color-surface);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  padding: 20px;
  transition: all 0.3s ease;
}

.class-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.class-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.class-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary);
}

.class-subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 4px 0 0 0;
}

.class-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background-color: var(--color-success);
  opacity: 0.1;
  color: var(--color-success);
}

.status-inactive {
  background-color: var(--color-error);
  opacity: 0.1;
  color: var(--color-error);
}

.class-stats {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.class-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-view {
  padding: 8px 16px;
  border-radius: 6px;
  background-color: var(--color-primary);
  color: white;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-view:hover {
  background-color: var(--color-primary-dark);
}
</style>


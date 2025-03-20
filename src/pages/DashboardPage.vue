<template>
  <div class="dashboard-content">
    <div class="statistics-container">
      <StatisticsCard 
        title="Total Students" 
        value="32" 
        iconClass="fas fa-users"
        backgroundColor="var(--card-blue)"
      />
      <StatisticsCard 
        title="Class average" 
        value="81%" 
        iconClass="fas fa-chart-line"
        backgroundColor="var(--card-green)"
      />
    </div>
    
    <div class="charts-container">
      <div class="chart-card">
        <GradeDistributionChart 
          :assessments="gradeDistribution" 
          :loading="loading"
        />
      </div>
      
      <div class="assessments-section">
        <AssessmentList
          :assessments="filteredAssessments"
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import StatisticsCard from '@/components/dashboard/StatisticsCard.vue';
import GradeDistributionChart from '@/components/dashboard/GradeDistributionChart.vue';
import AssessmentList from '@/components/dashboard/AssessmentList.vue';

import { useClassStore } from '@/stores/class.store';
import { useAssessmentStore } from '@/stores/assessment.store';
import { useScoreStore } from '@/stores/score.store';
import type { Assessment } from '@/services/assessment.service';

const classStore = useClassStore();
const assessmentStore = useAssessmentStore();
const scoreStore = useScoreStore();

const selectedClassId = ref<number | null>(null);
const loading = ref(true);

// Mock data for the charts (will be replaced with real data)
const gradeDistribution = ref([
  { title: 'Quiz 1', averageScore: 75, color: 'var(--chart-red)' },
  { title: 'Homework #2', averageScore: 85, color: 'var(--chart-green)' },
  { title: 'Mid term exam', averageScore: 65, color: 'var(--chart-purple)' }
]);

const allAssessments = ref<Assessment[]>([]);
const filteredAssessments = computed(() => {
  if (!selectedClassId.value) return [];
  return allAssessments.value.filter(a => a.class_id === selectedClassId.value);
});

const loadClassData = async () => {
  if (!selectedClassId.value) return;
  
  loading.value = true;
  
  try {
    // Load assessments for the selected class
    await assessmentStore.fetchAssessments();
    allAssessments.value = assessmentStore.assessments;
    
    // Load real data for grade distribution
    // This would typically involve fetching scores for each assessment
    // and calculating average scores
    const classAssessments = filteredAssessments.value;
    
    // For the demo, we'll just use some mock data that matches the image
    // In a real app, you would replace this with actual API data
    gradeDistribution.value = [
      { title: 'Quiz 1', averageScore: 75, color: 'var(--chart-red)' },
      { title: 'Homework #2', averageScore: 85, color: 'var(--chart-green)' },
      { title: 'Mid term exam', averageScore: 65, color: 'var(--chart-purple)' }
    ];
    
  } catch (error) {
    console.error('Failed to load class data:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    // Load available classes
    await classStore.fetchClasses();
    const classes = classStore.classes;
    
    // Select first class by default if available
    if (classes.length > 0) {
      selectedClassId.value = Number(classes[0].id);
      await loadClassData();
    }
  } catch (error) {
    console.error('Failed to initialize dashboard:', error);
  } finally {
    loading.value = false;
  }
});

// Listen for class change events from parent component
const handleClassChange = (classId: number) => {
  selectedClassId.value = classId;
  loadClassData();
};

// Expose the handleClassChange method to parent components
defineExpose({
  handleClassChange
});

watch(selectedClassId, () => {
  if (selectedClassId.value) {
    loadClassData();
  }
});
</script>

<style scoped>
.dashboard-content {
  padding: 1.5rem;
  background-color: var(--background-light);
  overflow-y: auto;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.statistics-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
}

.charts-container {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 1.5rem;
  width: 100%;
  flex: 1;
}

.chart-card {
  background-color: #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.assessments-section {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

@media (max-width: 992px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 1rem;
  }
  
  .statistics-container {
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .charts-container {
    gap: 1rem;
  }
}
</style>
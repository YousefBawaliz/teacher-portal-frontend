<template>
    <div class="assessments-list">
      <div class="assessments-header">
        <h2>{{ title }}</h2>
        <div class="filter-dropdown">
          <select v-model="timeFilter" @change="applyTimeFilter">
            <option v-for="option in filterOptions" :key="option.value" :value="option.value">
              show: {{ option.label }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="assessment-completion-chart">
        <AssessmentCompletionChart 
          :completed="completionData.completed" 
          :pending="completionData.pending"
          :loading="loading"
        />
      </div>
      
      <div class="completion-legend">
        <div class="legend-item">
          <span class="dot completed"></span>
          <span>Completed - {{ completionData.completed }}%</span>
        </div>
        <div class="legend-item">
          <span class="dot pending"></span>
          <span>Pending - {{ completionData.pending }}%</span>
        </div>
      </div>
      
      <div class="assessments-list-container" v-if="displayedAssessments.length > 0">
        <div 
          v-for="assessment in displayedAssessments" 
          :key="assessment.id" 
          class="assessment-item"
        >
          <div class="assessment-type" :class="assessment.type">
            {{ assessment.type }}
          </div>
          <div class="assessment-details">
            <div class="assessment-title">{{ assessment.title }}</div>
            <div class="assessment-date">{{ formatDate(assessment.date) }}</div>
          </div>
        </div>
      </div>
      
      <div v-else-if="!loading" class="no-assessments">
        No assessments found for the selected time period.
      </div>
      
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading assessments...</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue';
  import AssessmentCompletionChart from './AssessmentCompletionChart.vue';
  import type { Assessment } from '@/services/assessment.service';
  
  interface AssessmentsListProps {
    assessments: Assessment[];
    loading?: boolean;
    title?: string;
  }
  
  const props = withDefaults(defineProps<AssessmentsListProps>(), {
    loading: false,
    title: 'Assessments'
  });
  
  const timeFilter = ref('month');
  const filterOptions = [
    { value: 'month', label: 'this month' },
    { value: 'upcoming', label: 'upcoming' },
    { value: 'all', label: 'all' }
  ];
  
  const displayedAssessments = ref<Assessment[]>([]);
  
  const completionData = computed(() => {
    const now = new Date();
    const total = props.assessments.length;
    
    if (total === 0) return { completed: 0, pending: 100 };
    
    const completedCount = props.assessments.filter(
      a => new Date(a.date) < now
    ).length;
    
    const completedPercentage = Math.round((completedCount / total) * 100);
    
    return {
      completed: completedPercentage,
      pending: 100 - completedPercentage
    };
  });
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const applyTimeFilter = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    switch (timeFilter.value) {
      case 'month':
        // Filter for current month
        displayedAssessments.value = props.assessments.filter(assessment => {
          const assessmentDate = new Date(assessment.date);
          return assessmentDate.getMonth() === currentMonth && 
                 assessmentDate.getFullYear() === currentYear;
        });
        break;
      case 'upcoming':
        // Filter for future assessments
        displayedAssessments.value = props.assessments.filter(assessment => {
          return new Date(assessment.date) > now;
        });
        break;
      case 'all':
      default:
        // Show all assessments
        displayedAssessments.value = [...props.assessments];
        break;
    }
  };
  
  // Update displayed assessments when props change
  watch(() => props.assessments, (newAssessments) => {
    applyTimeFilter();
  }, { immediate: true });
  
  // Update when filter changes
  watch(timeFilter, () => {
    applyTimeFilter();
  });
  
  onMounted(() => {
    applyTimeFilter();
  });
  </script>
  
  <style scoped>
  .assessments-list {
    width: 100%;
    height: 100%;
  }
  
  .assessments-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .assessments-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .filter-dropdown select {
    background-color: transparent;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    outline: none;
  }
  
  .assessment-completion-chart {
    margin-bottom: 1rem;
  }
  
  .completion-legend {
    margin-bottom: 1.5rem;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .dot {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 0.5rem;
  }
  
  .dot.completed {
    background-color: var(--chart-blue-completed);
  }
  
  .dot.pending {
    background-color: var(--chart-blue-pending);
  }
  
  .assessments-list-container {
    max-height: 200px;
    overflow-y: auto;
  }
  
  .assessment-item {
    display: flex;
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #eee;
  }
  
  .assessment-type {
    width: 80px;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    text-align: center;
    margin-right: 0.75rem;
    text-transform: capitalize;
  }
  
  .assessment-type.quiz {
    background-color: var(--chart-red);
    color: white;
  }
  
  .assessment-type.assignment {
    background-color: var(--chart-green);
    color: #333;
  }
  
  .assessment-type.exam {
    background-color: var(--chart-purple);
    color: white;
  }
  
  .assessment-details {
    flex: 1;
  }
  
  .assessment-title {
    font-weight: 500;
    margin-bottom: 0.25rem;
  }
  
  .assessment-date {
    font-size: 0.75rem;
    color: #666;
  }
  
  .no-assessments {
    text-align: center;
    padding: 1rem;
    color: #666;
    font-style: italic;
  }
  
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
  }
  
  .loading-spinner {
    width: 30px;
    height: 30px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: var(--primary-color);
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 0.5rem;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  </style>
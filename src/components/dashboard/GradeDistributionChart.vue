<template>
  <div class="chart-container">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading chart data...</p>
    </div>
    <canvas v-else ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

interface AssessmentData {
  title: string;
  averageScore: number;
  color?: string;
}

interface GradeDistributionProps {
  assessments: AssessmentData[];
  loading?: boolean;
  title?: string;
}

const props = withDefaults(defineProps<GradeDistributionProps>(), {
  loading: false,
  title: 'Average mark distribution'
});

const chartRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const initChart = () => {
  if (!chartRef.value) return;
  
  const ctx = chartRef.value.getContext('2d');
  if (!ctx) return;
  
  // Explicitly define colors for each bar type
  const backgroundColors = props.assessments.map(a => {
    // Use the assessment type to determine color
    if (a.title.toLowerCase().includes('quiz')) {
      return 'var(--chart-red)';
    } else if (a.title.toLowerCase().includes('homework') || a.title.toLowerCase().includes('assignment')) {
      return 'var(--chart-green)';
    } else if (a.title.toLowerCase().includes('exam') || a.title.toLowerCase().includes('midterm')) {
      return 'var(--chart-purple)';
    }
    // Default color if no match
    return a.color || '#aed581';
  });
  
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: props.assessments.map(a => a.title),
      datasets: [{
        data: props.assessments.map(a => a.averageScore),
        backgroundColor: backgroundColors,
        borderWidth: 0,
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: props.title,
          font: {
            size: 14,
            weight: 'normal'
          },
          padding: {
            bottom: 30
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
};

const updateChart = () => {
  if (!chart) return;
  
  chart.data.labels = props.assessments.map(a => a.title);
  chart.data.datasets[0].data = props.assessments.map(a => a.averageScore);
  
  // Update colors based on assessment types
  chart.data.datasets[0].backgroundColor = props.assessments.map(a => {
    if (a.title.toLowerCase().includes('quiz')) {
      return 'var(--chart-red)';
    } else if (a.title.toLowerCase().includes('homework') || a.title.toLowerCase().includes('assignment')) {
      return 'var(--chart-green)';
    } else if (a.title.toLowerCase().includes('exam') || a.title.toLowerCase().includes('midterm')) {
      return 'var(--chart-purple)';
    }
    return a.color || '#aed581';
  });
  
  chart.update();
};

onMounted(() => {
  if (!props.loading && props.assessments.length > 0) {
    initChart();
  }
});

watch(() => props.assessments, (newVal) => {
  if (chart) {
    updateChart();
  } else if (newVal.length > 0 && !props.loading) {
    initChart();
  }
}, { deep: true });

watch(() => props.loading, (newVal) => {
  if (!newVal && props.assessments.length > 0 && !chart) {
    initChart();
  }
});

onUnmounted(() => {
  if (chart) {
    chart.destroy();
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
  position: relative;
}

.loading-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
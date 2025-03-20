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

interface AssessmentCompletionProps {
  completed: number;
  pending: number;
  loading?: boolean;
  title?: string;
}

const props = withDefaults(defineProps<AssessmentCompletionProps>(), {
  loading: false,
  title: 'Assessment Completion'
});

const chartRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const initChart = () => {
  if (!chartRef.value) return;
  
  const ctx = chartRef.value.getContext('2d');
  if (!ctx) return;
  
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Completed', 'Pending'],
      datasets: [{
        data: [props.completed, props.pending],
        backgroundColor: ['var(--chart-blue-completed)', 'var(--chart-blue-pending)'],
        borderWidth: 0
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
          display: false,
          text: props.title
        }
      }
    }
  });
};

const updateChart = () => {
  if (!chart) return;
  
  chart.data.datasets[0].data = [props.completed, props.pending];
  chart.update();
};

onMounted(() => {
  if (!props.loading) {
    initChart();
  }
});

watch([() => props.completed, () => props.pending], () => {
  if (chart) {
    updateChart();
  } else if (!props.loading) {
    initChart();
  }
});

watch(() => props.loading, (newVal) => {
  if (!newVal && !chart) {
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
  height: 200px;
  position: relative;
  flex: 1;
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
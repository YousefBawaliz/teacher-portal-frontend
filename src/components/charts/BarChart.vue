<template>
    <div class="chart-wrapper">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import Chart from 'chart.js/auto'
  import { type ChartData } from 'chart.js'

  const props = defineProps({
    chartData: {
      type: Object as () => ChartData<'bar'>,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    }
  })

  const chartCanvas = ref<HTMLCanvasElement | null>(null)
  let chart: Chart | null = null
  
  const createChart = () => {
    if (!chartCanvas.value) return
    
    const ctx = chartCanvas.value.getContext('2d')
    if (!ctx) return
    
    // Default chart options
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(31, 41, 55, 0.9)',
          titleFont: {
            size: 12
          },
          bodyFont: {
            size: 12
          },
          padding: 10,
          cornerRadius: 4
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
            font: {
              size: 10
            }
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
            drawBorder: false
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
            font: {
              size: 10
            },
            padding: 10
          }
        }
      }
    }
    
    // Merge default options with user options
    const mergedOptions = {
      ...defaultOptions,
      ...props.options
    }
    
    chart = new Chart(ctx, {
      type: 'bar',
      data: props.chartData,
      options: mergedOptions
    })
  }
  
  const updateChart = () => {
    if (chart) {
      chart.data = props.chartData
      chart.update()
    }
  }
  
  watch(() => props.chartData, () => {
    updateChart()
  }, { deep: true })
  
  onMounted(() => {
    createChart()
  })
  </script>
  
  <style scoped>
  .chart-wrapper {
    width: 100%;
    height: 100%;
  }
  </style>

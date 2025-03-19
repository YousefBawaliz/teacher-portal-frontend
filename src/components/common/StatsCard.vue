<template>
  <div class="stats-card" :class="`stats-card-${type}`">
    <div class="stats-icon">
      <slot name="icon"></slot>
    </div>
    <div class="stats-content">
      <h3 class="stats-title">{{ title }}</h3>
      <div class="stats-value">
        <span ref="counterRef">{{ formattedValue }}</span>
      </div>
      <div v-if="trend" class="stats-trend" :class="trendClass">
        <svg
          v-if="trend > 0"
          class="trend-icon"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <svg
          v-else
          class="trend-icon"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ formatTrend(trend) }}</span>
      </div>
    </div>
    <div class="background-icon">
      <slot name="icon"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value: string) => ['info', 'success', 'warning', 'danger'].includes(value)
  },
  trend: {
    type: Number,
    default: null
  },
  format: {
    type: String,
    default: 'number' // 'number' | 'percentage'
  }
})

const counterRef = ref<HTMLElement | null>(null)
const formattedValue = ref(props.value.toString())

const trendClass = computed(() => ({
  'trend-positive': props.trend > 0,
  'trend-negative': props.trend < 0
}))

const formatTrend = (value: number) => {
  const prefix = value > 0 ? '+' : ''
  return `${prefix}${value}%`
}

const animateValue = (start: number, end: number, duration: number) => {
  const startTimestamp = performance.now()
  
  const animate = (currentTimestamp: number) => {
    const elapsed = currentTimestamp - startTimestamp
    const progress = Math.min(elapsed / duration, 1)
    
    const current = Math.floor(start + (end - start) * progress)
    formattedValue.value = props.format === 'percentage' 
      ? `${current}%` 
      : current.toString()
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  requestAnimationFrame(animate)
}

watch(() => props.value, (newValue, oldValue) => {
  animateValue(oldValue, newValue, 800)
})

onMounted(() => {
  animateValue(0, props.value, 800)
})
</script>

<style scoped>
.stats-card {
  position: relative;
  padding: 25px 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.stats-card-info {
  border-top: 4px solid #3B82F6;
}

.stats-card-success {
  border-top: 4px solid #10B981;
}

.stats-card-warning {
  border-top: 4px solid #F59E0B;
}

.stats-card-danger {
  border-top: 4px solid #EF4444;
}

.stats-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stats-card-info .stats-icon {
  background: linear-gradient(135deg, #3B82F6, #60A5FA);
}

.stats-card-success .stats-icon {
  background: linear-gradient(135deg, #10B981, #34D399);
}

.stats-card-warning .stats-icon {
  background: linear-gradient(135deg, #F59E0B, #FBBF24);
}

.stats-card-danger .stats-icon {
  background: linear-gradient(135deg, #EF4444, #F87171);
}

.stats-icon svg {
  width: 24px;
  height: 24px;
}

.stats-content {
  position: relative;
  z-index: 2;
}

.stats-title {
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
  margin: 0 0 8px 0;
}

.stats-value {
  font-size: 32px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 8px;
}

.stats-trend {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
}

.trend-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}

.trend-positive {
  color: #10B981;
}

.trend-negative {
  color: #EF4444;
}

.background-icon {
  position: absolute;
  bottom: -15px;
  right: -15px;
  z-index: 1;
  transform: scale(3);
  opacity: 0.05;
}
</style>

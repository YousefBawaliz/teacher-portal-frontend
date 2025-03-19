<template>
  <div class="stats-card">
    <div class="stats-icon" :class="`stats-icon-${type}`">
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
  return `${prefix}${value}% from previous period`
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
  animateValue(oldValue, newValue, 1000)
})

onMounted(() => {
  animateValue(0, props.value, 1000)
})
</script>

<style scoped>
.stats-card {
  height: 120px;
  padding: 16px;
  background-color: var(--color-surface);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  position: relative;
  overflow: hidden;
}

.stats-icon {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stats-icon svg {
  width: 24px;
  height: 24px;
}

.stats-icon-info {
  background-color: var(--color-info);
  opacity: 0.15;
  color: var(--color-info);
}

.stats-icon-success {
  background-color: var(--color-success);
  opacity: 0.15;
  color: var(--color-success);
}

.stats-icon-warning {
  background-color: var(--color-warning);
  opacity: 0.15;
  color: var(--color-warning);
}

.stats-icon-danger {
  background-color: var(--color-error);
  opacity: 0.15;
  color: var(--color-error);
}

.stats-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.stats-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin: 0 0 8px 0;
}

.stats-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.stats-trend {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-top: 8px;
}

.trend-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}

.trend-positive {
  color: var(--color-success);
}

.trend-negative {
  color: var(--color-error);
}
</style>
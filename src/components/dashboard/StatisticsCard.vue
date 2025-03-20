<template>
    <div class="statistics-card" :style="{ backgroundColor }">
      <div class="icon">
        <i :class="iconClass"></i>
      </div>
      <div class="content">
        <div class="value">{{ value }}</div>
        <div class="title">{{ title }}</div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    title: string;
    value: string | number;
    iconClass: string;
    backgroundColor?: string;
  }>();
  </script>
  
  <style scoped>
  .statistics-card {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    border-radius: 8px;
    min-height: 140px;
    width: 100%;
  }
  
  .icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .value {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .title {
    font-size: 1rem;
    opacity: 0.8;
  }
  
  @media (max-width: 768px) {
    .statistics-card {
      padding: 1rem;
      min-height: 120px;
    }
    
    .value {
      font-size: 2rem;
    }
  }
  </style>
<template>
  <aside class="side-navigation">
    <div class="class-selector">
      <div class="dropdown">
        <button class="dropdown-toggle">
          {{ selectedClassName }}
          <i class="dropdown-arrow">▼</i>
        </button>
        <div class="dropdown-menu" v-if="showClassMenu">
          <div 
            v-for="cls in classes" 
            :key="cls.id" 
            class="dropdown-item"
            @click="selectClass(cls)"
          >
            {{ cls.course?.course_code }} - {{ cls.section_number }}
          </div>
        </div>
      </div>
    </div>
    
    <nav class="nav-menu">
      <ul>
        <li>
          <router-link to="/students" class="nav-item">
            <div class="nav-icon students-icon">👥</div>
            <span class="nav-label">Students</span>
            <span class="nav-arrow">▶</span>
          </router-link>
        </li>
        <li>
          <router-link to="/calendar" class="nav-item">
            <div class="nav-icon calendar-icon">📅</div>
            <span class="nav-label">Calendar</span>
            <span class="nav-arrow">▶</span>
          </router-link>
        </li>
        <li>
          <router-link to="/assessments" class="nav-item">
            <div class="nav-icon assessments-icon">📋</div>
            <span class="nav-label">Assessments</span>
            <span class="nav-arrow">▶</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useClassStore } from '@/stores/class.store';
import type { Class } from '@/services/class.service';

const emit = defineEmits<{
  (e: 'classChange', classId: string | number): void
}>();

const classStore = useClassStore();
const classes = ref<Class[]>([]);
const selectedClass = ref<Class | null>(null);
const showClassMenu = ref(false);

const selectedClassName = computed(() => {
  if (!selectedClass.value) return 'Select Class';
  return `${selectedClass.value.course?.course_code || ''} - ${selectedClass.value.section_number || 'Class A'}`;
});

const selectClass = (cls: Class) => {
  selectedClass.value = cls;
  showClassMenu.value = false;
  emit('classChange', cls.id);
};

const toggleClassMenu = () => {
  showClassMenu.value = !showClassMenu.value;
};

onMounted(async () => {
  try {
    await classStore.fetchClasses();
    classes.value = classStore.classes;
    
    // Default to first class if available
    if (classes.value.length > 0) {
      selectedClass.value = classes.value[0];
      emit('classChange', classes.value[0].id);
    }
  } catch (error) {
    console.error('Failed to fetch classes:', error);
  }
});

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.dropdown')) {
    showClassMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

defineExpose({
  // Required if you need to access this component from outside
});
</script>

<style scoped>
.side-navigation {
  background-color: var(--sidebar-color);
  color: var(--text-light);
  width: 12rem;
  height: calc(100vh - 3.5rem);
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.class-selector {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dropdown {
  position: relative;
}

.dropdown-toggle {
  width: 100%;
  padding: 0.75rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  color: var(--text-light);
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.dropdown-arrow {
  font-size: 0.75rem;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: var(--sidebar-color);
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  margin-top: 0.25rem;
  z-index: 10;
}

.dropdown-item {
  padding: 0.75rem;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: var(--sidebar-hover);
}

.nav-menu {
  flex: 1;
  padding: 1rem 0;
}

.nav-menu ul {
  list-style: none;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--text-light);
  text-decoration: none;
  position: relative;
}

.nav-item:hover {
  background-color: var(--sidebar-hover);
}

.nav-icon {
  margin-right: 0.75rem;
  font-size: 1.25rem;
  width: 1.5rem;
  text-align: center;
}

.nav-label {
  flex: 1;
}

.nav-arrow {
  font-size: 0.75rem;
}

.router-link-active {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
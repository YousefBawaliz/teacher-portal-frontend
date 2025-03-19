<template>
  <div class="test-runner-container">
    <h1>Store Tests</h1>
    
    <div class="status-panel">
      <p :class="{'status-error': hasError}">
        Current Operation: {{ currentOperation }}
      </p>
      <div class="log-container">
        <pre>{{ logs }}</pre>
      </div>
    </div>

    <button 
      :disabled="isRunning" 
      @click="runTests" 
      class="test-button"
    >
      {{ isRunning ? 'Running Tests...' : 'Run Store Tests' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { useUserStore } from '@/stores/user.store';
import { useClassStore } from '@/stores/class.store';
import { useCourseStore } from '@/stores/course.store';
import { useAssessmentStore } from '@/stores/assessment.store';
import { useScoreStore } from '@/stores/score.store';

const currentOperation = ref('Idle');
const isRunning = ref(false);
const logs = ref('');
const hasError = ref(false);

interface TestResult {
  success: boolean;
  data?: any;
  error?: any;
}

const log = (message: string, isError = false) => {
  const timestamp = new Date().toISOString();
  const prefix = isError ? '❌ ERROR' : '✓ INFO';
  const logMessage = `[${timestamp}] ${prefix}: ${message}`;
  logs.value += logMessage + '\n';
  if (isError) {
    console.error(logMessage);
  } else {
    console.log(logMessage);
  }
};

const logObject = (label: string, obj: any) => {
  log(`${label}:\n${JSON.stringify(obj, null, 2)}`);
};

const handleTestStep = async <T>(
  stepName: string,
  operation: () => Promise<T>
): Promise<TestResult> => {
  try {
    log(`Starting: ${stepName}`);
    const result = await operation();
    log(`Completed: ${stepName}`);
    return { success: true, data: result };
  } catch (error: any) {
    const errorMessage = error.message || 'Unknown error';
    log(`Failed: ${stepName} - ${errorMessage}`, true);
    return { success: false, error };
  }
};

const runTests = async () => {
  isRunning.value = true;
  hasError.value = false;
  logs.value = '';
  
  // Initialize stores
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const classStore = useClassStore();
  const courseStore = useCourseStore();
  const assessmentStore = useAssessmentStore();
  const scoreStore = useScoreStore();
  
  try {
    // Test 1: Auth Store
    currentOperation.value = 'Testing Auth Store';
    const loginResult = await handleTestStep('Auth store login', async () => {
      const credentials = {
        email: 'teacher@example.com',
        password: 'teacher123'
      };
      logObject('Login attempt with credentials', credentials);
      return await authStore.login(credentials);
    });

    if (!loginResult.success) {
      throw new Error('Authentication store test failed');
    }
    logObject('Auth store state after login', {
      isAuthenticated: authStore.isAuthenticated,
      currentUser: authStore.currentUser
    });

    // Test 2: User Store
    currentOperation.value = 'Testing User Store';
    const userResult = await handleTestStep('Fetch users', async () => {
      const response = await userStore.fetchAllUsers();
      if (!userStore.users) {
        throw new Error('Failed to fetch users');
      }
      return userStore.users;
    });

    if (!userResult.success) {
      throw new Error('User store test failed');
    }
    logObject('User store state', {
      usersCount: userStore.users?.length || 0,
      selectedUser: userStore.selectedUser
    });

    // Test 3: Course Store
    currentOperation.value = 'Testing Course Store';
    const courseResult = await handleTestStep('Fetch courses', async () => {
      await courseStore.fetchCourses();
      return {
        courses: courseStore.courses,
        activeCourses: courseStore.activeCourses
      };
    });

    if (!courseResult.success) {
      throw new Error('Course store test failed');
    }
    logObject('Course store state', courseResult.data);

    // Test 4: Class Store
    currentOperation.value = 'Testing Class Store';
    const classResult = await handleTestStep('Fetch classes', async () => {
      const response = await classStore.fetchClasses();
      
      // Add detailed logging
      logObject('Class fetch response', response);
      
      if (!classStore.classes || classStore.classes.length === 0) {
        const error = new Error('No classes found');
        // Add debug information
        logObject('Class store state', {
          classes: classStore.classes,
          error: classStore.error,
          loading: classStore.loading
        });
        throw error;
      }
      
      return {
        classes: classStore.classes,
        teacherClasses: authStore.currentUser?.id 
          ? classStore.teacherClasses(String(authStore.currentUser.id))
          : []
      };
    });

    if (!classResult.success) {
      throw new Error('Class store test failed');
    }
    logObject('Class store state', classResult.data);

    // Test 5: Assessment Store
    currentOperation.value = 'Testing Assessment Store';
    const assessmentResult = await handleTestStep('Fetch assessments', async () => {
      if (!classStore.classes || classStore.classes.length === 0) {
        throw new Error('Classes must be loaded before testing assessments');
      }

      await assessmentStore.fetchAssessments();
      
      return {
        assessments: assessmentStore.assessments,
        selectedAssessment: assessmentStore.selectedAssessment,
        // Add some additional validation data
        assessmentsByClass: classStore.classes[0] 
          ? assessmentStore.assessmentsByClass(Number(classStore.classes[0].id))
          : []
      };
    });

    if (!assessmentResult.success) {
      throw new Error('Assessment store test failed');
    }
    logObject('Assessment store state', assessmentResult.data);

    // Test 6: Score Store
    currentOperation.value = 'Testing Score Store';
    const scoreResult = await handleTestStep('Fetch scores', async () => {
      // Don't use the current user's ID if they're a teacher
      // Instead, we need to fetch a valid student ID
      const studentId = 3; // Using the known valid student ID
      
      const assessment = assessmentStore.assessments.find(a => a.title === 'Quiz 1');
      if (!assessment) throw new Error('Quiz 1 assessment not found');
      
      await scoreStore.fetchScoresByAssessment(studentId, assessment.id);
      
      return {
        scores: scoreStore.scores,
        assessmentTitle: assessment.title
      };
    });

    if (!scoreResult.success) {
      throw new Error('Score store test failed');
    }
    logObject('Score store state', scoreResult.data);

    // Cleanup
    currentOperation.value = 'Cleanup';
    await handleTestStep('Logout', async () => {
      await authStore.logout();
      return true;
    });

    currentOperation.value = 'All store tests completed successfully';
    log('✨ All store tests completed successfully');
    
  } catch (error: any) {
    hasError.value = true;
    log(`TEST SUITE ERROR: ${error.message}`, true);
    logObject('Error details', error);
    currentOperation.value = 'Test suite failed';
  } finally {
    isRunning.value = false;
  }
};
</script>

<style scoped>
.test-runner-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.status-panel {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.status-error {
  color: #dc3545;
  font-weight: bold;
}

.log-container {
  background: #1e1e1e;
  color: #fff;
  padding: 15px;
  border-radius: 4px;
  max-height: 600px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  font-size: 14px;
  line-height: 1.5;
}

.test-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.test-button:hover:not(:disabled) {
  background-color: #45a049;
}

.test-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>








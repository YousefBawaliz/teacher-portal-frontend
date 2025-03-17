<template>
  <div class="test-runner-container">
    <h1>Teacher Service Tests</h1>
    
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
      {{ isRunning ? 'Running Tests...' : 'Run Teacher Tests' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AuthService from '@/services/auth.service';
import UserService from '@/services/user.service';
import ClassService from '@/services/class.service';
import AssessmentService from '@/services/assessment.service';
import ScoreService, { type CreateScoreData } from '@/services/score.service';

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
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
    log(`Failed: ${stepName} - ${errorMessage}`, true);
    return { success: false, error };
  }
};

const runTests = async () => {
  isRunning.value = true;
  hasError.value = false;
  logs.value = '';
  
  try {
    // Test 1: Teacher Authentication
    currentOperation.value = 'Teacher Authentication';
    const loginResult = await handleTestStep('Teacher login', async () => {
      const credentials = {
        email: 'teacher@example.com',
        password: 'teacher123'
      };
      logObject('Login attempt with credentials', credentials);
      return await AuthService.login(credentials);
    });

    if (!loginResult.success) {
      throw new Error('Authentication failed');
    }
    logObject('Login response', loginResult.data);

    // Test 2: Get Teacher Profile
    currentOperation.value = 'Fetching Teacher Profile';
    const profileResult = await handleTestStep('Get teacher profile', async () => {
      return await UserService.getCurrentUser();
    });

    if (!profileResult.success) {
      throw new Error('Failed to fetch teacher profile');
    }
    logObject('Teacher profile', profileResult.data);

    // Test 3: Get Teacher's Classes
    currentOperation.value = 'Fetching Classes';
    const classesResult = await handleTestStep('Get teacher classes', async () => {
      return await ClassService.getAllClasses();
    });

    if (!classesResult.success || !classesResult.data.length) {
      throw new Error('No classes found or failed to fetch classes');
    }
    logObject('Retrieved classes', classesResult.data);

    // Test 4: Assessments Flow
    currentOperation.value = 'Testing Assessments';
    
    // Create assessment
    const newAssessmentData = {
    class_id: classesResult.data[0].id,
    title: `Assessment Test ${new Date().toISOString()}`,
    type: 'quiz' as 'quiz' | 'assignment' | 'exam',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Changed from due_date to date
    description: 'Test assessment created by automated test'
    // Remove total_points as it's not in the schema
};
    
    logObject('Creating assessment with data', newAssessmentData);
    const createAssessmentResult = await handleTestStep(
      'Create assessment',
      async () => await AssessmentService.createAssessment(newAssessmentData)
    );

    if (!createAssessmentResult.success) {
      throw new Error('Failed to create assessment');
    }
    const assessmentId = createAssessmentResult.data.id;
    logObject('Created assessment', createAssessmentResult.data);

    // Get assessment
    const getAssessmentResult = await handleTestStep(
      'Get assessment details',
      async () => await AssessmentService.getAssessment(assessmentId)
    );

    if (!getAssessmentResult.success) {
      throw new Error('Failed to get assessment details');
    }
    logObject('Retrieved assessment', getAssessmentResult.data);

    // Update assessment
    const updateAssessmentData = {
      title: `${newAssessmentData.title} (Updated)`,
      description: 'Updated test assessment description',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    };

    logObject('Updating assessment with data', updateAssessmentData);
    const updateAssessmentResult = await handleTestStep(
      'Update assessment',
      async () => await AssessmentService.updateAssessment(assessmentId, updateAssessmentData)
    );

    if (!updateAssessmentResult.success) {
      throw new Error('Failed to update assessment');
    }
    logObject('Updated assessment', updateAssessmentResult.data);

    // Test 5: Scores Flow
    currentOperation.value = 'Testing Scores';
    
    const newScoreData: CreateScoreData = {
      student_id: 3,
      assessment_id: assessmentId,
      score_value: 95.5,
      feedback: 'Excellent work on the test assessment!'
    };

    logObject('Creating score with data', newScoreData);
    const createScoreResult = await handleTestStep(
      'Create score',
      async () => await ScoreService.createScore(newScoreData)
    );

    if (!createScoreResult.success) {
      throw new Error('Failed to create score');
    }
    const scoreId = createScoreResult.data.id;
    logObject('Created score', createScoreResult.data);

    // Update score
    const updateScoreData = {
      score_value: 97.0,
      feedback: 'Updated feedback - Outstanding performance!'
    };

    logObject('Updating score with data', updateScoreData);
    const updateScoreResult = await handleTestStep(
      'Update score',
      async () => await ScoreService.updateScore(scoreId, updateScoreData)
    );

    if (!updateScoreResult.success) {
      throw new Error('Failed to update score');
    }
    logObject('Updated score', updateScoreResult.data);

    // Cleanup
    currentOperation.value = 'Cleanup';
    
    // Delete score
    await handleTestStep(
      'Delete score',
      async () => await ScoreService.deleteScore(scoreId)
    );
    log('Successfully deleted test score');

    // Delete assessment
    await handleTestStep(
      'Delete assessment',
      async () => await AssessmentService.deleteAssessment(assessmentId)
    );
    log('Successfully deleted test assessment');

    // Logout
    await handleTestStep(
      'Teacher logout',
      async () => await AuthService.logout()
    );
    log('Successfully logged out teacher');

    currentOperation.value = 'All tests completed successfully';
    log('✨ All tests completed successfully');
    
  } catch (error: any) {
    hasError.value = true;
    const errorDetails = error.response?.data || error;
    log(`TEST SUITE ERROR: ${error.message}`, true);
    logObject('Error details', errorDetails);
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
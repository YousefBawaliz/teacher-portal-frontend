<template>
  <div class="test-runner">
    <h1>API Test Runner</h1>
    
    <div class="controls">
      <button 
        @click="runTests" 
        :disabled="isRunning"
        class="run-button"
      >
        {{ isRunning ? 'Running Tests...' : 'Run All Tests' }}
      </button>
    </div>

    <div v-if="currentOperation" class="current-operation">
      Current Operation: {{ currentOperation }}
    </div>

    <div class="results">
      <div 
        v-for="result in testResults" 
        :key="result.name"
        :class="['result-item', result.status]"
      >
        <div class="result-header">
          <span class="test-name">{{ result.name }}</span>
          <span class="duration">{{ result.duration }}ms</span>
        </div>
        <div v-if="result.error" class="error-message">
          {{ result.error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface TestResult {
  name: string;
  status: 'pending' | 'passed' | 'failed';
  error: string | null;
  duration: number;
}

import { ref } from 'vue';
// import type { TestResult } from '@/types';
import { UserService } from '@/services/user.service';
import { ScoreService } from '@/services/score.service';
import { CourseService } from '@/services/course.service';
import { ClassService } from '@/services/class.service';
import { AuthService } from '@/services/auth.service';
import { AssessmentService } from '@/services/assessment.service';

const currentOperation = ref<string>('');
const testResults = ref<TestResult[]>([]);
const isRunning = ref(false);
const testLog = ref<string>('');

// Logger utility
const logger = {
  _addToLog(message: string) {
    testLog.value += message + '\n';
  },

  request: (method: string, url: string, data?: any, headers?: any) => {
    const message = [
      `\n🌐 API Request: ${method} ${url}`,
      `Timestamp: ${new Date().toISOString()}`,
      `Headers: ${JSON.stringify(headers, null, 2)}`,
      data ? `Request Data: ${JSON.stringify(data, null, 2)}` : '',
      '----------------------------------------'
    ].join('\n');
    logger._addToLog(message);
  },

  response: (response: any) => {
    const message = [
      '\n✅ API Response',
      `Status: ${response.status}`,
      `Headers: ${JSON.stringify(response.headers, null, 2)}`,
      `Data: ${JSON.stringify(response.data, null, 2)}`,
      '----------------------------------------'
    ].join('\n');
    logger._addToLog(message);
  },

  error: (error: any) => {
    const message = [
      '\n❌ API Error',
      `Timestamp: ${new Date().toISOString()}`,
      error.response ? [
        `Status: ${error.response.status}`,
        `Headers: ${JSON.stringify(error.response.headers, null, 2)}`,
        `Data: ${JSON.stringify(error.response.data, null, 2)}`
      ].join('\n') : '',
      `Error Config: ${JSON.stringify(error.config, null, 2)}`,
      `Full Error: ${JSON.stringify(error, null, 2)}`,
      'Stack Trace:',
      error.stack || 'No stack trace available',
      '----------------------------------------'
    ].join('\n');
    logger._addToLog(message);
  },

  test: (testName: string, message: string) => {
    const msg = [
      `\n🧪 Test: ${testName}`,
      message,
      '----------------------------------------'
    ].join('\n');
    logger._addToLog(msg);
  }
};

const tests = [
  {
    name: 'Auth - Teacher Flow',
    run: async () => {
      try {
        // Login as teacher
        currentOperation.value = 'Teacher login';
        logger.test('Auth Flow', 'Attempting teacher login...');
        
        const loginData = {
          email: 'teacher@example.com',
          password: 'teacher123'
        };
        
        const loginResult = await AuthService.login(loginData);
        logger.test('Auth Flow', 'Login successful');

        // Verify current user
        currentOperation.value = 'Verifying user profile';
        const currentUser = await AuthService.getCurrentUser();
        if (!currentUser) {
          throw new Error('Failed to get current user');
        }

        // Logout
        currentOperation.value = 'Teacher logout';
        await AuthService.logout();
        
        if (AuthService.isAuthenticated()) {
          throw new Error('Still authenticated after logout');
        }
      } catch (error) {
        logger.error(error);
        throw error;
      }
    }
  },

  // {
  //   name: 'Course - Teacher View Flow',
  //   run: async () => {
  //     currentOperation.value = 'Getting all courses';
  //     const courses = await CourseService.getAllCourses();
  //     if (!courses.length) {
  //       throw new Error('No courses returned');
  //     }

  //     // Get specific course
  //     currentOperation.value = 'Getting course details';
  //     const courseId = courses[0].id;
  //     const courseDetails = await CourseService.getCourse(courseId);
  //     if (!courseDetails) {
  //       throw new Error('Failed to get course details');
  //     }
  //   }
  // },

  {
    name: 'Class - Teacher View Flow',
    run: async () => {
      currentOperation.value = 'Getting all classes';
      const classResponse = await ClassService.getAllClasses();
      if (!classResponse.data.length) {
        throw new Error('No classes returned');
      }

      // Get class details
      const classId = classResponse.data[0].id;
      currentOperation.value = 'Getting class details';
      const classDetails = await ClassService.getClass(classId);
      if (!classDetails) {
        throw new Error('Failed to get class details');
      }

      // Get class stats
      currentOperation.value = 'Getting class statistics';
      const classStats = await ClassService.getClassStats(classId);
      if (!classStats) {
        throw new Error('Failed to get class statistics');
      }

      // Get class students
      currentOperation.value = 'Getting class students';
      const studentsResponse = await ClassService.getClassStudents(classId);
      if (!studentsResponse) {
        throw new Error('Failed to get class students');
      }
    }
  },

  {
    name: 'Assessment - Teacher Flow',
    run: async () => {
      const classId = '1'; // This should be from a real class
      
      // Get all assessments
      currentOperation.value = 'Getting class assessments';
      const assessments = await AssessmentService.getAllAssessments(classId);
      if (!assessments.data.length) {
        throw new Error('No assessments found');
      }

      // Create assessment
      currentOperation.value = 'Creating assessment';
      const newAssessment = await AssessmentService.createAssessment({
        class_id: classId,
        title: 'Test Assessment',
        type: 'quiz',
        due_date: new Date(Date.now() + 86400000).toISOString(),
        total_points: 100
      });

      // Get assessment details
      currentOperation.value = 'Getting assessment details';
      const assessmentDetails = await AssessmentService.getAssessment(newAssessment.id);
      if (!assessmentDetails) {
        throw new Error('Failed to get assessment details');
      }

      // Update assessment
      currentOperation.value = 'Updating assessment';
      await AssessmentService.updateAssessment(newAssessment.id, {
        title: 'Updated Test Assessment',
        total_points: 90
      });

      // Publish assessment
      currentOperation.value = 'Publishing assessment';
      await AssessmentService.publishAssessment(newAssessment.id);

      // Get assessment stats
      currentOperation.value = 'Getting assessment statistics';
      const stats = await AssessmentService.getAssessmentStats(newAssessment.id);
      if (!stats) {
        throw new Error('Failed to get assessment statistics');
      }
    }
  },

  {
    name: 'Score - Teacher Flow',
    run: async () => {
      const assessmentId = '1'; // This should be from a real assessment
      
      // Get scores for assessment
      currentOperation.value = 'Getting assessment scores';
      const scores = await ScoreService.getScores(assessmentId);
      if (!scores.data.length) {
        throw new Error('No scores found');
      }

      // Create new score
      currentOperation.value = 'Creating score';
      const newScore = await ScoreService.createScore({
        assessment_id: assessmentId,
        student_id: '1',
        score: 85
      });

      // Get student score
      currentOperation.value = 'Getting student score';
      const studentScore = await ScoreService.getStudentScore(
        assessmentId,
        '1'
      );

      // Update score
      currentOperation.value = 'Updating score';
      await ScoreService.updateScore(newScore.id, {
        score: 90,
        feedback: 'Great improvement!'
      });

      // Batch create scores
      currentOperation.value = 'Batch creating scores';
      await ScoreService.batchCreateScores(assessmentId, {
        scores: [
          { student_id: 'student-1', score: 85 },
          { student_id: 'student-2', score: 90 }
        ]
      });

      // Get student scores
      currentOperation.value = 'Getting student scores';
      const studentScores = await ScoreService.getStudentScores('test-student-id');
      if (!studentScores.length) {
        throw new Error('No student scores found');
      }
    }
  }
];

async function runTests() {
  isRunning.value = true;
  testResults.value = [];
  testLog.value = ''; // Clear previous logs
  console.clear(); // Clear console before starting new test run
  
  logger._addToLog(`🚀 Starting Test Run: ${new Date().toISOString()}\n`);

  for (const test of tests) {
    const result: TestResult = {
      name: test.name,
      status: 'pending',
      error: null,
      duration: 0
    };

    try {
      logger._addToLog(`\n📋 Running Test: ${test.name}`);
      const startTime = performance.now();
      
      await test.run();
      
      const endTime = performance.now();
      result.duration = Math.round(endTime - startTime);
      result.status = 'passed';
      
      logger._addToLog(`✅ Test Passed (${result.duration}ms)`);

    } catch (error: any) {
      result.status = 'failed';
      result.error = error.message;
      logger._addToLog(`❌ Test Failed: ${error}`);
    } finally {
      testResults.value.push(result);
    }
  }

  // Add summary to log
  const summary = testResults.value.map(r => ({
    Name: r.name,
    Status: r.status,
    Duration: `${r.duration}ms`,
    Error: r.error
  }));
  
  logger._addToLog('\n📊 Test Run Summary:');
  logger._addToLog(JSON.stringify(summary, null, 2));

  // Output the entire log at once
  console.log(testLog.value);
  
  isRunning.value = false;
}
</script>

<style scoped>
.test-runner {
  padding: 20px;
}

.controls {
  margin: 20px 0;
}

.run-button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.current-operation {
  margin: 10px 0;
  padding: 10px;
  background: #f0f0f0;
  border-radius: 4px;
}

.result-item {
  margin: 10px 0;
  padding: 15px;
  border-radius: 4px;
}

.result-item.passed {
  background: #e6ffe6;
  border: 1px solid #00cc00;
}

.result-item.failed {
  background: #ffe6e6;
  border: 1px solid #cc0000;
}

.result-item.pending {
  background: #f0f0f0;
  border: 1px solid #ccc;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-message {
  margin-top: 10px;
  color: #cc0000;
  font-family: monospace;
  white-space: pre-wrap;
}

.duration {
  font-size: 0.9em;
  color: #666;
}
</style>
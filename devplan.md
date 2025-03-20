# Teacher Dashboard Development Plan

## Overview
This development plan outlines the incremental implementation of a teacher dashboard with a white and orange color scheme. The dashboard will feature a class grid view, detailed class analytics, student management, and assessment tracking capabilities.

## Color Palette
- **Primary**: Orange (#FF6B35)
- **Secondary**: White (#FFFFFF)
- **Text**: Dark Gray (#333333)
- **Accent**: Light Orange (#FF9E6B)
- **Background**: Light Gray (#F5F5F5)
- **Success**: Green (#4CAF50)
- **Warning**: Amber (#FFC107)
- **Danger**: Red (#F44336)
- **Info**: Blue (#2196F3)
- **Subtle**: Very Light Gray (#EEEEEE)

## Typography
- **Primary Font**: 'Poppins', sans-serif
- **Secondary Font**: 'Roboto', sans-serif
- **Header Sizes**: 
  - H1: 24px
  - H2: 20px
  - H3: 18px
  - H4: 16px
- **Body Text**: 14px
- **Small Text**: 12px

## Phase 1: Project Setup and Navigation Layout

### Base Layout Component
- Create `AppLayout.vue` with:
  - Fixed sidebar (80px width, full height)
  - Main content area with 24px padding
  - Top header with profile dropdown

```vue
<!-- Structure -->
<div class="app-layout">
  <AppSidebar />
  <div class="main-container">
    <AppHeader />
    <main class="content">
      <router-view />
    </main>
  </div>
</div>
```

**Styling:**
- Container: Full viewport width and height
- Background: Light Gray (#F5F5F5)
- Content area: White background, border-radius: 8px, box-shadow: 0 2px 5px rgba(0,0,0,0.1)

### Sidebar Component
- Create `AppSidebar.vue` with:
  - Logo at top (80px height)
  - Icon-only navigation with tooltips
  - Active state indication

**Styling:**
- Background: White (#FFFFFF)
- Width: 80px
- Shadow: 0 0 15px rgba(0,0,0,0.1)
- Icons: 24px, color: #333333, centered
- Active icon: Background: Light Orange (#FF9E6B), Color: White
- Hover effect: Scale to 1.1, transition duration: 0.2s
- Icon tooltips: Appear on hover after 0.5s, fade-in animation

### Header Component
- Create `AppHeader.vue` with:
  - User profile section (avatar, name)
  - Theme toggle
  - Notifications icon

**Styling:**
- Height: 64px
- Background: White
- Padding: 0 24px
- Border-bottom: 1px solid #EEEEEE
- User avatar: 40px circle, border: 2px solid #FF6B35
- Username: 16px, bold, margin-left: 12px
- Notification icon: 20px, color: #333333
- Animations: Hover effects for icons (scale: 1.05, duration: 0.2s)

## Phase 2: Dashboard Home View (Class Grid)

### Dashboard View Component
- Create `TeacherDashboard.vue` showing the grid of classes
- Page title and welcome message
- "New Class" button (non-functional for now)
- Grid layout for class cards

**Styling:**
- Greeting: "Good Morning/Afternoon/Evening, [Name]"
- Font: Poppins, 24px, bold
- Welcome container height: 80px
- Grid: 3 columns on large screens, 2 on medium, 1 on small
- Gap between cards: 24px
- Animations: Staggered entrance animation for cards (0.1s delay between each)

### Class Card Component
- Create `ClassCard.vue` displaying:
  - Course code and title
  - Section number and semester
  - Student count badge
  - Visual indicator of overall class performance

```vue
<!-- Structure -->
<div class="class-card" @click="navigateToClass">
  <div class="card-header">
    <h3>{{ class.course.title }}</h3>
    <div class="badge">{{ class.section_number }}</div>
  </div>
  <div class="card-body">
    <div class="student-count">
      <i class="icon icon-users"></i>
      <span>{{ studentCount }} Students</span>
    </div>
    <div class="semester-info">
      {{ class.semester }} {{ class.year }}
    </div>
  </div>
  <div class="card-footer">
    <div class="performance-indicator" :style="performanceStyle"></div>
  </div>
</div>
```

**Styling:**
- Card: Background white, border-radius: 8px, padding: 16px
- Box-shadow: 0 4px 10px rgba(0,0,0,0.08)
- Height: 160px
- Course title: 18px, bold, truncate with ellipsis
- Section badge: Small pill shape (border-radius: 16px), background: #FF6B35, color: white
- Student count: 14px, with icon
- Hover effect: Transform scale(1.03), box-shadow increase, transition: 0.3s
- Click effect: Transform scale(0.98), transition: 0.1s
- Performance indicator: 4px height bar at bottom of card with gradient color based on average (red to green)

## Phase 3: Class Detail View Layout

### Class Detail Layout
- Create `ClassDetail.vue` with sections for:
  - Header with class info
  - Content area with grid layout
  - Back button to return to dashboard

**Styling:**
- Header: 80px height, display flex, align-items: center
- Back button: Icon with circle background, left margin: 0
- Class title: 24px bold, margin-left: 16px
- Section number: 16px, semi-transparent badge
- Content grid: 2 columns for large screens, 1 column for small screens
- Grid gap: 24px
- Entrance animation: Fade and slide up, duration: 0.4s

### Class Header Component
- Create `ClassHeader.vue` with:
  - Course name and code
  - Section number, semester, year
  - Teacher name
  - Navigation tabs (optional)

```vue
<!-- Structure -->
<div class="class-header">
  <button class="back-button" @click="goBack">
    <i class="icon-arrow-left"></i>
  </button>
  <div class="class-info">
    <h1>{{ classData.course.title }}</h1>
    <div class="class-meta">
      <span class="section">Section {{ classData.section_number }}</span>
      <span class="divider">•</span>
      <span class="semester">{{ classData.semester }} {{ classData.year }}</span>
    </div>
  </div>
</div>
```

**Styling:**
- Background: White
- Padding: 24px
- Border-radius: 8px 8px 0 0
- Box-shadow: 0 2px 5px rgba(0,0,0,0.1)
- Back button: 40px circle, background: #F5F5F5, transition: all 0.2s
- Back button hover: Background: #FF6B35, color: white, transform: scale(1.1)
- Course title: 24px bold, color: #333333
- Section/semester info: 14px, color: #666666, with bullet separator

## Phase 4: Student Overview Widget

### Student Overview Component
- Create `StudentOverview.vue` showing:
  - Total student count with icon
  - Student performance summary
  - "View All Students" button

```vue
<!-- Structure -->
<div class="student-overview-card">
  <div class="card-header">
    <h3>Students Enrolled</h3>
  </div>
  <div class="student-count">
    <div class="icon-container">
      <i class="icon-users"></i>
    </div>
    <div class="count-display">
      <span class="count">{{ studentCount }}</span>
      <span class="label">Students</span>
    </div>
  </div>
  <div class="performance-summary">
    <div class="performance-item">
      <span class="label">Above Average</span>
      <span class="value">{{ aboveAverageCount }}</span>
    </div>
    <div class="performance-item">
      <span class="label">Below Average</span>
      <span class="value">{{ belowAverageCount }}</span>
    </div>
  </div>
  <button class="view-all-button" @click="viewAllStudents">
    View All Students
  </button>
</div>
```

**Styling:**
- Card: White background, border-radius: 8px, padding: 16px
- Box-shadow: 0 4px 10px rgba(0,0,0,0.08)
- Student count: 48px bold, with animated entrance (count-up animation)
- Icon container: 64px circle, background: #FF9E6B, margin-right: 16px
- Icon: 32px, color: white
- Performance summary: 2 columns, space-between
- Performance item: 16px, with color indicators (green/red)
- Button: Full width, background: #FF6B35, color: white, border-radius: 4px
- Button hover: Brightness: 110%, transform: translateY(-2px), transition: 0.2s
- Entrance animation: Fade in and slide up from bottom

## Phase 5: Assessment Performance Chart

### Score Distribution Component
- Create `ScoreDistribution.vue` with:
  - Bar chart showing score distribution for each assessment
  - Chart legend and controls
  - Assessment filter dropdown

```vue
<!-- Structure -->
<div class="score-distribution-card">
  <div class="card-header">
    <h3>Assessment Performance</h3>
    <div class="controls">
      <button class="refresh-btn">
        <i class="icon-refresh"></i>
      </button>
    </div>
  </div>
  <div class="chart-container">
    <BarChart :chart-data="chartData" :options="chartOptions" />
  </div>
</div>
```

**JavaScript Logic:**
```javascript
// Chart configuration
const chartData = {
  labels: assessments.map(a => a.title),
  datasets: [
    {
      label: 'Average Score (%)',
      backgroundColor: '#FF6B35',
      data: assessmentAverages,
      borderRadius: 4,
    }
  ]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#333',
      bodyColor: '#333',
      borderColor: '#ddd',
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      callbacks: {
        // Custom tooltip formatting
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      grid: {
        display: true,
        color: 'rgba(0,0,0,0.05)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  animation: {
    duration: 1000,
    easing: 'easeOutQuart'
  }
};
```

**Styling:**
- Card: White background, border-radius: 8px, padding: 16px
- Box-shadow: 0 4px 10px rgba(0,0,0,0.08)
- Chart height: 300px
- Chart animation: Bar grow from bottom, sequential (0.1s delay between bars)
- Refresh button: 32px circle, background: #F5F5F5, icon: #666666
- Refresh hover: Background: #FF6B35, icon: white, transform: rotate(180deg), transition: 0.3s

## Phase 6: Overall Average Score Widget

### Average Score Component
- Create `AverageScore.vue` with:
  - Large numeric display of overall average
  - Circular progress indicator
  - Comparison to previous assessments

```vue
<!-- Structure -->
<div class="average-score-card">
  <div class="card-header">
    <h3>Overall Average Score</h3>
  </div>
  <div class="score-display">
    <div class="circular-progress" :style="progressStyle">
      <div class="progress-inner">
        <span class="average-value">{{ averageScore }}</span>
        <span class="percentage">%</span>
      </div>
    </div>
    <div class="score-comparison">
      <div class="trend-indicator" :class="trendClass">
        <i :class="trendIcon"></i>
        <span>{{ trendValue }}% from previous</span>
      </div>
    </div>
  </div>
</div>
```

**Styling:**
- Card: White background, border-radius: 8px, padding: 16px
- Box-shadow: 0 4px 10px rgba(0,0,0,0.08)
- Circular progress: 120px diameter, 8px stroke width
- Progress color: Gradient based on score (red to orange to green)
- Average value: 36px bold, centered
- Animation: Progress stroke animates from 0 to current value, duration: 1.5s
- Trend indicator: Arrow up/down icon with percentage difference
- Trend up: Green color (#4CAF50)
- Trend down: Red color (#F44336)
- Entrance animation: Fade in and scale from 0.9 to 1

## Phase 7: Calendar Component

### Calendar Widget
- Create `ClassCalendar.vue` with:
  - Monthly calendar view
  - Highlighted dates for assessments
  - Event indicators

```vue
<!-- Structure -->
<div class="calendar-card">
  <div class="card-header">
    <h3>Class Calendar</h3>
    <div class="calendar-controls">
      <button @click="previousMonth">
        <i class="icon-chevron-left"></i>
      </button>
      <h4>{{ currentMonthDisplay }}</h4>
      <button @click="nextMonth">
        <i class="icon-chevron-right"></i>
      </button>
    </div>
  </div>
  <div class="calendar-container">
    <div class="calendar-weekdays">
      <span v-for="day in weekdays" :key="day">{{ day }}</span>
    </div>
    <div class="calendar-days">
      <button 
        v-for="day in calendarDays" 
        :key="day.date" 
        class="calendar-day" 
        :class="getDayClasses(day)"
      >
        {{ day.dayNumber }}
        <div v-if="day.hasEvent" class="event-indicator"></div>
      </button>
    </div>
  </div>
</div>
```

**Styling:**
- Card: White background, border-radius: 8px, padding: 16px
- Box-shadow: 0 4px 10px rgba(0,0,0,0.08)
- Calendar controls: Space-between, month name centered
- Control buttons: 32px circle, background: #F5F5F5
- Control button hover: Background: #FF6B35, color: white
- Weekdays: 7 columns, gray text, centered, uppercase
- Calendar days: 7 columns grid, aspect-ratio: 1/1
- Day cell: Border-radius: 4px, transition: 0.2s
- Day hover: Background: #FFF0EB
- Today: Background: #FF6B35, color: white
- Assessment day: Border: 2px solid #FF6B35
- Event indicator: 4px circle, background: #FF6B35
- Hover animation: Scale 1.05, box-shadow: 0 2px 8px rgba(0,0,0,0.1)

## Phase 8: Student List Modal

### Student List Component
- Create `StudentList.vue` with:
  - Modal layout
  - Search and filter controls
  - Table of students with performance data
  - Sort capabilities

```vue
<!-- Structure -->
<div class="student-list-modal" v-if="isVisible">
  <div class="modal-backdrop" @click="closeModal"></div>
  <div class="modal-container">
    <div class="modal-header">
      <h2>Students in {{ className }}</h2>
      <button class="close-button" @click="closeModal">
        <i class="icon-close"></i>
      </button>
    </div>
    <div class="search-container">
      <div class="search-input">
        <i class="icon-search"></i>
        <input type="text" placeholder="Search students..." v-model="searchQuery">
      </div>
      <div class="filter-controls">
        <button :class="{ active: sortBy === 'name' }" @click="setSortBy('name')">
          Name
        </button>
        <button :class="{ active: sortBy === 'performance' }" @click="setSortBy('performance')">
          Performance
        </button>
      </div>
    </div>
    <div class="student-table-container">
      <table class="student-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Average Score</th>
            <th>Last Assessment</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in filteredStudents" :key="student.id">
            <td>{{ student.first_name }} {{ student.last_name }}</td>
            <td>{{ student.email }}</td>
            <td>
              <div class="score-pill" :style="getScoreStyle(student.average_score)">
                {{ student.average_score }}%
              </div>
            </td>
            <td>{{ student.last_assessment }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
```

**Styling:**
- Modal backdrop: Fixed position, full viewport, background: rgba(0,0,0,0.4)
- Modal container: Fixed, centered, width: 80%, max-width: 900px, max-height: 80vh
- Background: White, border-radius: 8px, box-shadow: 0 10px 25px rgba(0,0,0,0.2)
- Modal entrance: Scale from 0.9 to 1 and fade in, duration: 0.3s
- Close button: 32px circle, position: absolute, top: 16px, right: 16px
- Search container: Flex space-between, margin: 16px 0
- Search input: Border-radius: 4px, border: 1px solid #EEEEEE
- Search icon: Left padding: 12px, color: #999999
- Filter buttons: Pills, 8px padding, border-radius: 16px
- Active filter: Background: #FF6B35, color: white
- Table: Full width, border-collapse: collapse
- Table header: Background: #F5F5F5, sticky top: 0
- Table rows: Border-bottom: 1px solid #EEEEEE, transition: 0.2s
- Table row hover: Background: #FFF0EB
- Score pill: 40px width, centered, border-radius: 12px, color depends on score
- Row entrance animation: Staggered fade in, duration: 0.3s, delay: 0.03s * index

## Phase 9: Animation and Interaction Refinements

### Global Animation Settings
- Implement consistent animation library
- Define transition presets for common operations
- Create animation directives for reuse

```javascript
// Animation presets
const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 300 }
  },
  slideUp: {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 300, easing: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)' }
  },
  slideIn: {
    from: { opacity: 0, transform: 'translateX(-20px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
    config: { duration: 300, easing: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)' }
  },
  scaleIn: {
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { duration: 300, easing: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)' }
  }
}
```

**Implementations:**
- Card hover effects: Scale 1.03 on hover, shadow increase, transition: 0.3s
- Button hover effects: Scale 1.05, brightness increase
- Navigation hover: Icon scale 1.1, tooltip fade in
- Page transitions: Fade out old page, fade in new page with slight slide
- List item staggered entrance: Each item has increasing delay (index * 50ms)
- Chart animations: Sequential bar grow animation, 1.2s duration

### Interactive Components Refinement

**Card Interaction:**
- Hover state: Transform: scale(1.03), box-shadow increase
- Active state: Transform: scale(0.98) on mouse down
- Click animation: Quick pulse effect on click

**Button Interactions:**
- Hover state: Background brightness increase, slight lift (translateY(-2px))
- Active state: Scale down to 0.95, no lift
- Loading state: Subtle pulse animation while loading

**Navigation Interactions:**
- Hover state: Icon scale, tooltip appearance
- Active state: Background fill animation
- Current page: Left border indicator with slide animation on change

**Chart Interactions:**
- Hover state for data points: Scale up slightly, tooltip with data
- Click on legend: Toggle visibility with fade animation
- Data update: Smooth transition between old and new values

## Phase 10: Responsive Design and Testing

### Responsive Breakpoints
- Mobile: < 576px
- Tablet: 576px - 992px
- Desktop: > 992px

**Mobile Adaptations:**
- Sidebar collapses to bottom navigation
- Single column layout for all card components
- Calendar becomes list view
- Student modal becomes full screen
- Chart heights adjust based on screen size

**Tablet Adaptations:**
- Sidebar becomes compact (icons only)
- Grid changes to 2 columns
- Charts scale to fit container width
- Modal width increases to 90%

**Desktop Optimizations:**
- Sidebar expanded
- 3-column grid for dashboard
- 2-column layout for class detail view
- Fixed width modal (max-width: 900px)

### Testing Plan
- Component unit testing with Jest
- Visual regression testing for animations
- Browser compatibility testing (Chrome, Firefox, Safari, Edge)
- Responsive layout testing on various device sizes
- Performance testing, especially for animations

## Implementation Guidelines

1. Start with base layout (Phase 1)
2. Implement dashboard view (Phase 2)
3. Create class detail components (Phases 3-7)
4. Add interactive elements (Phase 8)
5. Refine animations and interactions (Phase 9)
6. Test and optimize for all devices (Phase 10)

### Component Dependencies
- Vue 3 Composition API
- Vue Router for navigation
- Pinia for state management
- Chart.js for data visualization
- Vue-use for animation utilities
- date-fns for date formatting and manipulation

### Performance Considerations
- Lazy load components not visible on initial render
- Implement virtual scrolling for large student lists
- Use requestAnimationFrame for complex animations
- Debounce resize handlers and expensive calculations
- Optimize repaints with CSS will-change property for animations

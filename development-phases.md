
This document provides detailed, AI-friendly instructions for implementing the teacher dashboard application in sequential phases. Each phase builds upon the previous ones and contains specific instructions for file creation, component development, and integration.
# Development Phases for Student Portal Frontend

## Phase 0: Project Setup

### Instructions

1. Initialize a new Vue 3 project with Vite:
   - Use TypeScript template
   - Configure for Vue 3 with Composition API

2. Install required dependencies:
   ```
   - vue-router@4
   - pinia
   - axios
   - bootstrap
   - bootstrap-vue-3
   - vue-chartjs
   - chart.js
   - @vueuse/core
   ```

3. Create the following folder structure:
   ```
   src/
   ├── assets/
   │   └── styles/
   │       ├── main.css
   │       ├── variables.css (for theming)
   │       └── themes/
   │           ├── light.css
   │           └── dark.css
   ├── components/
   │   ├── common/
   │   ├── layout/
   │   ├── class/
   │   ├── student/
   │   └── assessment/
   ├── composables/
   ├── layouts/
   ├── pages/
   ├── router/
   ├── services/
   ├── stores/
   ├── types/
   └── utils/
   ```

4. Configure environment variables:
   - Create `.env`, `.env.development`, and `.env.production` files
   - Define `VITE_API_BASE_URL` variable for API endpoint

5. Update `vite.config.ts` to include path aliases:
   - Configure `@` to point to the `src` directory
   - Add any necessary plugins

## Phase 1: API Service Setup

### Instructions

1. Create API service files in `src/services/`:

   a. `src/services/api.ts`:
   - Create base Axios instance with:
     - Base URL from environment variable
     - Request/response interceptors
     - Error handling

   b. `src/services/auth.service.ts`:
   - Implement login/logout methods
   - Token refresh function
   - Token storage utilities

   c. `src/types/api.types.ts`:
   - Define response and request interface types based on API documentation
   - Include pagination types if needed

2. Implement API services for each resource:

   a. `src/services/user.service.ts`:
   - Methods for getting current user
   - Updating user profile

   b. `src/services/course.service.ts`:
   - Methods for getting all courses
   - Getting course details

   c. `src/services/class.service.ts`:
   - Methods for getting all classes
   - Getting class details
   - Enrollment management

   d. `src/services/assessment.service.ts`:
   - Methods for CRUD operations on assessments
   - Getting assessment scores

   e. `src/services/score.service.ts`:
   - Methods for creating/updating scores
   - Getting student scores

3. Create utility functions in `src/utils/`:

   a. `src/utils/token.ts`:
   - Functions for JWT token handling
   - Storage and retrieval
   - Expiration checking

   b. `src/utils/error-handler.ts`:
   - Centralized error handling functions
   - Error message formatting

## Phase 2: State Management Setup

### Instructions

1. Create Pinia stores:

   a. `src/stores/auth.store.ts`:
   - State: currentUser, isAuthenticated, loading, error
   - Actions: login, logout, refreshToken, getUserProfile
   - Getters: isAdmin, isTeacher, userFullName

   b. `src/stores/course.store.ts`:
   - State: courses, selectedCourse, loading, error
   - Actions: fetchCourses, fetchCourseById
   - Getters: coursesByCode, activeCourses

   c. `src/stores/class.store.ts`:
   - State: classes, selectedClass, loading, error
   - Actions: fetchClasses, fetchClassById
   - Getters: classesByCourse, teacherClasses

   d. `src/stores/assessment.store.ts`:
   - State: assessments, selectedAssessment, loading, error
   - Actions: fetchAssessments, fetchAssessmentById, createAssessment, updateAssessment, deleteAssessment
   - Getters: assessmentsByClass, upcomingAssessments, recentAssessments

   e. `src/stores/score.store.ts`:
   - State: scores, loading, error
   - Actions: fetchScoresByStudent, fetchScoresByAssessment, createScore, updateScore
   - Getters: averageScoreByClass, lowPerformingStudents

2. Create store types in `src/types/store.types.ts`:
   - Define interfaces for all store states
   - Define types for store getters and actions

3. Configure Pinia in main.ts:
   - Import and create the Pinia instance
   - Add to Vue app

## Phase 3: Authentication and Layout

### Instructions

1. Create authentication components:

   a. `src/pages/LoginPage.vue`:
   - Login form with email and password inputs
     - Container: Centered card with max-width of 450px, border-radius of 8px
     - Background: White (#FFFFFF) with subtle shadow (0px 4px 20px rgba(0, 0, 0, 0.1))
     - Logo: Centered at top, 60px height, 24px margin-bottom
     - Form inputs: Full width, 12px padding, 4px border-radius, #F5F7FA background
     - Labels: 14px font-size, #6B7280 color, 8px margin-bottom
     - Login button: Full width, background #3B82F6, 12px padding, 4px border-radius
     - Button hover effect: Background lighten to #60A5FA with 0.2s transition
     - Button active effect: Scale transform to 0.98 with 0.1s transition
   - Error display: Red (#EF4444) alert with 12px padding, light red background (#FEF2F2)
   - Loading indicator: Blue (#3B82F6) spinner, centered, 24px size
   - Responsive: Adjust padding to 16px on mobile screens

   b. `src/components/layout/AppHeader.vue`:
   - Fixed position at top with z-index: 1000
   - Height: 64px with white (#FFFFFF) background
   - Border-bottom: 1px solid #E5E7EB
   - Logo: Left aligned, 36px height, vertical centering
   - Navigation links:
     - Horizontal list, display: flex
     - Each link: 16px padding, #1F2937 color, 15px font-size
     - Active link: Bottom border 2px solid #3B82F6, color #3B82F6
     - Hover effect: Color transition to #3B82F6 with 0.2s duration
   - User profile dropdown:
     - Right aligned, 40px circular avatar with border
     - Dropdown menu: White background, 8px border-radius, shadow
     - Menu items: 14px padding, 15px font-size, hover background #F9FAFB
   - Theme toggle:
     - Right aligned before profile, 20px size
     - Icon transition between sun/moon with 0.3s rotation animation
   - Logout button: Red text (#EF4444), 14px font-size, right aligned in dropdown
   - Mobile: Collapse to hamburger menu at breakpoint 768px
   - Transition: 0.3s slide-down animation when page loads

   c. `src/components/layout/AppSidebar.vue` (optional):
   - Fixed position with z-index: 900
   - Width: 250px, full height
   - Background: White (#FFFFFF)
   - Border-right: 1px solid #E5E7EB
   - Section headers: 12px font-size, uppercase, #6B7280 color, 16px padding
   - Navigation links:
     - 14px padding, #4B5563 color, 14px font-size
     - Icon: 18px, left aligned, 12px margin-right
     - Active link: Background #EBF5FF, color #3B82F6, left border 3px solid #3B82F6
     - Hover: Background #F9FAFB with 0.2s transition
   - Collapsible sections:
     - Chevron icon with rotate transition
     - Content height transition of 0.3s
   - Scrollable: overflow-y: auto with custom scrollbar styling
   - Collapsible: Transform translateX(-100%) on collapse with 0.3s transition
   - Footer: Version info at bottom, 12px font-size, #9CA3AF color

2. Create layout components:

   a. `src/layouts/MainLayout.vue`:
   - Grid layout: "header header" auto "sidebar main" 1fr / auto 1fr
   - Header: Spans full width at top
   - Sidebar: Fixed width on left (collapsible)
   - Main content:
     - Padding: 24px on all sides (16px on mobile)
     - Background: #F5F7FA (very light blue)
     - Min-height: calc(100vh - 64px)
   - Page transitions: Fade in-out with 0.3s transition
   - Responsive: Sidebar collapses on mobile with overlay mode
   - Main content padding-left adjusts based on sidebar state

   b. `src/layouts/AuthLayout.vue`:
   - Simplified centered layout
   - Background: Linear gradient (135deg, #EBF5FF 0%, #F0F9FF 100%)
   - Fixed background image: Subtle pattern or school-related graphics at 5% opacity
   - Centered content with max-width 450px
   - Vertical and horizontal centering with flex
   - School logo or app name at top: 28px font-size, bold, #1F2937 color
   - Footer: Copyright text, centered, 14px font-size, #6B7280 color, 24px margin-top

3. Configure router:

   a. `src/router/index.ts`:
   - Define routes with layouts
   - Add navigation guards for auth protection
   - Implement route meta for role-based access
   - Configure route transitions based on route depth

   b. `src/composables/useAuth.ts`:
   - Provide authentication utility functions
   - Handle token refresh
   - Check user permissions
   - Manage redirect paths after login

4. Implement theme switching:

   a. `src/composables/useTheme.ts`:
   - Primary theme colors:
     - Light theme: 
       - Primary: #3B82F6 (blue)
       - Background: #F5F7FA (very light blue)
       - Text: #1F2937 (dark gray)
       - Card background: #FFFFFF (white)
     - Dark theme: 
       - Primary: #60A5FA (lighter blue)
       - Background: #1F2937 (dark blue-gray)
       - Text: #F9FAFB (off-white)
       - Card background: #374151 (dark gray)
   - CSS variables structure in root element
   - Transition all color properties with 0.3s duration
   - System preference detection with prefers-color-scheme
   - Store preference in local storage and user settings
   - Smooth page transition when theme changes

## Phase 4: Dashboard and Class List

### Instructions

1. Create dashboard components:

   a. `src/pages/DashboardPage.vue`:
   - Main teacher dashboard layout:
     - Page title: "Dashboard" in 28px font, #1F2937 color, font-weight 600
     - Breadcrumb: Home > Dashboard, 14px font-size, #6B7280 color
     - Welcome message: "Welcome back, [Teacher Name]" in 18px font
     - Page structure: 24px gap between sections
   - Summary statistics section:
     - Row of 4 StatsCard components
     - Layout: display: grid, grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))
     - Gap: 16px between cards
     - Margin: 0 0 32px 0
   - Grid of class cards:
     - Title: "Your Classes" in 20px font, #1F2937 color, with "+ New Class" button (admin only)
     - Button styling: #3B82F6 background, white text, 8px border-radius
     - Layout: display: grid, grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))
     - Gap: 24px between cards
     - Animation: Cards fade in sequentially with 0.1s delay between each card
   - No classes state:
     - Friendly message with illustration
     - Action button to add first class
   - Responsive behavior:
     - Switch to single column layout on screens <768px
     - Reduce padding to 16px on mobile

   b. `src/components/class/ClassCard.vue`:
   - Card container:
     - Height: 240px
     - Background: White (#FFFFFF)
     - Border-radius: 8px
     - Box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05)
     - Border: 1px solid #E5E7EB
     - Hover effect: transform: translateY(-4px), increased shadow with 0.2s transition
     - Cursor: pointer for entire card
   - Class header:
     - Course code: 14px font-size, #6B7280 color, font-weight 500
     - Class title: 18px font-size, #1F2937 color, font-weight 600, truncate with ellipsis
     - Padding: 16px
     - Border-bottom: 1px solid #F3F4F6
   - Class content:
     - Padding: 16px
     - Teacher name: 14px font-size, #4B5563 color
     - Schedule info: 14px font-size, #6B7280 color
     - Student count with icon: 14px font-size, #6B7280 color
   - Metrics section:
     - Average score: Display as large number (24px) with label
     - Color coding: >80% green (#10B981), 60-80% yellow (#FBBF24), <60% red (#EF4444)
     - Small trend indicator showing change from previous assessment
     - Progress bar showing completion rate for recent assessments
     - Progress bar styling: 6px height, rounded corners, dynamic background color
   - Action section:
     - View button: Text "View Class", right aligned, #3B82F6 color
     - Hover effect: background #EBF5FF with 0.2s transition
     - Active effect: transform: scale(0.98) with 0.1s transition

   c. `src/components/common/StatsCard.vue`:
   - Card container:
     - Height: 120px
     - Background: White (#FFFFFF)
     - Border-radius: 8px
     - Box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)
     - Border: 1px solid #E5E7EB
     - Padding: 16px
     - Display: flex, flex-direction: column
   - Icon section:
     - Icon placement: top-right
     - Icon size: 24px
     - Icon colors: Dynamic based on type (info: #3B82F6, success: #10B981, warning: #FBBF24, danger: #EF4444)
     - Icon background: Light version of icon color at 15% opacity, 36px circular container
   - Content section:
     - Title: 14px font-size, #6B7280 color, font-weight 500
     - Value: 28px font-size, #1F2937 color, font-weight 600
     - Animation: Value counters up from 0 when card enters viewport
   - Trend indicator:
     - Small arrow icon (up/down) based on trend
     - Text: 14px font-size
     - Colors: Positive (#10B981), Negative (#EF4444)
     - Format: "+/-X% from previous period"

2. Create loading and error components:

   a. `src/components/common/LoadingSpinner.vue`:
   - SVG-based spinner with circular animation:
     - Default size: 24px (customizable via props)
     - Default color: #3B82F6 (customizable via props)
     - Track: 3px width, #E5E7EB color, 50% opacity
     - Spinner: 3px width, full opacity
     - Animation: 1.5s linear infinite rotation
     - Center alignment with transform
     - Optional text: "Loading..." 14px font-size, #6B7280 color, 8px margin-top
   - Global loading overlay variant:
     - Semi-transparent background (#FFFFFF at 80% opacity)
     - Centered larger spinner (40px)
     - Z-index: 9999
     - Fade-in animation: 0.2s

   b. `src/components/common/ErrorAlert.vue`:
   - Container:
     - Background: #FEF2F2 (light red)
     - Border: 1px solid #FEE2E2
     - Border-radius: 8px
     - Padding: 16px
     - Display: flex
     - Margin: 16px 0
   - Icon:
     - Left aligned, 20px size
     - Color: #EF4444 (red)
     - Margin-right: 12px
   - Content:
     - Title: 16px font-size, #B91C1C color, font-weight 500
     - Message: 14px font-size, #991B1B color
     - Max-width: 100% with word-break
   - Retry button (optional):
     - Text: "Try Again"
     - Background: #FFFFFF
     - Border: 1px solid #EF4444
     - Color: #EF4444
     - Padding: 8px 12px
     - Border-radius: 4px
     - Margin-top: 12px
     - Hover: Background #FEE2E2 with 0.2s transition
   - Animation: Shake animation on entry (0.5s)
   - Dismissible: X button at top-right, 16px size

3. Implement dashboard composables:

   a. `src/composables/useClassStats.ts`:
   - Calculate class statistics
   - Aggregate student performance
   - Format data for charts
   - Calculate score color ranges:
     - >80%: #10B981 (green)
     - 60-80%: #FBBF24 (yellow)
     - <60%: #EF4444 (red)

4. Add class search and filtering:

   a. `src/components/class/ClassFilter.vue`:
   - Container:
     - Background: White (#FFFFFF)
     - Border-radius: 8px
     - Box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)
     - Border: 1px solid #E5E7EB
     - Padding: 16px
     - Margin-bottom: 24px
   - Search input:
     - Height: 40px
     - Border: 1px solid #E5E7EB
     - Border-radius: 6px
     - Padding: 0 16px
     - Width: 100% (on mobile) or 300px
     - Font-size: 14px
     - Placeholder: "Search classes..."
     - Search icon: 16px, #9CA3AF color, left-aligned inside input with 12px padding
     - Focus effect: Border color change to #3B82F6 with 0.2s transition, box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1)
   - Filter section:
     - Layout: display: flex, flex-wrap: wrap, gap: 12px
     - Label: 14px font-size, #4B5563 color, font-weight 500
   - Filter dropdowns:
     - Course filter: "Filter by Course"
     - Status filter: "Active/Inactive"
     - Term filter: "Current/Past Term"
     - Width: 180px for each dropdown
     - Height: 36px
     - Border: 1px solid #E5E7EB
     - Border-radius: 6px
     - Font-size: 14px
     - Background: Chevron down icon at right
     - Open animation: Smooth height transition for dropdown panel
   - Sort dropdown:
     - Label: "Sort by"
     - Options: "Newest", "Alphabetical", "Performance"
     - Same styling as filter dropdowns
   - Clear filters button:
     - Text: "Clear Filters"
     - Color: #6B7280
     - Hover: Text color #3B82F6 with 0.2s transition
     - Only shown when filters are active
   - Responsive behavior:
     - Stack filters vertically on screens <768px
     - Full width inputs on mobile

## Phase 5: Class Detail Page

### Instructions

1. Create class detail components:

   a. `src/pages/ClassDetailPage.vue`:
   - Page layout:
     - Max-width: 1200px, margin: 0 auto
     - Padding: 24px (16px on mobile)
   - Header section:
     - Breadcrumb: Dashboard > Classes > [Class Name], 14px font-size, #6B7280 color
     - Back button: Left arrow icon, "Back to Dashboard" text, #6B7280 color
     - Animation: Fade in with 0.3s duration
   - Tabs navigation:
     - Container: border-bottom: 1px solid #E5E7EB, margin-bottom: 24px
     - Tab styles: 
       - Padding: 16px 24px
       - Font-size: 16px
       - Default color: #6B7280
       - Active: color #3B82F6, border-bottom: 2px solid #3B82F6
       - Hover: color #4B5563 with 0.2s transition
       - Indicator: Animated bottom border slide with 0.3s duration
     - Tab options: "Overview", "Students", "Assessments"
   - Tab content:
     - Animation: Fade transition between tabs with 0.3s duration
     - Min-height: 400px to prevent layout shifts
   - Responsive behavior:
     - Stack tab navigation vertically on screens <768px
     - Adjust padding and margins for mobile viewing

   b. `src/components/class/ClassHeader.vue`:
   - Container:
     - Background: White (#FFFFFF)
     - Border-radius: 8px at top
     - Box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)
     - Border: 1px solid #E5E7EB
     - Padding: 24px
     - Margin-bottom: 24px
     - Display: flex, justify-content: space-between, align-items: center
   - Class info section:
     - Course code: 14px font-size, #6B7280 color, font-weight 500
     - Class title: 24px font-size, #1F2937 color, font-weight 600
     - Status badge: "Active" (green #10B981) or "Inactive" (gray #9CA3AF)
     - Badge styling: 12px font-size, 6px border-radius, 6px padding, uppercase
   - Actions section:
     - Edit button (admin/teacher only): Pencil icon, "Edit" text, #6B7280 color
       - Hover: color #3B82F6 with 0.2s transition
     - Back button: Left arrow icon, "Back" text, #6B7280 color
       - Hover: color #3B82F6 with 0.2s transition
     - Button styles: 
       - padding: 8px 16px
       - border: 1px solid #E5E7EB
       - border-radius: 6px
       - font-size: 14px
       - margin-left: 12px
   - Responsive: Stack info and actions vertically on screens <640px

   c. `src/components/class/ClassOverview.vue`:
   - Layout: Grid with auto-fit columns, gap: 24px
   - Stats section:
     - Grid of 4 StatsCard components
     - Metrics: "Class Average", "Assessments", "Students", "Completion Rate"
     - Icons: Colorful and subject-appropriate
   - Performance chart section:
     - Background: White (#FFFFFF)
     - Border-radius: 8px
     - Box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)
     - Border: 1px solid #E5E7EB
     - Padding: 24px
     - Title: "Class Performance", 18px font-size, #1F2937 color, font-weight 600
     - Chart container: height: 300px, margin-top: 16px
     - Period selector: Small button group in top-right (Week, Month, Term)
       - Active period: #3B82F6 background, white text
       - Inactive: #F9FAFB background, #6B7280 text
       - Button group styling: 4px border-radius, overflow hidden, 1px #E5E7EB border
   - Recent activity section:
     - Layout: Same card styling as Performance section
     - Title: "Recent Activity", 18px font-size, #1F2937 color, font-weight 600
     - Activity list: Timeline style with left border and dots
       - Dots: 12px circular indicators with activity-specific colors
       - Activity item: 16px padding, display: flex
       - Event text: 14px font-size, #4B5563 color
       - Timestamp: 12px font-size, #6B7280 color
       - Alternating rows: odd rows #F9FAFB background
   - Upcoming assessments section:
     - Layout: Same card styling as other sections
     - Title: "Upcoming Assessments", 18px font-size, #1F2937 color, font-weight 600
     - Assessment list: 
       - Assessment item: 16px padding, display: flex, justify-content: space-between
       - Title: 14px font-size, #4B5563 color
       - Date: 14px font-size, #6B7280 color
       - Proximity indicator: Colored dot based on how soon (red: <3 days, yellow: <7 days, green: >7 days)
       - Separator: 1px solid #F3F4F6 between items
   - Students needing attention section:
     - Layout: Same card styling as other sections
     - Title: "Students Needing Attention", 18px font-size, #1F2937 color, font-weight 600
     - Student list:
       - Student item: display: flex, align-items: center, 16px padding
       - Avatar: 32px circular image or initials with background color based on name
       - Name: 14px font-size, #4B5563 color, font-weight 500
       - Score: 14px font-size, color based on score range
       - Action button: "View" text, #3B82F6 color
       - Separator: 1px solid #F3F4F6 between items
   - Empty states for all sections:
     - Friendly message with illustration
     - Action button when appropriate
   - Animation: Sections fade in sequentially with 0.1s delay between each
   - Responsive behavior:
     - Single column layout on screens <768px
     - Chart height reduces to 200px on mobile

2. Create chart components:

   a. `src/components/charts/AverageScoreChart.vue`:
   - Chart configuration:
     - Type: Line chart
     - Height: 100% (fills container)
     - Width: 100%
     - Responsive: true
     - Maintainaspectratio: false
   - Data styling:
     - Line color: #3B82F6 (blue)
     - Line width: 3px
     - Point radius: 4px
     - Point hover radius: 6px
     - Fill: gradient from rgba(59, 130, 246, 0.1) to transparent
     - Tension: 0.4 for smooth curves
   - X-axis (time):
     - Grid lines: #F3F4F6 color, 1px dashed
     - Labels: #6B7280 color, 12px font-size
     - Padding: 10px
   - Y-axis (scores):
     - Grid lines: #F3F4F6 color, 1px dashed
     - Labels: #6B7280 color, 12px font-size
     - Min: 0, Max: 100
     - Ticks: Steps of 20
   - Tooltip:
     - Background: #1F2937 (dark)
     - Text color: #F9FAFB (white)
     - Border-radius: 4px
     - Padding: 8px
     - Title font-size: 12px, font-weight 600
     - Body font-size: 12px
     - Caret size: 5px
   - Animation:
     - Duration: 1s
     - Easing: easeOutQuart
     - Delay: 0.2s

   b. `src/components/charts/GradeDistributionChart.vue`:
   - Chart configuration:
     - Type: Bar chart
     - Height: 100% (fills container)
     - Width: 100%
     - Responsive: true
     - Maintainaspectratio: false
   - Data styling:
     - Bar colors: Range from #EF4444 (red) for low scores to #10B981 (green) for high scores
     - Bar border: None
     - Bar border-radius: 4px at top
     - Hover effect: Brightness increase with 0.2s transition
   - X-axis (grade ranges):
     - Categories: "0-20", "21-40", "41-60", "61-80", "81-100"
     - Grid lines: None
     - Labels: #6B7280 color, 12px font-size
     - Padding: 10px
   - Y-axis (frequency):
     - Grid lines: #F3F4F6 color, 1px dashed
     - Labels: #6B7280 color, 12px font-size
     - Min: 0
     - Ticks: Begin at zero, steps based on data
   - Tooltip and animation: Same as AverageScoreChart

   c. `src/composables/useChartData.ts`:
   - Data formatting functions:
     - Generate gradient colors for score ranges:
       - 0-60: Shades of red (#EF4444)
       - 61-80: Shades of yellow (#FBBF24)
       - 81-100: Shades of green (#10B981)
     - Format dates consistently for x-axis labels
     - Calculate appropriate y-axis ranges based on data
   - Standard chart options:
     - Common tooltip configurations
     - Responsive options
     - Font family consistency
     - Animation defaults

3. Create student list component:

   a. `src/components/student/StudentList.vue`:
   - Container:
     - Background: White (#FFFFFF)
     - Border-radius: 8px
     - Box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)
     - Border: 1px solid #E5E7EB
     - Padding: 24px
     - Margin-top: 24px
   - Header section:
     - Title: "Students", 18px font-size, #1F2937 color, font-weight 600
     - Search input: Same styling as ClassFilter component
     - Filter dropdown: "Filter by Performance"
       - Options: "All", "High (>80%)", "Medium (60-80%)", "Low (<60%)"
     - Add button (admin only): "+ Add Student", #3B82F6 background, white text
   - Table styling:
     - Width: 100%
     - Border-collapse: separate
     - Border-spacing: 0
     - Margin-top: 16px
   - Table header:
     - Background: #F9FAFB
     - Text: #6B7280 color, 14px font-size, font-weight 500
     - Text alignment: Left for name columns, center for score columns
     - Padding: 12px 16px
     - Border-bottom: 1px solid #E5E7EB
     - Hover: Show sort indicators on hover
     - Sort indicators: Small up/down arrows, 12px size
     - Clickable: cursor: pointer for sortable columns
   - Table rows:
     - Alternating colors: Even rows white, odd rows #F9FAFB
     - Hover effect: Background #F3F4F6 with 0.2s transition
     - Border-bottom: 1px solid #E5E7EB
     - Animation: Fade in rows sequentially with 0.05s delay
   - Table cells:
     - Padding: 12px 16px
     - Vertical alignment: middle
     - Text: #4B5563 color, 14px font-size
   - Student cell:
     - Display: flex, align-items: center
     - Avatar: 32px circular image or initials
     - Name: 14px font-size, #1F2937 color, margin-left: 12px
     - Bold font-weight: 500
   - Performance indicators:
     - Score cell: Score as percentage with appropriate color
     - Visual indicator: Small colored dot before score
     - Trend indicator: Small arrow showing improvement/decline
   - Action buttons:
     - View button: Eye icon, tooltip "View Details"
     - Grade button: Pencil icon, tooltip "Grade Student"
     - Button styling: 32px square, #F3F4F6 background, #6B7280 icon color
     - Hover: Background #E5E7EB with 0.2s transition
     - Active: transform: scale(0.95) with 0.1s transition
   - Pagination:
     - Container: display: flex, justify-content: space-between, margin-top: 16px
     - Page info: "Showing X to Y of Z students", 14px font-size, #6B7280 color
     - Page controls: Prev/Next buttons with arrows
     - Button styling: 36px height, border: 1px solid #E5E7EB, border-radius: 6px
     - Disabled state: Opacity 0.5, not clickable
     - Page numbers: 30px square buttons, active page with #3B82F6 background
   - Empty state:
     - Friendly message: "No students enrolled in this class yet"
     - Illustration: Classroom or students graphic
     - Action button for admins to add students
   - Responsive behavior:
     - Horizontal scroll on small screens
     - Simplified mobile view: Hide less important columns
     - Stack controls on screens <640px

## Phase 6: Assessment Management

### Instructions

1. Create assessment list components:

   a. `src/pages/AssessmentListPage.vue`:
   - Page layout:
     - Max-width: 1200px, margin: 0 auto
     - Padding: 24px (16px on mobile)
   - Header section:
     - Breadcrumb: Dashboard > Classes > [Class Name] > Assessments, 14px font-size, #6B7280 color
     - Title: "Assessments for [Class Name]", 24px font-size, #1F2937 color, font-weight 600
     - Create button: "+ Create Assessment", #3B82F6 background, white text
       - Button styling: 12px padding, 6px border-radius, 14px font-size
       - Hover: Background lighten to #60A5FA with 0.2s transition
       - Active: transform: scale(0.98) with 0.1s transition
   - Filter section:
     - Background: White (#FFFFFF)
     - Border-radius: 8px
     - Box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)
     - Border: 1px solid #E5E7EB
     - Padding: 16px
     - Margin: 24px 0
     - Display: flex, justify-content: space-between, align-items: center
     - Filter elements:
       - Search input: 240px width, same styling as ClassFilter
       - Type dropdown: "All Types", "Quiz", "Assignment", "Exam"
       - Status dropdown: "All Status", "Upcoming", "Past"
       - Date range: Date picker dropdowns for start/end dates
     - Layout: Wrap filters as needed with 12px gap
   - Assessment list:
     - Layout: display: flex, flex-direction: column, gap: 16px
     - Empty state: "No assessments created yet" with illustration
       - Action button to create first assessment
     - Animation: List items fade in sequentially with 0.1s delay

   b. `src/components/assessment/AssessmentListItem.vue`:
   - Container:
     - Background: White (#FFFFFF)
     - Border-radius: 8px
     - Box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)
     - Border: 1px solid #E5E7EB
     - Padding: 16px
     - Display: flex, justify-content: space-between, align-items: center
     - Hover effect: Background #F9FAFB with 0.2s transition
     - Cursor: pointer
   - Left section:
     - Type badge: 
       - Quiz: Purple (#8B5CF6) background
       - Assignment: Blue (#3B82F6) background
       - Exam: Red (#EF4444) background
       - Badge styling: 4px border-radius, 6px padding, 12px font-size, white text
     - Title: 16px font-size, #1F2937 color, font-weight 500, margin-left: 12px
     - Date: 14px font-size, #6B7280 color, display: block, margin-top: 4px
   - Middle section:
     - Average score: 16px font-size, dynamic color based on score
     - Completion rate: Text and circular progress indicator
     - Progress styling: 
       - Circle size: 32px
       - Track: #E5E7EB color, 3px width
       - Fill: #3B82F6 color (or dynamic based on completion percentage)
       - Text: 12px font-size, centered
   - Right section:
     - Action buttons:
       - View details: Eye icon
       - Edit: Pencil icon (teacher/admin only)
       - Delete: Trash icon (teacher/admin only)
       - Button styling: 36px square, #F3F4F6 background, #6B7280 icon color
       - Hover: Background #E5E7EB with 0.2s transition
       - Active: transform: scale(0.95) with 0.1s transition
     - Status indicator:
       - "Upcoming": Green (#10B981) dot with text
       - "In Progress": Blue (#3B82F6) dot with text
       - "Past": Gray (#9CA3AF) dot with text
   - Responsive behavior:
     - Stack sections vertically on screens <768px
     - Full width buttons on mobile

2. Create assessment form components:

   a. `src/components/assessment/AssessmentForm.vue`:
   - Form container:
     - Background: White (#FFFFFF)
     - Border-radius: 8px
     - Box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)
     - Border: 1px solid #E5E7EB
     - Padding: 24px
     - Max-width: 800px, margin: 0 auto
   - Form header:
     - Title: "Create Assessment" or "Edit Assessment", 20px font-size, #1F2937 color
     - Divider: 1px solid #E5E7EB, margin: 16px 0
   - Form layout:
     - display: grid, grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))
     - gap: 24px
     - Form groups: display: flex, flex-direction: column
   - Form elements:
     - Labels: 14px font-size, #4B5563 color, font-weight 500, margin-bottom: 8px
     - Inputs: 
       - Height: 40px
       - Border: 1px solid #E5E7EB
       - Border-radius: 6px
       - Padding: 0 12px
       - Font-size: 14px
       - Color: #1F2937
       - Width: 100%
       - Focus effect: Border color #3B82F6, box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1)
       - Transition: all 0.2s ease
     - Select dropdowns: 
       - Same styling as inputs
       - Custom dropdown arrow
       - Option hover: Background #F9FAFB
     - Textarea: 
       - Min-height: 100px
       - Resize: vertical
       - Same styling as inputs
     - Required field indicator: Red asterisk (*) next to label
     - Error messages: 
       - Text: #EF4444 (red) color, 12px font-size
       - Icon: Exclamation circle, 14px size
       - Animation: Fade in with slight shake
   - Specific fields:
     - Title field: Full width, required
     - Type dropdown: Required with options "Quiz", "Assignment", "Exam"
     - Date field: Custom date picker
     - Description: Full width textarea, optional
   - Button group:
     - Container: display: flex, justify-content: flex-end, gap: 12px, margin-top: 24px
     - Submit button: "Create Assessment" or "Save Changes", #3B82F6 background, white text
     - Cancel button: "Cancel", transparent background, #6B7280 text, border: 1px solid #E5E7EB
     - Button styling: 12px padding, 6px border-radius, 14px font-size
     - Hover effects: 
       - Submit: Background lighten to #60A5FA with 0.2s transition
       - Cancel: Background #F9FAFB with 0.2s transition
     - Active: transform: scale(0.98) with 0.1s transition
     - Loading state: Replace text with spinner, disable button
   - Form validation:
     - Real-time validation with visual indicators
     - Submit button disabled until form is valid
     - Required fields marked clearly
     - Show specific error messages for each validation error

   b. `src/components/common/DatePicker.vue`:
   - Input container:
     - Position: relative
     - Same styling as standard inputs
     - Calendar icon at right inside input
   - Date panel:
     - Position: absolute, top: 100%, left: 0
     - Background: White (#FFFFFF)
     - Border-radius: 8px
     - Box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)
     - Border: 1px solid #E5E7EB
     - Width: 300px
     - Z-index: 10
     - Animation: Fade in with 0.2s duration
   - Month navigation:
     - Display: flex, justify-content: space-between, align-items: center
     - Padding: 12px
     - Month/Year text: 16px font-size, #1F2937 color, font-weight 500
     - Arrow buttons: 32px square, #F3F4F6 background, #6B7280 icon color
     - Hover: Background #E5E7EB with 0.2s transition
   - Calendar grid:
     - Display: grid, grid-template-columns: repeat(7, 1fr)
     - Day headers: 12px font-size, #6B7280 color, padding: 8px 0
     - Day cells: 
       - 36px square
       - Text: 14px font-size, centered
       - Current month: #4B5563 color
       - Other month: #9CA3AF color, 50% opacity
       - Today: #3B82F6 color, font-weight 500
       - Selected: White text, #3B82F6 background, filled circle
       - Hover: Background #EBF5FF with 0.2s transition
   - Action buttons:
     - "Today" button: Jump to current date
     - "Clear" button: Clear selected date
     - Button styling: Text only, 14px font-size, #6B7280 color
     - Padding: 8px 12px
     - Hover: Color #3B82F6 with 0.2s transition
   - Close behavior:
     - Click outside to close
     - Escape key to close
     - Select date to close

3. Create assessment detail page:

   a. `src/pages/AssessmentDetailPage.vue`:
   - Page layout:
     - Max-width: 1200px, margin: 0 auto
     - Padding: 24px (16px on mobile)
   - Header section:
     - Breadcrumb: Dashboard > Classes > [Class Name] > Assessments > [Assessment Title]
     - Back button: "Back to Assessments", left arrow icon, #6B7280 color
     - Title section: 
       - Type badge: Same styling as in AssessmentListItem
       - Assessment title: 24px font-size, #1F2937 color, font-weight 600
       - Date: 14px font-size, #6B7280 color
     - Action buttons: (teacher/admin only)
       - Edit: Pencil icon, "Edit", #6B7280 color
       - Delete: Trash icon, "Delete", #EF4444 color
       - Button styling: 36px height, border: 1px solid #E5E7EB, border-radius: 6px
   - Statistics section:
     - Grid of stats cards: "Average Score", "Completion Rate", "High Score", "Low Score"
     - Layout: Grid with auto-fit columns, minmax(240px, 1fr), gap: 16px
     - Card styling: Same as StatsCard component
   - Distribution chart:
     - Container: Same card styling as other sections
     - Title: "Grade Distribution", 18px font-size, #1F2937 color, font-weight 600
     - Chart container: height: 300px, margin-top: 16px
     - Use GradeDistributionChart component
   - Student scores section:
     - Container: Same card styling as other sections
     - Title: "Student Scores", 18px font-size, #1F2937 color, font-weight 600
     - Search and filter: Search by name, filter by score range
     - Table styling:
       - Same base styling as StudentList component
       - Columns: Student Name, Score, Submission Date, Feedback, Actions
       - Score column: Visual indicator with appropriate color
       - Actions: View detail, Edit score (teacher/admin only)
   - Bulk actions: (teacher/admin only)
     - Container at top of table
     - "Grade All" button: #3B82F6 background, white text
     - "Export Scores" button: White background, #3B82F6 text, border: 1px solid #3B82F6
     - Button styling: 12px padding, 6px border-radius, 14px font-size

4. Implement assessment creation workflow:

   a. `src/composables/useAssessmentForm.ts`:
   - Form state management:
     - Default values
     - Validation rules
     - Error handling
   - Submit handling:
     - Loading states
     - Success/error notifications
     - Redirect after creation
   - Form field types:
     - Title: string, required, min 3 chars, max 100 chars
     - Type: string enum ('quiz', 'assignment', 'exam'), required
     - Date: Date object, required, must be valid date
     - Description: string, optional, max 500 chars

## Phase 7: Student Grading Interface

### Instructions

1. Create grading components:

   a. `src/pages/GradingPage.vue`:
   - Page layout:
     - Max-width: 1200px, margin: 0 auto
     - Padding: 24px (16px on mobile)
   - Header section:
     - Breadcrumb: Dashboard > Classes > [Class Name] > Assessments > [Assessment Title] > Grading
     - Title: "Grading: [Assessment Title]", 24px font-size, #1F2937 color, font-weight 600
     - Assessment info: Type badge, date, total students
     - Progress indicator: 
       - Container: display: flex, align-items: center, margin-top: 8px
       - Text: "X of Y students graded", 14px font-size, #6B7280 color
       - Progress bar: 
         - Width: 200px, height: 6px
         - Background: #E5E7EB
         - Fill: #3B82F6, transition width with 0.3s duration
         - Border-radius: 3px
   - Grading interface layout:
     - Two-column grid on desktop: "grid-template-columns: 1fr 2fr"
     - Stack vertically on mobile: "grid-template-columns: 1fr"
     - Gap: 24px
   - Student list column:
     - Container: Same card styling as other sections
     - Title: "Students", 18px font-size, #1F2937 color, font-weight 600
     - Search: Filter by name
     - Filter options: "All", "Graded", "Ungraded"
     - Student list:
       - Max-height: 600px, overflow-y: auto
       - Custom scrollbar styling
       - Student item: 
         - Padding: 12px
         - Display: flex, align-items: center
         - Avatar: 32px circular image or initials
         - Name: 14px font-size, #1F2937 color, margin-left: 12px
         - Selected state: Background #EBF5FF, border-left: 3px solid #3B82F6
         - Graded indicator: Green checkmark when graded
         - Hover: Background #F9FAFB with 0.2s transition
         - Cursor: pointer
       - Alternating rows: odd rows #F9FAFB background
       - Separator: 1px solid #F3F4F6 between items
   - Grading form column:
     - Container: Same card styling as other sections
     - Title: "Grading: [Student Name]", 18px font-size, #1F2937 color, font-weight 600
     - Empty state: "Select a student to grade" when no student selected
     - Form layout: display: flex, flex-direction: column, gap: 24px
     - Score input section:
       - Label: "Score", 16px font-size, #4B5563 color, font-weight 500
       - Input group: display: flex, align-items: center
       - Score input: 
         - Width: 100px
         - Height: 48px
         - Font-size: 20px
         - Text align: center
         - Border: 1px solid #E5E7EB
         - Border-radius: 6px
         - Padding: 0 12px
       - Score percentage: 16px font-size, #6B7280 color, margin-left: 12px
       - Score range text: "out of 100", 14px font-size, #9CA3AF color
       - Dynamic color change based on score value
     - Feedback section:
       - Label: "Feedback", 16px font-size, #4B5563 color, font-weight 500
       - Textarea: 
         - Min-height: 150px
         - Border: 1px solid #E5E7EB
         - Border-radius: 6px
         - Padding: 12px
         - Font-size: 14px
         - Color: #1F2937
         - Width: 100%
         - Focus effect: Border color #3B82F6, box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1)
       - Character count: "X/500 characters", 12px font-size, #9CA3AF color, text-align: right
       - Template buttons: Quick feedback templates
         - Button styling: #F3F4F6 background, #6B7280 text, 6px border-radius
         - Hover: Background #E5E7EB with 0.2s transition
     - Button group:
       - Container: display: flex, justify-content: space-between, margin-top: 16px
       - Save button: "Save Score", #3B82F6 background, white text
       - Next button: "Save & Next", #10B981 background, white text
       - Button styling: 12px padding, 6px border-radius, 14px font-size
       - Hover effects: Background lighten with 0.2s transition
       - Active: transform: scale(0.98) with 0.1s transition
       - Loading state: Replace text with spinner, disable button
   - Navigation controls:
     - Prev/Next student buttons at bottom of form
     - Button styling: 36px height, border: 1px solid #E5E7EB, border-radius: 6px
     - Icons: Left/right arrows
     - Text: "Previous Student", "Next Student"
     - Disabled state when at first/last student
   - Keyboard shortcuts:
     - Save: Ctrl+S or Cmd+S
     - Next student: Alt+Right Arrow
     - Previous student: Alt+Left Arrow
     - Shortcut hint text at bottom of form

   b. `src/components/assessment/ScoreInput.vue`:
   - Container: position: relative
   - Input styling:
     - Height: 48px
     - Border: 1px solid #E5E7EB
     - Border-radius: 6px
     - Padding: 0 12px
     - Font-size: 20px
     - Text align: center
     - Width: 100px
     - Focus effect: Border color #3B82F6, box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1)
   - Validation:
     - Min: 0, Max: 100 (or custom range via props)
     - Error state: Border color #EF4444, shake animation
     - Error tooltip: Position absolute, top: -40px
   - Visual features:
     - Dynamic border color based on score:
       - <60: #EF4444 (red)
       - 60-80: #FBBF24 (yellow)
       - >80: #10B981 (green)
     - Score percentage text: 16px font-size, dynamic color, margin-left: 12px
     - Number input controls: Custom styled increment/decrement buttons
     - Animation: Value changes animate with 0.2s duration

   c. `src/components/assessment/FeedbackInput.vue`:
   - Container: display: flex, flex-direction: column
   - Textarea styling:
     - Min-height: 150px
     - Border: 1px solid #E5E7EB
     - Border-radius: 6px
     - Padding: 12px
     - Font-size: 14px
     - Color: #1F2937
     - Width: 100%
     - Focus effect: Border color #3B82F6, box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1)
     - Resize: vertical
   - Character counter:
     - Text: "X/Y characters", 12px font-size, #9CA3AF color
     - Position: text-align: right, margin-top: 4px
     - Warning color when approaching limit: #FBBF24
     - Error color when exceeding limit: #EF4444
   - Template section:
     - Title: "Templates", 14px font-size, #6B7280 color
     - Template buttons: Horizontal scrolling row
     - Button styling: #F3F4F6 background, #6B7280 text, 6px border-radius, 8px padding
     - Hover: Background #E5E7EB with 0.2s transition
     - Active: transform: scale(0.98) with 0.1s transition
     - Selected: Border: 2px solid #3B82F6
   - Autosave indicator:
     - Small text showing "Saving..." or "Saved" status
     - Icon: Spinning for saving, checkmark for saved
     - Text: 12px font-size, #9CA3AF color

2. Implement batch grading:

   a. `src/components/assessment/BatchGradeForm.vue`:
   - Container:
     - Background: White (#FFFFFF)
     - Border-radius: 8px
     - Box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)
     - Border: 1px solid #E5E7EB
     - Padding: 24px
     - Max-width: 800px, margin: 0 auto
   - Header:
     - Title: "Batch Grading", 20px font-size, #1F2937 color, font-weight 600
     - Description: "Apply scores to multiple students at once", 14px font-size, #6B7280 color
     - Divider: 1px solid #E5E7EB, margin: 16px 0
   - Student selection:
     - Checkboxes for all students
     - "Select All" toggle at top
     - Student list styling:
       - Max-height: 300px, overflow-y: auto
       - Custom scrollbar styling
       - Student item: Same styling as in GradingPage but with checkbox
     - Search filter: Filter students by name
   - Scoring section:
     - Score input: Same as ScoreInput component
     - Score distribution options:
       - "Same score for all" (default)
       - "Random scores within range" (with min/max inputs)
       - "Curved grading" (with mean and std deviation inputs)
       - Option styling: Radio buttons with labels
     - Feedback options:
       - "No feedback"
       - "Same feedback for all" (with textarea)
       - "Individual feedback" (disabled, with note to use individual grading)
   - Button group:
     - Container: display: flex, justify-content: flex-end, gap: 12px, margin-top: 24px
     - Apply button: "Apply Scores", #3B82F6 background, white text
     - Cancel button: "Cancel", transparent background, #6B7280 text, border: 1px solid #E5E7EB
     - Button styling: 12px padding, 6px border-radius, 14px font-size
     - Confirm warning: Modal confirmation before applying batch grades
   - Modal dialog styling:
     - Container: position: fixed, inset: 0, background: rgba(0, 0, 0, 0.5)
     - Dialog: 400px width, white background, 8px border-radius, 24px padding
     - Title: 20px font-size, #1F2937 color
     - Content: 16px font-size, #4B5563 color
     - Buttons: Same as button group

   b. `src/composables/useGrading.ts`:
   - Grading state management:
     - Current student index
     - Navigation functions (next, previous, jump to student)
     - Score validation
     - Feedback character limiting
   - Submit functions:
     - Individual score submission
     - Batch score submission
     - Error handling
     - Success notifications
   - Helper functions:
     - Calculate score color mapping
     - Generate score distributions for batch grading
     - Format feedback text
     - Template management

3. Create score review components:

   a. `src/components/assessment/ScoreReviewList.vue`:
   - Container: Same card styling as other sections
   - Header section:
     - Title: "Student Scores", 18px font-size, #1F2937 color, font-weight 600
     - Search input: Filter by student name
     - Export button: "Export CSV", #F3F4F6 background, #6B7280 text
     - Button styling: 12px padding, 6px border-radius, 14px font-size
   - Statistics row:
     - Small stat cards: "Average", "Highest", "Lowest", "Median"
     - Layout: display: flex, gap: 16px, margin: 16px 0
     - Card styling: Small version of StatsCard
   - Table styling:
     - Width: 100%
     - Border-collapse: separate
     - Border-spacing: 0
     - Margin-top: 16px
   - Table header: Same style as StudentList component
   - Table rows:
     - Same base styling as StudentList
     - Columns: Student Name, Score, Grade, Submission Date, Feedback, Actions
     - Score column: Visual indicator with appropriate color
     - Grade column: Letter grade based on score ranges (A, B, C, D, F)
     - Feedback column: Truncated with "Show more" expander
     - Actions: View detail, Edit score (teacher/admin only)
   - Expandable rows:
     - Click to expand full feedback
     - Animation: height transition with 0.3s duration
     - Expanded background: #F9FAFB
     - Padding: 16px
     - Close button: Small X icon
   - Pagination: Same styling as StudentList
   - Empty state: "No scores recorded yet" with illustrationading multiple students
   - Bulk actions

   b. `src/composables/useGrading.ts`:
   - Manage grading state
   - Submit scores in batches
   - Validation logic

3. Create score review components:

   a. `src/components/assessment/ScoreReviewList.vue`:
   - Display all scores for an assessment
   - Highlight statistics
   - Sort and filter options

## Phase 8: Student Detail Page

### Instructions

1. Create student detail components:

   a. `src/pages/StudentDetailPage.vue`:
   - Page layout:
     - Max-width: 1200px, margin: 0 auto
     - Padding: 24px (16px on mobile)
   - Header section:
     - Breadcrumb: Dashboard > Classes > [Class Name] > Students > [Student Name]
     - Back button: "Back to Students", left arrow icon, #6B7280 color
     - Student profile section:
       - Layout: display: flex, align-items: center, margin-bottom: 24px
       - Avatar: 64px circular image or initials with background color based on name
       - Student info:
         - Name: 24px font-size, #1F2937 color, font-weight 600
         - Email: 14px font-size, #6B7280 color, display: block
         - Status badge: "Active" (green) or "Inactive" (gray)
       - Performance summary:
         - Average score: 20px font-size, color based on score
         - Small trend indicator showing change
   - Tab navigation:
     - Container: border-bottom: 1px solid #E5E7EB, margin-bottom: 24px
     - Tab styles: 
       - Padding: 16px 24px
       - Font-size: 16px
       - Default color: #6B7280
       - Active: color #3B82F6, border-bottom: 2px solid #3B82F6
       - Hover: color #4B5563 with 0.2s transition
     - Tab options: "Overview", "Assessments", "Notes"
     - Tab indicator: Animated bottom border slide with 0.3s duration
   - Performance overview tab:
     - Layout: display: grid, grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)), gap: 24px
     - Performance chart card:
       - Container: Same card styling as other sections
       - Title: "Performance Trends", 18px font-size, #1F2937 color, font-weight 600
       - Chart container: height: 300px, margin-top: 16px
       - Period selector: Button group for Week/Month/Term
       - Use StudentPerformanceChart component
     - Assessment summary card:
       - Container: Same card styling as other sections
       - Title: "Assessment Summary", 18px font-size, #1F2937 color, font-weight 600
       - Stats grid: 
         - "Overall Average": Value with color indicator
         - "Assessments Completed": Value with percentage
         - "Best Performance": Value with subject
         - "Needs Improvement": Value with subject
       - Stats styling: Title 14px, #6B7280 color; Value 20px, #1F2937 color
     - Recent assessments card:
       - Container: Same card styling as other sections
       - Title: "Recent Assessments", 18px font-size, #1F2937 color, font-weight 600
       - Assessment list: 
         - Assessment item: 16px padding, display: flex, justify-content: space-between
         - Title: 14px font-size, #4B5563 color
         - Score: 14px font-size, color based on score
         - Dynamic indicators for exceptional performance
         - Separator: 1px solid #F3F4F6 between items
   - Assessments tab:
     - Assessment history table:
       - Same table styling as other tables
       - Columns: Assessment Title, Type, Date, Score, Class Average, Actions
       - Type column: Colored badges as in other components
       - Score column: Value with color indicator
       - Class average: Grayed value for comparison
       - Actions: View details button
       - Sort/filter: By date, type, score
     - Filter section above table:
       - Search input: Filter by assessment title
       - Type filter: Dropdown for quiz/assignment/exam
       - Score range filter: Min/max inputs or slider
       - Clear filters button
     - Empty state: "No assessments recorded yet" with illustration
   - Notes tab:
     - Notes list:
       - Container: Same card styling as other sections
       - Add note section at top:
         - Textarea: 100px height, same styling as other inputs
         - Save button: "+ Add Note", #3B82F6 background, white text
         - Button position: right aligned
       - Notes timeline:
         - Layout: display: flex, flex-direction: column, gap: 16px
         - Note item: 
           - Border-left: 3px solid #3B82F6
           - Padding: 16px
           - Background: #F9FAFB
           - Border-radius: 0 8px 8px 0
           - Margin-left: 16px
         - Date/time: 12px font-size, #6B7280 color
         - Content: 14px font-size, #4B5563 color, white-space: pre-wrap
         - Actions: Edit/Delete buttons (small, text only)
         - Animation: New notes fade in with 0.3s duration
       - Empty state: "No notes yet. Add one to keep track of important information."
   - Responsive behavior:
     - Stack tab navigation vertically on screens <768px
     - Single column layout on mobile
     - Simplified tables with fewer columns

   b. `src/components/student/StudentHeader.vue`:
   - Container:
     - Background: White (#FFFFFF)
     - Border-radius: 8px at top
     - Box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)
     - Border: 1px solid #E5E7EB
     - Padding: 24px
     - Margin-bottom: 24px
     - Display: flex, justify-content: space-between, align-items: center
   - Student info section:
     - Layout: display: flex, align-items: center
     - Avatar: 48px circular image or initials with background color based on name
     - Text container: margin-left: 16px
     - Name: 20px font-size, #1F2937 color, font-weight 600
     - Class info: 14px font-size, #6B7280 color
     - Status badge: "Active" (green) or "Inactive" (gray), positioned below name
     - Badge styling: 12px font-size, 4px border-radius, 4px padding, uppercase
   - Performance summary:
     - Container: display: flex, align-items: center
     - Average score: 24px font-size, dynamic color based on score
     - Label: "Avg Score", 12px font-size, #6B7280 color, positioned above score
     - Trend indicator: Small up/down arrow with percentage change
     - Visual separator: 1px solid #E5E7EB, margin: 0 16px, height: 40px
     - Completion rate: "XX% Complete", 16px font-size, #4B5563 color
   - Actions section:
     - Button group: display: flex, gap: 8px
     - Grade button: "Grade", #3B82F6 background, white text
     - Contact button: "Contact", white background, #6B7280 text, border: 1px solid #E5E7EB
     - Button styling: 10px padding, 6px border-radius, 14px font-size
     - Icons: Left-aligned, 16px size, 8px margin-right
   - Responsive: Stack sections vertically on screens <768px

2. Create performance tracking components:

   a. `src/components/charts/StudentPerformanceChart.vue`:
   - Chart configuration:
     - Type: Line chart with multiple series
     - Height: 100% (fills container)
     - Width: 100%
     - Responsive: true
     - Maintainaspectratio: false
   - Data styling:
     - Student line: 
       - Color: #3B82F6 (blue)
       - Line width: 3px
       - Point radius: 4px
       - Point hover radius: 6px
       - Fill: Gradient from rgba(59, 130, 246, 0.1) to transparent
     - Class average line:
       - Color: #9CA3AF (gray)
       - Line width: 2px, dashed
       - Point radius: 0 (no points)
       - No fill
     - Tension: 0.4 for smooth curves
   - Axes and legends:
     - X-axis (time): Same as AverageScoreChart
     - Y-axis (scores): Same as AverageScoreChart
     - Legend:
       - Position: top
       - Labels: "Student Score", "Class Average"
       - Align: end
       - Box width: 12px
       - Font size: 12px
       - Padding: 16px
   - Tooltip and animation: Same as AverageScoreChart
   - Interactive features:
     - Assessment point markers with tooltips
     - Click handler for assessment details

   b. `src/components/student/AssessmentHistoryList.vue`:
   - Container: Same card styling as other sections
   - Header section:
     - Title: "Assessment History", 18px font-size, #1F2937 color, font-weight 600
     - Filter/search: Same styling as other filter components
   - Table styling:
     - Same base table styling as other tables
     - Columns: Title, Type, Date, Score, Class Avg, Actions
     - Type column: Badges for quiz/assignment/exam
     - Score column: 
       - Value with color indicator
       - Visual comparison to class average (small bar or arrow)
     - Sort options: By date (default), score, title
     - Hover effect: Background #F9FAFB with 0.2s transition
   - Empty state: "No assessments found" with illustration
   - Pagination: Same as other components

3. Implement student notes:

   a. `src/components/student/StudentNotes.vue`:
   - Container: Same card styling as other sections
   - Add note section:
     - Textarea: 
       - Height: 100px
       - Border: 1px solid #E5E7EB
       - Border-radius: 6px
       - Padding: 12px
       - Font-size: 14px
       - Color: #1F2937
       - Width: 100%
       - Focus effect: Border color #3B82F6, box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1)
       - Placeholder: "Add a note about this student..."
     - Button group:
       - Add button: "+ Add Note", #3B82F6 background, white text
       - Cancel button: "Cancel", only visible when content entered
       - Button styling: 10px padding, 6px border-radius, 14px font-size
   - Notes list:
     - Empty state: "No notes yet" with simple illustration
     - Notes timeline:
       - Layout: display: flex, flex-direction: column, gap: 16px
       - Note item: 
         - Container: 
           - Border-left: 3px solid #3B82F6
           - Padding: 16px
           - Background: #F9FAFB
           - Border-radius: 0 8px 8px 0
           - Position: relative
           - Margin-left: 24px
         - Date indicator: 
           - Circle on timeline: 12px diameter, 24px left position
           - Date text: 12px font-size, #6B7280 color
           - Time text: 12px font-size, #9CA3AF color
         - Content: 14px font-size, #4B5563 color, white-space: pre-wrap
         - Actions:
           - Edit/Delete buttons
           - Positioned: top-right
           - Only visible on hover
           - Button styling: Text only, 12px font-size, #6B7280 color
           - Hover: Color #3B82F6 with 0.2s transition
     - Edit mode:
       - Replace text with textarea
       - Add Save/Cancel buttons
       - Animation: Smooth height transition
     - Delete confirmation:
       - Small inline confirmation
       - "Are you sure? Yes / No"
       - Styling: warning color text

   b. `src/composables/useNotes.ts`:
   - Note state management:
     - Current notes array
     - Adding/editing/deleting functions
     - Loading and error states
   - Note object structure:
     - id: string
     - student_id: string
     - content: string
     - created_at: Date
     - updated_at: Date
     - created_by: string (teacher id)
   - Helper functions:
     - Format dates for display
     - Sort notes by date
     - Filter notes by content

## Phase 9: Analytics Dashboard

### Instructions

1. Create analytics components:

   a. `src/components/class/ClassAnalytics.vue`:
   - Container:
     - Background: White (#FFFFFF)
     - Border-radius: 8px
     - Box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)
     - Border: 1px solid #E5E7EB
     - Padding: 24px
     - Margin-bottom: 24px
   - Header section:
     - Title: "Class Analytics", 20px font-size, #1F2937 color, font-weight 600
     - Filter controls: 
       - Time period selector: Dropdown with options (Week, Month, Term, Custom)
       - Assessment type filter: Multi-select dropdown
       - Export button: "Export Data", #F3F4F6 background, #6B7280 text
     - Controls styling: 
       - Same as other filter components
       - Layout: display: flex, gap: 12px, flex-wrap: wrap
       - Alignment: space-between with title
   - Analytics grid:
     - Layout: display: grid, grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)), gap: 24px
     - Margin-top: 24px
   - Widget placement:
     - Large chart widgets: grid-column: span 2 on desktop
     - Small statistic widgets: Single column span
   - Responsive behavior:
     - Stack all widgets on screens <768px
     - Adjust padding to 16px on mobile
     - Simplify grid to single column

   b. `src/components/charts/CompletionRateChart.vue`:
   - Chart configuration:
     - Type: Donut chart
     - Size: 240px diameter, centered
     - Responsive: true
   - Data styling:
     - Completed segment: #3B82F6 (blue)
     - Incomplete segment: #E5E7EB (light gray)
     - Border: none
     - Hover effect: Segment expands slightly with 0.2s transition
   - Center text:
     - Percentage: 28px font-size, #1F2937 color, font-weight 600
     - Label: "Completion", 14px font-size, #6B7280 color
     - Position: Centered in donut
   - Legend:
     - Position: bottom
     - Labels: "Completed", "Incomplete"
     - Align: center
     - Font size: 12px
     - Padding: 16px
   - Animation:
     - Type: easeOutQuart
     - Duration: 1s
   - Tooltip:
     - Same styling as other charts
     - Show count and percentage

   c. `src/components/charts/PerformanceTrendChart.vue`:
   - Chart configuration:
     - Type: Line chart with multiple series
     - Height: 300px
     - Width: 100%
     - Responsive: true
   - Data styling:
     - Multiple series with distinct colors:
       - Class average: #3B82F6 (blue)
       - Quiz average: #8B5CF6 (purple)
       - Assignment average: #10B981 (green)
       - Exam average: #EF4444 (red)
     - Line styling:
       - Standard width: 3px
       - Highlighted series: 4px
       - Dimmed series: 2px, 50% opacity
       - Point radius: 3px (6px on hover)
     - Area fill: Light gradient below each line (10% opacity)
   - Legend:
     - Position: top
     - Interactive: Click to hide/show series
     - Active: Full opacity
     - Inactive: 50% opacity, strikethrough
   - Axes and grid:
     - Same base styling as other charts
     - Y-axis: Start at 0 or lowest score - 10 (whichever is lower)
     - X-axis: Time periods with appropriate intervals
   - Interactive features:
     - Zoom capability: Drag to select time range
     - Reset zoom button: Small icon in top-right
     - Highlight series on legend hover
   - Animation: Same as other charts

2. Create analytics widgets:

   a. `src/components/widgets/PerformanceWidget.vue`:
   - Container:
     - Background: White (#FFFFFF)
     - Border-radius: 8px
     - Box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)
     - Border: 1px solid #E5E7EB
     - Padding: 20px
     - Height: 100%
     - Display: flex, flex-direction: column
   - Header section:
     - Title: Dynamic from props, 16px font-size, #1F2937 color, font-weight 600
     - Period selector: Small dropdown in top-right (optional via prop)
     - Layout: display: flex, justify-content: space-between, align-items: center
   - Chart container:
     - Height: 200px
     - Margin: 16px 0
     - Configuration via props for different chart types
   - Stats footer:
     - Layout: display: flex, justify-content: space-between
     - Period comparison: "vs Previous: +/-X%", color based on trend direction
     - Secondary stat: Configurable via props (e.g., "Highest: 98%")
     - Text styling: 12px font-size, #6B7280 color
   - Loading state:
     - Semi-transparent overlay
     - Centered spinner
     - Animation: Fade in/out with 0.2s duration
   - Empty state:
     - Friendly message with small illustration
     - Centered in container
   - Dynamic styling:
     - Widget title icon: Left of title, color based on widget type
     - Border-top: 3px solid color based on widget type

   b. `src/components/widgets/StudentsNeedingAttentionWidget.vue`:
   - Container: Same base styling as PerformanceWidget
   - Header:
     - Title: "Students Needing Attention", 16px font-size, #1F2937 color, font-weight 600
     - Counter badge: Circular badge showing count, background #EF4444, white text
     - Badge styling: 20px diameter, 12px font-size, position: absolute, right: 12px, top: 12px
   - Threshold selector:
     - Text: "Show scores below:", 12px font-size, #6B7280 color
     - Dropdown: 60% default, options 50%, 60%, 70%
     - Position: Below header, 12px margin-top
   - Student list:
     - Max-height: 250px, overflow-y: auto
     - Custom scrollbar styling
     - Student item: 
       - Layout: display: flex, justify-content: space-between, align-items: center
       - Padding: 12px
       - Border-bottom: 1px solid #F3F4F6
       - Hover: Background #F9FAFB with 0.2s transition
     - Student info:
       - Avatar: 24px circular image or initials
       - Name: 14px font-size, #1F2937 color, margin-left: 8px
       - Truncate with ellipsis if too long
     - Score info:
       - Score: 14px font-size, color based on score level
       - Assessment title: 12px font-size, #6B7280 color
     - Action:
       - View button: "View", #3B82F6 color, 12px font-size
       - Hover: Underline with 0.2s transition
   - Footer:
     - "View All" link: Right aligned, 14px font-size, #3B82F6 color
     - Margin-top: 16px
   - Empty state:
     - Message: "All students are performing well!"
     - Success icon: Green checkmark
     - Text: 14px font-size, #10B981 color
     - Centered in container with 24px padding

3. Implement analytics calculations:

   a. `src/composables/useAnalytics.ts`:
   - Analytics calculation functions:
     - Class performance metrics:
       - Average score calculation
       - Performance trends over time
       - Distribution analysis
     - Assessment analysis:
       - Completion rates
       - Score distributions
       - Type comparison (quiz vs assignment vs exam)
     - Student analysis:
       - Identify struggling students (below threshold)
       - Highlight top performers
       - Track improvement/decline
   - Data formatting for charts:
     - Format arrays for chart.js consumption
     - Apply consistent color schemes across charts
     - Calculate appropriate axis ranges
   - Time period handling:
     - Filter data by selected period
     - Group data by appropriate intervals
     - Calculate period-over-period changes
   - Calculated metrics:
     - Z-scores for identifying outliers
     - Moving averages for trend smoothing
     - Class ranking calculations
   - Chart configuration presets:
     - Standard options for each chart type
     - Color schemes based on metric type
     - Consistent tooltip and legend formatting

## Phase 10: Responsive Design and Polish

### Instructions

1. Implement responsive layouts:

   a. Update all page components:
   - Common responsive styling across all pages:
     - Base container: max-width: 1200px, margin: 0 auto, padding: 24px
     - Mobile container: padding: 16px on screens <768px
     - Grid layouts: Use minmax() for responsive column widths
       - `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`
     - Typography scaling:
       - Page titles: 28px desktop, 24px mobile
       - Section titles: 20px desktop, 18px mobile
       - Body text: 16px desktop, 14px mobile
     - Spacing adjustments:
       - Reduce all margins and paddings by ~25% on mobile
       - Maintain minimum touch target size of 44px
     - Cards: Full-width on mobile with reduced padding (16px)
     - Tables: Horizontal scroll on mobile with fixed first column
     - Forms: Stack fields vertically on mobile, full-width inputs
   - Explicit breakpoints:
     - Mobile: <576px
     - Tablet: 576px-767px
     - Small desktop: 768px-991px
     - Medium desktop: 992px-1199px
     - Large desktop: ≥1200px
   - Responsive behavior patterns:
     - Dashboard: 3 columns → 2 columns → 1 column as screen narrows
     - Navigation: Full sidebar → collapsed sidebar → top hamburger menu
     - Tables: Full → selective columns → card view for each row
     - Forms: Side-by-side → stacked fields
     - Charts: Standard → simplified → key metrics only

   b. `src/components/layout/MobileHeader.vue`:
   - Container:
     - Height: 56px
     - Background: White (#FFFFFF)
     - Border-bottom: 1px solid #E5E7EB
     - Position: fixed, top: 0, left: 0, right: 0
     - z-index: 1000
     - Display: flex, justify-content: space-between, align-items: center
     - Padding: 0 16px
     - Box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)
   - Logo section:
     - Logo: 32px height
     - App name: 18px font-size, #1F2937 color, font-weight: 600
   - Menu toggle:
     - Button: 40px square, #F9FAFB background, #6B7280 icon
     - Border-radius: 6px
     - Border: 1px solid #E5E7EB
     - Icon: Hamburger (three lines) / X (when open)
     - Animation: Smooth transformation between icons with 0.3s duration
   - Mobile menu panel:
     - Position: fixed, top: 56px, left: 0, right: 0, bottom: 0
     - Background: White (#FFFFFF)
     - z-index: 999
     - Box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
     - Animation: Slide down with 0.3s duration
     - Overflow-y: auto with custom scrollbar
   - Mobile navigation:
     - Menu items: 
       - Padding: 16px
       - Border-bottom: 1px solid #F3F4F6
       - Font-size: 16px
       - Color: #4B5563
       - Icon: 20px, left aligned, 12px margin-right
     - Active item: 
       - Background: #EBF5FF
       - Color: #3B82F6
       - Left border: 4px solid #3B82F6
     - Nested items:
       - Indent: 16px padding-left
       - Smaller font: 14px
       - Lighter color: #6B7280
     - User section:
       - Avatar and name at bottom
       - Logout button: Full width, red text

2. Enhance theme implementation:

   a. Update `src/composables/useTheme.ts`:
   - Theme definition:
     - Light theme:
       - `--color-primary`: #3B82F6 (blue)
       - `--color-primary-light`: #60A5FA
       - `--color-primary-dark`: #2563EB
       - `--color-background`: #F5F7FA (very light blue)
       - `--color-surface`: #FFFFFF (white)
       - `--color-text-primary`: #1F2937 (dark gray)
       - `--color-text-secondary`: #6B7280 (medium gray)
       - `--color-border`: #E5E7EB (light gray)
       - `--color-success`: #10B981 (green)
       - `--color-warning`: #FBBF24 (yellow)
       - `--color-error`: #EF4444 (red)
       - `--color-info`: #3B82F6 (blue)
     - Dark theme:
       - `--color-primary`: #60A5FA (lighter blue)
       - `--color-primary-light`: #93C5FD
       - `--color-primary-dark`: #3B82F6
       - `--color-background`: #1F2937 (dark blue-gray)
       - `--color-surface`: #374151 (dark gray)
       - `--color-text-primary`: #F9FAFB (off-white)
       - `--color-text-secondary`: #D1D5DB (light gray)
       - `--color-border`: #4B5563 (medium gray)
       - `--color-success`: #34D399 (light green)
       - `--color-warning`: #FBBF24 (yellow)
       - `--color-error`: #F87171 (light red)
       - `--color-info`: #60A5FA (light blue)
   - Implementation approach:
     - Apply theme class to root element (html or body)
     - Use CSS variables in all component styles
     - Include transition for all color properties: transition: color 0.3s, background-color 0.3s, border-color 0.3s
   - Theme detection:
     - Check system preference with prefers-color-scheme media query
     - Override with user preference from profile
     - Store selection in localStorage as fallback
   - Toggle function:
     - Simple toggle between light/dark
     - Animate transition with fade overlay
     - Update user preference via API if authenticated
   - Theme initialization:
     - On app start, check user preference first
     - Fall back to system preference
     - Finally fall back to light theme
   - Chart theme:
     - Adjust Chart.js defaults based on theme
     - Define separate color palettes for light/dark
     - Update charts when theme changes

   b. Update CSS variables:
   - Create `src/assets/styles/variables.css`:
     - Define all theme variables for light and dark
     - Include additional variables for spacing, typography, shadows:
       - Spacing scale: `--spacing-1` through `--spacing-16` (4px to 64px)
       - Font sizes: `--text-xs` through `--text-3xl` (12px to 30px)
       - Font weights: `--font-normal` (400), `--font-medium` (500), `--font-semibold` (600), `--font-bold` (700)
       - Line heights: `--leading-tight` (1.25), `--leading-normal` (1.5), `--leading-loose` (2)
       - Shadows: `--shadow-sm`, `--shadow`, `--shadow-md`, `--shadow-lg`
       - Border radius: `--radius-sm` (4px), `--radius` (6px), `--radius-md` (8px), `--radius-lg` (12px), `--radius-full` (9999px)
       - Transitions: `--transition-fast` (0.15s), `--transition` (0.3s), `--transition-slow` (0.5s)
     - Organization: Group variables by purpose
     - Comments: Include purpose for each variable group
   - Create theme files:
     - `src/assets/styles/themes/light.css`: Light theme variables
     - `src/assets/styles/themes/dark.css`: Dark theme variables
   - Implement in global CSS:
     - Apply variables to all elements with universal selector
     - Include fallback values for better browser support
     - Add smooth transitions between themes

3. Add loading states and transitions:

   a. Update store actions:
   - Implement consistent loading pattern:
     - Start: Set `loading` state to true
     - Success: Set data and set `loading` to false
     - Error: Set error message and set `loading` to false
     - Reset: Clear error messages when starting new requests
   - Loading states for each entity type:
     - `loadingClasses`, `loadingAssessments`, `loadingStudents`, etc.
     - Finer-grained states for specific actions: `creatingAssessment`, `updatingGrade`, etc.
   - Error handling:
     - Structured error object with `message`, `statusCode`, `source`
     - Clearing errors after display or timeout
     - Recovery actions when applicable

   b. `src/components/common/SkeletonLoader.vue`:
   - Container: Same dimensions as target content
   - Animation: Subtle pulse effect, 1.5s duration, infinite
   - Gradient: Linear gradient animation from #F3F4F6 to #E5E7EB and back
   - Animation: `@keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }`
   - Variants:
     - Text skeleton:
       - Heights: 24px for titles, 16px for body text
       - Width: 100% or configurable percentage
       - Border-radius: 4px
     - Card skeleton:
       - Full dimensions of card
       - Border-radius: 8px
     - Table skeleton:
       - Row height: 52px
       - Columns: Configurable widths
       - Subtle borders matching table
     - Avatar skeleton:
       - Circle with configurable size
       - Default: 40px diameter
     - Chart skeleton:
       - Rectangular placeholder
       - Optional axis lines
   - Usage patterns:
     - Repeat elements for lists/tables
     - Respect layout of actual content
     - Match margins and padding of target elements
   - Implementation:
     - Accept type prop: 'text', 'card', 'table', 'avatar', 'chart'
     - Size props: 'width', 'height', 'count' (for repeating elements)
     - Customization props: 'radius', 'animation' (enable/disable)

4. Implement final polish:

   a. Create `src/composables/useTransitions.ts`:
   - Page transitions:
     - Fade transition: opacity 0.3s ease
     - Slide transitions: transform 0.3s ease
     - Direction options: left, right, up, down
     - Scale transitions: transform 0.3s ease
   - Element transitions:
     - List item transitions (staggered):
       - Fade in items one by one
       - Small delay between items (0.05s)
       - Calculate delay based on index
     - Notification transitions:
       - Enter: Slide in from top with fade
       - Exit: Slide out to right with fade
     - Modal transitions:
       - Enter: Fade in with slight scale up
       - Exit: Fade out with slight scale down
       - Backdrop: Simple fade
   - Transition hooks for Vue Router:
     - beforeEnter, enter, afterEnter
     - beforeLeave, leave, afterLeave
     - Handle scroll position
     - Preload data when possible
   - Animation utilities:
     - Easing functions (ease, ease-in, ease-out, etc.)
     - Duration constants
     - Helper for creating transition classes

   b. Add accessibility improvements:
   - ARIA attributes:
     - aria-label for interactive elements without visible text
     - aria-describedby for elements needing additional context
     - aria-expanded for expandable sections
     - aria-selected for tabs and selection components
     - aria-live regions for dynamic content
     - aria-busy for loading states
   - Keyboard navigation:
     - Focus styles: 2px outline, #3B82F6 color with offset
     - Tab index management
     - Key handlers for arrow navigation
     - Escape key for closing modals/dropdowns
     - Enter/Space for activating focused elements
   - Screen reader support:
     - Hidden text for icons (sr-only class)
     - Appropriate heading hierarchy
     - Semantic HTML elements
     - Skip to content link
   - Color contrast:
     - Ensure 4.5:1 ratio for normal text
     - Ensure 3:1 ratio for large text
     - Test with color blindness filters
   - Focus order:
     - Logical tab order
     - No keyboard traps
     - Return focus after modal closes

## Phase 11: Testing and Documentation

### Instructions

1. Implement unit tests:

   a. Create tests for each service:
   - Test file structure:
     - `src/services/__tests__/auth.service.test.ts`
     - `src/services/__tests__/class.service.test.ts`
     - etc.
   - Mock setup:
     - Create axios mock responses
     - Test successful API calls
     - Test error handling
     - Test retry logic
   - Test coverage:
     - All API endpoints
     - Authentication flows
     - Token refresh
     - Error cases
   - Testing patterns:
     - Arrange-Act-Assert pattern
     - Descriptive test names
     - Isolated tests with proper setup/teardown

   b. Create tests for stores:
   - Test file structure:
     - `src/stores/__tests__/auth.store.test.ts`
     - `src/stores/__tests__/class.store.test.ts`
     - etc.
   - Testing approach:
     - Mock service calls
     - Test state mutations
     - Test computed properties
     - Test action flows
     - Test error cases
   - Test coverage:
     - All actions
     - All getters
     - Initial state
     - Reset functionality

2. Implement component tests:

   a. Test key components:
   - Test file structure:
     - `src/components/__tests__/[ComponentName].test.ts`
   - Component testing focus:
     - Rendering with different props
     - User interactions
     - Emitted events
     - Conditional rendering
     - Slots and custom content
   - Key components to test:
     - Form components
     - Chart components
     - Interactive elements
     - Complex UI components
   - Testing patterns:
     - Mount vs shallowMount based on complexity
     - Simulated user interactions
     - DOM assertions
     - Snapshot testing for stable components
   - Test utilities:
     - Create helper functions for common patterns
     - Mock complex dependencies
     - Create fixture data

3. Create documentation:

   a. `src/components/README.md`:
   - Component documentation structure:
     - Purpose and usage
     - Props API with types and defaults
     - Events emitted
     - Slots available
     - Example usage code
     - Notes on behavior
   - Organization:
     - Group by component type
     - Include screenshots where helpful
     - Show variations with different props
   - Style guidelines:
     - How to use theme variables
     - Component composition patterns
     - State management patterns
   - Component hierarchy:
     - Parent-child relationships
     - Component dependencies

   b. Update main README.md:
   - Project overview:
     - Purpose and features
     - Technologies used
     - Architecture overview
     - Screenshot of main dashboard
   - Setup instructions:
     - Prerequisites
     - Installation steps
     - Environment configuration
     - Development server
     - Build for production
   - Development guidelines:
     - Code style and linting
     - Git workflow
     - Testing requirements
     - Documentation standards
   - Folder structure explanation
   - Contributing guidelines
   - License information

## Phase 12: Deployment Preparation

### Instructions

1. Configure build process:

   a. Update `vite.config.ts`:
   - Build optimizations:
     - Chunk size optimization
     - Tree shaking configuration
     - Asset compression
     - Source map generation for production
     - CSS minification
   - Plugin configuration:
     - Vue plugins
     - TypeScript plugins
     - PostCSS/autoprefixer
     - SVG optimization
   - Environment handling:
     - Mode-specific configurations
     - Environment variable validation
     - Feature flags

   b. Create deployment scripts:
   - Build command:
     - Environment variable setup
     - Build with proper mode
     - Post-build optimizations
   - Environment configuration:
     - Production-specific settings
     - API base URL configuration
     - Analytics integration
     - Error tracking setup
   - CI/CD configuration:
     - GitHub Actions or similar
     - Automatic testing
     - Deployment to hosting
     - Environment-specific builds

2. Implement error tracking:

   a. `src/utils/error-tracking.ts`:
   - Global error handler:
     - Window.onerror handler
     - Vue error handler
     - Promise rejection handler
     - Console error override
   - Error processing:
     - Stack trace formatting
     - User context addition
     - Environment information
     - Error categorization
   - Reporting mechanism:
     - Console logging in development
     - Send to API in production
     - Rate limiting for repeated errors
     - Offline queueing
   - Privacy considerations:
     - PII filtering
     - Data minimization
     - User consent

3. Finalize environment configurations:

   a. Complete `.env.production`:
   - Production settings:
     - API_BASE_URL: Production API endpoint
     - NODE_ENV: production
     - APP_VERSION: from package.json
     - BUILD_TIMESTAMP: build date
     - FEATURES: enabled feature flags

   b. Create `src/config.ts`:
   - Centralized configuration:
     - Import environment variables
     - Provide typed access to configuration
     - Set defaults for missing values
     - Validate required values
   - Feature toggles:
     - Analytics enabled
     - Advanced features
     - Experimental features
     - Role-specific features
   - Environment-specific settings:
     - API request timeouts
     - Cache durations
     - Polling intervals
     - Retry attempts
   - Implementation:
     - Export const config object
     - Use throughout application
     - Freeze object to prevent modification

## Important Integration Notes

1. Data Flow:
   - Services make API calls
   - Stores consume services and manage state
   - Components consume stores
   - Use composables for reusable logic

2. Type Safety:
   - Define interfaces for all API responses/requests
   - Type all store state, getters, and actions
   - Use type assertions sparingly

3. State Management:
   - Keep store modules focused on specific domains
   - Use getters for derived state
   - Actions should handle side effects

4. Component Design:
   - Keep components small and focused
   - Use props and events for parent-child communication
   - Use provide/inject for deeply nested components

5. Error Handling:
   - Implement consistent error handling
   - Display user-friendly error messages
   - Log errors for debugging

6. Performance:
   - Lazy load routes
   - Use pagination for large lists
   - Consider memoization for expensive calculations

7. File Naming Conventions:
   - Use kebab-case for file names
   - Use PascalCase for component names
   - Use camelCase for variables and functions

8. Inter-Phase Dependencies:
   - When modifying a file from a previous phase, note the changes clearly
   - Update imports when new files are created
   - Update types when data structures change# Development Phases for Teacher Dashboard


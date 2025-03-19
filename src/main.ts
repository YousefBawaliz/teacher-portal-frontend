import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { clickOutside } from './directives/clickOutside'
import './style.css'
import router from './router'


// Import Heroicons
import { 
  SunIcon, 
  MoonIcon, 
  ChevronDownIcon, 
  ChevronLeftIcon,
  ArrowRightOnRectangleIcon // This is the logout icon
} from '@heroicons/vue/24/outline'

// Create Pinia instance
const pinia = createPinia()

// Create and mount the app with plugins
const app = createApp(App)

// Register directives
app.directive('click-outside', clickOutside)

// Register icons as components
app.component('i-sun', SunIcon)
app.component('i-moon', MoonIcon)
app.component('i-chevron-down', ChevronDownIcon)
app.component('i-chevron-left', ChevronLeftIcon)
app.component('i-logout', ArrowRightOnRectangleIcon)

// Use plugins
app.use(pinia)
app.use(router)

app.mount('#app')





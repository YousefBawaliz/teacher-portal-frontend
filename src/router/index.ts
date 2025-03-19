import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { AuthService } from '@/services/auth.service'
import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('../pages/LoginPage.vue'),
        meta: { 
          title: 'Login',
          requiresGuest: true
        }
      }
    ]
  },
  {
    path: '/dashboard',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('../pages/DashboardPage.vue'),
        meta: { title: 'Dashboard' }
      }
    ]
  },
  // Move store-test route to root level
  {
    path: '/store-test',
    component: MainLayout,
    name: 'store-test',
    meta: { 
      title: 'Store Tests',
      requiresAuth: true
    },
    children: [
      {
        path: '',
        component: () => import('../pages/StoreTestPage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Update document title
  document.title = `${to.meta.title} - Learning Management System`

  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }

  // Check if route requires guest access (like login page)
  if (to.matched.some(record => record.meta.requiresGuest)) {
    if (authStore.isAuthenticated) {
      next({ name: 'dashboard' })
      return
    }
  }

  next()
})

export default router






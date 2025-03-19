import { ref } from 'vue'

type Theme = 'light' | 'dark'

export function useTheme() {
  const theme = ref<Theme>('light')

  const applyTheme = (newTheme: Theme) => {
    // Remove previous theme class
    document.documentElement.classList.remove('theme-light', 'theme-dark')
    // Add new theme class
    document.documentElement.classList.add(`theme-${newTheme}`)
  }

  const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light'
    theme.value = newTheme
    applyTheme(newTheme)
  }

  // Initialize with light theme
  applyTheme('light')

  return {
    theme,
    toggleTheme
  }
}

// Theme utility functions for reliable theme switching

export const applyTheme = (theme) => {
  console.log('🎨 Applying theme:', theme);
  
  const root = document.documentElement;
  const body = document.body;
  
  // Remove all existing theme classes from both root and body
  root.classList.remove('dark', 'light', 'dark-mode', 'light-mode');
  body.classList.remove('dark', 'light', 'dark-mode', 'light-mode');
  
  // Remove the forced indicator if it exists
  const indicator = document.getElementById('dark-mode-indicator');
  if (indicator) indicator.remove();
  
  // Apply new theme
  if (theme === 'dark') {
    // Add CSS classes
    root.classList.add('dark');
    body.classList.add('dark-mode');
    
    // Use the same reliable method as forceDarkMode but cleaner
    root.style.cssText = 'background-color: #0f172a !important; color: #f1f5f9 !important;';
    body.style.cssText = 'background-color: #0f172a !important; color: #f1f5f9 !important; margin: 0; padding: 0;';
    
    // Force update major containers with a slight delay
    setTimeout(() => {
      const containers = document.querySelectorAll('.bg-white, .bg-gray-50, .bg-slate-50, .bg-gray-100, .bg-slate-100');
      containers.forEach(el => {
        el.style.backgroundColor = '#1e293b';
        el.style.color = '#f1f5f9';
      });
      
      // Update text elements
      const textElements = document.querySelectorAll('.text-gray-900, .text-slate-900, .text-gray-800, .text-slate-800');
      textElements.forEach(el => {
        el.style.color = '#f1f5f9';
      });
      
      const secondaryTextElements = document.querySelectorAll('.text-gray-700, .text-slate-700, .text-gray-600, .text-slate-600');
      secondaryTextElements.forEach(el => {
        el.style.color = '#cbd5e1';
      });
    }, 50);
    
    console.log('🌙 Dark theme applied successfully');
    
  } else if (theme === 'light') {
    // Add CSS classes
    root.classList.add('light'); 
    body.classList.add('light-mode');
    
    // Reset all inline styles to let CSS take over
    root.style.cssText = '';
    body.style.cssText = '';
    
    // Reset container styles
    setTimeout(() => {
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        // Only reset styles we might have set for dark mode
        if (el.style.backgroundColor === 'rgb(30, 41, 59)' || // #1e293b
            el.style.backgroundColor === 'rgb(15, 23, 42)') {  // #0f172a
          el.style.backgroundColor = '';
          el.style.color = '';
        }
      });
    }, 50);
    
    console.log('☀️ Light theme applied successfully');
    
  } else if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log('🔄 Auto theme - system prefers dark:', prefersDark);
    
    // Use recursion to apply the appropriate theme
    applyTheme(prefersDark ? 'dark' : 'light');
    return; // Exit early since we're calling applyTheme again
  }
  
  // Force style recalculation
  setTimeout(() => {
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
    
    const computedStyle = getComputedStyle(body);
    console.log('📊 Final body background:', computedStyle.backgroundColor);
    console.log('📊 Final body color:', computedStyle.color);
    console.log('✅ Theme application complete!');
  }, 100);
};

export const getCurrentTheme = () => {
  const root = document.documentElement;
  if (root.classList.contains('dark')) return 'dark';
  if (root.classList.contains('light')) return 'light';
  return 'auto';
};

export const saveTheme = (theme) => {
  // Update the existing adminSettings with the new theme
  const existingSettings = localStorage.getItem('adminSettings');
  let settings = {};
  
  if (existingSettings) {
    try {
      settings = JSON.parse(existingSettings);
    } catch (e) {
      console.error('Error parsing existing settings:', e);
    }
  }
  
  // Update theme in the settings structure
  settings.system = settings.system || {};
  settings.system.theme = theme;
  
  localStorage.setItem('adminSettings', JSON.stringify(settings));
  console.log('Theme saved to adminSettings:', theme);
};

export const loadTheme = () => {
  const existingSettings = localStorage.getItem('adminSettings');
  
  if (existingSettings) {
    try {
      const settings = JSON.parse(existingSettings);
      const theme = settings.system?.theme || 'light';
      console.log('Theme loaded from adminSettings:', theme);
      return theme;
    } catch (e) {
      console.error('Error parsing adminSettings:', e);
    }
  }
  
  console.log('No theme found, defaulting to light');
  return 'light';
};

// Initialize theme on page load
export const initializeTheme = () => {
  const theme = loadTheme();
  console.log('Initializing theme:', theme);
  applyTheme(theme);
  return theme;
};

// Debug function to test themes from browser console
export const debugTheme = () => {
  const root = document.documentElement;
  const body = document.body;
  const computedStyle = getComputedStyle(body);
  
  const debugInfo = {
    rootClasses: root.className,
    bodyClasses: body.className,
    bodyBg: computedStyle.backgroundColor,
    bodyColor: computedStyle.color,
    cssVarBgPrimary: getComputedStyle(root).getPropertyValue('--bg-primary').trim(),
    cssVarTextPrimary: getComputedStyle(root).getPropertyValue('--text-primary').trim(),
    isDarkRoot: root.classList.contains('dark'),
    isLightRoot: root.classList.contains('light'),
    isDarkModeBody: body.classList.contains('dark-mode'),
    isLightModeBody: body.classList.contains('light-mode'),
    savedTheme: loadTheme()
  };
  
  console.log('=== THEME DEBUG INFO ===');
  console.table(debugInfo);
  return debugInfo;
};

// Test function to quickly switch themes from console
export const testTheme = (theme) => {
  console.log(`Testing theme: ${theme}`);
  applyTheme(theme);
  setTimeout(() => {
    debugTheme();
  }, 100);
};

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  window.debugTheme = debugTheme;
  window.testTheme = testTheme;
  window.themeUtils = { applyTheme, loadTheme, saveTheme, initializeTheme };
}

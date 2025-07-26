// Simple test function to force dark mode
export const forceDarkMode = () => {
  console.log('🚨 FORCING DARK MODE...');
  
  const root = document.documentElement;
  const body = document.body;
  
  // Add classes
  root.classList.add('dark');
  body.classList.add('dark-mode');
  
  // Force inline styles as backup
  root.style.cssText = 'background-color: #0f172a !important; color: #f1f5f9 !important;';
  body.style.cssText = 'background-color: #0f172a !important; color: #f1f5f9 !important; margin: 0; padding: 0;';
  
  // Force all major containers
  const selectors = [
    '.bg-white', '.bg-gray-50', '.bg-slate-50', '.bg-gray-100', '.bg-slate-100',
    'div', 'main', 'section', 'article', 'nav', 'header', 'footer'
  ];
  
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (el.classList.contains('bg-white') || 
          el.classList.contains('bg-gray-50') || 
          el.classList.contains('bg-slate-50') ||
          el.classList.contains('bg-gray-100') ||
          el.classList.contains('bg-slate-100')) {
        el.style.cssText += 'background-color: #1e293b !important; color: #f1f5f9 !important;';
      }
    });
  });
  
  // Add a visible indicator
  const indicator = document.createElement('div');
  indicator.id = 'dark-mode-indicator';
  indicator.innerHTML = '🌙 DARK MODE FORCED';
  indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #ef4444;
    color: white;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: bold;
    z-index: 99999;
    border-radius: 6px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  `;
  
  // Remove existing indicator if present
  const existing = document.getElementById('dark-mode-indicator');
  if (existing) existing.remove();
  
  document.body.appendChild(indicator);
  
  console.log('✅ Dark mode FORCED! You should see a red indicator in the top-right corner.');
  
  return {
    rootClasses: root.className,
    bodyClasses: body.className,
    rootStyle: root.style.cssText,
    bodyStyle: body.style.cssText
  };
};

// Make it globally available
if (typeof window !== 'undefined') {
  window.forceDarkMode = forceDarkMode;
}

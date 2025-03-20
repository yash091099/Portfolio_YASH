// Theme Switcher - Handles theme switching functionality

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// Create custom event for theme changes
const themeChangedEvent = new Event('themeChanged');

// Function to set theme
const setTheme = (theme) => {
  // Set data-theme attribute on html element
  document.documentElement.setAttribute('data-theme', theme);
  
  // Save theme preference to localStorage
  localStorage.setItem('theme', theme);
  
  // Update icon based on theme
  if (theme === 'dark') {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  } else {
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  }
  
  // Dispatch custom event
  document.dispatchEvent(themeChangedEvent);
};

// Check for saved theme preference or use system preference
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (prefersDark) {
    setTheme('dark');
  } else {
    setTheme('light');
  }
};

// Toggle between light and dark themes
const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  setTheme(currentTheme === 'light' ? 'dark' : 'light');
  
  // Add animation class
  themeToggle.classList.add('rotate');
  
  // Remove animation class after animation completes
  setTimeout(() => {
    themeToggle.classList.remove('rotate');
  }, 300);
};

// Listen for theme toggle click
themeToggle.addEventListener('click', toggleTheme);

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    setTheme(e.matches ? 'dark' : 'light');
  }
});

// Apply theme animations
const applyThemeAnimations = () => {
  // Add transition class to body
  document.body.classList.add('theme-transition');
  
  // Add event listener for theme changed event
  document.addEventListener('themeChanged', () => {
    // Apply animation to all elements
    document.querySelectorAll('*').forEach(element => {
      element.classList.add('theme-transition');
    });
    
    // Remove animation classes after transition completes
    setTimeout(() => {
      document.querySelectorAll('*').forEach(element => {
        element.classList.remove('theme-transition');
      });
    }, 1000);
  });
};

// Update meta theme-color based on theme
const updateMetaThemeColor = () => {
  // Create meta tag if it doesn't exist
  let metaThemeColor = document.querySelector('meta[name="theme-color"]');
  
  if (!metaThemeColor) {
    metaThemeColor = document.createElement('meta');
    metaThemeColor.name = 'theme-color';
    document.head.appendChild(metaThemeColor);
  }
  
  // Update color based on theme
  document.addEventListener('themeChanged', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    metaThemeColor.content = theme === 'dark' ? '#0f172a' : '#f8f9fa';
  });
  
  // Set initial color
  const initialTheme = document.documentElement.getAttribute('data-theme');
  metaThemeColor.content = initialTheme === 'dark' ? '#0f172a' : '#f8f9fa';
};

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  applyThemeAnimations();
  updateMetaThemeColor();
});
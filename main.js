// Main application entry point
import { initializeApplication } from './uiController.js';

/**
 * Application initialization
 * This is the main entry point that starts the Weather Recipe Recommender app
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('🌟 Weather Recipe Recommender starting up...');
  
  try {
    // Initialize the main application
    initializeApplication();
    
    // Log successful startup
    console.log('✅ Application started successfully!');
    console.log('📋 Features available:');
    console.log('   • Weather-based recipe recommendations');
    console.log('   • Real-time weather data fetching');
    console.log('   • Intelligent recipe matching algorithm');
    console.log('   • User preference filtering');
    console.log('   • Detailed cooking instructions');
    console.log('   • Responsive design for all devices');
    
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    
    // Fallback error display
    document.querySelector('#app').innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 2rem;
        text-align: center;
        background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="
          background: white;
          padding: 3rem;
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          max-width: 500px;
        ">
          <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
          <h1 style="color: #dc2626; margin-bottom: 1rem;">Application Error</h1>
          <p style="color: #6b7280; margin-bottom: 2rem;">
            Sorry, there was an error starting the Weather Recipe Recommender. 
            Please refresh the page to try again.
          </p>
          <button 
            onclick="window.location.reload()" 
            style="
              background: #3b82f6;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              font-size: 1rem;
              cursor: pointer;
              transition: background 0.2s;
            "
            onmouseover="this.style.background='#2563eb'"
            onmouseout="this.style.background='#3b82f6'"
          >
            🔄 Refresh Page
          </button>
        </div>
      </div>
    `;
  }
});

/**
 * Global error handler for unhandled errors
 */
window.addEventListener('error', function(event) {
  console.error('🚨 Unhandled error:', event.error);
  
  // Could send error to monitoring service here
  // trackError(event.error);
});

/**
 * Global handler for unhandled promise rejections
 */
window.addEventListener('unhandledrejection', function(event) {
  console.error('🚨 Unhandled promise rejection:', event.reason);
  
  // Prevent the default browser behavior
  event.preventDefault();
  
  // Could send error to monitoring service here
  // trackError(event.reason);
});

/**
 * Service worker registration (if available)
 * This would enable offline functionality and caching
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    // Service worker could be implemented for offline functionality
    console.log('🔧 Service worker support detected (not implemented in this demo)');
  });
}

/**
 * Performance monitoring
 */
window.addEventListener('load', function() {
  // Log performance metrics
  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    
    console.log(`⚡ Page loaded in ${loadTime}ms`);
    
    // Log other performance metrics
    const domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
    const firstPaint = timing.responseEnd - timing.navigationStart;
    
    console.log(`📊 Performance metrics:`);
    console.log(`   • DOM Content Loaded: ${domContentLoaded}ms`);
    console.log(`   • First Paint: ${firstPaint}ms`);
    console.log(`   • Total Load Time: ${loadTime}ms`);
  }
});

/**
 * Keyboard shortcuts and accessibility
 */
document.addEventListener('keydown', function(event) {
  // Add keyboard shortcuts for better accessibility
  
  // Ctrl/Cmd + / to focus search input
  if ((event.ctrlKey || event.metaKey) && event.key === '/') {
    event.preventDefault();
    const cityInput = document.getElementById('city-input');
    if (cityInput && cityInput.style.display !== 'none') {
      cityInput.focus();
    }
  }
  
  // Escape key to clear form or go back
  if (event.key === 'Escape') {
    const resultsSection = document.getElementById('results-section');
    const errorSection = document.getElementById('error-section');
    
    if (resultsSection && resultsSection.style.display !== 'none') {
      // Go back to search form
      const newSearchButton = document.getElementById('new-search-button');
      if (newSearchButton) {
        newSearchButton.click();
      }
    } else if (errorSection && errorSection.style.display !== 'none') {
      // Go back to search form
      const retryButton = document.getElementById('retry-button');
      if (retryButton) {
        retryButton.click();
      }
    }
  }
});

/**
 * Theme detection and handling
 */
function detectAndApplyTheme() {
  // Detect user's preferred color scheme
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
  
  console.log(`🎨 Theme preferences detected:`);
  console.log(`   • Dark mode: ${prefersDark}`);
  console.log(`   • High contrast: ${prefersHighContrast}`);
  
  // Could apply theme classes here
  // document.body.classList.toggle('dark-theme', prefersDark);
  // document.body.classList.toggle('high-contrast', prefersHighContrast);
}

// Apply theme on load
detectAndApplyTheme();

// Listen for theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', detectAndApplyTheme);
window.matchMedia('(prefers-contrast: high)').addEventListener('change', detectAndApplyTheme);

/**
 * Network status monitoring
 */
function handleNetworkStatus() {
  const isOnline = navigator.onLine;
  console.log(`🌐 Network status: ${isOnline ? 'Online' : 'Offline'}`);
  
  if (!isOnline) {
    // Could show offline notification
    console.log('📱 Offline mode - some features may be limited');
  }
}

// Monitor network status
window.addEventListener('online', handleNetworkStatus);
window.addEventListener('offline', handleNetworkStatus);

// Check initial network status
handleNetworkStatus();

/**
 * Memory usage monitoring (for development)
 */
if (window.performance && window.performance.memory) {
  setInterval(() => {
    const memory = window.performance.memory;
    const used = Math.round(memory.usedJSHeapSize / 1048576 * 100) / 100;
    const total = Math.round(memory.totalJSHeapSize / 1048576 * 100) / 100;
    
    // Only log if memory usage is high (for development)
    if (used > 50) {
      console.log(`🧠 Memory usage: ${used}MB / ${total}MB`);
    }
  }, 30000); // Check every 30 seconds
}

/**
 * Export for testing purposes
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeApplication
  };
}
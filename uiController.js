// UI Controller - handles all DOM manipulation and user interactions
import { fetchWeatherDataForCity } from './weatherService.js';
import { analyzeWeatherAndRecommendRecipes } from './recipeEngine.js';
import { difficultyLevels } from './data.js';

/**
 * Initializes the application and sets up event listeners
 */
export function initializeApplication() {
  console.log('🚀 Initializing Weather Recipe App...');
  
  try {
    // Set up the main application structure
    setupApplicationLayout();
    
    // Bind event listeners
    bindEventListeners();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize accessibility features
    initializeAccessibilityFeatures();
    
    // Show welcome message
    displayWelcomeMessage();
    
    console.log('✅ Application initialized successfully');
    
  } catch (error) {
    console.error('❌ Error initializing application:', error);
    displayErrorMessage('Failed to initialize application. Please refresh the page.');
  }
}

/**
 * Sets up the main application layout and HTML structure
 */
function setupApplicationLayout() {
  const app = document.querySelector('#app');
  
  app.innerHTML = `
    <div class="weather-recipe-app">
      <!-- Skip to main content link for screen readers -->
      <a href="#main-content" class="skip-link">Skip to main content</a>
      
      <!-- Header Section -->
      <header class="app-header" role="banner">
        <div class="header-content">
          <h1 class="app-title" id="app-title">
            <span class="title-icon" aria-hidden="true">🌤️</span>
            Weather Recipe Recommender
            <span class="title-icon" aria-hidden="true">🍽️</span>
          </h1>
          <p class="app-subtitle">Get personalized recipe recommendations based on your local weather</p>
        </div>
      </header>

      <!-- Main Content -->
      <main class="app-main" id="main-content" role="main">
        <!-- Live region for screen reader announcements -->
        <div id="live-region" class="sr-only" aria-live="polite" aria-atomic="true"></div>
        
        <!-- Input Form Section -->
        <section class="input-section" id="input-section" aria-labelledby="form-heading">
          <div class="form-container">
            <h2 class="section-title" id="form-heading">Tell us about your preferences</h2>
            
            <form id="weather-form" class="weather-form" role="form" aria-describedby="form-description">
              <p id="form-description" class="form-description">
                Enter your city and preferences to get weather-based recipe recommendations.
              </p>
              
              <div class="form-group">
                <label for="city-input" class="form-label">
                  <span class="label-icon" aria-hidden="true">📍</span>
                  Your City
                  <span class="required-indicator" aria-label="required">*</span>
                </label>
                <input 
                  type="text" 
                  id="city-input" 
                  name="city"
                  class="form-input"
                  placeholder="Enter your city name (e.g., New York, London, Tokyo)"
                  required
                  autocomplete="address-level2"
                  aria-describedby="city-help city-error"
                  aria-invalid="false"
                >
                <div id="city-help" class="input-help">We'll check the weather in your city to recommend perfect recipes</div>
                <div id="city-error" class="error-message" role="alert" aria-live="polite"></div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="cooking-time" class="form-label">
                    <span class="label-icon" aria-hidden="true">⏱️</span>
                    Maximum Cooking Time
                  </label>
                  <select id="cooking-time" name="maxCookingTime" class="form-select" aria-describedby="time-help">
                    <option value="">Any duration</option>
                    <option value="15">15 minutes or less</option>
                    <option value="30">30 minutes or less</option>
                    <option value="60">1 hour or less</option>
                    <option value="120">2 hours or less</option>
                  </select>
                  <div id="time-help" class="input-help">Optional: Limit recipes by cooking time</div>
                </div>

                <div class="form-group">
                  <label for="difficulty" class="form-label">
                    <span class="label-icon" aria-hidden="true">👨‍🍳</span>
                    Cooking Difficulty Level
                  </label>
                  <select id="difficulty" name="difficulty" class="form-select" aria-describedby="difficulty-help">
                    <option value="">Any difficulty</option>
                    <option value="easy">Easy - Simple preparation</option>
                    <option value="medium">Medium - Some experience needed</option>
                    <option value="hard">Hard - Advanced techniques</option>
                  </select>
                  <div id="difficulty-help" class="input-help">Optional: Choose your comfort level</div>
                </div>
              </div>

              <button type="submit" class="submit-button" id="submit-button" aria-describedby="submit-help">
                <span class="button-icon" aria-hidden="true">🔍</span>
                Find Perfect Recipes
                <span class="button-loading" id="button-loading" aria-hidden="true">
                  <span class="loading-spinner" aria-hidden="true"></span>
                  Analyzing weather...
                </span>
              </button>
              <div id="submit-help" class="input-help">Press Enter or click to get your personalized recipe recommendations</div>
            </form>
          </div>
        </section>

        <!-- Results Section -->
        <section class="results-section" id="results-section" style="display: none;" aria-labelledby="results-heading">
          <div class="results-container">
            <h2 id="results-heading" class="sr-only">Recipe Recommendations Results</h2>
            
            <!-- Weather Info will be inserted here -->
            <div id="weather-info" class="weather-info" role="region" aria-labelledby="weather-heading"></div>
            
            <!-- Recipe Recommendations will be inserted here -->
            <div id="recipe-recommendations" class="recipe-recommendations" role="region" aria-labelledby="recommendations-heading"></div>
            
            <!-- New Search Button -->
            <div class="new-search-container">
              <button id="new-search-button" class="new-search-button" aria-describedby="new-search-help">
                <span class="button-icon" aria-hidden="true">🔄</span>
                Search Another City
              </button>
              <div id="new-search-help" class="input-help">Return to the search form to try a different city</div>
            </div>
          </div>
        </section>

        <!-- Loading Section -->
        <section class="loading-section" id="loading-section" style="display: none;" aria-labelledby="loading-heading" role="status" aria-live="polite">
          <div class="loading-container">
            <div class="loading-animation">
              <div class="loading-spinner-large" aria-hidden="true"></div>
            </div>
            <h3 class="loading-title" id="loading-heading">Analyzing Your Weather</h3>
            <p class="loading-message" id="loading-message">Fetching weather data...</p>
            <div class="loading-steps" role="progressbar" aria-labelledby="loading-heading" aria-describedby="loading-message">
              <div class="loading-step" id="step-weather">
                <span class="step-icon" aria-hidden="true">🌤️</span>
                <span class="step-text">Getting weather data</span>
                <span class="step-status" aria-label="Status">⏳</span>
              </div>
              <div class="loading-step" id="step-analysis">
                <span class="step-icon" aria-hidden="true">🧠</span>
                <span class="step-text">Analyzing conditions</span>
                <span class="step-status" aria-label="Status">⏳</span>
              </div>
              <div class="loading-step" id="step-recipes">
                <span class="step-icon" aria-hidden="true">🍽️</span>
                <span class="step-text">Finding perfect recipes</span>
                <span class="step-status" aria-label="Status">⏳</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Error Section -->
        <section class="error-section" id="error-section" style="display: none;" aria-labelledby="error-heading" role="alert">
          <div class="error-container">
            <div class="error-icon" aria-hidden="true">⚠️</div>
            <h3 class="error-title" id="error-heading">Oops! Something went wrong</h3>
            <p class="error-message" id="error-message"></p>
            <button id="retry-button" class="retry-button">
              <span class="button-icon" aria-hidden="true">🔄</span>
              Try Again
            </button>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer class="app-footer" role="contentinfo">
        <p class="footer-text">
          Powered by weather data and culinary expertise • 
          <span class="footer-highlight">Made with ❤️ for food lovers</span>
        </p>
      </footer>
    </div>
  `;
}

/**
 * Initializes accessibility features
 */
function initializeAccessibilityFeatures() {
  // Set up focus management
  setupFocusManagement();
  
  // Set up keyboard navigation
  setupKeyboardNavigation();
  
  // Set up screen reader announcements
  setupScreenReaderAnnouncements();
  
  // Set up high contrast detection
  setupHighContrastSupport();
}

/**
 * Sets up focus management for better keyboard navigation
 */
function setupFocusManagement() {
  // Ensure skip link works
  const skipLink = document.querySelector('.skip-link');
  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    mainContent.focus();
    mainContent.scrollIntoView({ behavior: 'smooth' });
  });
  
  // Focus management for form submission
  const form = document.getElementById('weather-form');
  form.addEventListener('submit', () => {
    // Move focus to loading section when form is submitted
    setTimeout(() => {
      const loadingSection = document.getElementById('loading-section');
      if (loadingSection.style.display !== 'none') {
        loadingSection.focus();
      }
    }, 100);
  });
}

/**
 * Sets up keyboard navigation enhancements
 */
function setupKeyboardNavigation() {
  // Enhanced keyboard support for recipe cards
  document.addEventListener('keydown', (e) => {
    // Arrow key navigation for recipe cards
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const focusedElement = document.activeElement;
      if (focusedElement.classList.contains('recipe-card')) {
        e.preventDefault();
        const cards = Array.from(document.querySelectorAll('.recipe-card[tabindex="0"]'));
        const currentIndex = cards.indexOf(focusedElement);
        
        let nextIndex;
        if (e.key === 'ArrowDown') {
          nextIndex = (currentIndex + 1) % cards.length;
        } else {
          nextIndex = (currentIndex - 1 + cards.length) % cards.length;
        }
        
        cards[nextIndex].focus();
      }
    }
  });
}

/**
 * Sets up screen reader announcements
 */
function setupScreenReaderAnnouncements() {
  // Function to announce messages to screen readers
  window.announceToScreenReader = function(message, priority = 'polite') {
    const liveRegion = document.getElementById('live-region');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  };
}

/**
 * Sets up high contrast support
 */
function setupHighContrastSupport() {
  // Detect high contrast mode
  const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
  
  function handleHighContrast(e) {
    document.body.classList.toggle('high-contrast', e.matches);
    if (e.matches) {
      announceToScreenReader('High contrast mode detected and applied');
    }
  }
  
  // Apply on load and listen for changes
  handleHighContrast(highContrastQuery);
  highContrastQuery.addEventListener('change', handleHighContrast);
}

/**
 * Binds event listeners to form elements and buttons
 */
function bindEventListeners() {
  // Main form submission
  const form = document.getElementById('weather-form');
  form.addEventListener('submit', handleFormSubmission);
  
  // New search button
  const newSearchButton = document.getElementById('new-search-button');
  newSearchButton.addEventListener('click', handleNewSearchRequest);
  
  // Retry button
  const retryButton = document.getElementById('retry-button');
  retryButton.addEventListener('click', handleRetryRequest);
  
  // City input auto-suggestions (could be enhanced)
  const cityInput = document.getElementById('city-input');
  cityInput.addEventListener('input', handleCityInputChange);
  
  // Form validation on input change
  const formInputs = form.querySelectorAll('input, select');
  formInputs.forEach(input => {
    input.addEventListener('change', validateFormInput);
    input.addEventListener('blur', validateFormInput);
  });
}

/**
 * Initializes form validation
 */
function initializeFormValidation() {
  const cityInput = document.getElementById('city-input');
  
  // Add real-time validation
  cityInput.addEventListener('blur', function() {
    validateCityInput(this.value);
  });
}

/**
 * Displays welcome message and instructions
 */
function displayWelcomeMessage() {
  console.log('👋 Welcome to Weather Recipe Recommender!');
  
  // Announce welcome to screen readers
  setTimeout(() => {
    announceToScreenReader('Welcome to Weather Recipe Recommender. Enter your city to get personalized recipe recommendations based on your local weather.');
  }, 1000);
  
  // Add animation
  const appTitle = document.querySelector('.app-title');
  appTitle.style.animation = 'fadeInScale 0.8s ease-out';
}

/**
 * Handles form submission and starts the recipe recommendation process
 * @param {Event} event - Form submission event
 */
async function handleFormSubmission(event) {
  event.preventDefault();
  
  console.log('📝 Form submitted, starting recommendation process...');
  announceToScreenReader('Form submitted. Getting weather data and recipe recommendations.');
  
  try {
    // Extract form data
    const formData = extractFormData(event.target);
    
    // Validate form data
    if (!validateFormData(formData)) {
      return;
    }
    
    // Show loading state
    showLoadingState();
    
    // Start the recommendation process
    await processWeatherAndRecipeRecommendation(formData);
    
  } catch (error) {
    console.error('❌ Error in form submission:', error);
    showErrorState('An unexpected error occurred. Please try again.');
  }
}

/**
 * Extracts and structures form data
 * @param {HTMLFormElement} form - The form element
 * @returns {Object} Structured form data
 */
function extractFormData(form) {
  const formData = new FormData(form);
  
  return {
    city: formData.get('city')?.trim(),
    maxCookingTime: formData.get('maxCookingTime'),
    difficulty: formData.get('difficulty'),
    timestamp: new Date().toISOString()
  };
}

/**
 * Validates form data before processing
 * @param {Object} formData - Form data to validate
 * @returns {boolean} Whether form data is valid
 */
function validateFormData(formData) {
  if (!formData.city || formData.city.length < 2) {
    showValidationError('city-input', 'Please enter a valid city name with at least 2 characters');
    announceToScreenReader('Error: Please enter a valid city name', 'assertive');
    return false;
  }
  
  if (formData.city.length > 100) {
    showValidationError('city-input', 'City name is too long. Please enter a shorter name.');
    announceToScreenReader('Error: City name is too long', 'assertive');
    return false;
  }
  
  // Clear any existing validation errors
  clearValidationErrors();
  
  return true;
}

/**
 * Main process that coordinates weather fetching and recipe recommendation
 * @param {Object} formData - User form data
 */
async function processWeatherAndRecipeRecommendation(formData) {
  try {
    console.log('🌤️ Starting weather and recipe recommendation process...');
    
    // Step 1: Update loading state
    updateLoadingStep('step-weather', 'active', 'Fetching weather data...');
    announceToScreenReader('Getting weather data for ' + formData.city);
    
    // Step 2: Fetch weather data
    const weatherData = await fetchWeatherDataForCity(formData.city);
    updateLoadingStep('step-weather', 'complete', 'Weather data retrieved!');
    announceToScreenReader('Weather data received. Analyzing conditions.');
    
    // Step 3: Analyze weather and get recommendations
    updateLoadingStep('step-analysis', 'active', 'Analyzing weather conditions...');
    
    const recommendationResult = analyzeWeatherAndRecommendRecipes(weatherData, formData);
    updateLoadingStep('step-analysis', 'complete', 'Analysis complete!');
    announceToScreenReader('Weather analysis complete. Finding matching recipes.');
    
    // Step 4: Generate recipe recommendations
    updateLoadingStep('step-recipes', 'active', 'Finding perfect recipes...');
    
    // Add weather location info
    weatherData.location = formData.city;
    
    updateLoadingStep('step-recipes', 'complete', 'Recipes found!');
    announceToScreenReader(`Found ${recommendationResult.recommendations.length} recipe recommendations`);
    
    // Step 5: Display results
    await displayRecommendationResults(weatherData, recommendationResult, formData);
    
    console.log('✅ Recommendation process completed successfully');
    
  } catch (error) {
    console.error('❌ Error in recommendation process:', error);
    showErrorState(`Failed to get recommendations for ${formData.city}. Please check the city name and try again.`);
    announceToScreenReader('Error getting recommendations. Please try again.', 'assertive');
  }
}

/**
 * Displays the final recommendation results
 * @param {Object} weatherData - Weather information
 * @param {Object} recommendationResult - Recipe recommendations
 * @param {Object} formData - Original form data
 */
async function displayRecommendationResults(weatherData, recommendationResult, formData) {
  // Hide loading section
  hideLoadingState();
  
  // Show results section
  showResultsSection();
  
  // Display weather information
  displayWeatherInformation(weatherData);
  
  // Display recipe recommendations
  displayRecipeRecommendations(recommendationResult, weatherData);
  
  // Announce results to screen readers
  const recipeCount = recommendationResult.recommendations.length;
  announceToScreenReader(`Results ready. Found ${recipeCount} recipe recommendations for ${weatherData.description.toLowerCase()} weather in ${weatherData.location}.`);
  
  // Scroll to results and focus
  scrollToResults();
}

/**
 * Displays weather information in the results section
 * @param {Object} weatherData - Weather data to display
 */
function displayWeatherInformation(weatherData) {
  const weatherInfoContainer = document.getElementById('weather-info');
  
  const weatherHtml = `
    <div class="weather-card" role="region" aria-labelledby="weather-heading">
      <div class="weather-header">
        <h3 class="weather-title" id="weather-heading">
          <span class="weather-icon" aria-hidden="true">${getWeatherIcon(weatherData.condition)}</span>
          Current Weather in ${weatherData.location}
        </h3>
        ${weatherData.isMockData ? '<span class="demo-badge" aria-label="Using demo data">Demo Data</span>' : ''}
      </div>
      
      <div class="weather-details">
        <div class="weather-main">
          <div class="temperature">
            <span class="temp-value" aria-label="${weatherData.temperature.celsius} degrees celsius">${weatherData.temperature.celsius}°C</span>
            <span class="temp-alt" aria-label="${weatherData.temperature.fahrenheit} degrees fahrenheit">(${weatherData.temperature.fahrenheit}°F)</span>
          </div>
          <div class="condition">
            <span class="condition-text">${weatherData.description}</span>
          </div>
        </div>
        
        <div class="weather-extras">
          <div class="weather-stat">
            <span class="stat-icon" aria-hidden="true">💧</span>
            <span class="stat-label">Humidity</span>
            <span class="stat-value" aria-label="${weatherData.humidity} percent humidity">${weatherData.humidity}%</span>
          </div>
          <div class="weather-stat">
            <span class="stat-icon" aria-hidden="true">💨</span>
            <span class="stat-label">Wind Speed</span>
            <span class="stat-value" aria-label="${weatherData.windSpeed} kilometers per hour">${weatherData.windSpeed} km/h</span>
          </div>
        </div>
      </div>
    </div>
  `;
  
  weatherInfoContainer.innerHTML = weatherHtml;
}

/**
 * Displays recipe recommendations
 * @param {Object} recommendationResult - Recipe recommendation results
 * @param {Object} weatherData - Weather data for context
 */
function displayRecipeRecommendations(recommendationResult, weatherData) {
  const recommendationsContainer = document.getElementById('recipe-recommendations');
  
  if (!recommendationResult.recommendations || recommendationResult.recommendations.length === 0) {
    recommendationsContainer.innerHTML = `
      <div class="no-recommendations" role="region" aria-labelledby="no-results-heading">
        <div class="no-recommendations-icon" aria-hidden="true">🤔</div>
        <h3 id="no-results-heading">No specific recommendations found</h3>
        <p>We couldn't find recipes that perfectly match your current weather conditions, but any of our recipes would be delicious!</p>
      </div>
    `;
    return;
  }
  
  const recommendationsHtml = `
    <div class="recommendations-header">
      <h3 class="recommendations-title" id="recommendations-heading">
        <span class="title-icon" aria-hidden="true">🍽️</span>
        Perfect Recipes for Today's Weather
      </h3>
      <p class="recommendations-subtitle">
        Based on ${weatherData.description.toLowerCase()} in ${weatherData.location}, 
        here are our top ${recommendationResult.recommendations.length} recommendations:
      </p>
    </div>
    
    <div class="recipe-grid" role="list" aria-labelledby="recommendations-heading">
      ${recommendationResult.recommendations.map((recipe, index) => generateRecipeCard(recipe, index)).join('')}
    </div>
    
    <div class="analysis-summary" role="region" aria-labelledby="summary-heading">
      <h4 class="summary-title" id="summary-heading">Analysis Summary</h4>
      <div class="summary-stats">
        <div class="summary-stat">
          <span class="stat-number" aria-label="${recommendationResult.totalRecipesConsidered} recipes analyzed">${recommendationResult.totalRecipesConsidered}</span>
          <span class="stat-label">Recipes Analyzed</span>
        </div>
        <div class="summary-stat">
          <span class="stat-number" aria-label="${recommendationResult.weatherMatchedCount} weather matches">${recommendationResult.weatherMatchedCount}</span>
          <span class="stat-label">Weather Matches</span>
        </div>
        <div class="summary-stat">
          <span class="stat-number" aria-label="${recommendationResult.finalRecommendationCount} top picks">${recommendationResult.finalRecommendationCount}</span>
          <span class="stat-label">Top Picks</span>
        </div>
      </div>
    </div>
  `;
  
  recommendationsContainer.innerHTML = recommendationsHtml;
  
  // Make recipe cards focusable for keyboard navigation
  const recipeCards = document.querySelectorAll('.recipe-card');
  recipeCards.forEach((card, index) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'listitem');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Could expand recipe details or perform other actions
        announceToScreenReader(`Selected recipe: ${card.querySelector('.recipe-name').textContent}`);
      }
    });
  });
}

/**
 * Generates HTML for a single recipe card
 * @param {Object} recipe - Recipe with recommendation data
 * @param {number} index - Recipe index for accessibility
 * @returns {string} HTML string for recipe card
 */
function generateRecipeCard(recipe, index) {
  const confidenceClass = `confidence-${recipe.recommendation.confidenceLevel}`;
  const difficultyInfo = difficultyLevels[recipe.difficulty] || 'Standard preparation';
  
  return `
    <div class="recipe-card ${confidenceClass}" aria-labelledby="recipe-${index}-name" aria-describedby="recipe-${index}-description">
      <div class="recipe-header">
        <div class="recipe-rank">
          <span class="rank-number" aria-label="Rank ${recipe.recommendation.rank}">#${recipe.recommendation.rank}</span>
          <span class="confidence-indicator" aria-label="Confidence level: ${recipe.recommendation.confidenceLevel}" title="Confidence: ${recipe.recommendation.confidenceLevel}">
            ${getConfidenceIcon(recipe.recommendation.confidenceLevel)}
          </span>
        </div>
        <h4 class="recipe-name" id="recipe-${index}-name">${recipe.name}</h4>
        <div class="recipe-meta">
          <span class="recipe-time">
            <span class="meta-icon" aria-hidden="true">⏱️</span>
            <span aria-label="${recipe.cookingTime} minutes cooking time">${recipe.cookingTime} min</span>
          </span>
          <span class="recipe-difficulty">
            <span class="meta-icon" aria-hidden="true">👨‍🍳</span>
            <span aria-label="Difficulty level: ${recipe.difficulty}">${recipe.difficulty}</span>
          </span>
        </div>
      </div>
      
      <div class="recipe-content">
        <div class="recipe-description" id="recipe-${index}-description">
          <p>${recipe.description}</p>
        </div>
        
        <div class="recommendation-reasoning" role="region" aria-labelledby="reasoning-${index}-title">
          <h5 class="reasoning-title" id="reasoning-${index}-title">Why this recipe?</h5>
          <p class="reasoning-text">${recipe.recommendation.reasoning}</p>
        </div>
        
        <div class="recipe-details">
          <div class="recipe-section" role="region" aria-labelledby="ingredients-${index}-title">
            <h6 class="section-title" id="ingredients-${index}-title">Ingredients (${recipe.ingredients.length} items)</h6>
            <ul class="ingredients-list" aria-labelledby="ingredients-${index}-title">
              ${recipe.ingredients.slice(0, 5).map(ingredient => `<li>${ingredient}</li>`).join('')}
              ${recipe.ingredients.length > 5 ? `<li class="more-ingredients">... and ${recipe.ingredients.length - 5} more ingredients</li>` : ''}
            </ul>
          </div>
          
          <div class="recipe-section" role="region" aria-labelledby="instructions-${index}-title">
            <h6 class="section-title" id="instructions-${index}-title">Instructions</h6>
            <ol class="instructions-list" aria-labelledby="instructions-${index}-title">
              ${recipe.instructions.slice(0, 3).map(instruction => `<li>${instruction}</li>`).join('')}
              ${recipe.instructions.length > 3 ? `<li class="more-instructions">... ${recipe.instructions.length - 3} more steps</li>` : ''}
            </ol>
          </div>
          
          <div class="recipe-highlights" role="region" aria-labelledby="highlights-${index}-title">
            <h6 class="section-title" id="highlights-${index}-title">Nutrition Highlights</h6>
            <div class="highlights-tags" role="list" aria-labelledby="highlights-${index}-title">
              ${recipe.nutritionHighlights.map(highlight => `<span class="highlight-tag" role="listitem">${highlight}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
      
      <div class="recipe-footer">
        <div class="difficulty-info">
          <span class="info-icon" aria-hidden="true">ℹ️</span>
          <span class="info-text">${difficultyInfo}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Helper functions for UI elements
 */

function getWeatherIcon(condition) {
  const icons = {
    'clear': '☀️',
    'sunny': '🌞',
    'partly-cloudy': '⛅',
    'cloudy': '☁️',
    'overcast': '☁️',
    'rainy': '🌧️',
    'drizzle': '🌦️',
    'snow': '❄️',
    'fog': '🌫️'
  };
  return icons[condition] || '🌤️';
}

function getConfidenceIcon(level) {
  const icons = {
    'very-high': '🎯',
    'high': '✅',
    'medium': '👍',
    'low': '👌',
    'very-low': '🤷'
  };
  return icons[level] || '👍';
}

/**
 * UI State Management Functions
 */

function showLoadingState() {
  document.getElementById('input-section').style.display = 'none';
  document.getElementById('results-section').style.display = 'none';
  document.getElementById('error-section').style.display = 'none';
  document.getElementById('loading-section').style.display = 'block';
  
  // Reset loading steps
  resetLoadingSteps();
  
  // Focus on loading section for screen readers
  setTimeout(() => {
    document.getElementById('loading-section').focus();
  }, 100);
}

function hideLoadingState() {
  document.getElementById('loading-section').style.display = 'none';
}

function showResultsSection() {
  document.getElementById('results-section').style.display = 'block';
}

function showErrorState(message) {
  document.getElementById('loading-section').style.display = 'none';
  document.getElementById('results-section').style.display = 'none';
  document.getElementById('error-section').style.display = 'block';
  document.getElementById('error-message').textContent = message;
  
  // Focus on error section
  setTimeout(() => {
    document.getElementById('error-section').focus();
  }, 100);
}

function updateLoadingStep(stepId, status, message) {
  const step = document.getElementById(stepId);
  const statusElement = step.querySelector('.step-status');
  
  // Remove existing status classes
  step.classList.remove('active', 'complete');
  
  if (status === 'active') {
    step.classList.add('active');
    statusElement.textContent = '⏳';
    statusElement.setAttribute('aria-label', 'In progress');
  } else if (status === 'complete') {
    step.classList.add('complete');
    statusElement.textContent = '✅';
    statusElement.setAttribute('aria-label', 'Complete');
  }
  
  // Update loading message
  if (message) {
    document.getElementById('loading-message').textContent = message;
  }
}

function resetLoadingSteps() {
  const steps = document.querySelectorAll('.loading-step');
  steps.forEach(step => {
    step.classList.remove('active', 'complete');
    const statusElement = step.querySelector('.step-status');
    statusElement.textContent = '⏳';
    statusElement.setAttribute('aria-label', 'Waiting');
  });
}

function scrollToResults() {
  const resultsSection = document.getElementById('results-section');
  resultsSection.scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
  
  // Focus on results heading for screen readers
  setTimeout(() => {
    const resultsHeading = document.getElementById('results-heading');
    if (resultsHeading) {
      resultsHeading.focus();
    }
  }, 500);
}

/**
 * Event Handlers
 */

function handleNewSearchRequest() {
  // Reset to input form
  document.getElementById('results-section').style.display = 'none';
  document.getElementById('error-section').style.display = 'none';
  document.getElementById('input-section').style.display = 'block';
  
  // Clear form
  document.getElementById('weather-form').reset();
  
  // Focus on city input
  const cityInput = document.getElementById('city-input');
  cityInput.focus();
  
  // Announce to screen readers
  announceToScreenReader('Returned to search form. Enter a new city to get recommendations.');
  
  // Scroll to top
  document.getElementById('input-section').scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
}

function handleRetryRequest() {
  // Hide error and show input form
  document.getElementById('error-section').style.display = 'none';
  document.getElementById('input-section').style.display = 'block';
  
  // Focus on city input
  const cityInput = document.getElementById('city-input');
  cityInput.focus();
  
  announceToScreenReader('Returned to search form. Please try again.');
}

function handleCityInputChange(event) {
  // Could implement auto-suggestions here
  const value = event.target.value;
  if (value.length > 2) {
    // Potential for city auto-complete
    console.log(`City input: ${value}`);
  }
}

function validateFormInput(event) {
  // Real-time form validation
  const input = event.target;
  if (input.name === 'city') {
    validateCityInput(input.value);
  }
}

function validateCityInput(value) {
  const input = document.getElementById('city-input');
  const isValid = value && value.trim().length >= 2;
  
  if (!isValid && value.length > 0) {
    showValidationError('city-input', 'Please enter at least 2 characters');
  } else {
    clearValidationError('city-input');
  }
  
  return isValid;
}

function showValidationError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorContainer = document.getElementById(`${inputId.replace('-input', '-error')}`);
  
  input.classList.add('error');
  input.setAttribute('aria-invalid', 'true');
  
  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
  }
}

function clearValidationError(inputId) {
  const input = document.getElementById(inputId);
  const errorContainer = document.getElementById(`${inputId.replace('-input', '-error')}`);
  
  input.classList.remove('error');
  input.setAttribute('aria-invalid', 'false');
  
  if (errorContainer) {
    errorContainer.textContent = '';
    errorContainer.style.display = 'none';
  }
}

function clearValidationErrors() {
  const errorInputs = document.querySelectorAll('.form-input.error');
  errorInputs.forEach(input => {
    input.classList.remove('error');
    input.setAttribute('aria-invalid', 'false');
  });
  
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach(message => {
    message.textContent = '';
    message.style.display = 'none';
  });
}

function displayErrorMessage(message) {
  showErrorState(message);
}
// Recipe recommendation engine
import { recipeDatabase, weatherMoodMap, seasonalPreferences } from './data.js';
import { categorizeTemperature, getCurrentSeason } from './weatherService.js';

/**
 * Main function to analyze weather and recommend recipes
 * @param {Object} weatherData - Weather information from API
 * @param {Object} userPreferences - User preferences from form
 * @returns {Object} Recipe recommendations with reasoning
 */
export function analyzeWeatherAndRecommendRecipes(weatherData, userPreferences = {}) {
  console.log('🧠 Starting recipe analysis...');
  console.log('Weather data:', weatherData);
  console.log('User preferences:', userPreferences);
  
  try {
    // Step 1: Analyze weather conditions
    const weatherAnalysis = analyzeWeatherConditions(weatherData);
    
    // Step 2: Filter recipes based on weather
    const weatherMatchedRecipes = filterRecipesByWeather(weatherAnalysis);
    
    // Step 3: Apply user preferences
    const personalizedRecipes = applyUserPreferences(weatherMatchedRecipes, userPreferences);
    
    // Step 4: Rank and select top recommendations
    const rankedRecipes = rankRecipesByRelevance(personalizedRecipes, weatherAnalysis, userPreferences);
    
    // Step 5: Generate recommendation reasoning
    const recommendations = generateRecommendationReasons(rankedRecipes, weatherAnalysis);
    
    console.log('✅ Recipe analysis complete');
    
    return {
      weatherAnalysis,
      recommendations,
      totalRecipesConsidered: recipeDatabase.length,
      weatherMatchedCount: weatherMatchedRecipes.length,
      finalRecommendationCount: recommendations.length
    };
    
  } catch (error) {
    console.error('❌ Error in recipe analysis:', error);
    return generateFallbackRecommendations(weatherData);
  }
}

/**
 * Analyzes weather conditions to determine cooking preferences
 * @param {Object} weatherData - Weather information
 * @returns {Object} Weather analysis with cooking implications
 */
function analyzeWeatherConditions(weatherData) {
  const tempCategory = categorizeTemperature(weatherData.temperature.celsius);
  const condition = weatherData.condition;
  const season = getCurrentSeason();
  
  // Determine mood categories based on weather
  const moodCategories = [];
  
  // Add moods based on condition
  if (weatherMoodMap[condition]) {
    moodCategories.push(...weatherMoodMap[condition]);
  }
  
  // Add moods based on temperature
  if (weatherMoodMap[tempCategory]) {
    moodCategories.push(...weatherMoodMap[tempCategory]);
  }
  
  // Remove duplicates
  const uniqueMoods = [...new Set(moodCategories)];
  
  // Determine cooking motivation
  const cookingMotivation = determineCookingMotivation(weatherData, tempCategory, condition);
  
  // Assess comfort food need
  const comfortFoodNeed = assessComfortFoodNeed(weatherData, condition);
  
  return {
    temperature: {
      value: weatherData.temperature.celsius,
      category: tempCategory,
      fahrenheit: weatherData.temperature.fahrenheit
    },
    condition: condition,
    season: season,
    moodCategories: uniqueMoods,
    cookingMotivation: cookingMotivation,
    comfortFoodNeed: comfortFoodNeed,
    weatherDescription: weatherData.description,
    analysisTimestamp: new Date().toISOString()
  };
}

/**
 * Determines cooking motivation based on weather
 * @param {Object} weatherData - Weather information
 * @param {string} tempCategory - Temperature category
 * @param {string} condition - Weather condition
 * @returns {Object} Cooking motivation analysis
 */
function determineCookingMotivation(weatherData, tempCategory, condition) {
  let motivation = 'moderate';
  let reasons = [];
  
  // Cold weather increases cooking motivation
  if (tempCategory === 'cold') {
    motivation = 'high';
    reasons.push('Cold weather makes warm, cooked meals more appealing');
  }
  
  // Hot weather decreases cooking motivation
  if (tempCategory === 'hot') {
    motivation = 'low';
    reasons.push('Hot weather makes people prefer minimal cooking');
  }
  
  // Rainy/gloomy weather increases comfort cooking
  if (['rainy', 'drizzle', 'overcast', 'cloudy'].includes(condition)) {
    motivation = motivation === 'low' ? 'moderate' : 'high';
    reasons.push('Gloomy weather increases desire for comfort cooking');
  }
  
  // Sunny weather promotes lighter cooking
  if (['clear', 'sunny'].includes(condition)) {
    reasons.push('Nice weather encourages fresh, light meal preparation');
  }
  
  return {
    level: motivation,
    reasons: reasons
  };
}

/**
 * Assesses the need for comfort food based on weather
 * @param {Object} weatherData - Weather information
 * @param {string} condition - Weather condition
 * @returns {Object} Comfort food need assessment
 */
function assessComfortFoodNeed(weatherData, condition) {
  let needLevel = 'low';
  let factors = [];
  
  // Temperature factor
  if (weatherData.temperature.celsius < 10) {
    needLevel = 'high';
    factors.push('Very cold temperature increases comfort food craving');
  } else if (weatherData.temperature.celsius < 20) {
    needLevel = 'moderate';
    factors.push('Cool temperature moderately increases comfort food appeal');
  }
  
  // Weather condition factor
  if (['rainy', 'drizzle', 'snow', 'fog'].includes(condition)) {
    needLevel = needLevel === 'low' ? 'moderate' : 'high';
    factors.push('Dreary weather conditions increase comfort food desire');
  }
  
  // Humidity factor (if available)
  if (weatherData.humidity && weatherData.humidity > 80) {
    factors.push('High humidity may affect food preferences');
  }
  
  return {
    level: needLevel,
    factors: factors
  };
}

/**
 * Filters recipes based on weather analysis
 * @param {Object} weatherAnalysis - Weather analysis results
 * @returns {Array} Filtered recipes
 */
function filterRecipesByWeather(weatherAnalysis) {
  const { temperature, condition, moodCategories } = weatherAnalysis;
  
  return recipeDatabase.filter(recipe => {
    // Check if recipe matches weather conditions
    const matchesCondition = recipe.weatherTypes.includes(condition);
    
    // Check if recipe matches temperature category
    const matchesTemperature = recipe.temperature === temperature.category;
    
    // Check if recipe category matches mood
    const matchesMood = moodCategories.includes(recipe.category);
    
    // Recipe passes if it matches any of the criteria
    return matchesCondition || matchesTemperature || matchesMood;
  });
}

/**
 * Applies user preferences to filter recipes
 * @param {Array} recipes - Filtered recipes from weather analysis
 * @param {Object} userPreferences - User preferences from form
 * @returns {Array} Recipes filtered by user preferences
 */
function applyUserPreferences(recipes, userPreferences) {
  if (!userPreferences || Object.keys(userPreferences).length === 0) {
    return recipes;
  }
  
  return recipes.filter(recipe => {
    // Filter by cooking time preference
    if (userPreferences.maxCookingTime) {
      const maxTime = parseInt(userPreferences.maxCookingTime);
      if (recipe.cookingTime > maxTime) {
        return false;
      }
    }
    
    // Filter by difficulty preference
    if (userPreferences.difficulty) {
      if (recipe.difficulty !== userPreferences.difficulty) {
        return false;
      }
    }
    
    // Filter by dietary restrictions (if implemented)
    if (userPreferences.dietary) {
      // This could be expanded based on recipe tags
      // For now, we'll keep all recipes
    }
    
    return true;
  });
}

/**
 * Ranks recipes by relevance to weather and preferences
 * @param {Array} recipes - Filtered recipes
 * @param {Object} weatherAnalysis - Weather analysis
 * @param {Object} userPreferences - User preferences
 * @returns {Array} Ranked recipes
 */
function rankRecipesByRelevance(recipes, weatherAnalysis, userPreferences) {
  const scoredRecipes = recipes.map(recipe => {
    let score = 0;
    let scoreReasons = [];
    
    // Score based on weather condition match
    if (recipe.weatherTypes.includes(weatherAnalysis.condition)) {
      score += 10;
      scoreReasons.push(`Perfect match for ${weatherAnalysis.condition} weather`);
    }
    
    // Score based on temperature match
    if (recipe.temperature === weatherAnalysis.temperature.category) {
      score += 8;
      scoreReasons.push(`Ideal for ${weatherAnalysis.temperature.category} temperatures`);
    }
    
    // Score based on mood category match
    if (weatherAnalysis.moodCategories.includes(recipe.category)) {
      score += 6;
      scoreReasons.push(`Matches your weather mood for ${recipe.category} food`);
    }
    
    // Score based on comfort food need
    if (weatherAnalysis.comfortFoodNeed.level === 'high' && recipe.category === 'comfort') {
      score += 5;
      scoreReasons.push('High comfort food appeal for current weather');
    }
    
    // Score based on cooking motivation
    if (weatherAnalysis.cookingMotivation.level === 'high' && recipe.difficulty !== 'easy') {
      score += 3;
      scoreReasons.push('Weather encourages more involved cooking');
    } else if (weatherAnalysis.cookingMotivation.level === 'low' && recipe.difficulty === 'easy') {
      score += 4;
      scoreReasons.push('Simple preparation suits current weather mood');
    }
    
    // Score based on seasonal appropriateness
    const season = weatherAnalysis.season;
    if (seasonalPreferences[season]) {
      const seasonalMatch = seasonalPreferences[season].some(pref => 
        recipe.category.includes(pref) || 
        recipe.description.toLowerCase().includes(pref)
      );
      if (seasonalMatch) {
        score += 3;
        scoreReasons.push(`Perfect for ${season} season`);
      }
    }
    
    return {
      ...recipe,
      relevanceScore: score,
      scoreReasons: scoreReasons
    };
  });
  
  // Sort by score (highest first) and return top recommendations
  return scoredRecipes
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3); // Return top 3 recommendations
}

/**
 * Generates detailed reasoning for each recommendation
 * @param {Array} rankedRecipes - Top ranked recipes
 * @param {Object} weatherAnalysis - Weather analysis
 * @returns {Array} Recommendations with detailed reasoning
 */
function generateRecommendationReasons(rankedRecipes, weatherAnalysis) {
  return rankedRecipes.map((recipe, index) => {
    const reasoning = generateDetailedReasoning(recipe, weatherAnalysis, index + 1);
    
    return {
      ...recipe,
      recommendation: {
        rank: index + 1,
        reasoning: reasoning,
        weatherContext: weatherAnalysis.weatherDescription,
        confidenceLevel: calculateConfidenceLevel(recipe.relevanceScore)
      }
    };
  });
}

/**
 * Generates detailed reasoning for a recipe recommendation
 * @param {Object} recipe - Recipe with score
 * @param {Object} weatherAnalysis - Weather analysis
 * @param {number} rank - Recommendation rank
 * @returns {string} Detailed reasoning
 */
function generateDetailedReasoning(recipe, weatherAnalysis, rank) {
  const reasons = [];
  
  // Weather-specific reasoning
  if (weatherAnalysis.temperature.category === 'cold') {
    if (recipe.category === 'comfort' || recipe.category === 'warming') {
      reasons.push(`This ${recipe.category} dish will warm you up on this ${weatherAnalysis.temperature.category} day`);
    }
  } else if (weatherAnalysis.temperature.category === 'hot') {
    if (recipe.category === 'cooling' || recipe.category === 'refreshing') {
      reasons.push(`This ${recipe.category} meal will help you stay cool in the heat`);
    }
  }
  
  // Condition-specific reasoning
  if (['rainy', 'drizzle', 'overcast'].includes(weatherAnalysis.condition)) {
    reasons.push(`Perfect comfort food for this ${weatherAnalysis.condition} weather`);
  } else if (['sunny', 'clear'].includes(weatherAnalysis.condition)) {
    reasons.push(`A delightful choice for this beautiful ${weatherAnalysis.condition} day`);
  }
  
  // Cooking time reasoning
  if (recipe.cookingTime <= 20) {
    reasons.push('Quick and easy to prepare');
  } else if (recipe.cookingTime >= 60) {
    reasons.push('Worth the time investment for a satisfying meal');
  }
  
  // Seasonal reasoning
  const season = weatherAnalysis.season;
  reasons.push(`Seasonally appropriate for ${season}`);
  
  // Combine reasons into a coherent explanation
  let reasoning = `Ranked #${rank} because: `;
  reasoning += reasons.join(', ') + '.';
  
  // Add score-based confidence
  if (recipe.relevanceScore >= 15) {
    reasoning += ' This is an excellent match for current conditions!';
  } else if (recipe.relevanceScore >= 10) {
    reasoning += ' This is a good choice for the weather.';
  } else {
    reasoning += ' This could work well given the conditions.';
  }
  
  return reasoning;
}

/**
 * Calculates confidence level based on relevance score
 * @param {number} score - Relevance score
 * @returns {string} Confidence level
 */
function calculateConfidenceLevel(score) {
  if (score >= 20) return 'very-high';
  if (score >= 15) return 'high';
  if (score >= 10) return 'medium';
  if (score >= 5) return 'low';
  return 'very-low';
}

/**
 * Generates fallback recommendations when analysis fails
 * @param {Object} weatherData - Weather data
 * @returns {Object} Fallback recommendations
 */
function generateFallbackRecommendations(weatherData) {
  console.log('🔄 Generating fallback recommendations');
  
  // Select a few versatile recipes as fallbacks
  const fallbackRecipes = recipeDatabase.slice(0, 3).map((recipe, index) => ({
    ...recipe,
    recommendation: {
      rank: index + 1,
      reasoning: `A versatile choice that works well in various weather conditions. ${recipe.description}`,
      weatherContext: weatherData.description || 'Current weather conditions',
      confidenceLevel: 'medium'
    }
  }));
  
  return {
    weatherAnalysis: {
      temperature: weatherData.temperature,
      condition: weatherData.condition,
      weatherDescription: weatherData.description,
      fallbackMode: true
    },
    recommendations: fallbackRecipes,
    totalRecipesConsidered: recipeDatabase.length,
    weatherMatchedCount: recipeDatabase.length,
    finalRecommendationCount: fallbackRecipes.length
  };
}
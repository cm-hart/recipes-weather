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
    
    // Step 2: Filter recipes based on weather (more flexible approach)
    const weatherMatchedRecipes = filterRecipesByWeatherFlexible(weatherAnalysis);
    
    // Step 3: Apply user preferences
    const personalizedRecipes = applyUserPreferences(weatherMatchedRecipes, userPreferences);
    
    // Step 4: Rank and select top recommendations
    const rankedRecipes = rankRecipesByRelevance(personalizedRecipes, weatherAnalysis, userPreferences);
    
    // Step 5: Generate recommendation reasoning
    const recommendations = generateRecommendationReasons(rankedRecipes, weatherAnalysis);
    
    console.log('✅ Recipe analysis complete');
    console.log('Final recommendations:', recommendations);
    
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
 * Filters recipes based on weather analysis with more flexible matching
 * @param {Object} weatherAnalysis - Weather analysis results
 * @returns {Array} Filtered recipes
 */
function filterRecipesByWeatherFlexible(weatherAnalysis) {
  const { temperature, condition, moodCategories } = weatherAnalysis;
  
  console.log('🔍 Filtering recipes with flexible matching...');
  console.log('Temperature category:', temperature.category);
  console.log('Weather condition:', condition);
  console.log('Mood categories:', moodCategories);
  
  // Score each recipe based on multiple criteria
  const scoredRecipes = recipeDatabase.map(recipe => {
    let score = 0;
    let matchReasons = [];
    
    // Direct weather condition match (highest priority)
    if (recipe.weatherTypes.includes(condition)) {
      score += 10;
      matchReasons.push(`Perfect match for ${condition} weather`);
    }
    
    // Temperature category match
    if (recipe.temperature === temperature.category) {
      score += 8;
      matchReasons.push(`Ideal for ${temperature.category} temperatures`);
    }
    
    // Mood category match
    if (moodCategories.includes(recipe.category)) {
      score += 6;
      matchReasons.push(`Matches ${recipe.category} mood`);
    }
    
    // Flexible temperature matching (adjacent categories)
    const tempOrder = ['cold', 'cool', 'warm', 'hot'];
    const currentTempIndex = tempOrder.indexOf(temperature.category);
    const recipeTempIndex = tempOrder.indexOf(recipe.temperature);
    
    if (Math.abs(currentTempIndex - recipeTempIndex) === 1) {
      score += 4;
      matchReasons.push(`Good temperature match (${recipe.temperature} works with ${temperature.category})`);
    }
    
    // Seasonal appropriateness
    const season = weatherAnalysis.season;
    if (seasonalPreferences[season]) {
      const seasonalMatch = seasonalPreferences[season].some(pref => 
        recipe.category.includes(pref) || 
        recipe.description.toLowerCase().includes(pref) ||
        recipe.nutritionHighlights.some(highlight => highlight.toLowerCase().includes(pref))
      );
      if (seasonalMatch) {
        score += 3;
        matchReasons.push(`Perfect for ${season} season`);
      }
    }
    
    // Weather-adjacent conditions (similar weather types)
    const weatherGroups = {
      sunny: ['clear', 'sunny', 'partly-cloudy'],
      rainy: ['rainy', 'drizzle', 'overcast'],
      cold: ['snow', 'fog', 'cold'],
      mild: ['partly-cloudy', 'cloudy']
    };
    
    for (const [group, conditions] of Object.entries(weatherGroups)) {
      if (conditions.includes(condition)) {
        const adjacentMatch = recipe.weatherTypes.some(weatherType => 
          conditions.includes(weatherType) && weatherType !== condition
        );
        if (adjacentMatch) {
          score += 2;
          matchReasons.push(`Good match for similar weather conditions`);
        }
      }
    }
    
    // Base score for all recipes (ensures everyone gets some score)
    score += 1;
    
    return {
      ...recipe,
      matchScore: score,
      matchReasons: matchReasons
    };
  });
  
  // Return recipes with any score > 0 (which should be all of them now)
  const filteredRecipes = scoredRecipes.filter(recipe => recipe.matchScore > 0);
  
  console.log(`📊 Recipe scoring complete: ${filteredRecipes.length} recipes matched`);
  console.log('Top scored recipes:', filteredRecipes.slice(0, 3).map(r => ({ name: r.name, score: r.matchScore })));
  
  return filteredRecipes;
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
  
  console.log('👤 Applying user preferences...');
  
  return recipes.filter(recipe => {
    // Filter by cooking time preference
    if (userPreferences.maxCookingTime) {
      const maxTime = parseInt(userPreferences.maxCookingTime);
      if (recipe.cookingTime > maxTime) {
        console.log(`⏰ Filtered out ${recipe.name} - too long (${recipe.cookingTime}min > ${maxTime}min)`);
        return false;
      }
    }
    
    // Filter by difficulty preference
    if (userPreferences.difficulty) {
      if (recipe.difficulty !== userPreferences.difficulty) {
        console.log(`👨‍🍳 Filtered out ${recipe.name} - wrong difficulty (${recipe.difficulty} != ${userPreferences.difficulty})`);
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
  console.log('🏆 Ranking recipes by relevance...');
  
  if (recipes.length === 0) {
    console.log('⚠️ No recipes to rank, returning empty array');
    return [];
  }
  
  const scoredRecipes = recipes.map(recipe => {
    let score = recipe.matchScore || 0; // Start with existing match score
    let scoreReasons = [...(recipe.matchReasons || [])];
    
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
    
    // Bonus for quick recipes in any weather
    if (recipe.cookingTime <= 20) {
      score += 2;
      scoreReasons.push('Quick and convenient preparation');
    }
    
    // Bonus for nutritional highlights that match weather
    if (weatherAnalysis.temperature.category === 'hot' && 
        recipe.nutritionHighlights.some(h => h.toLowerCase().includes('cooling') || h.toLowerCase().includes('hydrating'))) {
      score += 3;
      scoreReasons.push('Cooling properties perfect for hot weather');
    }
    
    if (weatherAnalysis.temperature.category === 'cold' && 
        recipe.nutritionHighlights.some(h => h.toLowerCase().includes('warming') || h.toLowerCase().includes('protein'))) {
      score += 3;
      scoreReasons.push('Warming and nourishing for cold weather');
    }
    
    return {
      ...recipe,
      relevanceScore: score,
      scoreReasons: scoreReasons
    };
  });
  
  // Sort by score (highest first) and return top recommendations
  const rankedRecipes = scoredRecipes
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3); // Return top 3 recommendations
  
  console.log('🎯 Final rankings:', rankedRecipes.map(r => ({ 
    name: r.name, 
    score: r.relevanceScore,
    reasons: r.scoreReasons.length
  })));
  
  return rankedRecipes;
}

/**
 * Generates detailed reasoning for each recommendation
 * @param {Array} rankedRecipes - Top ranked recipes
 * @param {Object} weatherAnalysis - Weather analysis
 * @returns {Array} Recommendations with detailed reasoning
 */
function generateRecommendationReasons(rankedRecipes, weatherAnalysis) {
  if (rankedRecipes.length === 0) {
    console.log('⚠️ No ranked recipes to generate reasons for');
    return [];
  }
  
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
  
  // Use the score reasons we collected during ranking
  if (recipe.scoreReasons && recipe.scoreReasons.length > 0) {
    reasons.push(...recipe.scoreReasons.slice(0, 3)); // Take top 3 reasons
  }
  
  // Add weather-specific reasoning
  if (weatherAnalysis.temperature.category === 'cold') {
    if (recipe.category === 'comfort' || recipe.category === 'warming') {
      reasons.push(`This ${recipe.category} dish will warm you up on this ${weatherAnalysis.temperature.category} day`);
    }
  } else if (weatherAnalysis.temperature.category === 'hot') {
    if (recipe.category === 'cooling' || recipe.category === 'refreshing') {
      reasons.push(`This ${recipe.category} meal will help you stay cool in the heat`);
    }
  }
  
  // Add cooking time reasoning
  if (recipe.cookingTime <= 20) {
    reasons.push('Quick and easy to prepare');
  } else if (recipe.cookingTime >= 60) {
    reasons.push('Worth the time investment for a satisfying meal');
  }
  
  // Add seasonal reasoning
  const season = weatherAnalysis.season;
  reasons.push(`Seasonally appropriate for ${season}`);
  
  // Ensure we have at least some reasoning
  if (reasons.length === 0) {
    reasons.push(`A delicious ${recipe.category} option that works well with current conditions`);
    reasons.push(`${recipe.description}`);
  }
  
  // Combine reasons into a coherent explanation
  let reasoning = `Ranked #${rank} because: `;
  reasoning += reasons.slice(0, 3).join(', ') + '.';
  
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
    },
    relevanceScore: 10 - index // Give them decent scores
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
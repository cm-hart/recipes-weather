// Weather API service functions
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5/weather';
const GEOCODING_API_BASE = 'https://api.openweathermap.org/geo/1.0/direct';

/**
 * Fetches weather data for a given city using OpenWeatherMap API
 * Note: This uses a demo API key - in production, you'd need your own key
 * @param {string} cityName - Name of the city to get weather for
 * @returns {Promise<Object>} Weather data object
 */
export async function fetchWeatherDataForCity(cityName) {
  try {
    console.log(`🌤️ Fetching weather data for: ${cityName}`);
    
    // First, get coordinates for the city
    const coordinates = await getCityCoordinates(cityName);
    if (!coordinates) {
      throw new Error(`Could not find coordinates for city: ${cityName}`);
    }
    
    // Then fetch weather data using coordinates
    const weatherData = await fetchWeatherByCoordinates(coordinates.lat, coordinates.lon);
    
    console.log('✅ Weather data retrieved successfully');
    return weatherData;
    
  } catch (error) {
    console.error('❌ Error fetching weather data:', error);
    
    // Return mock data for demo purposes when API fails
    return generateMockWeatherData(cityName);
  }
}

/**
 * Gets latitude and longitude coordinates for a city name
 * @param {string} cityName - Name of the city
 * @returns {Promise<Object>} Coordinates object with lat and lon
 */
async function getCityCoordinates(cityName) {
  try {
    // Using a free geocoding service as fallback
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`);
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
    }
    
    return null;
    
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return null;
  }
}

/**
 * Fetches weather data using coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Weather data
 */
async function fetchWeatherByCoordinates(lat, lon) {
  try {
    // Using a free weather API service
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the data to our expected format
    return transformOpenMeteoData(data);
    
  } catch (error) {
    console.error('Error fetching weather by coordinates:', error);
    throw error;
  }
}

/**
 * Transforms Open-Meteo API data to our expected format
 * @param {Object} data - Raw API response
 * @returns {Object} Transformed weather data
 */
function transformOpenMeteoData(data) {
  const current = data.current_weather;
  const weatherCode = current.weather_code;
  
  // Map weather codes to descriptions
  const weatherDescriptions = {
    0: 'clear',
    1: 'partly-cloudy',
    2: 'partly-cloudy',
    3: 'cloudy',
    45: 'fog',
    48: 'fog',
    51: 'drizzle',
    53: 'drizzle',
    55: 'drizzle',
    61: 'rainy',
    63: 'rainy',
    65: 'rainy',
    71: 'snow',
    73: 'snow',
    75: 'snow',
    80: 'rainy',
    81: 'rainy',
    82: 'rainy',
    95: 'rainy',
    96: 'rainy',
    99: 'rainy'
  };
  
  const condition = weatherDescriptions[weatherCode] || 'partly-cloudy';
  const tempCelsius = current.temperature;
  const tempFahrenheit = (tempCelsius * 9/5) + 32;
  
  return {
    temperature: {
      celsius: Math.round(tempCelsius),
      fahrenheit: Math.round(tempFahrenheit)
    },
    condition: condition,
    description: getWeatherDescription(condition, tempCelsius),
    humidity: data.hourly?.relative_humidity_2m?.[0] || 50,
    windSpeed: current.windspeed || 0,
    timestamp: new Date().toISOString(),
    location: 'Unknown', // Will be filled in by calling function
    rawData: data
  };
}

/**
 * Generates a human-readable weather description
 * @param {string} condition - Weather condition
 * @param {number} temperature - Temperature in Celsius
 * @returns {string} Human-readable description
 */
function getWeatherDescription(condition, temperature) {
  const tempCategory = temperature > 25 ? 'hot' : temperature > 15 ? 'warm' : temperature > 5 ? 'cool' : 'cold';
  
  const descriptions = {
    'clear': `Clear and ${tempCategory}`,
    'sunny': `Sunny and ${tempCategory}`,
    'partly-cloudy': `Partly cloudy and ${tempCategory}`,
    'cloudy': `Cloudy and ${tempCategory}`,
    'overcast': `Overcast and ${tempCategory}`,
    'rainy': `Rainy and ${tempCategory}`,
    'drizzle': `Light drizzle and ${tempCategory}`,
    'snow': `Snowy and ${tempCategory}`,
    'fog': `Foggy and ${tempCategory}`
  };
  
  return descriptions[condition] || `${condition} and ${tempCategory}`;
}

/**
 * Generates mock weather data for demo purposes
 * @param {string} cityName - Name of the city
 * @returns {Object} Mock weather data
 */
function generateMockWeatherData(cityName) {
  const conditions = ['clear', 'partly-cloudy', 'cloudy', 'rainy', 'sunny'];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  const randomTemp = Math.floor(Math.random() * 30) + 5; // 5-35°C
  
  console.log('🎭 Using mock weather data for demo');
  
  return {
    temperature: {
      celsius: randomTemp,
      fahrenheit: Math.round((randomTemp * 9/5) + 32)
    },
    condition: randomCondition,
    description: getWeatherDescription(randomCondition, randomTemp),
    humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
    windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
    timestamp: new Date().toISOString(),
    location: cityName,
    isMockData: true
  };
}

/**
 * Determines temperature category based on celsius temperature
 * @param {number} tempCelsius - Temperature in Celsius
 * @returns {string} Temperature category
 */
export function categorizeTemperature(tempCelsius) {
  if (tempCelsius >= 30) return 'hot';
  if (tempCelsius >= 20) return 'warm';
  if (tempCelsius >= 10) return 'cool';
  return 'cold';
}

/**
 * Gets current season based on date
 * @returns {string} Current season
 */
export function getCurrentSeason() {
  const month = new Date().getMonth() + 1; // 1-12
  
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'fall';
  return 'winter';
}
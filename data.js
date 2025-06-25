// Recipe database with detailed information
export const recipeDatabase = [
  {
    id: 1,
    name: "Hearty Beef Stew",
    category: "comfort",
    weatherTypes: ["cold", "rainy", "snowy"],
    temperature: "cold",
    cookingTime: 120,
    difficulty: "medium",
    ingredients: [
      "2 lbs beef chuck roast, cubed",
      "4 large carrots, chopped",
      "3 potatoes, diced",
      "1 large onion, diced",
      "3 cloves garlic, minced",
      "4 cups beef broth",
      "2 tbsp tomato paste",
      "1 tsp thyme",
      "2 bay leaves",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Brown beef cubes in a large pot with oil",
      "Add onions and garlic, cook until fragrant",
      "Stir in tomato paste and cook for 1 minute",
      "Add broth, herbs, and seasonings",
      "Bring to boil, then simmer covered for 1 hour",
      "Add vegetables and cook for another 45 minutes",
      "Remove bay leaves and serve hot"
    ],
    description: "Perfect for cold, dreary days when you need something warm and filling",
    nutritionHighlights: ["High protein", "Rich in vitamins", "Comfort food"]
  },
  {
    id: 2,
    name: "Fresh Gazpacho",
    category: "refreshing",
    weatherTypes: ["hot", "sunny", "clear"],
    temperature: "hot",
    cookingTime: 15,
    difficulty: "easy",
    ingredients: [
      "6 large ripe tomatoes",
      "1 cucumber, peeled and seeded",
      "1 red bell pepper",
      "1/2 red onion",
      "3 cloves garlic",
      "1/4 cup olive oil",
      "2 tbsp red wine vinegar",
      "1 tsp salt",
      "Fresh basil leaves",
      "Crushed ice"
    ],
    instructions: [
      "Roughly chop all vegetables",
      "Combine in blender with olive oil and vinegar",
      "Blend until smooth but still slightly chunky",
      "Season with salt and pepper",
      "Chill for at least 2 hours",
      "Serve cold with ice cubes and fresh basil"
    ],
    description: "A cooling, refreshing soup perfect for hot summer days",
    nutritionHighlights: ["Low calorie", "High in vitamins", "Hydrating"]
  },
  {
    id: 3,
    name: "Grilled Chicken Salad",
    category: "light",
    weatherTypes: ["warm", "sunny", "partly-cloudy"],
    temperature: "warm",
    cookingTime: 25,
    difficulty: "easy",
    ingredients: [
      "2 chicken breasts",
      "Mixed greens (arugula, spinach, lettuce)",
      "1 avocado, sliced",
      "Cherry tomatoes, halved",
      "1/2 red onion, thinly sliced",
      "1/4 cup feta cheese, crumbled",
      "1/4 cup olive oil",
      "2 tbsp lemon juice",
      "1 tsp honey",
      "1 tsp Dijon mustard",
      "Salt and pepper"
    ],
    instructions: [
      "Season chicken with salt, pepper, and herbs",
      "Grill chicken for 6-7 minutes per side",
      "Let chicken rest, then slice",
      "Whisk together oil, lemon juice, honey, and mustard",
      "Arrange greens, vegetables, and cheese in bowl",
      "Top with sliced chicken",
      "Drizzle with dressing and serve"
    ],
    description: "Light and satisfying meal perfect for pleasant weather",
    nutritionHighlights: ["High protein", "Fresh vegetables", "Balanced meal"]
  },
  {
    id: 4,
    name: "Spicy Thai Curry",
    category: "warming",
    weatherTypes: ["cool", "rainy", "overcast"],
    temperature: "cool",
    cookingTime: 35,
    difficulty: "medium",
    ingredients: [
      "1 lb chicken thighs, cubed",
      "1 can coconut milk",
      "2 tbsp red curry paste",
      "1 bell pepper, sliced",
      "1 onion, sliced",
      "1 zucchini, sliced",
      "2 tbsp fish sauce",
      "1 tbsp brown sugar",
      "Fresh basil leaves",
      "Jasmine rice for serving",
      "Lime wedges"
    ],
    instructions: [
      "Cook rice according to package directions",
      "Heat oil in large pan, cook chicken until browned",
      "Add curry paste and cook for 1 minute",
      "Pour in coconut milk, bring to simmer",
      "Add vegetables, fish sauce, and sugar",
      "Simmer for 15-20 minutes until vegetables are tender",
      "Stir in fresh basil",
      "Serve over rice with lime wedges"
    ],
    description: "Warming and aromatic curry to brighten up gloomy days",
    nutritionHighlights: ["Spicy and warming", "Rich flavors", "Comfort food"]
  },
  {
    id: 5,
    name: "Iced Fruit Smoothie Bowl",
    category: "cooling",
    weatherTypes: ["hot", "sunny", "humid"],
    temperature: "hot",
    cookingTime: 10,
    difficulty: "easy",
    ingredients: [
      "1 frozen banana",
      "1/2 cup frozen mango chunks",
      "1/2 cup frozen berries",
      "1/2 cup coconut milk",
      "1 tbsp honey",
      "Granola for topping",
      "Fresh berries for topping",
      "Coconut flakes",
      "Chia seeds",
      "Mint leaves"
    ],
    instructions: [
      "Blend frozen fruits with coconut milk and honey",
      "Blend until thick and creamy",
      "Pour into chilled bowl",
      "Arrange toppings in colorful patterns",
      "Add granola, fresh berries, and coconut",
      "Sprinkle with chia seeds",
      "Garnish with mint and serve immediately"
    ],
    description: "Refreshing and nutritious bowl perfect for beating the heat",
    nutritionHighlights: ["Antioxidant rich", "Natural sugars", "Cooling effect"]
  },
  {
    id: 6,
    name: "Mushroom Risotto",
    category: "comfort",
    weatherTypes: ["cold", "rainy", "foggy"],
    temperature: "cold",
    cookingTime: 45,
    difficulty: "hard",
    ingredients: [
      "1 1/2 cups Arborio rice",
      "6 cups warm vegetable broth",
      "1 lb mixed mushrooms, sliced",
      "1 large onion, finely diced",
      "3 cloves garlic, minced",
      "1/2 cup white wine",
      "1/2 cup Parmesan cheese, grated",
      "3 tbsp butter",
      "2 tbsp olive oil",
      "Fresh thyme",
      "Salt and pepper"
    ],
    instructions: [
      "Keep broth warm in separate pot",
      "Sauté mushrooms until golden, set aside",
      "In same pan, cook onion until translucent",
      "Add garlic and rice, stir for 2 minutes",
      "Pour in wine, stir until absorbed",
      "Add broth one ladle at a time, stirring constantly",
      "Continue until rice is creamy and tender (20-25 minutes)",
      "Stir in mushrooms, butter, and Parmesan",
      "Season and serve immediately"
    ],
    description: "Creamy, luxurious dish perfect for cozy indoor dining",
    nutritionHighlights: ["Creamy comfort", "Umami rich", "Satisfying"]
  }
];

// Weather condition mappings for better recipe matching
export const weatherMoodMap = {
  "clear": ["light", "refreshing"],
  "sunny": ["light", "refreshing", "cooling"],
  "partly-cloudy": ["light", "balanced"],
  "cloudy": ["comfort", "warming"],
  "overcast": ["comfort", "warming"],
  "rainy": ["comfort", "warming"],
  "drizzle": ["comfort", "warming"],
  "snow": ["comfort", "warming"],
  "fog": ["comfort", "warming"],
  "hot": ["cooling", "refreshing"],
  "warm": ["light", "balanced"],
  "cool": ["warming", "comfort"],
  "cold": ["warming", "comfort"]
};

// Seasonal ingredient preferences
export const seasonalPreferences = {
  spring: ["fresh", "light", "vegetables"],
  summer: ["cooling", "fresh", "fruits"],
  fall: ["warming", "hearty", "spices"],
  winter: ["comfort", "warming", "rich"]
};

// Cooking difficulty explanations
export const difficultyLevels = {
  easy: "Simple preparation, minimal cooking skills required",
  medium: "Some cooking experience helpful, moderate preparation time",
  hard: "Advanced techniques required, longer preparation and attention needed"
};
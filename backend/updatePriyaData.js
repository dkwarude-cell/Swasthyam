const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const User = require('./models/User');
const OilConsumption = require('./models/OilConsumption');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('\nMongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Load recipes from master_recipes.jsonl
function loadRecipes() {
  const recipesPath = path.join(__dirname, '..', 'data', 'master_recipes.jsonl');
  const fileContent = fs.readFileSync(recipesPath, 'utf-8');
  const lines = fileContent.split('\n').filter(line => line.trim());
  return lines.map(line => JSON.parse(line));
}

// Categorize recipes by meal type
function categorizeRecipes(recipes) {
  const breakfast = [];
  const lunch = [];
  const dinner = [];
  const snacks = [];

  recipes.forEach(recipe => {
    const course = recipe.course?.toLowerCase() || '';
    const dishName = recipe.dish_name?.toLowerCase() || '';
    
    // Only include recipes with valid oil data
    if (!recipe.extracted_oil_volume_ml || recipe.extracted_oil_volume_ml < 1) {
      return;
    }

    if (course.includes('breakfast') || dishName.includes('idli') || dishName.includes('dosa') || 
        dishName.includes('upma') || dishName.includes('poha')) {
      breakfast.push(recipe);
    } else if (course.includes('snack') || dishName.includes('pakora') || dishName.includes('samosa') ||
               dishName.includes('vada') || dishName.includes('chutney')) {
      snacks.push(recipe);
    } else if (course.includes('lunch') || course.includes('main') || course.includes('dinner') ||
               dishName.includes('curry') || dishName.includes('rice') || dishName.includes('dal')) {
      if (Math.random() > 0.5) {
        lunch.push(recipe);
      } else {
        dinner.push(recipe);
      }
    }
  });

  return { breakfast, lunch, dinner, snacks };
}

// Map oil types from dataset to app format
function mapOilType(extractedType) {
  const oilMap = {
    'sunflower_oil': 'Sunflower Oil',
    'mustard_oil': 'Mustard Oil',
    'sesame_oil': 'Sesame Oil',
    'coconut_oil': 'Coconut Oil',
    'olive_oil': 'Olive Oil',
    'ghee': 'Ghee'
  };
  
  return oilMap[extractedType] || 'Sunflower Oil';
}

// Calculate SwasthaIndex components
function calculateSwasthaIndex(oilType, oilMl) {
  const oilData = {
    'Sunflower Oil': { pufa: 60, mufa: 25, sfa: 15 },
    'Rice Bran Oil': { pufa: 35, mufa: 47, sfa: 18 },
    'Mustard Oil': { pufa: 15, mufa: 60, sfa: 25 },
    'Groundnut Oil': { pufa: 30, mufa: 50, sfa: 20 },
    'Olive Oil': { pufa: 10, mufa: 75, sfa: 15 },
    'Coconut Oil': { pufa: 2, mufa: 6, sfa: 92 },
    'Sesame Oil': { pufa: 42, mufa: 40, sfa: 18 },
    'Ghee': { pufa: 4, mufa: 25, sfa: 71 },
    'Butter': { pufa: 4, mufa: 25, sfa: 71 },
    'Palm Oil': { pufa: 10, mufa: 40, sfa: 50 },
    'Palmolein Oil': { pufa: 10, mufa: 45, sfa: 45 },
    'Soybean Oil': { pufa: 58, mufa: 23, sfa: 19 },
    'Canola Oil': { pufa: 28, mufa: 63, sfa: 9 },
    'Corn Oil': { pufa: 55, mufa: 30, sfa: 15 },
    'Cottonseed Oil': { pufa: 52, mufa: 18, sfa: 26 },
    'Safflower Oil': { pufa: 75, mufa: 15, sfa: 10 },
    'Vegetable Oil': { pufa: 50, mufa: 30, sfa: 20 }
  };

  const oil = oilData[oilType] || oilData['Sunflower Oil'];
  
  // Calculate harm score
  const harmScore = Math.min(100, Math.round(
    (oil.sfa * 1.5) + (oil.pufa * 0.5) + (oil.mufa * 0.2)
  ));
  
  // Calculate calories
  const rawKcal = Math.round(oilMl * 9 * (6.25 / 100));
  const multiplier = 1.0 + (harmScore / 200);
  const effectiveKcal = Math.round(rawKcal * multiplier);
  
  return { harmScore, rawKcal, multiplier, effectiveKcal };
}

// Generate meals with real recipe data
function generateMealsForMonth(recipes, startDate, endDate, progressFactor) {
  const meals = [];
  const { breakfast: breakfastRecipes, lunch: lunchRecipes, dinner: dinnerRecipes, snacks: snackRecipes } = recipes;
  
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const mealsPerDay = Math.floor(Math.random() * 2) + 2; // 2-3 meals per day
    
    for (let i = 0; i < mealsPerDay; i++) {
      let recipe, mealType;
      const hour = 7 + (i * 5) + Math.floor(Math.random() * 2);
      
      // Select meal type and recipe
      if (i === 0 && breakfastRecipes.length > 0) {
        mealType = 'breakfast';
        recipe = breakfastRecipes[Math.floor(Math.random() * breakfastRecipes.length)];
      } else if (i === 1 && Math.random() > 0.3 && lunchRecipes.length > 0) {
        mealType = 'lunch';
        recipe = lunchRecipes[Math.floor(Math.random() * lunchRecipes.length)];
      } else if (i === 2 && dinnerRecipes.length > 0) {
        mealType = 'dinner';
        recipe = dinnerRecipes[Math.floor(Math.random() * dinnerRecipes.length)];
      } else if (snackRecipes.length > 0) {
        mealType = 'snack';
        recipe = snackRecipes[Math.floor(Math.random() * snackRecipes.length)];
      } else {
        continue;
      }
      
      // Calculate oil amount with increased quantity and progress factor
      const baseOilMl = recipe.extracted_oil_volume_ml || 15;
      const quantityMultiplier = 1.3 + Math.random() * 0.4; // 1.3x to 1.7x more
      const oilVariation = progressFactor + (Math.random() * 0.2 - 0.1); // Add some randomness
      const finalOilMl = Math.round(baseOilMl * quantityMultiplier * oilVariation);
      
      // Create meal timestamp
      const mealDate = new Date(currentDate);
      mealDate.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
      
      const oilType = mapOilType(recipe.extracted_oil_type);
      const oilAmount = Math.max(finalOilMl, 5); // Minimum 5ml
      const swasthaIndex = calculateSwasthaIndex(oilType, oilAmount);
      
      // Capitalize meal type
      const capitalizedMealType = mealType.charAt(0).toUpperCase() + mealType.slice(1);
      
      meals.push({
        dishName: recipe.dish_name,
        foodName: recipe.dish_name,
        oilAmount: oilAmount,
        oilType: oilType,
        unit: 'pieces',
        quantity: Math.ceil(recipe.servings * quantityMultiplier) || 2,
        date: mealDate,
        mealType: capitalizedMealType,
        ...swasthaIndex
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return meals;
}

async function updatePriyaData() {
  try {
    console.log('\n🔄 Updating Priya Sharma\'s data with real recipes...\n');
    
    // Find Priya
    const priya = await User.findOne({ email: 'priya.sharma@demo.com' });
    if (!priya) {
      console.log('❌ Priya Sharma not found');
      return;
    }
    
    console.log('✓ Found Priya Sharma');
    
    // Load and categorize recipes
    console.log('📚 Loading recipes from dataset...');
    const allRecipes = loadRecipes();
    console.log(`✓ Loaded ${allRecipes.length} recipes`);
    
    const categorizedRecipes = categorizeRecipes(allRecipes);
    console.log(`✓ Categorized: ${categorizedRecipes.breakfast.length} breakfast, ${categorizedRecipes.lunch.length} lunch, ${categorizedRecipes.dinner.length} dinner, ${categorizedRecipes.snacks.length} snacks`);
    
    // Delete existing November-December data for Priya
    const startDate = new Date('2024-11-01');
    const endDate = new Date('2024-12-09');
    
    await OilConsumption.deleteMany({
      userId: priya._id,
      date: { $gte: startDate, $lte: endDate }
    });
    console.log('✓ Cleared existing data\n');
    
    // November: Higher oil consumption (baseline)
    console.log('📅 Generating November meals (higher consumption)...');
    const novemberStart = new Date('2024-11-01');
    const novemberEnd = new Date('2024-11-30');
    const novemberMeals = generateMealsForMonth(
      categorizedRecipes,
      novemberStart,
      novemberEnd,
      1.15 // 15% more oil
    );
    console.log(`  ✓ Generated ${novemberMeals.length} November meals`);
    
    // December: Lower oil consumption (showing progress)
    console.log('📅 Generating December meals (lower consumption, showing progress)...');
    const decemberStart = new Date('2024-12-01');
    const decemberEnd = new Date('2024-12-09');
    const decemberMeals = generateMealsForMonth(
      categorizedRecipes,
      decemberStart,
      decemberEnd,
      0.70 // 30% less oil
    );
    console.log(`  ✓ Generated ${decemberMeals.length} December meals`);
    
    // Insert all meals
    const allMeals = [...novemberMeals, ...decemberMeals].map(meal => ({
      userId: priya._id,
      dishName: meal.dishName,
      foodName: meal.foodName,
      oilAmount: meal.oilAmount,
      oilType: meal.oilType,
      unit: meal.unit,
      quantity: meal.quantity,
      date: meal.date,
      mealType: meal.mealType,
      harmScore: meal.harmScore,
      rawKcal: meal.rawKcal,
      multiplier: meal.multiplier,
      effectiveKcal: meal.effectiveKcal
    }));
    
    console.log('\n💾 Saving meals to database...');
    await OilConsumption.insertMany(allMeals);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Successfully updated Priya Sharma\'s data!');
    console.log('='.repeat(60));
    console.log('\n📊 Summary:');
    console.log(`  • Total meals: ${allMeals.length}`);
    console.log(`  • November meals: ${novemberMeals.length} (higher consumption)`);
    console.log(`  • December meals: ${decemberMeals.length} (lower consumption)`);
    console.log(`  • Real recipes from Indian food dataset`);
    console.log(`  • Increased quantities (1.3x - 1.7x)`);
    console.log('='.repeat(60));
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

// Run the update
updatePriyaData();

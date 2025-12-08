const mongoose = require('mongoose');
require('dotenv').config();

const OilConsumption = require('./models/OilConsumption');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/swasthtel')
.then(() => console.log('MongoDB connected for migration'))
.catch(err => console.error('MongoDB connection error:', err));

async function migrateOilCalories() {
  try {
    console.log('Starting migration to update oil calories formula...');
    
    // Fetch all oil consumption records
    const records = await OilConsumption.find({});
    console.log(`Found ${records.length} records to update`);
    
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const record of records){
      try {
        // Recalculate with new formula: oilAmount * 9 * (6.25/100)
        const newRawKcal = parseFloat((record.oilAmount * 9.0 * (6.25 / 100)).toFixed(2));
        
        // Use existing multiplier or default to 1.0 if missing/invalid
        const multiplier = (record.multiplier && !isNaN(record.multiplier)) ? record.multiplier : 1.0;
        const newEffectiveKcal = parseFloat((newRawKcal * multiplier).toFixed(2));
        
        // Skip if we still get NaN
        if (isNaN(newRawKcal) || isNaN(newEffectiveKcal)) {
          console.log(`Skipping record ${record._id} - invalid calculation`);
          errorCount++;
          continue;
        }
        
        // Update the record
        await OilConsumption.updateOne(
          { _id: record._id },
          {
            $set: {
              rawKcal: newRawKcal,
              effectiveKcal: newEffectiveKcal,
              multiplier: multiplier // Ensure multiplier is set
            }
          }
        );
        
        updatedCount++;
        
        if (updatedCount % 100 === 0) {
          console.log(`Processed ${updatedCount} records...`);
        }
      } catch (error) {
        console.error(`Error updating record ${record._id}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\nMigration completed!');
    console.log(`Successfully updated: ${updatedCount} records`);
    console.log(`Errors: ${errorCount} records`);
    console.log('\nFormula changed from: oilAmount * 9');
    console.log('                   to: oilAmount * 9 * (6.25/100)');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateOilCalories();

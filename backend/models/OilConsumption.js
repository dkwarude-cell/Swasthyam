const mongoose = require('mongoose');

const oilConsumptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  foodName: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true
  },
  oilType: {
    type: String,
    required: [true, 'Oil type is required'],
    enum: [
      'Sunflower Oil',
      'Rice Bran Oil',
      'Mustard Oil',
      'Groundnut Oil',
      'Olive Oil',
      'Coconut Oil',
      'Sesame Oil',
      'Ghee',
      'Butter',
      'Palm Oil',
      'Palmolein Oil',
      'Soybean Oil',
      'Canola Oil',
      'Corn Oil',
      'Cottonseed Oil',
      'Safflower Oil',
      'Vegetable Oil'
    ]
  },
  oilAmount: {
    type: Number,
    required: [true, 'Oil amount is required'],
    min: [0, 'Oil amount cannot be negative']
  },
  // SwasthaIndex fields
  harmScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  rawKcal: {
    type: Number,
    required: true
  },
  multiplier: {
    type: Number,
    required: true,
    min: 1.0,
    max: 1.5
  },
  effectiveKcal: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['grams', 'bowls', 'pieces']
  },
  mealType: {
    type: String,
    required: [true, 'Meal type is required'],
    enum: ['Breakfast', 'Lunch', 'Snack', 'Dinner']
  },
  members: [{
    type: String,
    trim: true
  }],
  // Group logging fields
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    index: true
  },
  loggedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isGroupLog: {
    type: Boolean,
    default: false
  },
  consumedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  verified: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient querying by user and date
oilConsumptionSchema.index({ userId: 1, consumedAt: -1 });

// Virtual for formatted time
oilConsumptionSchema.virtual('formattedTime').get(function() {
  return this.consumedAt.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
});

// Virtual for date string
oilConsumptionSchema.virtual('dateString').get(function() {
  return this.consumedAt.toDateString();
});

// Method to compute effective calories multiplier
oilConsumptionSchema.statics.computeMultiplier = function(harmScore) {
  const K_PENALTY = 0.3;
  const M_MAX = 1.5;
  const hNorm = harmScore / 100.0;
  const m = 1 + K_PENALTY * (hNorm ** 2);
  return Math.min(m, M_MAX);
};

// Method to get daily total for a user (including effective calories)
oilConsumptionSchema.statics.getDailyTotal = async function(userId, date = new Date()) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const result = await this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        consumedAt: { $gte: startOfDay, $lte: endOfDay }
      }
    },
    {
      $group: {
        _id: null,
        totalOil: { $sum: '$oilAmount' },
        totalRawKcal: { $sum: '$rawKcal' },
        totalEffKcal: { $sum: '$effectiveKcal' },
        count: { $sum: 1 }
      }
    }
  ]);

  return result.length > 0 ? result[0] : { 
    totalOil: 0, 
    totalRawKcal: 0, 
    totalEffKcal: 0, 
    count: 0 
  };
};

// Method to get weekly stats
oilConsumptionSchema.statics.getWeeklyStats = async function(userId) {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  return await this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        consumedAt: { $gte: weekAgo, $lte: today }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$consumedAt' }
        },
        totalOil: { $sum: '$oilAmount' },
        entries: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
};

module.exports = mongoose.model('OilConsumption', oilConsumptionSchema);

const mongoose = require('mongoose');

/**
 * DailyGoal Schema - Stores computed daily oil calorie limits
 * Based on SwasthaIndex Oil Limit System
 */
const dailyGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  // TDEE and rolling scores
  tdee: {
    type: Number,
    required: true
  },
  sRoll: {
    type: Number, // 7-day rolling Swastha Score
    required: true,
    min: 0,
    max: 100
  },
  hRoll: {
    type: Number, // 7-day rolling Harm Index
    required: true,
    min: 0,
    max: 100
  },
  // Intermediate calculations
  vBase: {
    type: Number,
    required: true
  },
  ha: {
    type: Number, // Harm Adjustment factor
    required: true
  },
  vAdj: {
    type: Number,
    required: true
  },
  // Final goal
  goalKcal: {
    type: Number,
    required: true
  },
  goalGrams: {
    type: Number,
    required: true
  },
  goalMl: {
    type: Number,
    required: true
  },
  // Tracking
  cumulativeEffKcal: {
    type: Number,
    default: 0
  },
  eventsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index for unique user+date
dailyGoalSchema.index({ userId: 1, date: 1 }, { unique: true });

/**
 * Get or compute daily goal for a user on a specific date
 */
dailyGoalSchema.statics.getOrComputeGoal = async function(userId, date, userProfile) {
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  
  // Check if goal already exists
  let goal = await this.findOne({ userId, date: dateOnly });
  
  if (goal) {
    return goal;
  }
  
  // Compute new goal
  const { bmr, activityFactor = 1.5 } = userProfile;
  
  // Get rolling scores (default for new users)
  const rollingScores = await mongoose.model('RollingScore').getRollingScores(userId, dateOnly);
  
  const goalData = computeDailyGoal(bmr, activityFactor, rollingScores.sRoll, rollingScores.hRoll);
  
  goal = await this.create({
    userId,
    date: dateOnly,
    tdee: goalData.tdee,
    sRoll: rollingScores.sRoll,
    hRoll: rollingScores.hRoll,
    vBase: goalData.vBase,
    ha: goalData.ha,
    vAdj: goalData.vAdj,
    goalKcal: goalData.goalKcal,
    goalGrams: goalData.goalGrams,
    goalMl: goalData.goalMl
  });
  
  return goal;
};

/**
 * Update cumulative effective calories
 */
dailyGoalSchema.methods.addEffectiveCalories = async function(effKcal) {
  this.cumulativeEffKcal += effKcal;
  this.eventsCount += 1;
  await this.save();
  return this;
};

/**
 * Get status of goal (remaining, fill%, etc)
 */
dailyGoalSchema.methods.getStatus = function() {
  const remainingKcal = Math.max(0, this.goalKcal - this.cumulativeEffKcal);
  const remainingMl = remainingKcal / 9;
  const fillPercent = (this.cumulativeEffKcal / this.goalKcal) * 100;
  const overage = Math.max(0, this.cumulativeEffKcal - this.goalKcal);
  const status = this.cumulativeEffKcal <= this.goalKcal ? 'within_limit' : 'over_limit';
  
  return {
    goalKcal: this.goalKcal,
    goalMl: this.goalMl,
    cumulativeEffKcal: this.cumulativeEffKcal,
    remainingKcal: Math.round(remainingKcal * 100) / 100,
    remainingMl: Math.round(remainingMl * 100) / 100,
    fillPercent: Math.round(fillPercent * 10) / 10,
    overage: Math.round(overage * 100) / 100,
    eventsCount: this.eventsCount,
    status
  };
};

// Helper function to compute daily goal
function computeDailyGoal(bmr, activityFactor, sRoll, hRoll) {
  const R_FAT = 0.25;
  const R_VISIBLE = 0.25;
  const ALPHA_S = 0.6;
  const ALPHA_H = 0.9;
  const V_MIN = 0.02;
  const V_MAX = 0.12;
  const HA_MIN = 0.5;
  const HA_MAX = 1.8;
  
  const tdee = bmr * activityFactor;
  const vBase = R_FAT * R_VISIBLE * tdee;
  const ha = Math.max(HA_MIN, Math.min(HA_MAX, (100 - hRoll) / 100));
  const vAdj = vBase * (ALPHA_S * (sRoll / 100) + ALPHA_H * ha);
  const goalKcal = Math.max(V_MIN * tdee, Math.min(V_MAX * tdee, vAdj));
  const goalGrams = goalKcal / 9;
  const goalMl = goalGrams / 0.9;
  
  return {
    tdee: Math.round(tdee * 10) / 10,
    vBase: Math.round(vBase * 10) / 10,
    ha: Math.round(ha * 100) / 100,
    vAdj: Math.round(vAdj * 10) / 10,
    goalKcal: Math.round(goalKcal * 100) / 100,
    goalGrams: Math.round(goalGrams * 10) / 10,
    goalMl: Math.round(goalMl * 10) / 10
  };
}

module.exports = mongoose.model('DailyGoal', dailyGoalSchema);

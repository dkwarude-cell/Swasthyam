const OilConsumption = require('../models/OilConsumption');
const DailyGoal = require('../models/DailyGoal');
const RollingScore = require('../models/RollingScore');
const Group = require('../models/Group');
const User = require('../models/User');
const { getOilHarmScore } = require('../models/RollingScore');
const { computeEffectiveCalories } = require('../utils/swasthaIndex');

// Log oil consumption
exports.logConsumption = async (req, res, next) => {
  try {
    const { foodName, oilType, oilAmount, quantity, unit, mealType, members, consumedAt } = req.body;

    // Validate required fields
    if (!foodName || !oilType || oilAmount === undefined || !quantity || !unit || !mealType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const consumeDate = consumedAt ? new Date(consumedAt) : new Date();
    const dateOnly = new Date(consumeDate);
    dateOnly.setHours(0, 0, 0, 0);

    // Get or compute daily goal
    const userProfile = {
      bmr: req.user.bmr || 1500,
      activityFactor: req.user.activityFactor || 1.5
    };
    const dailyGoal = await DailyGoal.getOrComputeGoal(req.user._id, dateOnly, userProfile);

    // Get harm score for oil type
    const harmScore = getOilHarmScore(oilType);
    
    // Compute effective calories
    const grams = parseFloat(oilAmount);
    const effCalData = computeEffectiveCalories(grams, harmScore);

    // Create new consumption entry
    const consumption = await OilConsumption.create({
      userId: req.user._id,
      foodName,
      oilType,
      oilAmount: grams,
      harmScore,
      rawKcal: effCalData.rawKcal,
      multiplier: effCalData.multiplier,
      effectiveKcal: effCalData.effectiveKcal,
      quantity: parseFloat(quantity),
      unit,
      mealType,
      members: members || [],
      consumedAt: consumeDate
    });

    // Update daily goal cumulative
    await dailyGoal.addEffectiveCalories(effCalData.effectiveKcal);

    // Get status
    const status = dailyGoal.getStatus();

    res.status(201).json({
      success: true,
      message: 'Oil consumption logged successfully',
      data: {
        eventId: consumption._id,
        entry: consumption,
        rawKcal: effCalData.rawKcal,
        multiplier: effCalData.multiplier,
        effectiveKcal: effCalData.effectiveKcal,
        ...status
      }
    });
  } catch (error) {
    next(error);
  }
};

// Bulk log consumption for group members
exports.logGroupConsumption = async (req, res, next) => {
  try {
    const { groupId, consumptionData } = req.body;
    // consumptionData format: [{ userId, foodName, oilType, oilAmount, quantity, unit, mealType, consumedAt }]

    if (!groupId || !consumptionData || !Array.isArray(consumptionData) || consumptionData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Group ID and consumption data array are required'
      });
    }

    // Verify group exists and user is admin
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    if (!group.isAdmin(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Only group admin can log consumption for members'
      });
    }

    const results = [];
    const errors = [];

    for (const item of consumptionData) {
      try {
        const { userId, foodName, oilType, oilAmount, quantity, unit, mealType, consumedAt } = item;

        // Validate required fields
        if (!userId || !foodName || !oilType || oilAmount === undefined || !quantity || !unit || !mealType) {
          errors.push({ userId, error: 'Missing required fields' });
          continue;
        }

        // Verify user is group member
        if (!group.isMember(userId)) {
          errors.push({ userId, error: 'User is not an active member of the group' });
          continue;
        }

        const consumeDate = consumedAt ? new Date(consumedAt) : new Date();
        const dateOnly = new Date(consumeDate);
        dateOnly.setHours(0, 0, 0, 0);

        // Get user profile
        const user = await User.findById(userId);
        if (!user) {
          errors.push({ userId, error: 'User not found' });
          continue;
        }

        // Get or compute daily goal for this user
        const userProfile = {
          bmr: user.bmr || 1500,
          activityFactor: user.activityFactor || 1.5
        };
        const dailyGoal = await DailyGoal.getOrComputeGoal(userId, dateOnly, userProfile);

        // Get harm score for oil type
        const harmScore = getOilHarmScore(oilType);
        
        // Compute effective calories
        const grams = parseFloat(oilAmount);
        const effCalData = computeEffectiveCalories(grams, harmScore);

        // Create new consumption entry
        const consumption = await OilConsumption.create({
          userId,
          foodName,
          oilType,
          oilAmount: grams,
          harmScore,
          rawKcal: effCalData.rawKcal,
          multiplier: effCalData.multiplier,
          effectiveKcal: effCalData.effectiveKcal,
          quantity: parseFloat(quantity),
          unit,
          mealType,
          consumedAt: consumeDate,
          groupId,
          loggedBy: req.user._id,
          isGroupLog: true
        });

        // Update daily goal cumulative
        await dailyGoal.addEffectiveCalories(effCalData.effectiveKcal);

        results.push({
          userId,
          consumptionId: consumption._id,
          effectiveKcal: effCalData.effectiveKcal
        });
      } catch (error) {
        errors.push({ userId: item.userId, error: error.message });
      }
    }

    res.status(201).json({
      success: true,
      message: `Logged ${results.length} consumption entries`,
      data: {
        logged: results,
        errors
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get consumption entries
exports.getConsumption = async (req, res, next) => {
  try {
    const { startDate, endDate, limit = 50, page = 1 } = req.query;

    // Build query
    const query = { userId: req.user._id };

    // Add date filtering if provided
    if (startDate || endDate) {
      query.consumedAt = {};
      if (startDate) {
        query.consumedAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.consumedAt.$lte = end;
      }
    }

    // Get entries with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const entries = await OilConsumption.find(query)
      .sort({ consumedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    // Get total count for pagination
    const total = await OilConsumption.countDocuments(query);

    // Get today's total
    const dailyTotal = await OilConsumption.getDailyTotal(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        entries,
        dailyTotal: dailyTotal.totalOil,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get today's consumption
exports.getTodayConsumption = async (req, res, next) => {
  try {
    const dateParam = req.query.date ? new Date(req.query.date) : new Date();
    dateParam.setHours(0, 0, 0, 0);

    const start = new Date(dateParam);
    const end = new Date(dateParam);
    end.setHours(23, 59, 59, 999);

    const entries = await OilConsumption.find({
      userId: req.user._id,
      consumedAt: { $gte: start, $lte: end }
    })
    .sort({ consumedAt: -1 })
    .lean();

    const dailyTotal = await OilConsumption.getDailyTotal(req.user._id, dateParam);

    res.status(200).json({
      success: true,
      data: {
        entries,
        dailyTotal: dailyTotal.totalOil,
        count: entries.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get weekly stats
exports.getWeeklyStats = async (req, res, next) => {
  try {
    const stats = await OilConsumption.getWeeklyStats(req.user._id);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// Delete consumption entry
exports.deleteConsumption = async (req, res, next) => {
  try {
    const { id } = req.params;

    const consumption = await OilConsumption.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!consumption) {
      return res.status(404).json({
        success: false,
        message: 'Consumption entry not found'
      });
    }

    await consumption.deleteOne();

    // Get updated daily total
    const dailyTotal = await OilConsumption.getDailyTotal(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Consumption entry deleted successfully',
      data: {
        dailyTotal: dailyTotal.totalOil
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update consumption entry
exports.updateConsumption = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { foodName, oilType, oilAmount, quantity, unit, mealType, members } = req.body;

    const consumption = await OilConsumption.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!consumption) {
      return res.status(404).json({
        success: false,
        message: 'Consumption entry not found'
      });
    }

    // Update fields if provided
    if (foodName) consumption.foodName = foodName;
    if (oilType) consumption.oilType = oilType;
    if (oilAmount !== undefined) consumption.oilAmount = parseFloat(oilAmount);
    if (quantity !== undefined) consumption.quantity = parseFloat(quantity);
    if (unit) consumption.unit = unit;
    if (mealType) consumption.mealType = mealType;
    if (members !== undefined) consumption.members = members;

    await consumption.save();

    // Get updated daily total
    const dailyTotal = await OilConsumption.getDailyTotal(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Consumption entry updated successfully',
      data: {
        entry: consumption,
        dailyTotal: dailyTotal.totalOil
      }
    });
  } catch (error) {
    next(error);
  }
};

// Compute daily goal (SwasthaIndex endpoint)
exports.computeDailyGoal = async (req, res, next) => {
  try {
    const { date } = req.body;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const userProfile = {
      bmr: req.user.bmr || 1500,
      activityFactor: req.user.activityFactor || 1.5
    };

    const dailyGoal = await DailyGoal.getOrComputeGoal(req.user._id, targetDate, userProfile);

    res.status(200).json({
      success: true,
      data: {
        goalKcal: dailyGoal.goalKcal,
        goalGrams: dailyGoal.goalGrams,
        goalMl: dailyGoal.goalMl,
        tdee: dailyGoal.tdee,
        vBase: dailyGoal.vBase,
        ha: dailyGoal.ha,
        vAdj: dailyGoal.vAdj,
        sRoll: dailyGoal.sRoll,
        hRoll: dailyGoal.hRoll,
        date: dailyGoal.date
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user oil status (SwasthaIndex endpoint)
exports.getUserOilStatus = async (req, res, next) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const userProfile = {
      bmr: req.user.bmr || 1500,
      activityFactor: req.user.activityFactor || 1.5
    };

    const dailyGoal = await DailyGoal.getOrComputeGoal(req.user._id, targetDate, userProfile);
    const status = dailyGoal.getStatus();

    res.status(200).json({
      success: true,
      data: {
        userId: req.user._id,
        date: targetDate,
        ...status
      }
    });
  } catch (error) {
    next(error);
  }
};

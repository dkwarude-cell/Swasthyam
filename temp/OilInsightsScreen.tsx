import { ChevronLeft, Droplet, Heart, TrendingDown, Target, Info, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface OilInsightsScreenProps {
  onComplete: () => void;
  onBack: () => void;
  language: string;
  userData: any;
}

export function OilInsightsScreen({ onComplete, onBack, language, userData }: OilInsightsScreenProps) {
  const [dailyOilGoal, setDailyOilGoal] = useState('');
  const [idealConsumption, setIdealConsumption] = useState(0);
  const [currentEstimate, setCurrentEstimate] = useState(0);
  const [reductionNeeded, setReductionNeeded] = useState(0);

  useEffect(() => {
    // Calculate ideal oil consumption based on user data
    const calculateIdealConsumption = () => {
      const basicInfo = userData?.screen1 || {};
      const medicalHistory = userData?.screen2 || {};
      const eatingHabits = userData?.screen3 || {};

      // Base calculation factors
      let baseConsumption = 25; // Base 25g per day (WHO recommendation is <20g)
      
      // Age factor
      const age = parseInt(basicInfo.age) || 30;
      if (age > 50) baseConsumption -= 3;
      else if (age < 18) baseConsumption -= 5;

      // Gender factor
      if (basicInfo.gender === 'female') baseConsumption -= 2;

      // BMI factor
      const bmi = basicInfo.bmi || 0;
      if (bmi > 30) baseConsumption -= 8;
      else if (bmi > 25) baseConsumption -= 5;
      else if (bmi < 18.5) baseConsumption += 3;

      // Medical conditions factor
      const conditions = medicalHistory?.medicalConditions || {};
      const conditionCount = Object.keys(conditions).length;
      baseConsumption -= conditionCount * 2;

      // Check for severe conditions
      Object.values(conditions).forEach((severity: any) => {
        if (severity === 'severe') baseConsumption -= 3;
        else if (severity === 'moderate') baseConsumption -= 2;
      });

      // Eating habits factor
      if (eatingHabits.outsideEating === 'frequently' || eatingHabits.outsideEating === 'daily') {
        baseConsumption -= 3;
      }
      if (eatingHabits.foodieLevel === 'health-conscious') {
        baseConsumption -= 2;
      }

      // Ensure minimum safe level
      baseConsumption = Math.max(15, baseConsumption);

      return Math.round(baseConsumption);
    };

    const calculateCurrentEstimate = () => {
      const eatingHabits = userData?.screen3 || {};
      let estimate = 35; // Average Indian consumption

      // Adjust based on meals per day
      if (eatingHabits.mealsPerDay === '1-2 meals') estimate -= 5;
      else if (eatingHabits.mealsPerDay === '5+ meals') estimate += 5;

      // Adjust based on outside eating
      if (eatingHabits.outsideEating === 'daily') estimate += 8;
      else if (eatingHabits.outsideEating === 'frequently') estimate += 5;
      else if (eatingHabits.outsideEating === 'rarely') estimate -= 5;

      // Adjust based on foodie level
      if (eatingHabits.foodieLevel === 'health-conscious') estimate -= 5;
      else if (eatingHabits.foodieLevel === 'foodie') estimate += 3;

      return Math.round(estimate);
    };

    const ideal = calculateIdealConsumption();
    const current = calculateCurrentEstimate();
    
    setIdealConsumption(ideal);
    setCurrentEstimate(current);
    setReductionNeeded(Math.max(0, current - ideal));
    setDailyOilGoal(ideal.toString());
  }, [userData]);

  const handleComplete = () => {
    // Save the goal and complete onboarding
    onComplete();
  };

  const oilProducts = userData?.screen4?.oilProducts || [];

  return (
    <div className="h-screen bg-[#fafbfa] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-[#E7F2F1] flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-[#5B5B5B]" />
          </button>
          <span className="text-[#5B5B5B] text-sm">Step 5 of 6</span>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-2 bg-[#E7F2F1] rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-[#1b4a5a] rounded-full transition-all duration-300"
            style={{ width: '83.33%' }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-[#040707] text-2xl mb-2">Your Oil Insights</h1>
          <p className="text-[#5B5B5B] text-sm mb-8">Based on your profile, here's your personalized recommendation</p>

          {/* How We Calculate */}
          <div className="bg-gradient-to-br from-[#1b4a5a] to-[#2a5a6a] rounded-2xl p-5 mb-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5" />
              <h3>How We Calculate Your Ideal Oil Consumption</h3>
            </div>
            <p className="text-sm text-white/90 leading-relaxed">
              We use a comprehensive algorithm that considers your age, gender, BMI, medical conditions, 
              eating habits, and activity level. Our recommendation aligns with WHO guidelines and is 
              personalized to help you achieve optimal health while reducing oil consumption by 10%.
            </p>
          </div>

          {/* Current vs Ideal */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white border border-[#E7F2F1] rounded-xl p-4">
              <p className="text-[#5B5B5B] text-sm mb-2">Current Estimate</p>
              <div className="flex items-end gap-2">
                <p className="text-[#040707] text-3xl">{currentEstimate}</p>
                <p className="text-[#5B5B5B] mb-1">g/day</p>
              </div>
              <div className="mt-3 h-2 bg-red-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="bg-white border border-[#E7F2F1] rounded-xl p-4">
              <p className="text-[#5B5B5B] text-sm mb-2">Ideal Target</p>
              <div className="flex items-end gap-2">
                <p className="text-[#040707] text-3xl">{idealConsumption}</p>
                <p className="text-[#5B5B5B] mb-1">g/day</p>
              </div>
              <div className="mt-3 h-2 bg-green-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>

          {/* Reduction Needed */}
          {reductionNeeded > 0 && (
            <div className="bg-[#fcaf56]/10 border border-[#fcaf56]/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#fcaf56] rounded-full flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[#040707]">Reduction Goal</p>
                  <p className="text-[#5B5B5B] text-sm">Reduce by {reductionNeeded}g per day ({((reductionNeeded/currentEstimate) * 100).toFixed(0)}%)</p>
                </div>
              </div>
            </div>
          )}

          {/* Your Oils */}
          {oilProducts.length > 0 && (
            <div className="bg-white border border-[#E7F2F1] rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Droplet className="w-5 h-5 text-[#1b4a5a]" />
                <h3 className="text-[#040707]">Your Cooking Oils</h3>
              </div>
              <div className="space-y-2">
                {oilProducts.map((oil: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-[#5B5B5B]">{oil.brand} {oil.type} - {oil.volume}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Factors */}
          <div className="bg-white border border-[#E7F2F1] rounded-xl p-4 mb-6">
            <h3 className="text-[#040707] mb-3">Key Factors Considered</h3>
            <div className="space-y-2">
              {userData?.screen1?.bmi && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5B5B5B]">BMI</span>
                  <span className="text-[#040707]">{userData.screen1.bmi.toFixed(1)}</span>
                </div>
              )}
              {userData?.screen2?.medicalConditions && Object.keys(userData.screen2.medicalConditions).length > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5B5B5B]">Medical Conditions</span>
                  <span className="text-[#040707]">{Object.keys(userData.screen2.medicalConditions).length}</span>
                </div>
              )}
              {userData?.screen3?.mealsPerDay && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5B5B5B]">Meals Per Day</span>
                  <span className="text-[#040707]">{userData.screen3.mealsPerDay}</span>
                </div>
              )}
              {userData?.screen3?.outsideEating && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5B5B5B]">Outside Eating</span>
                  <span className="text-[#040707] capitalize">{userData.screen3.outsideEating}</span>
                </div>
              )}
            </div>
          </div>

          {/* Set Your Goal */}
          <div className="bg-white border border-[#E7F2F1] rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-[#1b4a5a]" />
              <h3 className="text-[#040707]">Set Your Daily Oil Goal</h3>
            </div>
            <p className="text-[#5B5B5B] text-sm mb-4">Adjust your target if needed</p>
            
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={dailyOilGoal}
                onChange={(e) => setDailyOilGoal(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#fafbfa] border border-[#E7F2F1] rounded-xl text-[#040707] text-center text-2xl focus:outline-none focus:border-[#1b4a5a] transition-colors"
              />
              <span className="text-[#5B5B5B]">grams/day</span>
            </div>

            {dailyOilGoal && parseInt(dailyOilGoal) > idealConsumption + 5 && (
              <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-xs">
                  This is higher than recommended. Consider setting a lower goal for better health.
                </p>
              </div>
            )}
          </div>

          {/* Health Benefits */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-green-600" />
              <h3 className="text-green-900">Expected Health Benefits</h3>
            </div>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Reduced risk of heart disease and stroke</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Better cholesterol levels and blood pressure</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Improved weight management</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Supporting India's 10% oil reduction goal</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="bg-white px-5 py-4 border-t border-[#E7F2F1] flex-shrink-0">
        <button
          onClick={handleComplete}
          className="w-full py-4 bg-[#1b4a5a] text-white rounded-xl hover:bg-[#153a47] transition-colors"
        >
          Complete Setup & Start Journey
        </button>
      </div>
    </div>
  );
}

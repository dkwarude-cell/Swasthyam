import { ChevronLeft, Utensils, Coffee, Heart } from 'lucide-react';
import { useState } from 'react';

interface EatingHabitsScreenProps {
  onNext: (data: any) => void;
  onSkip: () => void;
  onBack: () => void;
  language: string;
}

export function EatingHabitsScreen({ onNext, onSkip, onBack, language }: EatingHabitsScreenProps) {
  const [mealsPerDay, setMealsPerDay] = useState('');
  const [outsideEating, setOutsideEating] = useState('');
  const [foodieLevel, setFoodieLevel] = useState('');
  const [dietType, setDietType] = useState('');
  const [cookingStyle, setCookingStyle] = useState('');

  const handleContinue = () => {
    onNext({ 
      mealsPerDay, 
      outsideEating, 
      foodieLevel,
      dietType,
      cookingStyle
    });
  };

  const isFormValid = mealsPerDay && outsideEating && foodieLevel;

  return (
    <div className="h-screen bg-[#fafbfa] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-[#E7F2F1] flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-[#5B5B5B]" />
          </button>
          <span className="text-[#5B5B5B] text-sm">Step 3 of 6</span>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-2 bg-[#E7F2F1] rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-[#1b4a5a] rounded-full transition-all duration-300"
            style={{ width: '50%' }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <h1 className="text-[#040707] text-2xl mb-2">Eating Habits</h1>
        <p className="text-[#5B5B5B] text-sm mb-8">Help us understand your food preferences</p>

        <div className="space-y-5 pb-6">
          {/* Meals Per Day */}
          <div>
            <label className="block text-[#040707] text-sm mb-3">How many meals do you eat per day?</label>
            <div className="grid grid-cols-2 gap-3">
              {['1-2 meals', '3 meals', '4 meals', '5+ meals'].map((option) => (
                <button
                  key={option}
                  onClick={() => setMealsPerDay(option)}
                  className={`py-3 px-4 rounded-xl border-2 transition-all ${
                    mealsPerDay === option
                      ? 'bg-[#1b4a5a] border-[#1b4a5a] text-white'
                      : 'bg-white border-[#E7F2F1] text-[#040707]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Outside Eating Frequency */}
          <div>
            <label className="block text-[#040707] text-sm mb-3">How often do you eat outside or order food?</label>
            <div className="space-y-2">
              {[
                { value: 'rarely', label: 'Rarely (Once a month or less)', icon: '🏠' },
                { value: 'occasionally', label: 'Occasionally (2-3 times a month)', icon: '🍽️' },
                { value: 'weekly', label: 'Weekly (1-2 times a week)', icon: '🍔' },
                { value: 'frequently', label: 'Frequently (3-5 times a week)', icon: '🍕' },
                { value: 'daily', label: 'Almost Daily', icon: '🍱' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setOutsideEating(option.value)}
                  className={`w-full py-3 px-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    outsideEating === option.value
                      ? 'bg-[#1b4a5a] border-[#1b4a5a] text-white'
                      : 'bg-white border-[#E7F2F1] text-[#040707]'
                  }`}
                >
                  <span className="text-xl">{option.icon}</span>
                  <span className="text-sm flex-1 text-left">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Foodie Level */}
          <div>
            <label className="block text-[#040707] text-sm mb-3">How would you describe yourself?</label>
            <div className="space-y-2">
              {[
                { value: 'health-conscious', label: 'Health Conscious', subtitle: 'I prioritize nutrition and healthy eating', icon: Heart },
                { value: 'balanced', label: 'Balanced Eater', subtitle: 'I enjoy food but watch my health', icon: Utensils },
                { value: 'foodie', label: 'Food Lover', subtitle: 'I love trying new foods and flavors', icon: Coffee }
              ].map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setFoodieLevel(option.value)}
                    className={`w-full py-4 px-4 rounded-xl border-2 transition-all flex items-start gap-3 ${
                      foodieLevel === option.value
                        ? 'bg-[#1b4a5a] border-[#1b4a5a] text-white'
                        : 'bg-white border-[#E7F2F1] text-[#040707]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      foodieLevel === option.value ? 'text-white' : 'text-[#fcaf56]'
                    }`} />
                    <div className="flex-1 text-left">
                      <p className={`text-sm ${foodieLevel === option.value ? 'text-white' : 'text-[#040707]'}`}>
                        {option.label}
                      </p>
                      <p className={`text-xs mt-1 ${foodieLevel === option.value ? 'text-white/80' : 'text-[#5B5B5B]'}`}>
                        {option.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Diet Type */}
          <div>
            <label className="block text-[#040707] text-sm mb-3">Dietary Preference</label>
            <select
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#E7F2F1] rounded-xl text-[#040707] focus:outline-none focus:border-[#1b4a5a] transition-colors appearance-none"
            >
              <option value="">Select your diet type</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="eggetarian">Eggetarian</option>
              <option value="jain">Jain</option>
            </select>
          </div>

          {/* Cooking Style */}
          <div>
            <label className="block text-[#040707] text-sm mb-3">Preferred Cooking Style</label>
            <select
              value={cookingStyle}
              onChange={(e) => setCookingStyle(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#E7F2F1] rounded-xl text-[#040707] focus:outline-none focus:border-[#1b4a5a] transition-colors appearance-none"
            >
              <option value="">Select cooking style</option>
              <option value="north-indian">North Indian</option>
              <option value="south-indian">South Indian</option>
              <option value="bengali">Bengali</option>
              <option value="gujarati">Gujarati</option>
              <option value="punjabi">Punjabi</option>
              <option value="mixed">Mixed/Continental</option>
              <option value="minimal-oil">Minimal Oil Cooking</option>
            </select>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white px-5 py-4 border-t border-[#E7F2F1] space-y-3 flex-shrink-0">
        <button
          onClick={handleContinue}
          disabled={!isFormValid}
          className={`w-full py-4 rounded-xl transition-colors ${
            isFormValid
              ? 'bg-[#1b4a5a] text-white hover:bg-[#153a47]'
              : 'bg-[#E7F2F1] text-[#5B5B5B] cursor-not-allowed'
          }`}
        >
          Continue
        </button>
        <button
          onClick={onSkip}
          className="w-full py-2 text-[#5B5B5B] hover:text-[#040707] transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

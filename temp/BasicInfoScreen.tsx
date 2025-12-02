import { ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

interface BasicInfoScreenProps {
  onNext: (data: any) => void;
  onSkip: () => void;
  onBack: () => void;
  language: string;
}

export function BasicInfoScreen({ onNext, onSkip, onBack, language }: BasicInfoScreenProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);

  // Calculate BMI when weight and height change
  useEffect(() => {
    if (weight && height) {
      const weightNum = parseFloat(weight);
      const heightNum = parseFloat(height) / 100; // Convert cm to meters
      if (weightNum > 0 && heightNum > 0) {
        const calculatedBmi = weightNum / (heightNum * heightNum);
        setBmi(calculatedBmi);
      }
    } else {
      setBmi(null);
    }
  }, [weight, height]);

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { text: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { text: 'Overweight', color: 'text-yellow-600' };
    return { text: 'Obese', color: 'text-red-600' };
  };

  const handleContinue = () => {
    onNext({ name, age, gender, weight, height, bmi });
  };

  const isFormValid = name && age && gender && weight && height;

  return (
    <div className="h-screen bg-[#fafbfa] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-[#E7F2F1] flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-[#5B5B5B]" />
          </button>
          <span className="text-[#5B5B5B] text-sm">Step 1 of 6</span>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-2 bg-[#E7F2F1] rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-[#1b4a5a] rounded-full transition-all duration-300"
            style={{ width: '16.67%' }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <h1 className="text-[#040707] text-2xl mb-2">Let's Get Started</h1>
        <p className="text-[#5B5B5B] text-sm mb-8">Tell us a bit about yourself</p>

        <div className="space-y-5 pb-6">
          {/* Name Input */}
          <div>
            <label className="block text-[#040707] text-sm mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 bg-white border border-[#E7F2F1] rounded-xl text-[#040707] focus:outline-none focus:border-[#1b4a5a] transition-colors"
            />
          </div>

          {/* Age Input */}
          <div>
            <label className="block text-[#040707] text-sm mb-2">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              className="w-full px-4 py-3 bg-white border border-[#E7F2F1] rounded-xl text-[#040707] focus:outline-none focus:border-[#1b4a5a] transition-colors"
            />
          </div>

          {/* Gender Dropdown */}
          <div>
            <label className="block text-[#040707] text-sm mb-2">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#E7F2F1] rounded-xl text-[#040707] focus:outline-none focus:border-[#1b4a5a] transition-colors appearance-none"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          {/* Height Input */}
          <div>
            <label className="block text-[#040707] text-sm mb-2">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter your height in cm"
              className="w-full px-4 py-3 bg-white border border-[#E7F2F1] rounded-xl text-[#040707] focus:outline-none focus:border-[#1b4a5a] transition-colors"
            />
          </div>

          {/* Weight Input */}
          <div>
            <label className="block text-[#040707] text-sm mb-2">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter your weight in kg"
              className="w-full px-4 py-3 bg-white border border-[#E7F2F1] rounded-xl text-[#040707] focus:outline-none focus:border-[#1b4a5a] transition-colors"
            />
          </div>

          {/* BMI Display */}
          {bmi !== null && (
            <div className="bg-white border border-[#E7F2F1] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#5B5B5B] text-sm">Your BMI</span>
                <span className="text-[#040707] text-2xl">{bmi.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5B5B5B] text-sm">Category</span>
                <span className={`${getBMICategory(bmi).color}`}>{getBMICategory(bmi).text}</span>
              </div>
              <div className="mt-3 h-2 bg-[#E7F2F1] rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    bmi < 18.5 ? 'bg-blue-500' :
                    bmi < 25 ? 'bg-green-500' :
                    bmi < 30 ? 'bg-yellow-500' :
                    'bg-red-500'
                  } transition-all duration-300`}
                  style={{ width: `${Math.min((bmi / 40) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
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

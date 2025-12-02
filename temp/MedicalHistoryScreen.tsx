import { ChevronLeft, Upload, FileText, ChevronDown, Info } from 'lucide-react';
import { useState } from 'react';

interface MedicalHistoryScreenProps {
  onNext: (data: any) => void;
  onSkip: () => void;
  onBack: () => void;
  language: string;
  userData: any;
}

const medicalConditions = [
  { id: 'diabetes', name: 'Diabetes', hasLevels: true },
  { id: 'hypertension', name: 'High Blood Pressure', hasLevels: true },
  { id: 'heart-disease', name: 'Heart Disease', hasLevels: true },
  { id: 'cholesterol', name: 'High Cholesterol', hasLevels: true },
  { id: 'obesity', name: 'Obesity', hasLevels: true },
  { id: 'thyroid', name: 'Thyroid Issues', hasLevels: true },
  { id: 'kidney-disease', name: 'Kidney Disease', hasLevels: true },
  { id: 'liver-disease', name: 'Liver Disease', hasLevels: true },
  { id: 'arthritis', name: 'Arthritis', hasLevels: false },
  { id: 'asthma', name: 'Asthma', hasLevels: false },
];

export function MedicalHistoryScreen({ onNext, onSkip, onBack, language, userData }: MedicalHistoryScreenProps) {
  const [selectedConditions, setSelectedConditions] = useState<{[key: string]: string}>({});
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportType, setReportType] = useState('');

  const bmi = userData?.screen1?.bmi;

  const toggleCondition = (conditionId: string) => {
    setSelectedConditions(prev => {
      const newConditions = { ...prev };
      if (newConditions[conditionId]) {
        delete newConditions[conditionId];
      } else {
        newConditions[conditionId] = 'mild';
      }
      return newConditions;
    });
  };

  const setSeverity = (conditionId: string, severity: string) => {
    setSelectedConditions(prev => ({
      ...prev,
      [conditionId]: severity
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReportFile(file);
    }
  };

  const handleContinue = () => {
    onNext({ 
      medicalConditions: selectedConditions, 
      reportFile: reportFile?.name,
      reportType 
    });
  };

  return (
    <div className="h-screen bg-[#fafbfa] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-[#E7F2F1] flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-[#5B5B5B]" />
          </button>
          <span className="text-[#5B5B5B] text-sm">Step 2 of 6</span>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-2 bg-[#E7F2F1] rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-[#1b4a5a] rounded-full transition-all duration-300"
            style={{ width: '33.33%' }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <h1 className="text-[#040707] text-2xl mb-2">Medical History</h1>
        <p className="text-[#5B5B5B] text-sm mb-2">Select any conditions you have to calculate your ideal oil consumption</p>

        {/* BMI Info */}
        {bmi && (
          <div className="bg-[#fcaf56]/10 border border-[#fcaf56]/30 rounded-xl p-4 mb-6 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#fcaf56] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[#040707] text-sm mb-1">Your BMI: <span className="font-semibold">{bmi.toFixed(1)}</span></p>
              <p className="text-[#5B5B5B] text-xs">Medical history helps us personalize your oil consumption recommendations</p>
            </div>
          </div>
        )}

        <div className="space-y-3 pb-6">
          {medicalConditions.map((condition) => (
            <div key={condition.id} className="bg-white border border-[#E7F2F1] rounded-xl overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => toggleCondition(condition.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                    selectedConditions[condition.id] 
                      ? 'bg-[#1b4a5a] border-[#1b4a5a]' 
                      : 'border-[#E7F2F1]'
                  }`}>
                    {selectedConditions[condition.id] && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[#040707]">{condition.name}</span>
                </div>
                {condition.hasLevels && selectedConditions[condition.id] && (
                  <ChevronDown className="w-5 h-5 text-[#5B5B5B]" />
                )}
              </div>

              {/* Severity Levels */}
              {condition.hasLevels && selectedConditions[condition.id] && (
                <div className="px-4 pb-4 pt-0 space-y-2 border-t border-[#E7F2F1]">
                  <p className="text-[#5B5B5B] text-xs mb-2 mt-2">Severity Level:</p>
                  <div className="flex gap-2">
                    {['mild', 'moderate', 'severe'].map((severity) => (
                      <button
                        key={severity}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSeverity(condition.id, severity);
                        }}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
                          selectedConditions[condition.id] === severity
                            ? 'bg-[#1b4a5a] text-white'
                            : 'bg-[#E7F2F1] text-[#5B5B5B]'
                        }`}
                      >
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Upload Medical Report */}
          <div className="bg-white border border-[#E7F2F1] rounded-xl p-4 mt-6">
            <p className="text-[#040707] mb-3">Upload Recent Medical Report (Optional)</p>
            
            {/* Report Type */}
            <div className="mb-3">
              <label className="block text-[#5B5B5B] text-sm mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#E7F2F1] rounded-xl text-[#040707] focus:outline-none focus:border-[#1b4a5a] transition-colors appearance-none"
              >
                <option value="">Select report type</option>
                <option value="blood-test">Blood Test</option>
                <option value="diabetes">Diabetes Report</option>
                <option value="lipid-profile">Lipid Profile</option>
                <option value="liver-function">Liver Function Test</option>
                <option value="kidney-function">Kidney Function Test</option>
                <option value="thyroid">Thyroid Test</option>
                <option value="general">General Health Checkup</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* File Upload */}
            <label className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-[#E7F2F1] rounded-xl cursor-pointer hover:border-[#1b4a5a] transition-colors">
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
              />
              {reportFile ? (
                <>
                  <FileText className="w-6 h-6 text-[#1b4a5a]" />
                  <div className="flex-1">
                    <p className="text-[#040707] text-sm">{reportFile.name}</p>
                    <p className="text-[#5B5B5B] text-xs">Click to change</p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-[#5B5B5B]" />
                  <div className="flex-1">
                    <p className="text-[#040707] text-sm">Upload Report</p>
                    <p className="text-[#5B5B5B] text-xs">PDF, JPG, PNG (Max 10MB)</p>
                  </div>
                </>
              )}
            </label>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white px-5 py-4 border-t border-[#E7F2F1] space-y-3 flex-shrink-0">
        <button
          onClick={handleContinue}
          className="w-full py-4 bg-[#1b4a5a] text-white rounded-xl hover:bg-[#153a47] transition-colors"
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

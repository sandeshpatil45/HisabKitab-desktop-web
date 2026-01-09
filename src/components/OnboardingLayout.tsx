import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

interface StepProps {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}

const Step: React.FC<StepProps> = ({ number, label, active, completed }) => {
  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
            completed
              ? 'bg-green-600 text-white'
              : active
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-500'
          }`}
        >
          {completed ? '✓' : number}
        </div>
        <p
          className={`mt-2 text-sm font-medium ${
            active ? 'text-green-600' : completed ? 'text-green-600' : 'text-gray-500'
          }`}
        >
          {label}
        </p>
      </div>
    </div>
  );
};

const OnboardingLayout: React.FC = () => {
  const location = useLocation();

  // Determine current step based on route
  const getCurrentStep = () => {
    if (location.pathname.includes('business-details')) return 1;
    if (location.pathname.includes('bulk-menu')) return 2;
    if (location.pathname.includes('subscription')) return 3;
    return 1;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-green-600">HisabKitab</h1>
          <p className="text-gray-600 mt-1">Restaurant Setup</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-12">
          <Step number={1} label="Business Details" active={currentStep === 1} completed={currentStep > 1} />
          
          {/* Line connector */}
          <div className={`flex-1 h-1 mx-4 ${currentStep > 1 ? 'bg-green-600' : 'bg-gray-200'}`} />
          
          <Step number={2} label="Menu Setup" active={currentStep === 2} completed={currentStep > 2} />
          
          {/* Line connector */}
          <div className={`flex-1 h-1 mx-4 ${currentStep > 2 ? 'bg-green-600' : 'bg-gray-200'}`} />
          
          <Step number={3} label="Subscription" active={currentStep === 3} completed={currentStep > 3} />
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;

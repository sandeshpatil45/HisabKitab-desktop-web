import { useNavigate } from 'react-router-dom';

export default function SubscriptionScreen() {
  const navigate = useNavigate();

  const handleContinueWithTrial = () => {
    // Mark onboarding as complete
    localStorage.setItem('onboardingComplete', 'true');
    
    // Navigate to main app
    navigate('/tables');
  };

  const handleUpgrade = () => {
    // Future: Open payment modal
    alert('Payment integration coming soon! For now, continue with trial.');
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Trial Status */}
      <div className="mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Trial is Active</h2>
        <p className="text-xl text-gray-600">7 days remaining</p>
      </div>

      {/* Trial Features */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Trial Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
          <div className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-gray-700">Basic Features</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-gray-700">Offline Billing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-gray-700">Tables & Menu Management</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-gray-700">KOT Generation</span>
          </div>
        </div>
      </div>

      {/* Premium Plan */}
      <div className="border-2 border-green-600 rounded-xl p-6 mb-8 bg-gradient-to-br from-green-50 to-white">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-3xl">💎</span>
          <h3 className="text-2xl font-bold text-gray-800">Premium Plan</h3>
        </div>
        <p className="text-3xl font-bold text-green-600 mb-6">₹999/month</p>

        <p className="text-gray-700 font-semibold mb-4">Everything in Trial, plus:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left mb-6">
          <div className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-gray-700">Desktop + Mobile Access</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-gray-700">Cloud Sync & Backup</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-gray-700">Advanced Reports & Analytics</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-gray-700">WhatsApp Integration</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-gray-700">Priority Support</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-gray-700">Unlimited Staff Accounts</span>
          </div>
        </div>

        <button
          onClick={handleUpgrade}
          className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg transition-colors"
        >
          Upgrade Now →
        </button>
      </div>

      {/* Continue with Trial */}
      <button
        onClick={handleContinueWithTrial}
        className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
      >
        Continue with Trial →
      </button>

      <p className="text-sm text-gray-500 mt-4">
        No credit card required for trial. Cancel anytime.
      </p>
    </div>
  );
}

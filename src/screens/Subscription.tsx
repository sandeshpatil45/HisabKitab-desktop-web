import { roleCheck } from '../utils/roleCheck';

export default function Subscription() {
  const canAccess = roleCheck.isOwner();

  if (!canAccess) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">You don't have permission to access this page.</p>
      </div>
    );
  }

  const handleUpgrade = (plan: string) => {
    alert(`Upgrade to ${plan} coming soon! Payment integration in progress.`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-2">Billing</p>
        <h1 className="text-4xl font-bold text-gray-800">Subscription</h1>
      </div>

      {/* Current Plan Card */}
      <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-xl p-8 mb-8 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Current Plan</h2>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-semibold">Plan:</span>
                <span className="text-gray-900">Trial</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-semibold">Status:</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-semibold">Valid until:</span>
                <span className="text-gray-900">17 Jan 2026</span>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Features:</h3>
                <ul className="space-y-1 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Basic Billing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Reports</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="text-6xl">🎉</div>
        </div>
      </div>

      {/* Available Plans */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Plans</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Base Plan */}
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200 hover:border-green-400 transition-colors">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Base Plan</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-green-600">₹500</span>
              <span className="text-gray-600">/month</span>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-green-600 font-bold">✓</span>
              <span>Billing + Reports</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-green-600 font-bold">✓</span>
              <span>Offline Mode</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-green-600 font-bold">✓</span>
              <span>Table Management</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-green-600 font-bold">✓</span>
              <span>Basic Support</span>
            </div>
          </div>

          <button
            onClick={() => handleUpgrade('Base Plan')}
            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
          >
            Upgrade to Base
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-xl p-8 border-2 border-green-500 relative">
          <div className="absolute -top-3 right-6">
            <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">RECOMMENDED</span>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Pro Plan</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-green-600">₹800</span>
              <span className="text-gray-600">/month</span>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <p className="text-gray-700 font-semibold mb-3">All Base features, plus:</p>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-green-600 font-bold">✓</span>
              <span>KOT + Kitchen Display</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-green-600 font-bold">✓</span>
              <span>Cloud Sync & Backup</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-green-600 font-bold">✓</span>
              <span>Advanced Reports</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-green-600 font-bold">✓</span>
              <span>WhatsApp Integration</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-green-600 font-bold">✓</span>
              <span>Priority Support</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-green-600 font-bold">✓</span>
              <span>Unlimited Staff</span>
            </div>
          </div>

          <button
            onClick={() => handleUpgrade('Pro Plan')}
            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors shadow-md"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>

      {/* Note */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          💡 <strong>Note:</strong> All plans include GST. You can cancel or change your plan anytime.
        </p>
      </div>
    </div>
  );
}

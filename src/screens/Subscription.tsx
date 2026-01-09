import React from 'react';
import { roleCheck } from '../utils/roleCheck';

const Subscription: React.FC = () => {
  const canAccess = roleCheck.isOwner();

  if (!canAccess) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Current Subscription</h2>
            <p className="text-gray-600">Manage your HisabKitab subscription plan</p>
          </div>

          {/* Current Plan */}
          <div className="bg-gradient-to-r from-primary to-green-700 rounded-lg p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold mb-2">Premium Plan</h3>
                <p className="text-green-100">Active until: December 31, 2026</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">₹999</p>
                <p className="text-green-100">per month</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Plan Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Unlimited Tables',
                'Unlimited Menu Items',
                'Unlimited Staff Members',
                'Real-time Reports',
                'KOT & Bill Printing',
                'WhatsApp Integration',
                'Data Backup',
                'Priority Support',
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button className="btn-primary">Renew Subscription</button>
            <button className="btn-secondary">View All Plans</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;

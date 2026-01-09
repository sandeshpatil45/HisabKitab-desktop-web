import React, { useState, useEffect } from 'react';
import { restaurantApi } from '../api/restaurantApi';
import type { RestaurantSettings } from '../types';
import { authService } from '../utils/authService';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const user = authService.getUser();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await restaurantApi.getSettings();
      setSettings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      await restaurantApi.updateSettings(settings);
      setSuccess('Settings saved successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6">
          {/* User Info */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4">User Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Username</p>
                <p className="font-medium">{user?.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-medium">{user?.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mobile</p>
                <p className="font-medium">{user?.mobile}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{user?.firstName || '-'}</p>
              </div>
            </div>
          </div>

          {/* Restaurant Settings */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading settings...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {!loading && settings && (
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Restaurant Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    value={settings.restaurantName}
                    onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={settings.address || ''}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="input-field"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile
                    </label>
                    <input
                      type="text"
                      value={settings.mobile || ''}
                      onChange={(e) => setSettings({ ...settings, mobile: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.email || ''}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Number
                  </label>
                  <input
                    type="text"
                    value={settings.gstNumber || ''}
                    onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CGST %
                    </label>
                    <input
                      type="number"
                      value={settings.cgstPercentage}
                      onChange={(e) => setSettings({ ...settings, cgstPercentage: parseFloat(e.target.value) })}
                      className="input-field"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SGST %
                    </label>
                    <input
                      type="number"
                      value={settings.sgstPercentage}
                      onChange={(e) => setSettings({ ...settings, sgstPercentage: parseFloat(e.target.value) })}
                      className="input-field"
                      step="0.1"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary"
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          )}

          {/* App Info */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Application Info</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Version: 1.0.0</p>
              <p>HisabKitab Restaurant POS Desktop Web App</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

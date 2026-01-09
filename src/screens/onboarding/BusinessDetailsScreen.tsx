import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../api/apiService';

export default function BusinessDetailsScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    mobileNumber: '',
    address: '',
    gstNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Pre-fill from localStorage if available
    const savedDetails = localStorage.getItem('businessDetails');
    if (savedDetails) {
      try {
        const parsed = JSON.parse(savedDetails);
        setFormData(parsed);
      } catch (e) {
        console.error('Failed to parse saved business details');
      }
    }

    // Pre-fill business name from registration
    const shopName = localStorage.getItem('shopName');
    if (shopName && !formData.businessName) {
      setFormData(prev => ({ ...prev, businessName: shopName }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto-uppercase GST number
    if (name === 'gstNumber') {
      setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSkip = () => {
    navigate('/onboarding/bulk-menu');
  };

  const handleSave = async () => {
    setError('');

    // Validate mobile number if provided
    if (formData.mobileNumber && formData.mobileNumber.length > 0) {
      const cleanedMobile = formData.mobileNumber.replace(/\D/g, '');
      if (cleanedMobile.length !== 10) {
        setError('Mobile number must be 10 digits');
        return;
      }
    }

    // Validate GST number format if provided
    if (formData.gstNumber && formData.gstNumber.length > 0) {
      if (formData.gstNumber.length !== 15) {
        setError('GST number must be 15 characters');
        return;
      }
    }

    setLoading(true);

    try {
      // Save to localStorage
      localStorage.setItem('businessDetails', JSON.stringify(formData));

      // Sync to backend (non-blocking)
      try {
        await apiService.put('/api/shop', {
          name: formData.businessName || undefined,
          address: formData.address || undefined,
          phone: formData.mobileNumber || undefined,
          gstNumber: formData.gstNumber || undefined,
        });
      } catch (backendError) {
        console.error('Backend sync failed, saved locally:', backendError);
        // Don't block user flow if backend fails
      }

      // Navigate to next step
      navigate('/onboarding/bulk-menu');
    } catch (err: any) {
      setError(err.message || 'Failed to save details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Business Details</h2>
      <p className="text-gray-600 mb-6">Tell us about your restaurant (optional)</p>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Business Name */}
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
            Business Name
          </label>
          <input
            id="businessName"
            name="businessName"
            type="text"
            value={formData.businessName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your restaurant name"
            disabled={loading}
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number
          </label>
          <input
            id="mobileNumber"
            name="mobileNumber"
            type="tel"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter 10 digit mobile number"
            maxLength={10}
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">Enter 10 digits only</p>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter restaurant address"
            disabled={loading}
          />
        </div>

        {/* GST Number */}
        <div>
          <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 mb-2">
            GST Number
          </label>
          <input
            id="gstNumber"
            name="gstNumber"
            type="text"
            value={formData.gstNumber}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., 27XXXXX1234X1ZX"
            maxLength={15}
            style={{ textTransform: 'uppercase' }}
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">Format: 15 characters (auto-uppercase)</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={handleSkip}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          Skip
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>
    </div>
  );
}

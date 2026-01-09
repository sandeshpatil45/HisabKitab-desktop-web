import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiService } from '../api/apiService';
import { validation } from '../utils/validation';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    phone: '',
    shopName: '',
    shopAddress: '',
    shopPhone: '',
    gstNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!validation.isRequired(formData.username)) {
      setError('Username is required');
      return;
    }

    if (!validation.isRequired(formData.password)) {
      setError('Password is required');
      return;
    }

    if (!validation.isRequired(formData.name)) {
      setError('Your name is required');
      return;
    }

    if (!validation.isRequired(formData.shopName)) {
      setError('Shop name is required');
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.register({
        username: formData.username.trim(),
        password: formData.password.trim(),
        name: formData.name.trim(),
        phone: formData.phone.trim() || '+91',
        shopName: formData.shopName.trim(),
        shopAddress: formData.shopAddress.trim() || '',
        shopPhone: formData.shopPhone.trim() || formData.phone.trim() || '+91',
        gstNumber: formData.gstNumber.trim() || '27XXXXX1234X1ZX',
        defaultLanguage: 'ENGLISH',
        businessType: 'RESTAURANT',
      });

      // Response is already unwrapped by apiService.register()
      // response = { token, username, role, shopId, shopName }
      if (response.token) {
        // Successfully registered and token stored
        // Check if onboarding complete
        const onboardingComplete = localStorage.getItem('onboardingComplete');
        
        if (onboardingComplete === 'true') {
          navigate('/tables');
        } else {
          // New user - start onboarding
          navigate('/onboarding/business-details');
        }
      } else {
        throw new Error('Registration failed: No token received');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-green-700 py-12 px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">HisabKitab</h1>
          <p className="text-gray-600">Create Your Restaurant Account</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="input-field"
                placeholder="Choose username"
                autoComplete="username"
                disabled={loading}
                autoFocus
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Choose password"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your name"
                disabled={loading}
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="+91 9876543210"
                disabled={loading}
              />
            </div>

            {/* Shop Name */}
            <div>
              <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-2">
                Shop Name <span className="text-red-500">*</span>
              </label>
              <input
                id="shopName"
                name="shopName"
                type="text"
                value={formData.shopName}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter shop name"
                disabled={loading}
              />
            </div>

            {/* Shop Phone */}
            <div>
              <label htmlFor="shopPhone" className="block text-sm font-medium text-gray-700 mb-2">
                Shop Phone
              </label>
              <input
                id="shopPhone"
                name="shopPhone"
                type="tel"
                value={formData.shopPhone}
                onChange={handleChange}
                className="input-field"
                placeholder="+91 9876543210"
                disabled={loading}
              />
            </div>
          </div>

          {/* Shop Address */}
          <div>
            <label htmlFor="shopAddress" className="block text-sm font-medium text-gray-700 mb-2">
              Shop Address
            </label>
            <textarea
              id="shopAddress"
              name="shopAddress"
              value={formData.shopAddress}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter shop address"
              rows={2}
              disabled={loading}
            />
          </div>

          {/* GST Number */}
          <div>
            <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 mb-2">
              GST Number (Optional)
            </label>
            <input
              id="gstNumber"
              name="gstNumber"
              type="text"
              value={formData.gstNumber}
              onChange={handleChange}
              className="input-field"
              placeholder="27XXXXX1234X1ZX"
              maxLength={15}
              disabled={loading}
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-green-700 font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

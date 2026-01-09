import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import OnboardingLayout from './components/OnboardingLayout';

// Screens
import Login from './screens/Login';
import Register from './screens/Register';

// Onboarding
import BusinessDetailsScreen from './screens/onboarding/BusinessDetailsScreen';
import BulkMenuAddScreen from './screens/onboarding/BulkMenuAddScreen';
import SubscriptionScreen from './screens/onboarding/SubscriptionScreen';

// Main App
import Tables from './screens/Tables';
import MenuOrderScreen from './screens/MenuOrderScreen';
import InvoiceScreen from './screens/InvoiceScreen';
import Billing from './screens/Billing';
import Menu from './screens/Menu';
import Staff from './screens/Staff';
import Invoices from './screens/Invoices';
import Reports from './screens/Reports';
import OrderRolls from './screens/OrderRolls';
import Subscription from './screens/Subscription';
import Settings from './screens/Settings';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Onboarding Routes */}
        <Route path="/onboarding" element={<OnboardingLayout />}>
          <Route path="business-details" element={<BusinessDetailsScreen />} />
          <Route path="bulk-menu" element={<BulkMenuAddScreen />} />
          <Route path="subscription" element={<SubscriptionScreen />} />
        </Route>
        
        {/* Protected Routes - Wrapped in ProtectedRoute which adds Layout */}
        <Route path="/" element={<Navigate to="/tables" replace />} />
        <Route 
          path="/tables" 
          element={
            <ProtectedRoute>
              <Tables />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tables/:id/menu-order" 
          element={
            <ProtectedRoute>
              <MenuOrderScreen />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tables/:id/invoice" 
          element={
            <ProtectedRoute>
              <InvoiceScreen />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/billing/:id" 
          element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/menu" 
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/staff" 
          element={
            <ProtectedRoute>
              <Staff />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/invoices" 
          element={
            <ProtectedRoute>
              <Invoices />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/order-rolls" 
          element={
            <ProtectedRoute>
              <OrderRolls />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/subscription" 
          element={
            <ProtectedRoute>
              <Subscription />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/tables" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

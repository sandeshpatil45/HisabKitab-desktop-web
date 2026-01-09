import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Screens
import Login from './screens/Login';
import Register from './screens/Register';
import Tables from './screens/Tables';
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
        
        {/* Protected Routes - Wrapped in Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/tables" replace />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/tables/:id/billing" element={<Billing />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/order-rolls" element={<OrderRolls />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/tables" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

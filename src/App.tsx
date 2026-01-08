import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Screens
import Login from './screens/Login';
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
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/tables"
          element={
            <ProtectedRoute>
              <Tables />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/billing/:tableId"
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
        
        <Route path="/" element={<Navigate to="/tables" replace />} />
        <Route path="*" element={<Navigate to="/tables" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

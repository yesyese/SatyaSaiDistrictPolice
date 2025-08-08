// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Pages
import EditRefugeeCasePage from './pages/EditRefugeeCasePage';
import RefugeeCaseDetailsPage from './pages/RefugeeCaseDetailsPage';
import LoginPage from './LoginPage';
import SecurityPage from './pages/SecurityPage';
import OrganizationsPage from './pages/OrganizationsPage';
import GrievanceDetailsPage from './pages/GrievanceDetailsPage';
import OutOfViewCaseDetailsPage from './pages/OutOfViewCaseDetailsPage';
import DeleteConfirmationModal from './pages/DeleteConfirmationModal'; // WHAT CHANGED: Path corrected to components
import EditForeignerPage from './pages/EditForeignerPage';
import ForeignerDetailsPage from './pages/ForeignerDetailsPage';
import NotificationsPage from './pages/NotificationsPage';
import DashboardPage from './DashboardPage';
import DashboardOverviewPage from './pages/DashboardOverviewPage';
import UnregisteredArrivalsPage from './pages/UnregisteredArrivalsPage';
import OverstaysPage from './pages/OverstaysPage';
import OverstayDetailsPage from './pages/OverstayDetailsPage';
import RefugeesPage from './pages/RefugeesPage'; // Note: Check if this file name is RufugeesPage.jsx or RefugeesPage.jsx
import OutOfViewCasesPage from './pages/OutOfViewCasesPage';
import CitizenshipRequestsPage from './pages/CitizenshipRequestsPage';
import GrievanceHandlingPage from './pages/GrievanceHandlingPage';
import HelpPage from './pages/HelpPage';
import RegisteredArrivalsPage from './pages/RegisteredArrivalsPage';
import UserManagementPage from './pages/UserManagementPage';
import AddForeignerPage from './pages/AddForeignerPage';
// import OrganizationsPage from './pages/OrganizationsPage'; // WHAT CHANGED: Added OrganizationsPage import
import NotFound from './pages/NotFound';

// Routes
import ProtectedRoute from './components/ProtectedRoute';
import SuperAdminRoute from './components/SuperAdminRoute';

// Auth
import { loginUser, fetchCurrentUser, logoutUser } from './authService';
import Analytics from './pages/Analytics';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);

      try {
        const currentUser = await fetchCurrentUser();

        if (currentUser?.id && currentUser?.username && currentUser?.role) {
          setUser(currentUser);
          setIsAuthenticated(true);

          const shouldWelcome = sessionStorage.getItem('showWelcomeToast');
          if (shouldWelcome) {
            setTimeout(() => {
              // toast.success(`Welcome back, ${currentUser.username}!`); // Removed for cleaner UX during auto-login
              sessionStorage.removeItem('showWelcomeToast');
            }, 300);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = async (username, password) => {
    setLoading(true);

    try {
      await loginUser(username, password);
      const currentUser = await fetchCurrentUser();

      if (currentUser?.id && currentUser?.username && currentUser?.role) {
        setUser(currentUser);
        setIsAuthenticated(true);
        sessionStorage.setItem('showWelcomeToast', 'true');
        toast.success(` Login successful! Redirecting...`);
      } else {
        toast.error(' Login succeeded, but user data failed to load.');
        await logoutUser(); // Ensure backend logout happens
        setIsAuthenticated(false);
      }
    } catch (err) {
      toast.error(err.message || '❌ Login failed.');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // WHAT CHANGED: Make handleLogout async and await logoutUser
  const handleLogout = async () => {
    await logoutUser(); // Ensure backend logout completes before updating state
    setIsAuthenticated(false);
    setUser(null);
    toast.info('You have been logged out.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={
          isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <LoginPage onLogin={handleLogin} loading={loading} />
        } />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          {/* WHAT CHANGED: Nested routes for modals like EditForeignerPage */}
          <Route path='/foreigners/edit/:foreignerId' element={<EditForeignerPage />} />
          <Route path='/overstays/:id' element={<OverstayDetailsPage />} /> {/* Route for viewing overstay details */}
          <Route path='/out-of-view-cases/:caseId' element={<OutOfViewCaseDetailsPage />} /> {/* Route for OutOfViewCaseDetailsPage */}
          <Route path='/grievances/:grievanceId' element={<GrievanceDetailsPage />} /> {/* Route for GrievanceDetailsPage */}
          {/* Note: DeleteConfirmationModal is opened programmatically, not via a direct route like this. */}
          {/* <Route path='/foreigners/delete/:foreignerId' element={<DeleteConfirmationModal />} /> */}
          <Route path='/refugees/edit/:refugeeId' element={<EditRefugeeCasePage />} />

          <Route path="/" element={<DashboardPage user={user} onLogout={handleLogout} />}>
            {/* Nested routes will render inside the <Outlet> of DashboardPage */}
            <Route index element={<DashboardOverviewPage />} />
            <Route path="/dashboard" element={<DashboardOverviewPage />} />
<Route path="/refugees/:refugeeId" element={<RefugeeCaseDetailsPage onClose={() => {}} />} /> {/* Route for RefugeeCaseDetailsPage */}
            {/* Core Modules */}
            <Route path="/registered-arrivals" element={<RegisteredArrivalsPage />} />
            <Route path="/foreigners/add" element={<AddForeignerPage />} />
            <Route path="/unregistered-arrivals" element={<UnregisteredArrivalsPage />} />
            <Route path="/overstays" element={<OverstaysPage />} />
            <Route path="/refugees" element={<RefugeesPage />} /> {/* Note: Check if this is RefugeesPage or RufugeesPage */}
            <Route path="/citizenship-requests" element={<CitizenshipRequestsPage />} />
            <Route path="/out-of-view-cases" element={<OutOfViewCasesPage />} />
            <Route path="/grievance-handling" element={<GrievanceHandlingPage />} />
            <Route path='/ai-analytics' element={<Analytics/>} />
            {/* Administration */}
            <Route path="/organizations" element={<OrganizationsPage />} /> WHAT CHANGED: Added OrganizationsPage Route

            {/* System */}
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<p className="text-gray-400 p-6">Settings Page - Coming Soon!</p>} /> {/* Placeholder */}
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/help" element={<HelpPage />} />

            {/* Super Admin Only */}
            <Route element={<SuperAdminRoute user={user} />}>
              <Route path="/users" element={<UserManagementPage currentUser={user} />} />
            </Route>

            {/* Catch-all for any other path within the dashboard area */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        {/* Fallback for any other path not caught by the above, redirects to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminCompanies from "./pages/Admin/AdminCompanies";
import AdminApprovals from "./pages/Admin/AdminApprovals";
import AdminSubscriptions from "./pages/Admin/AdminSubscriptions";
import CompanyDashboard from "./pages/Company/Dashboard";
import ClientDashboard from "./pages/Client/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import Settings from "./pages/Settings";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public pages */}
          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />
          <Route
            path="/login"
            element={
              <MainLayout>
                <Login />
              </MainLayout>
            }
          />

          {/* Admin pages */}
          <Route
            path="/admin"
            element={
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            }
          />
          <Route
            path="/admin/companies"
            element={
              <MainLayout>
                <AdminCompanies />
              </MainLayout>
            }
          />
          <Route
            path="/admin/approvals"
            element={
              <MainLayout>
                <AdminApprovals />
              </MainLayout>
            }
          />
          <Route
            path="/admin/subscriptions"
            element={
              <MainLayout>
                <AdminSubscriptions />
              </MainLayout>
            }
          />

          {/* Company and Client */}
          <Route
            path="/company"
            element={
              <MainLayout>
                <CompanyDashboard />
              </MainLayout>
            }
          />   {/* setting */}
          <Route
            path="/settings"
            element={
              <MainLayout>
                <Settings />
              </MainLayout>
            }
          />
          <Route
            path="/client"
            element={
              <MainLayout>
                <ClientDashboard />
              </MainLayout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

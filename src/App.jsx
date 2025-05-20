// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/Admin/Dashboard";
import CompanyDashboard from "./pages/Company/Dashboard";
import ClientDashboard from "./pages/Client/Dashboard";
import { AuthProvider } from "./context/AuthContext"; // ✅ Add this

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/company" element={<CompanyDashboard />} />
            <Route path="/client" element={<ClientDashboard />} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;

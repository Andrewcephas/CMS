// src/pages/Admin/AdminDashboard.jsx
import { Building2, BadgeCheck, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    activeSubscriptions: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("adminStats")) || {
      totalCompanies: 12,
      activeSubscriptions: 8,
      pendingApprovals: 3,
    };
    setStats(data);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-dark p-6">
      <h1 className="text-3xl font-bold text-primary mb-4">Admin Dashboard</h1>
      <p className="mb-6 text-gray-700">Manage companies, clients, and system-wide subscriptions.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Total Companies" value={stats.totalCompanies} icon={<Building2 />} />
        <DashboardCard title="Active Subscriptions" value={stats.activeSubscriptions} icon={<BadgeCheck />} />
        <DashboardCard title="Pending Approvals" value={stats.pendingApprovals} icon={<Clock />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <AdminAction label="Manage Companies" to="/admin/companies" />
        <AdminAction label="Approve Requests" to="/admin/approvals" />
        <AdminAction label="Subscription Plans" to="/admin/subscriptions" />
      </div>

      <RecentCompanies />
    </div>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
      <div className="flex items-center gap-2 mb-2 text-primary">
        {icon}
        <h2 className="text-xl font-semibold text-dark">{title}</h2>
      </div>
      <p className="text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}

function AdminAction({ label, to }) {
  return (
    <Link to={to} className="bg-white p-4 rounded-xl shadow hover:shadow-md transition text-center font-medium text-primary border border-primary hover:bg-primary hover:text-white">
      {label}
    </Link>
  );
}

function RecentCompanies() {
  const recent = JSON.parse(localStorage.getItem("recentCompanies")) || [
    { name: "Emaxy IT", email: "admin@emaxyit.co.ke", date: "2025-05-20" },
    { name: "Catech", email: "andrew@catech.co.ke", date: "2025-05-19" },
    { name: "TechPro", email: "info@techpro.com", date: "2025-05-18" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-xl font-semibold text-dark mb-4">Recent Company Sign-ups</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Company</th>
            <th className="py-2">Email</th>
            <th className="py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {recent.map((company, i) => (
            <tr key={i} className="border-b text-gray-700">
              <td className="py-2">{company.name}</td>
              <td className="py-2">{company.email}</td>
              <td className="py-2">{company.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;

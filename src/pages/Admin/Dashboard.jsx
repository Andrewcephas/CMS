function AdminDashboard() {
    return (
      <div className="min-h-screen bg-gray-100 text-dark p-6">
        <h1 className="text-3xl font-bold text-primary mb-4">Admin Dashboard</h1>
        <p className="mb-6 text-gray-700">Manage companies, clients, and system-wide subscriptions.</p>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-dark mb-2">Total Companies</h2>
            <p className="text-2xl font-bold text-primary">12</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-dark mb-2">Active Subscriptions</h2>
            <p className="text-2xl font-bold text-primary">8</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-dark mb-2">Pending Approvals</h2>
            <p className="text-2xl font-bold text-primary">3</p>
          </div>
        </div>
      </div>
    );
  }
  
  export default AdminDashboard;
  
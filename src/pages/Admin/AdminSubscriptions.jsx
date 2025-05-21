import { useState, useEffect } from "react";

function AdminSubscriptions() {
  // Load subscriptions from localStorage or default sample
  const [subscriptions, setSubscriptions] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("subscriptions")) || [
        { id: 1, company: "Emaxy IT", plan: "Pro", status: "Active" },
        { id: 2, company: "Catech", plan: "Basic", status: "Inactive" },
      ]
    );
  });

  const [form, setForm] = useState({ company: "", plan: "", status: "Active" });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Sync subscriptions to localStorage when changed
  useEffect(() => {
    localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
  }, [subscriptions]);

  // Handle form submit: add or update subscription
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.company.trim() || !form.plan.trim()) {
      alert("Company and plan are required.");
      return;
    }

    if (editingId) {
      // Update existing subscription
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === editingId
            ? { ...sub, company: form.company.trim(), plan: form.plan.trim(), status: form.status }
            : sub
        )
      );
      alert("Subscription updated successfully.");
    } else {
      // Add new subscription with unique ID
      setSubscriptions((prev) => [
        ...prev,
        {
          id: Date.now(),
          company: form.company.trim(),
          plan: form.plan.trim(),
          status: form.status,
        },
      ]);
      alert("Subscription added successfully.");
    }

    setForm({ company: "", plan: "", status: "Active" });
    setEditingId(null);
  };

  // Delete subscription with confirmation
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
      alert("Subscription deleted.");
      if (editingId === id) {
        setEditingId(null);
        setForm({ company: "", plan: "", status: "Active" });
      }
    }
  };

  // Load subscription to form for editing
  const handleEdit = (id) => {
    const sub = subscriptions.find((s) => s.id === id);
    if (!sub) return;
    setForm({ company: sub.company, plan: sub.plan, status: sub.status });
    setEditingId(id);
  };

  // Cancel editing form
  const cancelEdit = () => {
    setEditingId(null);
    setForm({ company: "", plan: "", status: "Active" });
  };

  // Toggle subscription status
  const toggleStatus = (id) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === id
          ? { ...sub, status: sub.status === "Active" ? "Inactive" : "Active" }
          : sub
      )
    );
  };

  // Filtered subscriptions based on search
  const filtered = subscriptions.filter(
    (sub) =>
      sub.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-primary">Subscription Plans</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by company, plan, or status..."
        className="mb-4 p-2 rounded border w-full max-w-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Subscription list */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full bg-white rounded shadow text-left">
          <thead>
            <tr className="border-b bg-gray-200">
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Plan</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No subscriptions found.
                </td>
              </tr>
            ) : (
              filtered.map((sub) => (
                <tr key={sub.id} className="border-b text-gray-700">
                  <td className="py-2 px-4">{sub.company}</td>
                  <td className="py-2 px-4">{sub.plan}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => toggleStatus(sub.id)}
                      className={`px-3 py-1 rounded text-white ${
                        sub.status === "Active" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                      }`}
                      title="Toggle Status"
                    >
                      {sub.status}
                    </button>
                  </td>
                  <td className="py-2 px-4 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(sub.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      title="Edit Subscription"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      title="Delete Subscription"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Subscription Form */}
      <div className="max-w-xl bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Subscription" : "Add New Subscription"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Company Name"
            className="border p-2 rounded"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Plan (e.g. Basic, Pro)"
            className="border p-2 rounded"
            value={form.plan}
            onChange={(e) => setForm({ ...form, plan: e.target.value })}
            required
          />
          <select
            className="border p-2 rounded"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90"
            >
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminSubscriptions;

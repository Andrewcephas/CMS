import { useState, useEffect } from "react";

function AdminApprovals() {
  // Load pending approvals from localStorage or use default sample
  const [pending, setPending] = useState(() => {
    return JSON.parse(localStorage.getItem("pendingApprovals")) || [
      { id: 1, name: "NewTech", email: "apply@newtech.com", date: "2025-05-21" },
    ];
  });

  const [form, setForm] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Sync to localStorage whenever pending changes
  useEffect(() => {
    localStorage.setItem("pendingApprovals", JSON.stringify(pending));
  }, [pending]);

  // Approve a request: move to recentCompanies and remove from pending
  const handleApprove = (id) => {
    const approvedCompany = pending.find((p) => p.id === id);
    if (!approvedCompany) return;

    // Add to recentCompanies list in localStorage
    const recentCompanies = JSON.parse(localStorage.getItem("recentCompanies")) || [];
    localStorage.setItem(
      "recentCompanies",
      JSON.stringify([
        ...recentCompanies,
        {
          name: approvedCompany.name,
          email: approvedCompany.email,
          date: new Date().toISOString().slice(0, 10),
        },
      ])
    );

    // Remove from pending list
    setPending(pending.filter((p) => p.id !== id));
  };

  // Reject a request: remove from pending with confirmation
  const handleReject = (id) => {
    if (window.confirm("Are you sure you want to reject this approval request?")) {
      setPending(pending.filter((p) => p.id !== id));
    }
  };

  // Handle form submit for add or edit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      alert("Name and email are required");
      return;
    }

    if (editingId) {
      // Update existing approval request
      setPending((prev) =>
        prev.map((p) =>
          p.id === editingId ? { ...p, name: form.name.trim(), email: form.email.trim() } : p
        )
      );
      setEditingId(null);
    } else {
      // Add new approval request
      setPending((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: form.name.trim(),
          email: form.email.trim(),
          date: new Date().toISOString().slice(0, 10),
        },
      ]);
    }

    // Clear form
    setForm({ name: "", email: "" });
  };

  // Load request into form for editing
  const handleEdit = (id) => {
    const toEdit = pending.find((p) => p.id === id);
    if (!toEdit) return;
    setForm({ name: toEdit.name, email: toEdit.email });
    setEditingId(id);
  };

  // Filter list by search term
  const filtered = pending.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-primary">Pending Approvals</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by name or email..."
        className="mb-4 p-2 rounded border w-full max-w-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Pending approvals list */}
      {filtered.length === 0 ? (
        <p className="text-gray-600">No pending approval requests found.</p>
      ) : (
        <ul className="space-y-4 mb-8 max-w-xl">
          {filtered.map((p) => (
            <li
              key={p.id}
              className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:justify-between md:items-center"
            >
              <div>
                <div className="font-semibold text-lg">{p.name}</div>
                <div className="text-sm text-gray-600">{p.email}</div>
                <div className="text-xs text-gray-400">Requested on {p.date}</div>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2">
                <button
                  onClick={() => handleApprove(p.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  title="Approve"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleEdit(p.id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  title="Edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleReject(p.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  title="Reject"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add/Edit approval request form */}
      <div className="max-w-xl bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Approval Request" : "Add New Approval Request"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Company Name"
            className="border p-2 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className="border p-2 rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
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
                className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "", email: "" });
                }}
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

export default AdminApprovals;

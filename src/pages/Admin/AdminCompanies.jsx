import { useState, useEffect } from "react";

function AdminCompanies() {
  // Load companies from localStorage or default empty
  const [companies, setCompanies] = useState(() => {
    return JSON.parse(localStorage.getItem("recentCompanies")) || [];
  });

  const [form, setForm] = useState({ name: "", email: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Sync companies to localStorage on change
  useEffect(() => {
    localStorage.setItem("recentCompanies", JSON.stringify(companies));
  }, [companies]);

  // Handle form submission: add or update
  const handleSubmit = (e) => {
    e.preventDefault();

    const nameTrim = form.name.trim();
    const emailTrim = form.email.trim();

    if (!nameTrim || !emailTrim) {
      alert("Name and Email are required.");
      return;
    }

    if (!validateEmail(emailTrim)) {
      alert("Please enter a valid email.");
      return;
    }

    if (editingIndex !== null) {
      // Update existing
      const updated = [...companies];
      updated[editingIndex] = { name: nameTrim, email: emailTrim, date: updated[editingIndex].date };
      setCompanies(updated);
      alert("Company updated successfully.");
    } else {
      // Add new with current date
      setCompanies([
        ...companies,
        { name: nameTrim, email: emailTrim, date: new Date().toISOString().slice(0, 10) },
      ]);
      alert("Company added successfully.");
    }

    resetForm();
  };

  // Delete company with confirmation
  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      const updated = [...companies];
      updated.splice(index, 1);
      setCompanies(updated);
      alert("Company deleted.");
      if (editingIndex === index) {
        resetForm();
      }
    }
  };

  // Load company data into form for editing
  const handleEdit = (index) => {
    const company = companies[index];
    setForm({ name: company.name, email: company.email });
    setEditingIndex(index);
  };

  // Cancel editing/reset form
  const resetForm = () => {
    setForm({ name: "", email: "" });
    setEditingIndex(null);
  };

  // Basic email validation
  function validateEmail(email) {
    // simple regex for demo purposes
    return /\S+@\S+\.\S+/.test(email);
  }

  // Filter companies by search term (name or email)
  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-primary">Manage Companies</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name or email..."
        className="mb-4 p-2 rounded border max-w-md w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Company List */}
      <ul className="space-y-4 mb-8 max-w-xl">
        {filteredCompanies.length === 0 ? (
          <li className="text-gray-500">No companies found.</li>
        ) : (
          filteredCompanies.map((company, i) => (
            <li
              key={i}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <div className="font-semibold">{company.name}</div>
                <div className="text-sm text-gray-500">{company.email}</div>
                <div className="text-xs text-gray-400">Joined on {company.date}</div>
              </div>
              <div className="space-x-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(i)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  title="Edit Company"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(i)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  title="Delete Company"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Add/Edit Form */}
      <div className="max-w-xl bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          {editingIndex !== null ? "Edit Company" : "Add New Company"}
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
              {editingIndex !== null ? "Update" : "Add"}
            </button>
            {editingIndex !== null && (
              <button
                type="button"
                onClick={resetForm}
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

export default AdminCompanies;

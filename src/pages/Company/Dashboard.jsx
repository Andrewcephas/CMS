import React, { useState, useEffect } from "react";
import useProjects from "../../hooks/useProjects";
import useClients from "../../hooks/useClients";
import CreateProject from "./CreateProject";
import ProjectList from "./ProjectList";
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";

function CompanyDashboard() {
  const { clients: initialClients } = useClients();
  const {
    projects,
    addOrUpdateProject,
    deleteProject,
    updateProjectProgress,
  } = useProjects();

  const [clients, setClients] = useState(initialClients);
  const [newClient, setNewClient] = useState("");
  const [editingProject, setEditingProject] = useState(null);

  // Suggestions state: { [projectId]: [suggestion, ...] }
  const [suggestionsByProject, setSuggestionsByProject] = useState({});

  // Reply inputs per suggestion: { [suggestionId]: string }
  const [replyInputs, setReplyInputs] = useState({});

  // Sync local clients with hook clients data
  useEffect(() => {
    setClients(initialClients);
  }, [initialClients]);

  // Load suggestions for all projects with realtime updates
  useEffect(() => {
    if (!projects.length) return;

    const unsubscribes = projects.map((project) => {
      const suggestionsCol = collection(db, "projects", project.id, "clientSuggestions");
      return onSnapshot(suggestionsCol, (snapshot) => {
        setSuggestionsByProject((prev) => ({
          ...prev,
          [project.id]: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        }));
      });
    });

    return () => unsubscribes.forEach((unsub) => unsub());
  }, [projects]);

  // Add Client function
  const addClient = async () => {
    if (!newClient.trim()) return alert("Client name cannot be empty.");
    if (clients.some((c) => c.name.toLowerCase() === newClient.trim().toLowerCase())) {
      return alert("Client already exists!");
    }
    try {
      await addDoc(collection(db, "clients"), { name: newClient.trim() });
      setNewClient("");
    } catch (error) {
      console.error("Failed to add client:", error);
      alert("Failed to add client.");
    }
  };

  // Delete Client function
  const deleteClient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      await deleteDoc(doc(db, "clients", id));
    } catch (error) {
      console.error("Failed to delete client:", error);
      alert("Failed to delete client.");
    }
  };

  const handleEdit = (project) => setEditingProject(project);
  const handleCancelEdit = () => setEditingProject(null);

  // Handle reply input change per suggestion
  const handleReplyChange = (suggestionId, value) => {
    setReplyInputs((prev) => ({ ...prev, [suggestionId]: value }));
  };

  // Submit reply to Firestore for a suggestion
  const submitReply = async (projectId, suggestionId) => {
    const replyText = replyInputs[suggestionId]?.trim();
    if (!replyText) return alert("Reply cannot be empty.");

    const suggestionDocRef = doc(db, "projects", projectId, "clientSuggestions", suggestionId);
    try {
      await updateDoc(suggestionDocRef, {
        replies: arrayUnion({
          message: replyText,
          timestamp: new Date().toISOString(),
        }),
      });
      setReplyInputs((prev) => ({ ...prev, [suggestionId]: "" }));
    } catch (error) {
      console.error("Failed to submit reply:", error);
      alert("Failed to submit reply.");
    }
  };

  // Toggle resolved status of suggestion
  const toggleResolved = async (projectId, suggestionId, currentStatus) => {
    const suggestionDocRef = doc(db, "projects", projectId, "clientSuggestions", suggestionId);
    try {
      await updateDoc(suggestionDocRef, {
        resolved: !currentStatus,
      });
    } catch (error) {
      console.error("Failed to toggle resolved status:", error);
      alert("Failed to update status.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-dark">
      <h1 className="text-3xl font-bold text-primary mb-6">Company Dashboard</h1>

      {/* Manage Clients Section */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-3">Manage Clients</h2>
        <div className="flex gap-3 mb-3">
          <input
            type="text"
            className="border p-2 rounded-xl w-full"
            placeholder="Enter client name"
            value={newClient}
            onChange={(e) => setNewClient(e.target.value)}
          />
          <button
            className="bg-black text-white px-4 py-2 rounded-xl hover:bg-red-700"
            onClick={addClient}
          >
            Add Client
          </button>
        </div>
        <ul className="flex flex-wrap gap-2">
          {clients.map((client) => (
            <li
              key={client.id}
              className="bg-gray-200 px-4 py-1 rounded-xl flex items-center gap-2"
            >
              {client.name}
              <button
                className="text-red-600"
                onClick={() => deleteClient(client.id)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Create/Edit Project Form */}
      <CreateProject
        clients={clients}
        onSave={addOrUpdateProject}
        editingProject={editingProject}
        onCancelEdit={handleCancelEdit}
      />

      {/* Projects List */}
      <ProjectList
        projects={projects}
        onEdit={handleEdit}
        onDelete={deleteProject}
        onProgressChange={updateProjectProgress}
      />

      {/* Client Suggestions Section */}
      <div className="bg-white p-6 rounded-xl shadow mt-8">
        <h2 className="text-xl font-semibold mb-4">Client Suggestions & Issues</h2>

        {projects.length === 0 && <p>No projects found.</p>}

        {projects.map((project) => (
          <div key={project.id} className="mb-6 border border-gray-300 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-2">{project.name}</h3>

            {(!suggestionsByProject[project.id] || suggestionsByProject[project.id].length === 0) && (
              <p className="text-gray-500 mb-2">No suggestions/issues raised for this project.</p>
            )}

            {(suggestionsByProject[project.id] || []).map((suggestion) => (
              <div
                key={suggestion.id}
                className={`border p-3 mb-3 rounded-md ${
                  suggestion.resolved ? "bg-green-100" : "bg-yellow-100"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold">{suggestion.issue}</p>
                  <button
                    onClick={() => toggleResolved(project.id, suggestion.id, suggestion.resolved)}
                    className={`px-2 py-1 rounded text-sm ${
                      suggestion.resolved ? "bg-green-500 text-white" : "bg-yellow-500 text-black"
                    }`}
                  >
                    {suggestion.resolved ? "Resolved" : "Mark as Resolved"}
                  </button>
                </div>

                {/* Show replies if any */}
                {suggestion.replies && suggestion.replies.length > 0 && (
                  <div className="mb-2 ml-4">
                    <h4 className="font-semibold mb-1">Replies:</h4>
                    <ul className="list-disc list-inside text-sm">
                      {suggestion.replies.map((reply, i) => (
                        <li key={i}>{reply.message}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Reply input */}
                <textarea
                  rows={2}
                  value={replyInputs[suggestion.id] || ""}
                  onChange={(e) => handleReplyChange(suggestion.id, e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full p-2 rounded border border-gray-300 resize-none mb-2"
                />
                <button
                  onClick={() => submitReply(project.id, suggestion.id)}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                >
                  Submit Reply
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompanyDashboard;

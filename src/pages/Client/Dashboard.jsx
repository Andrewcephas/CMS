import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, addDoc } from "firebase/firestore";

export default function ClientDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState({});
  const [newIssues, setNewIssues] = useState({});

  // Fetch all projects (no client filter)
  useEffect(() => {
    const q = collection(db, "projects");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(fetched);
      setLoading(false);

      // Real-time listeners for suggestions of each project
      fetched.forEach((project) => {
        const suggRef = collection(db, "projects", project.id, "clientSuggestions");
        onSnapshot(suggRef, (snap) => {
          setSuggestions((prev) => ({
            ...prev,
            [project.id]: snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
          }));
        });
      });
    });

    return () => unsubscribe();
  }, []);

  // Submit new suggestion for a project
  const submitSuggestion = async (projectId) => {
    const issueText = newIssues[projectId];
    if (!issueText?.trim()) return alert("Suggestion cannot be empty.");

    const ref = collection(db, "projects", projectId, "clientSuggestions");
    await addDoc(ref, {
      issue: issueText.trim(),
      resolved: false,
      replies: [],
      timestamp: new Date().toISOString(),
    });

    setNewIssues((prev) => ({ ...prev, [projectId]: "" }));
  };

  if (loading) return <div className="p-6">Loading projects...</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-100 text-dark">
      <h1 className="text-3xl font-bold mb-6 text-primary">Client Dashboard</h1>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        projects.map((project) => (
          <div
            key={project.id}
            className="mb-8 bg-white shadow p-6 rounded-xl border"
          >
            {/* Project Details */}
            <h2 className="text-xl font-bold text-red-600">{project.name}</h2>
            <p className="text-sm text-gray-500 mb-1">
              Deadline: <strong>{project.deadline}</strong>
            </p>
            <p className="text-gray-700 mb-4">{project.description}</p>

            {/* Project Progress */}
            {project.progress !== undefined ? (
              typeof project.progress === "object" ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Progress Breakdown:
                  </label>
                  <ul className="list-disc ml-5 text-gray-700">
                    {Object.entries(project.progress).map(([key, value]) => (
                      <li key={key}>
                        {key}: {value}%
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Progress: {project.progress}%
                  </label>
                  <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
                    <div
                      className="bg-green-500 h-4"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              )
            ) : (
              <p className="mb-4 text-sm italic text-gray-400">
                No progress updates yet.
              </p>
            )}

            {/* Suggestion Input */}
            <div className="mb-4">
              <textarea
                rows={2}
                className="w-full border p-2 rounded mb-2"
                value={newIssues[project.id] || ""}
                onChange={(e) =>
                  setNewIssues((prev) => ({ ...prev, [project.id]: e.target.value }))
                }
                placeholder="Raise a suggestion or issue..."
              />
              <button
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                onClick={() => submitSuggestion(project.id)}
              >
                Submit Suggestion
              </button>
            </div>

            {/* Suggestions Display */}
            <div>
              <h3 className="font-semibold text-md mb-2">Suggestions</h3>
              {suggestions[project.id]?.length > 0 ? (
                suggestions[project.id].map((sugg) => (
                  <div
                    key={sugg.id}
                    className="border rounded p-3 mb-2 bg-gray-50"
                  >
                    <p
                      className={`font-semibold mb-2 ${
                        sugg.resolved ? "text-green-600" : "text-yellow-700"
                      }`}
                    >
                      📝 {sugg.issue} — {sugg.resolved ? "Resolved" : "Pending"}
                    </p>

                    <div className="text-sm">
                      {sugg.replies?.length > 0 ? (
                        sugg.replies.map((reply, i) => (
                          <div key={i} className="mb-1 text-gray-700">
                            💬 {reply.message}{" "}
                            <span className="text-xs text-gray-400">
                              ({new Date(reply.timestamp).toLocaleString()})
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 italic">No replies yet</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">No suggestions submitted yet.</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

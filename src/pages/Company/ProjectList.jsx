import React, { useState, useEffect } from "react";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  addDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

function ProjectList({ companyId }) {
  const [projects, setProjects] = useState([]);
  const [suggestions, setSuggestions] = useState({}); // { projectId: [suggestions] }
  const [replies, setReplies] = useState({}); // { suggId: [replies] }
  const [replyInputs, setReplyInputs] = useState({});
  const [reviewInputs, setReviewInputs] = useState({});

  // Load projects for this company and listen for changes
  useEffect(() => {
    if (!companyId) return; // Prevent query if companyId is undefined or falsy
  
    const q = query(collection(db, "projects"), where("companyId", "==", companyId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedProjects = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(fetchedProjects);
    });
    return () => unsubscribe();
  }, [companyId]);
  

  // Listen for suggestions per project
  useEffect(() => {
    const unsubscribers = [];

    projects.forEach((project) => {
      const suggRef = collection(db, "projects", project.id, "clientSuggestions");
      const unsub = onSnapshot(suggRef, (suggSnap) => {
        const suggs = suggSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSuggestions((prev) => ({ ...prev, [project.id]: suggs }));

        // For each suggestion, listen for replies
        suggs.forEach((sugg) => {
          const repliesRef = collection(db, "projects", project.id, "clientSuggestions", sugg.id, "replies");
          if (!replies[sugg.id]) {
            const unsubReplies = onSnapshot(repliesRef, (repliesSnap) => {
              setReplies((prevReplies) => ({
                ...prevReplies,
                [sugg.id]: repliesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
              }));
            });
            unsubscribers.push(unsubReplies);
          }
        });
      });
      unsubscribers.push(unsub);
    });

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [projects, replies]);

  // Toggle project progress step and update Firestore
  const onProgressChange = async (projectId, step) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const updatedProgress = {
      ...project.progress,
      [step]: !project.progress?.[step],
    };

    await updateDoc(doc(db, "projects", projectId), { progress: updatedProgress });
  };

  // Toggle suggestion resolved status
  const toggleSuggestionStatus = async (projectId, suggId, currentStatus) => {
    await updateDoc(doc(db, "projects", projectId, "clientSuggestions", suggId), {
      resolved: !currentStatus,
    });
  };

  // Handle typing reply to a suggestion
  const handleReplyChange = (projectId, suggId, value) => {
    setReplyInputs((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [suggId]: value,
      },
    }));
  };

  // Handle typing company review for suggestion
  const handleReviewChange = (projectId, suggId, value) => {
    setReviewInputs((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [suggId]: value,
      },
    }));
  };

  // Submit reply from company to suggestion
  const submitReply = async (projectId, suggId) => {
    const message = replyInputs?.[projectId]?.[suggId];
    if (!message || message.trim() === "") {
      alert("Reply cannot be empty");
      return;
    }

    const reply = {
      message: message.trim(),
      timestamp: serverTimestamp(),
      author: "company",
    };

    const repliesRef = collection(db, "projects", projectId, "clientSuggestions", suggId, "replies");
    await addDoc(repliesRef, reply);

    setReplyInputs((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [suggId]: "",
      },
    }));
  };

  // Submit company review/comment on suggestion
  const submitReview = async (projectId, suggId) => {
    const review = reviewInputs?.[projectId]?.[suggId];
    if (!review || review.trim() === "") {
      alert("Review cannot be empty");
      return;
    }

    await updateDoc(doc(db, "projects", projectId, "clientSuggestions", suggId), {
      companyReview: review.trim(),
      companyReviewTimestamp: serverTimestamp(),
    });

    setReviewInputs((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [suggId]: "",
      },
    }));
  };

  const isCompleted = (progress) =>
    progress && Object.values(progress).every(Boolean);

  return (
    <div className="space-y-6 p-6">
      {projects.length === 0 && <p>No projects assigned.</p>}

      {projects.map((project) => (
        <div key={project.id} className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-bold mb-1">{project.name}</h3>
          <p className="text-sm text-gray-500 mb-4">Client: {project.client}</p>

          <p className="text-gray-700 mb-2">{project.description}</p>
          <p className="text-sm text-gray-600 mb-2">
            Deadline: {project.deadline || "N/A"}
          </p>

          {/* Progress Steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {project.progress &&
              Object.entries(project.progress).map(([step, done]) => (
                <label key={step} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => onProgressChange(project.id, step)}
                    className="accent-primary"
                  />
                  <span>{step}</span>
                </label>
              ))}
          </div>

          <p className="mt-2 text-sm font-semibold">
            {isCompleted(project.progress) ? (
              <span className="text-green-600">✅ Completed</span>
            ) : (
              <span className="text-yellow-600">🚧 In Progress</span>
            )}
          </p>

          {/* Client Suggestions */}
          <div className="mt-6 border-t pt-4">
            <h4 className="font-semibold mb-3 text-lg">Client Suggestions</h4>

            {suggestions?.[project.id]?.length ? (
              suggestions[project.id].map((sugg) => (
                <div key={sugg.id} className="mb-4 p-3 border rounded bg-gray-50">
                  <div className="flex justify-between items-center mb-1">
                    <p className={`font-semibold ${sugg.resolved ? "text-green-600" : "text-yellow-700"}`}>
                      📝 {sugg.issue} — {sugg.resolved ? "Resolved" : "Pending"}
                    </p>
                    <button
                      onClick={() =>
                        toggleSuggestionStatus(project.id, sugg.id, sugg.resolved)
                      }
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Mark {sugg.resolved ? "Pending" : "Resolved"}
                    </button>
                  </div>

                  {/* Replies */}
                  <div className="text-sm mb-2 max-h-40 overflow-y-auto">
                    {replies?.[sugg.id]?.length > 0 ? (
                      replies[sugg.id].map((reply) => (
                        <div
                          key={reply.id}
                          className={`mb-1 text-gray-700 ${reply.author === "company" ? "font-semibold" : ""}`}
                        >
                          {reply.author === "company" ? "🏢 " : "💬 "}
                          {reply.message}{" "}
                          <span className="text-xs text-gray-400">
                            ({reply.timestamp?.toDate ? reply.timestamp.toDate().toLocaleString() : "..."})
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 italic">No replies yet</p>
                    )}
                  </div>

                  {/* Reply input */}
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      className="flex-grow border rounded px-2 py-1"
                      value={replyInputs?.[project.id]?.[sugg.id] || ""}
                      onChange={(e) =>
                        handleReplyChange(project.id, sugg.id, e.target.value)
                      }
                    />
                    <button
                      disabled={!replyInputs?.[project.id]?.[sugg.id]?.trim()}
                      onClick={() => submitReply(project.id, sugg.id)}
                      className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      Reply
                    </button>
                  </div>

                  {/* Company Review */}
                  <div className="mb-2">
                    <textarea
                      rows={2}
                      placeholder="Write company review/comment here..."
                      className="w-full border rounded p-2"
                      value={reviewInputs?.[project.id]?.[sugg.id] ?? sugg.companyReview ?? ""}
                      onChange={(e) =>
                        handleReviewChange(project.id, sugg.id, e.target.value)
                      }
                    />
                    <button
                      disabled={
                        !reviewInputs?.[project.id]?.[sugg.id]?.trim()
                      }
                      onClick={() => submitReview(project.id, sugg.id)}
                      className="mt-1 text-sm bg-green-600 text-white px-3 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No client suggestions yet.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectList;

import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import SuggestionItem from "./SuggestionItem";

export default function ProjectSuggestions({ project, submitSuggestion }) {
  const [suggestions, setSuggestions] = useState([]);
  const [newIssue, setNewIssue] = useState("");

  useEffect(() => {
    const suggestionsRef = collection(db, "projects", project.id, "clientSuggestions");
    const unsubscribe = onSnapshot(suggestionsRef, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSuggestions(fetched);
    });

    return () => unsubscribe();
  }, [project.id]);

  return (
    <div className="mb-6 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold text-primary mb-2">{project.name}</h2>
      <p className="text-sm text-gray-600 mb-2">Deadline: {project.deadline}</p>
      <p className="mb-4 text-gray-700">{project.description}</p>

      <div className="mb-4">
        <textarea
          rows={2}
          className="w-full border p-2 rounded mb-2"
          value={newIssue}
          onChange={(e) => setNewIssue(e.target.value)}
          placeholder="Raise a suggestion or issue..."
        />
        <button
          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
          onClick={() => submitSuggestion(project.id, newIssue, () => setNewIssue(""))}
        >
          Submit Suggestion
        </button>
      </div>

      <h3 className="font-semibold text-md mb-2">Suggestions</h3>
      {suggestions.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No suggestions yet.</p>
      ) : (
        suggestions.map((sugg) => (
          <SuggestionItem key={sugg.id} suggestion={sugg} />
        ))
      )}
    </div>
  );
}

import React from "react";

export default function SuggestionItem({ suggestion }) {
  return (
    <div className="border rounded p-3 mb-2 bg-gray-50">
      <p
        className={`font-semibold ${
          suggestion.resolved ? "text-green-600" : "text-yellow-700"
        }`}
      >
        📝 {suggestion.issue} — {suggestion.resolved ? "Resolved" : "Pending"}
      </p>

      <div className="mt-2 text-sm">
        {suggestion.replies && suggestion.replies.length > 0 ? (
          suggestion.replies.map((reply, i) => (
            <div key={i} className="text-gray-700 mb-1">
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
  );
}

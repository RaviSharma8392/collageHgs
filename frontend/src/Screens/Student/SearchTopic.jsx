import React, { useState } from "react";

const SearchTopic = ({ semester }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    const encodedQuery = encodeURIComponent(`${query} ${semester} semester topic`);
    window.open(`https://www.google.com/search?q=${encodedQuery}`, "_blank");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold text-blue-700">Search Your Semester Topic</h2>
      <p className="text-sm text-gray-600">Currently in <strong>Semester {semester || "?"}</strong></p>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. Operating Systems"
        className="w-full max-w-md p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSearch}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Search on Google
      </button>
    </div>
  );
};

export default SearchTopic;

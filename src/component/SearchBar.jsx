import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    onSearch(q.trim());
    // keep the input or clear — I'll keep it for convenience
  };

  return (
    <form className="searchbar mb-3" onSubmit={submit}>
      <div className="input-group">
        <input
          className="form-control"
          placeholder="Enter city name..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="City name"
        />
        <button className="btn btn-primary" type="submit">
          Search
        </button>
      </div>
    </form>
  );
}

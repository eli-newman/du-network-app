"use client";

import { useState, useMemo } from "react";
import { Profile } from "@/types";
import { ProfileCard } from "./ProfileCard";

export function Directory({ profiles }: { profiles: Profile[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return profiles;
    return profiles.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.major.toLowerCase().includes(q) ||
        p.gradYear.toLowerCase().includes(q) ||
        p.building.toLowerCase().includes(q)
    );
  }, [profiles, query]);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-white/20 shrink-0">search_</span>
        <input
          type="text"
          placeholder="name, major, or what they're building"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-sm text-white/70 placeholder-white/15"
        />
      </div>

      <div className="border-t border-white/[0.06]" />

      {/* Count line */}
      <p className="text-xs text-white/20">
        <span className="text-white/15">// </span>
        {filtered.length} {filtered.length === 1 ? "builder" : "builders"}
        {query && (
          <>
            {" "}matching{" "}
            <span className="text-white/35">&quot;{query}&quot;</span>
            <button
              onClick={() => setQuery("")}
              className="ml-3 text-white/20 hover:text-white/50 transition-colors"
            >
              [clear]
            </button>
          </>
        )}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((profile, i) => (
            <ProfileCard key={i} profile={profile} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-xs text-white/20">no results.</p>
        </div>
      )}
    </div>
  );
}

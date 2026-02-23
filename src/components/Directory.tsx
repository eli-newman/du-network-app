"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Profile } from "@/types";
import { ProfileCard } from "./ProfileCard";

const MAX_VISIBLE_MAJORS = 5;
const STAGGER_MS = 30;
const MAX_STAGGER_MS = 450;

function FilterChips({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const visibleOptions =
    label === "major" && !expanded && options.length > MAX_VISIBLE_MAJORS
      ? options.slice(0, MAX_VISIBLE_MAJORS)
      : options;
  const hiddenCount = options.length - MAX_VISIBLE_MAJORS;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] text-white/20 uppercase tracking-wider shrink-0 w-10">
        {label}
      </span>
      <button
        onClick={() => onSelect(null)}
        className={`text-xs px-2.5 py-1 rounded-sm border transition-colors ${
          selected === null
            ? "border-gold/50 text-gold"
            : "border-white/[0.06] text-white/30 hover:text-white/50 hover:border-white/[0.12]"
        }`}
      >
        all
      </button>
      {visibleOptions.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(selected === opt ? null : opt)}
          className={`text-xs px-2.5 py-1 rounded-sm border transition-colors ${
            selected === opt
              ? "border-gold/50 text-gold"
              : "border-white/[0.06] text-white/30 hover:text-white/50 hover:border-white/[0.12]"
          }`}
        >
          {opt}
        </button>
      ))}
      {label === "major" && !expanded && hiddenCount > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="text-xs px-2.5 py-1 rounded-sm border border-white/[0.06] text-white/20 hover:text-white/40 transition-colors"
        >
          +{hiddenCount} more
        </button>
      )}
    </div>
  );
}

export function Directory({ profiles }: { profiles: Profile[] }) {
  const [query, setQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<string | null>(null);
  const [majorFilter, setMajorFilter] = useState<string | null>(null);

  // Derive unique years and majors from data
  const years = useMemo(() => {
    const set = new Set<string>();
    for (const p of profiles) {
      if (p.gradYear?.trim()) set.add(p.gradYear.trim());
    }
    return Array.from(set).sort();
  }, [profiles]);

  const majors = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of profiles) {
      if (p.major?.trim()) {
        const m = p.major.trim();
        counts.set(m, (counts.get(m) || 0) + 1);
      }
    }
    // Sort by frequency (most popular first)
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([m]) => m);
  }, [profiles]);

  const hasFilters = yearFilter !== null || majorFilter !== null;

  const filtered = useMemo(() => {
    let result = profiles;

    // Apply year filter
    if (yearFilter) {
      result = result.filter((p) => p.gradYear?.trim() === yearFilter);
    }

    // Apply major filter
    if (majorFilter) {
      result = result.filter((p) => p.major?.trim() === majorFilter);
    }

    // Apply search query
    const q = query.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.major.toLowerCase().includes(q) ||
          p.gradYear.toLowerCase().includes(q) ||
          p.building.toLowerCase().includes(q)
      );
    }

    return result;
  }, [profiles, query, yearFilter, majorFilter]);

  // Build count line description
  const countParts: string[] = [
    `${filtered.length} ${filtered.length === 1 ? "builder" : "builders"}`,
  ];
  if (yearFilter) countParts.push(`class of ${yearFilter}`);
  if (majorFilter) countParts.push(majorFilter);

  const clearAll = () => {
    setYearFilter(null);
    setMajorFilter(null);
    setQuery("");
  };

  // Key for triggering re-animation on filter changes
  const filterKey = `${query}-${yearFilter}-${majorFilter}`;

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

      {/* Filter chips */}
      {years.length > 1 && (
        <FilterChips
          label="year"
          options={years}
          selected={yearFilter}
          onSelect={setYearFilter}
        />
      )}
      {majors.length > 1 && (
        <FilterChips
          label="major"
          options={majors}
          selected={majorFilter}
          onSelect={setMajorFilter}
        />
      )}

      <div className="border-t border-white/[0.06]" />

      {/* Count line */}
      <p className="text-xs text-white/20">
        <span className="text-white/15">// </span>
        {countParts.join(" \u00B7 ")}
        {query && (
          <>
            {" "}matching{" "}
            <span className="text-white/35">&quot;{query}&quot;</span>
          </>
        )}
        {(hasFilters || query) && (
          <button
            onClick={clearAll}
            className="ml-3 text-white/20 hover:text-white/50 transition-colors"
          >
            [clear all]
          </button>
        )}
      </p>

      {/* Grid with staggered fade-in */}
      <AnimatePresence mode="wait">
        {filtered.length > 0 ? (
          <motion.div
            key={filterKey}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: Math.min(
                    STAGGER_MS / 1000,
                    MAX_STAGGER_MS / 1000 / filtered.length
                  ),
                },
              },
            }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((profile, i) => (
              <motion.div
                key={`${profile.name}-${i}`}
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <ProfileCard profile={profile} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <p className="text-xs text-white/20">no results.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

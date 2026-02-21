"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

// DU colors for mountain zones
const CRIMSON = "#862334";
const STONE = "#a0a0a0";
const GOLD = "#b8822e";

interface MountainLine {
  text: string;
  color: string;
  opacity: number;
}

// Rocky Mountain silhouette — gold peaks, stone body, crimson base
const MOUNTAIN: MountainLine[] = [
  { text: "                *                ", color: GOLD, opacity: 0.30 },
  { text: "               / \\               ", color: GOLD, opacity: 0.26 },
  { text: "         *    /   \\    *         ", color: GOLD, opacity: 0.22 },
  { text: "        / \\  /     \\  / \\        ", color: STONE, opacity: 0.16 },
  { text: "       /   \\/   *   \\/   \\       ", color: STONE, opacity: 0.18 },
  { text: "      /    /\\  / \\  /\\    \\      ", color: STONE, opacity: 0.20 },
  { text: "     /    /  \\/   \\/  \\    \\     ", color: STONE, opacity: 0.22 },
  { text: "    /    /   /\\   /\\   \\    \\    ", color: STONE, opacity: 0.24 },
  { text: "   /    /   /  \\ /  \\   \\    \\   ", color: CRIMSON, opacity: 0.30 },
  { text: "  /    /   /    X    \\   \\    \\  ", color: CRIMSON, opacity: 0.36 },
  { text: " /    /   /    / \\    \\   \\    \\ ", color: CRIMSON, opacity: 0.42 },
  { text: "/____/   /____/   \\____\\   \\____\\", color: CRIMSON, opacity: 0.50 },
];

const CYCLE = 7; // seconds per full loop

// Deterministic pseudo-random from seed
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function AsciiMountains({ visible }: { visible: boolean }) {
  // Render animated chars only after mount to avoid hydration mismatch
  // (Math.sin float precision differs between server and client)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Pre-compute stable random scatter offsets per character
  const scatterMap = useMemo(() => {
    return MOUNTAIN.map((line, row) =>
      line.text.split("").map((_, col) => ({
        x: (rand(row * 100 + col) - 0.5) * 80,
        y: (rand(row * 100 + col + 500) - 0.5) * 60,
        r: (rand(row * 100 + col + 1000) - 0.5) * 120,
      }))
    );
  }, []);

  return (
    <div
      className="hidden lg:block select-none pointer-events-none shrink-0"
      aria-hidden
    >
      <div className="font-mono text-xs leading-[1.7]">
        {MOUNTAIN.map((line, row) => (
          <div key={row} className="flex whitespace-pre h-[1.7em]">
            {line.text.split("").map((char, col) => {
              // Spaces hold layout but don't animate
              if (char === " ") {
                return (
                  <span
                    key={col}
                    className="inline-block"
                    style={{ width: "1ch" }}
                  >
                    {"\u00A0"}
                  </span>
                );
              }

              // Before mount, render invisible placeholder to avoid hydration mismatch
              if (!mounted) {
                return (
                  <span
                    key={col}
                    className="inline-block text-center"
                    style={{ width: "1ch", opacity: 0 }}
                  >
                    {char}
                  </span>
                );
              }

              const s = scatterMap[row][col];
              // Bottom-left assembles first: row 11 col 0 = delay 0
              const delay =
                (MOUNTAIN.length - 1 - row) * 0.06 + col * 0.008;

              return (
                <motion.span
                  key={col}
                  className="inline-block text-center"
                  style={{
                    width: "1ch",
                    color: line.color,
                    textShadow: `0 0 10px ${line.color}`,
                  }}
                  initial={{ opacity: 0, x: s.x, y: s.y, rotate: s.r }}
                  animate={
                    visible
                      ? {
                          opacity: [0, line.opacity, line.opacity, 0],
                          x: [s.x, 0, 0, s.x],
                          y: [s.y, 0, 0, s.y],
                          rotate: [s.r, 0, 0, s.r],
                        }
                      : { opacity: 0, x: s.x, y: s.y, rotate: s.r }
                  }
                  transition={
                    visible
                      ? {
                          duration: CYCLE,
                          times: [0, 0.18, 0.7, 1],
                          delay,
                          repeat: Infinity,
                          ease: "easeOut",
                        }
                      : { duration: 0.2 }
                  }
                >
                  {char}
                </motion.span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

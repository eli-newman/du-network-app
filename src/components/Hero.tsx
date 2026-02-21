"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { AsciiMountains } from "./AsciiMountains";

const LINES = [
  { text: "// university of denver", className: "text-xs text-white/25 tracking-widest uppercase" },
  { text: "find the builders", className: "text-2xl sm:text-3xl font-medium text-white/90 tracking-tight" },
  { text: "at your school.", className: "text-2xl sm:text-3xl font-medium text-white/40 tracking-tight" },
];

const CHAR_DELAY = 38;
const LINE_GAP = 180;

function useTypingSequence(lines: typeof LINES) {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;

    const currentLine = lines[lineIdx];
    if (!currentLine) { setDone(true); return; }

    if (charIdx < currentLine.text.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), CHAR_DELAY);
      return () => clearTimeout(t);
    }

    if (lineIdx < lines.length - 1) {
      const t = setTimeout(() => {
        setLineIdx((l) => l + 1);
        setCharIdx(0);
      }, LINE_GAP);
      return () => clearTimeout(t);
    }

    setDone(true);
  }, [lineIdx, charIdx, done, lines]);

  return { lineIdx, charIdx, done };
}

export function Hero() {
  const { lineIdx, charIdx, done } = useTypingSequence(LINES);

  return (
    <section className="px-4 sm:px-6 pt-14 sm:pt-20 pb-12 sm:pb-16">
      <div className="mx-auto max-w-6xl flex items-center gap-16 lg:gap-24">

        {/* Left: typing content */}
        <div className="flex-1 min-w-0">
          <div className="space-y-2 mb-8">
            {LINES.map((line, i) => {
              const isCurrentLine = i === lineIdx;
              const isFinished = i < lineIdx || done;
              const visible = i <= lineIdx;

              const text = isFinished
                ? line.text
                : isCurrentLine
                ? line.text.slice(0, charIdx)
                : "";

              if (!visible) return null;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.01 }}
                >
                  <span className={line.className}>{text}</span>
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence>
            {done && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-6"
              >
                <p className="text-sm text-white/35 leading-relaxed max-w-sm">
                  a directory of DU students shipping startups,
                  research, projects, and open source work.
                </p>
                <div className="flex items-center gap-5">
                  <Link
                    href="/join"
                    className="text-sm text-gold hover:text-gold/70 transition-colors"
                  >
                    add your profile →
                  </Link>
                  <a
                    href="#directory"
                    className="text-sm text-white/30 hover:text-white/60 transition-colors"
                  >
                    browse
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: ASCII mountains — desktop only */}
        <AsciiMountains visible={done} />

      </div>
    </section>
  );
}

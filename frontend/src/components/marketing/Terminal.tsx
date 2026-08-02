"use client";

import { useEffect, useReducer, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Terminal.tsx — simulated live scan panel.
 *
 * Uses the Card "terminal" variant (traffic-light header, bg-background,
 * cyber-chamfer) established in Phase 2.
 *
 * Behaviour:
 *   - Lines appear one at a time with a typewriter effect
 *   - Each line types character-by-character at ~28 ms/char
 *   - 400 ms pause between lines
 *   - Ends on a blinking cursor (global `blink` keyframe from Phase 1)
 *   - Under prefers-reduced-motion: all lines rendered instantly (static end-state)
 */

const SCAN_LINES = [
  { prefix: "$", text: " preflight scan github.com/user/my-app", type: "cmd" },
  { prefix: ">", text: " Cloning repository...", type: "info" },
  { prefix: ">", text: " Detecting framework: Next.js 15", type: "info" },
  { prefix: ">", text: " Checking dependencies...", type: "info" },
  { prefix: ">", text: " Checking secrets...", type: "warn" },
  { prefix: ">", text: " Checking CI/CD configuration...", type: "info" },
  { prefix: ">", text: " Checking Docker setup...", type: "info" },
  { prefix: ">", text: " Running security audit...", type: "warn" },
  { prefix: ">", text: " Checking test coverage...", type: "info" },
  { prefix: ">", text: " Analysing documentation...", type: "info" },
  { prefix: "!", text: " 3 issues found — generating report", type: "err" },
  { prefix: "✓", text: " Preflight Score™: 84 / 100", type: "ok" },
];

const CHAR_DELAY = 28;   // ms per character
const LINE_PAUSE = 420;  // ms between lines

type PrefixType = "cmd" | "info" | "warn" | "err" | "ok";

const prefixColor: Record<PrefixType, string> = {
  cmd:  "text-accent",
  info: "text-accent",
  warn: "text-[#ffaa00]",
  err:  "text-destructive",
  ok:   "text-accent",
};

type State = {
  completedLines: typeof SCAN_LINES;
  currentLineIndex: number;
  currentText: string;
  done: boolean;
};

type Action =
  | { type: "ADD_CHAR"; char: string }
  | { type: "NEXT_LINE" }
  | { type: "DONE" }
  | { type: "STATIC" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_CHAR":
      return { ...state, currentText: state.currentText + action.char };
    case "NEXT_LINE": {
      const finishedLine = SCAN_LINES[state.currentLineIndex];
      return {
        completedLines: finishedLine
          ? [...state.completedLines, finishedLine]
          : state.completedLines,
        currentLineIndex: state.currentLineIndex + 1,
        currentText: "",
        done: false,
      };
    }
    case "DONE":
      return { ...state, done: true };
    case "STATIC":
      return {
        completedLines: SCAN_LINES,
        currentLineIndex: SCAN_LINES.length,
        currentText: "",
        done: true,
      };
    default:
      return state;
  }
}

export function Terminal() {
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const [state, dispatch] = useReducer(reducer, {
    completedLines: [],
    currentLineIndex: 0,
    currentText: "",
    done: false,
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom as lines appear
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.completedLines, state.currentText]);

  useEffect(() => {
    // Under reduced-motion: render everything instantly
    if (prefersReducedMotion) {
      dispatch({ type: "STATIC" });
      return;
    }

    if (state.done) return;

    const line = SCAN_LINES[state.currentLineIndex];

    // All lines completed
    if (!line) {
      dispatch({ type: "DONE" });
      return;
    }

    const fullText = line.prefix + line.text;
    const charIndex = state.currentText.length;

    if (charIndex < fullText.length) {
      // Type next character
      timeoutRef.current = setTimeout(() => {
        dispatch({ type: "ADD_CHAR", char: fullText[charIndex] });
      }, CHAR_DELAY);
    } else {
      // Line complete — pause then advance
      timeoutRef.current = setTimeout(() => {
        dispatch({ type: "NEXT_LINE" });
      }, LINE_PAUSE);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [state, prefersReducedMotion]);

  return (
    <Card variant="terminal" className="w-full max-w-xl font-body text-sm">
      <CardContent className="p-0">
        <div
          ref={scrollRef}
          className="h-72 overflow-y-auto p-4 space-y-1 scrollbar-none"
          aria-label="Simulated Preflight scan output"
          aria-live="polite"
          aria-atomic="false"
        >
          {/* Completed lines */}
          {state.completedLines.map((line, i) => (
            <div key={i} className="flex gap-2 leading-relaxed">
              <span className={`shrink-0 font-label ${prefixColor[line.type as PrefixType]}`}>
                {line.prefix}
              </span>
              <span className="text-foreground">{line.text}</span>
            </div>
          ))}

          {/* Currently typing line */}
          {!state.done && state.currentLineIndex < SCAN_LINES.length && (
            <div className="flex gap-2 leading-relaxed">
              <span className={`shrink-0 font-label ${
                prefixColor[SCAN_LINES[state.currentLineIndex].type as PrefixType]
              }`}>
                {/* Show prefix only once full prefix is typed */}
                {state.currentText.length > 0
                  ? state.currentText[0]
                  : ""}
              </span>
              <span className="text-foreground">
                {state.currentText.slice(1)}
                {/* Blinking cursor — animation suppressed by global reduced-motion rule */}
                <span
                  className="inline-block w-2 h-[1em] bg-accent ml-0.5 align-middle animate-[blink_1s_step-end_infinite] motion-reduce:animate-none"
                  aria-hidden="true"
                />
              </span>
            </div>
          )}

          {/* Idle cursor after all lines complete */}
          {state.done && (
            <div className="flex gap-2 leading-relaxed">
              <span className="font-label text-accent">$</span>
              <span
                className="inline-block w-2 h-[1em] bg-accent ml-0.5 align-middle animate-[blink_1s_step-end_infinite] motion-reduce:animate-none"
                aria-hidden="true"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

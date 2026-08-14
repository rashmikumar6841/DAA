import { useEffect, useRef, useState, useCallback } from "react";

// Drives a "current step" cursor through a precomputed trace array.
// The algorithm has already finished running (instantly) — this hook is purely
// about pacing the *replay* so a human can follow the decisions cinematically.
export function usePlayer(length, { initialSpeed = 6 } = {}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed); // steps per second
  const raf = useRef(null);
  const last = useRef(0);
  const acc = useRef(0);

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [length]);

  useEffect(() => {
    if (!playing) {
      if (raf.current) cancelAnimationFrame(raf.current);
      return;
    }
    last.current = performance.now();
    acc.current = 0;
    function tick(now) {
      const dt = now - last.current;
      last.current = now;
      acc.current += dt;
      const stepMs = 1000 / speed;
      let steps = Math.floor(acc.current / stepMs);
      if (steps > 0) {
        acc.current -= steps * stepMs;
        setIndex((i) => {
          const next = Math.min(length, i + steps);
          if (next >= length) setPlaying(false);
          return next;
        });
      }
      raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => raf.current && cancelAnimationFrame(raf.current);
  }, [playing, speed, length]);

  const step = useCallback((delta = 1) => setIndex((i) => Math.max(0, Math.min(length, i + delta))), [length]);
  const jumpTo = useCallback((i) => setIndex(Math.max(0, Math.min(length, i))), [length]);
  const reset = useCallback(() => {
    setIndex(0);
    setPlaying(false);
  }, []);
  const jumpToEnd = useCallback(() => {
    setIndex(length);
    setPlaying(false);
  }, [length]);

  return { index, playing, setPlaying, speed, setSpeed, step, jumpTo, reset, jumpToEnd };
}

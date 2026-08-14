import { fits, consume, ratio, costFraction, BIG_O } from "./common.js";

// Greedy: rank every activity by joy-per-resource-fraction, then walk the
// ranked list once, taking anything that still fits. Classic fractional-knapsack
// heuristic borrowed for a 0/1, multi-resource problem — fast, but not guaranteed optimal.
export function runGreedy(items, constraints) {
  const t0 = performance.now();
  const ranked = items
    .map((item) => ({ item, ratio: ratio(item, constraints), cf: costFraction(item, constraints) }))
    .sort((a, b) => b.ratio - a.ratio);

  const trace = [];
  let remaining = { ...constraints };
  const chosen = [];
  let comparisons = 0;

  trace.push({ type: "rank", order: ranked.map((r) => r.item.id) });

  ranked.forEach(({ item, ratio: r }, idx) => {
    comparisons++;
    const canFit = fits(item, remaining);
    if (canFit) {
      remaining = consume(remaining, item);
      chosen.push(item);
      trace.push({
        type: "take",
        item,
        ratio: r,
        rank: idx + 1,
        remainingAfter: remaining,
        runningJoy: chosen.reduce((s, i) => s + i.joy, 0),
      });
    } else {
      trace.push({
        type: "skip",
        item,
        ratio: r,
        rank: idx + 1,
        remainingBefore: remaining,
        reason: item.time > remaining.time ? "time" : item.money > remaining.money ? "money" : "energy",
      });
    }
  });

  const ms = performance.now() - t0;
  return {
    algorithm: "greedy",
    label: "Greedy",
    complexity: BIG_O.greedy,
    chosen,
    joy: chosen.reduce((s, i) => s + i.joy, 0),
    remaining,
    trace,
    metrics: {
      nodesExplored: ranked.length,
      comparisons,
      ms,
    },
  };
}

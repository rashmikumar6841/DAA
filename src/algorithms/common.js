// Shared helpers for the DAY//0 solver engine.
// Keep pure & framework-free: the UI never computes results, it only replays traces.

export function fits(item, remaining) {
  return item.time <= remaining.time && item.money <= remaining.money && item.energy <= remaining.energy;
}

export function consume(remaining, item) {
  return {
    time: remaining.time - item.time,
    money: remaining.money - item.money,
    energy: remaining.energy - item.energy,
  };
}

export function totalJoy(items) {
  return items.reduce((s, i) => s + i.joy, 0);
}

export function usedResources(items) {
  return items.reduce(
    (acc, i) => ({ time: acc.time + i.time, money: acc.money + i.money, energy: acc.energy + i.energy }),
    { time: 0, money: 0, energy: 0 }
  );
}

// A single scalar "cost fraction" used by greedy ratio & fractional bound:
// how much of each resource budget an item eats, summed. This lets a 3D
// resource problem collapse into one comparable ratio.
export function costFraction(item, constraints) {
  const t = constraints.time > 0 ? item.time / constraints.time : 0;
  const m = constraints.money > 0 ? item.money / constraints.money : 0;
  const e = constraints.energy > 0 ? item.energy / constraints.energy : 0;
  return t + m + e;
}

export function ratio(item, constraints) {
  const cf = costFraction(item, constraints);
  return cf > 0 ? item.joy / cf : item.joy * 1000;
}

export const BIG_O = {
  greedy: "O(n log n)",
  backtracking: "O(2^n) worst case",
  dp: "O(n \u00B7 T \u00B7 M \u00B7 E)  pseudo-polynomial",
  bnb: "O(2^n) worst case, empirically \u226A",
};

// Safety valve: hard caps so a pathological run can never lock up the tab.
export const SAFETY = {
  maxNodesHard: 250000, // absolute recursion-node ceiling (feasibility, not perf, at n=16)
  traceLimit: 1400, // how many node-events we keep for animated tree playback
  dpMaxCells: 3_000_000, // guard for the discretized DP grid
};

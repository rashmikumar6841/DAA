export const ALGO_META = {
  greedy: { color: "amber", label: "Greedy", tag: "GRD", desc: "Rank by joy-per-resource, take what fits, never look back." },
  backtracking: { color: "rose", label: "Backtracking", tag: "BKT", desc: "Try every include/exclude branch, prune only the impossible ones." },
  dp: { color: "violet", label: "Dynamic Programming", tag: "DP", desc: "Fill a state table once; every optimal subproblem is reused, never recomputed." },
  bnb: { color: "cyan", label: "Branch & Bound", tag: "B&B", desc: "Backtracking with a mathematical ceiling — discard branches that provably can't win." },
};

export const COLOR_CLASSES = {
  amber: { text: "text-amber", bg: "bg-amber", border: "border-amber", dim: "text-amber-dim", ring: "ring-amber", glow: "shadow-glowAmber", fill: "#F2A65A" },
  rose: { text: "text-rose", bg: "bg-rose", border: "border-rose", dim: "text-rose-dim", ring: "ring-rose", glow: "shadow-glowAmber", fill: "#F27A7A" },
  violet: { text: "text-violet", bg: "bg-violet", border: "border-violet", dim: "text-violet-dim", ring: "ring-violet", glow: "shadow-glowViolet", fill: "#9B8CFF" },
  cyan: { text: "text-cyan", bg: "bg-cyan", border: "border-cyan", dim: "text-cyan-dim", ring: "ring-cyan", glow: "shadow-glow", fill: "#6FE7DD" },
};

import { BIG_O, SAFETY } from "./common.js";

// Dynamic Programming: the 0/1 knapsack recurrence extended to three resources.
// Budgets are discretized onto a grid (15-minute slots, $5 slots, 1-unit energy)
// so the state space stays small enough to fill exhaustively and instantly —
// this is exactly the "pseudo-polynomial" tradeoff DP makes: exact, but only
// tractable because the resources are bounded integers, not real numbers.
const TSTEP = 15;
const MSTEP = 5;

export function runDP(items, constraints) {
  const t0 = performance.now();
  const n = items.length;
  const T = Math.ceil(constraints.time / TSTEP);
  const M = Math.ceil(constraints.money / MSTEP);
  const E = Math.round(constraints.energy);

  const dT = T + 1,
    dM = M + 1,
    dE = E + 1;
  const cells = (n + 1) * dT * dM * dE;

  const idx = (i, t, m, e) => ((i * dT + t) * dM + m) * dE + e;

  const dp = new Int32Array((n + 1) * dT * dM * dE);
  const took = new Uint8Array((n + 1) * dT * dM * dE);

  // NOTE: costs are intentionally NOT clamped to the grid max. An item whose
  // discretized cost exceeds the budget must stay "too expensive" (dt/dm/de > T/M/E)
  // so the t >= dt / m >= dm / e >= de feasibility checks correctly exclude it.
  // Clamping here would silently understate its cost and let infeasible items in.
  const disc = items.map((item) => ({
    item,
    dt: Math.ceil(item.time / TSTEP),
    dm: Math.ceil(item.money / MSTEP),
    de: Math.round(item.energy),
  }));

  const layers = [];
  // layer 0: empty grid (baseline, before any item is considered)
  layers.push(makeSlice(dp, idx, 0, T, M, E, null));

  for (let i = 1; i <= n; i++) {
    const { item, dt, dm, de } = disc[i - 1];
    for (let t = 0; t <= T; t++) {
      for (let m = 0; m <= M; m++) {
        for (let e = 0; e <= E; e++) {
          const notTake = dp[idx(i - 1, t, m, e)];
          let take = -1;
          if (t >= dt && m >= dm && e >= de) {
            take = dp[idx(i - 1, t - dt, m - dm, e - de)] + item.joy;
          }
          if (take > notTake) {
            dp[idx(i, t, m, e)] = take;
            took[idx(i, t, m, e)] = 1;
          } else {
            dp[idx(i, t, m, e)] = notTake;
          }
        }
      }
    }
    layers.push(makeSlice(dp, idx, i, T, M, E, layers[i - 1].grid, item));
  }

  // reconstruct optimal set from the full-budget corner
  const chosen = [];
  let t = T,
    m = M,
    e = E;
  for (let i = n; i >= 1; i--) {
    if (took[idx(i, t, m, e)]) {
      const { item, dt, dm, de } = disc[i - 1];
      chosen.unshift(item);
      t -= dt;
      m -= dm;
      e -= de;
    }
  }

  const joy = dp[idx(n, T, M, E)];
  const ms = performance.now() - t0;

  return {
    algorithm: "dp",
    label: "Dynamic Programming",
    complexity: BIG_O.dp,
    chosen,
    joy,
    remaining: constraints,
    trace: layers,
    grid: { T, M, E, tstep: TSTEP, mstep: MSTEP },
    metrics: {
      nodesExplored: cells,
      states: cells,
      comparisons: cells,
      ms,
    },
  };
}

function makeSlice(dp, idx, i, T, M, E, prevGrid, item) {
  // A 2D slice of the DP cube at full energy budget E, for the heatmap view.
  const grid = [];
  let changed = 0;
  for (let t = 0; t <= T; t++) {
    const row = [];
    for (let m = 0; m <= M; m++) {
      const v = dp[idx(i, t, m, E)];
      row.push(v);
      if (prevGrid && prevGrid[t][m] !== v) changed++;
    }
    grid.push(row);
  }
  return { itemIndex: i - 1, item: item || null, grid, changedCount: changed };
}

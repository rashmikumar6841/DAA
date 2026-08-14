import { fits, consume, BIG_O, SAFETY } from "./common.js";

// Branch & Bound: same include/exclude tree as backtracking, but before
// descending into a branch we compute an optimistic upper bound on what that
// branch could still achieve. If the bound can't beat the best solution found
// so far, the entire subtree is discarded unexplored — this is what makes
// B&B empirically much faster than plain backtracking on the same problem.
//
// Bound = min of three single-resource fractional-knapsack relaxations
// (time-only, money-only, energy-only). Relaxing two of three constraints can only
// make the achievable value larger, so each relaxed bound is a valid upper bound
// on the true (3-constraint) remaining optimum — and so is their minimum.
export function runBranchAndBound(items, constraints) {
  const t0 = performance.now();
  const n = items.length;

  // Order items by a blended ratio for a good branching order (helps find a strong
  // incumbent early, which makes bounding prune more).
  const order = items
    .map((item, i) => ({ item, i }))
    .sort((a, b) => {
      const ra = a.item.joy / Math.max(1, a.item.time + a.item.money * 2 + a.item.energy * 4);
      const rb = b.item.joy / Math.max(1, b.item.time + b.item.money * 2 + b.item.energy * 4);
      return rb - ra;
    })
    .map((x) => x.item);

  // Precompute per-dimension ratio orders over the (re-ordered) item list.
  const dims = ["time", "money", "energy"];
  const dimOrder = {};
  dims.forEach((d) => {
    dimOrder[d] = order
      .map((item, idx) => ({ item, idx, r: item[d] > 0 ? item.joy / item[d] : Infinity }))
      .sort((a, b) => b.r - a.r);
  });

  function boundFor(idx, remaining, value) {
    let minBound = Infinity;
    for (const d of dims) {
      let cap = remaining[d];
      let bound = value;
      for (const { item, idx: itemIdx } of dimOrder[d]) {
        if (itemIdx < idx) continue; // already decided
        const cost = item[d];
        if (cost <= cap) {
          cap -= cost;
          bound += item.joy;
        } else if (cost > 0) {
          bound += (cap / cost) * item.joy;
          cap = 0;
          break;
        }
      }
      if (bound < minBound) minBound = bound;
    }
    return minBound;
  }

  const trace = [];
  let nodeId = 0;
  let nodesTotal = 0;
  let prunedInfeasible = 0;
  let prunedBound = 0;
  let best = { value: 0, chosen: [] };
  let aborted = false;

  function pushTrace(evt) {
    if (trace.length < SAFETY.traceLimit) trace.push(evt);
  }

  function recurse(idx, remaining, chosen, value, path, parentId) {
    if (aborted) return;
    if (nodesTotal > SAFETY.maxNodesHard) {
      aborted = true;
      return;
    }
    if (idx === n) {
      if (value > best.value) best = { value, chosen: [...chosen] };
      pushTrace({ type: "leaf", id: nodeId++, parentId, depth: idx, value, isNewBest: value === best.value && value > 0, path });
      return;
    }

    const item = order[idx];
    const bound = boundFor(idx, remaining, value);

    if (bound <= best.value) {
      prunedBound++;
      nodesTotal++;
      pushTrace({ type: "bound-prune", id: nodeId++, parentId, depth: idx, itemIndex: idx, item, bound, bestSoFar: best.value, path: [...path, "x"] });
      return;
    }

    // include
    nodesTotal++;
    const myId = nodeId++;
    if (fits(item, remaining)) {
      const newVal = value + item.joy;
      if (newVal > best.value) best = { value: newVal, chosen: [...chosen, item] };
      pushTrace({ type: "include", id: myId, parentId, depth: idx, itemIndex: idx, item, value: newVal, bound, path: [...path, 1] });
      recurse(idx + 1, consume(remaining, item), [...chosen, item], newVal, [...path, 1], myId);
    } else {
      prunedInfeasible++;
      pushTrace({ type: "prune", id: myId, parentId, depth: idx, itemIndex: idx, item, reason: item.time > remaining.time ? "time" : item.money > remaining.money ? "money" : "energy", path: [...path, 1] });
    }
    if (aborted) return;

    // exclude
    nodesTotal++;
    const myId2 = nodeId++;
    const bound2 = boundFor(idx + 1, remaining, value);
    pushTrace({ type: "exclude", id: myId2, parentId, depth: idx, itemIndex: idx, item, value, bound: bound2, path: [...path, 0] });
    recurse(idx + 1, remaining, chosen, value, [...path, 0], myId2);
  }

  recurse(0, constraints, [], 0, [], -1);

  const ms = performance.now() - t0;
  return {
    algorithm: "bnb",
    label: "Branch & Bound",
    complexity: BIG_O.bnb,
    chosen: best.chosen,
    joy: best.value,
    remaining: constraints,
    trace,
    traceTruncated: nodesTotal > SAFETY.traceLimit,
    metrics: {
      nodesExplored: nodesTotal,
      prunedBound,
      prunedInfeasible,
      comparisons: nodesTotal,
      ms,
      aborted,
    },
  };
}

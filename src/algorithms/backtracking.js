import { fits, consume, BIG_O, SAFETY } from "./common.js";

// Exhaustive backtracking: at every activity, branch into {include, exclude}.
// Prunes only on hard infeasibility (a resource would go negative) — no bound,
// so this is the "brute force, but not stupid" baseline the other algorithms are judged against.
export function runBacktracking(items, constraints) {
  const t0 = performance.now();
  const n = items.length;
  const trace = [];
  let nodeId = 0;
  let nodesTotal = 0;
  let leavesTotal = 0;
  let prunedTotal = 0;
  let best = { value: -1, chosen: [] };
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
      leavesTotal++;
      const isNewBest = value > best.value;
      if (isNewBest) best = { value, chosen: [...chosen] };
      pushTrace({ type: "leaf", id: nodeId++, parentId, depth: idx, value, isNewBest, path });
      return;
    }

    const item = items[idx];

    // Branch 1: include this activity
    nodesTotal++;
    const myId = nodeId++;
    if (fits(item, remaining)) {
      pushTrace({ type: "include", id: myId, parentId, depth: idx, itemIndex: idx, item, value: value + item.joy, path: [...path, 1] });
      recurse(idx + 1, consume(remaining, item), [...chosen, item], value + item.joy, [...path, 1], myId);
    } else {
      prunedTotal++;
      pushTrace({ type: "prune", id: myId, parentId, depth: idx, itemIndex: idx, item, reason: item.time > remaining.time ? "time" : item.money > remaining.money ? "money" : "energy", path: [...path, 1] });
    }
    if (aborted) return;

    // Branch 2: exclude this activity
    nodesTotal++;
    const myId2 = nodeId++;
    pushTrace({ type: "exclude", id: myId2, parentId, depth: idx, itemIndex: idx, item, value, path: [...path, 0] });
    recurse(idx + 1, remaining, chosen, value, [...path, 0], myId2);
  }

  recurse(0, constraints, [], 0, [], -1);

  const ms = performance.now() - t0;
  return {
    algorithm: "backtracking",
    label: "Backtracking",
    complexity: BIG_O.backtracking,
    chosen: best.chosen,
    joy: best.value,
    remaining: constraints, // recomputed by caller if needed
    trace,
    traceTruncated: nodesTotal > SAFETY.traceLimit,
    metrics: {
      nodesExplored: nodesTotal,
      leaves: leavesTotal,
      pruned: prunedTotal,
      comparisons: nodesTotal,
      ms,
      aborted,
    },
  };
}

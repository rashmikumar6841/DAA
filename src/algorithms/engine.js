import { runGreedy } from "./greedy.js";
import { runBacktracking } from "./backtracking.js";
import { runDP } from "./dp.js";
import { runBranchAndBound } from "./branchAndBound.js";
import { totalJoy, usedResources } from "./common.js";

// Runs all four solvers against the identical (items, constraints) instance.
// Nothing here touches the DOM — this module is the "ground truth" the UI replays.
export function solveDay(items, constraints) {
  const greedy = runGreedy(items, constraints);
  const backtracking = runBacktracking(items, constraints);
  const dp = runDP(items, constraints);
  const bnb = runBranchAndBound(items, constraints);

  const optimalJoy = dp.joy;
  [greedy, backtracking, dp, bnb].forEach((r) => {
    r.used = usedResources(r.chosen);
    r.optimalJoy = optimalJoy;
    r.isOptimal = r.joy >= optimalJoy;
    r.gap = optimalJoy > 0 ? Math.round(((optimalJoy - r.joy) / optimalJoy) * 100) : 0;
  });

  return { greedy, backtracking, dp, bnb, optimalJoy };
}

export function evaluateUserDay(chosenItems, constraints) {
  const used = usedResources(chosenItems);
  const joy = totalJoy(chosenItems);
  const overTime = used.time > constraints.time;
  const overMoney = used.money > constraints.money;
  const overEnergy = used.energy > constraints.energy;
  return { chosen: chosenItems, used, joy, feasible: !overTime && !overMoney && !overEnergy, overTime, overMoney, overEnergy };
}

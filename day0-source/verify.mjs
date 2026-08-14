import { ACTIVITIES } from "./src/data/activities.js";
import { runGreedy } from "./src/algorithms/greedy.js";
import { runBacktracking } from "./src/algorithms/backtracking.js";
import { runDP } from "./src/algorithms/dp.js";
import { runBranchAndBound } from "./src/algorithms/branchAndBound.js";

function usedResources(items) {
  return items.reduce((a, i) => ({ time: a.time + i.time, money: a.money + i.money, energy: a.energy + i.energy }), { time: 0, money: 0, energy: 0 });
}

const cases = [
  { time: 360, money: 80, energy: 34 },
  { time: 120, money: 0, energy: 10 },
  { time: 600, money: 150, energy: 60 },
  { time: 240, money: 40, energy: 20 },
  { time: 180, money: 60, energy: 16 },
  { time: 300, money: 100, energy: 45 },
  { time: 150, money: 25, energy: 12 },
  { time: 450, money: 70, energy: 30 },
  { time: 90, money: 10, energy: 8 },
  { time: 600, money: 0, energy: 60 },
];

let failures = 0;

for (const c of cases) {
  const bt = runBacktracking(ACTIVITIES, c);
  const dp = runDP(ACTIVITIES, c);
  const bnb = runBranchAndBound(ACTIVITIES, c);
  const gr = runGreedy(ACTIVITIES, c);

  const label = `T${c.time}/M${c.money}/E${c.energy}`;
  const optimal = new Set([bt.joy, dp.joy, bnb.joy]);

  console.log(`\n[${label}] backtracking=${bt.joy} dp=${dp.joy} bnb=${bnb.joy} greedy=${gr.joy}`);

  if (optimal.size !== 1) {
    console.log(`  \u2717 MISMATCH: exact algorithms disagree`, [...optimal]);
    failures++;
  } else {
    console.log(`  \u2713 exact algorithms agree on optimum = ${bt.joy}`);
  }

  if (gr.joy > bt.joy) {
    console.log(`  \u2717 greedy (${gr.joy}) beat the proven optimum (${bt.joy}) \u2014 impossible`);
    failures++;
  }

  // feasibility checks: every chosen set must actually respect the budget
  for (const [name, res] of [["backtracking", bt], ["dp", dp], ["bnb", bnb], ["greedy", gr]]) {
    const used = usedResources(res.chosen);
    if (used.time > c.time + 1e-9 || used.money > c.money + 1e-9 || used.energy > c.energy + 1e-9) {
      console.log(`  \u2717 ${name} chosen set violates budget:`, used, "vs", c);
      failures++;
    }
    // recompute joy directly to make sure .joy matches the actual chosen set
    const recomputedJoy = res.chosen.reduce((s, i) => s + i.joy, 0);
    if (recomputedJoy !== res.joy) {
      console.log(`  \u2717 ${name} reported joy ${res.joy} != recomputed ${recomputedJoy} from chosen set`);
      failures++;
    }
    // no duplicate items
    const ids = res.chosen.map((i) => i.id);
    if (new Set(ids).size !== ids.length) {
      console.log(`  \u2717 ${name} chosen set has duplicate items`);
      failures++;
    }
  }
}

console.log(`\n\n${failures === 0 ? "ALL CHECKS PASSED" : `${failures} FAILURES`}`);

// --- extra: performance + safety sanity check on the tightest/loosest sliders ---
console.log("\n--- performance sanity ---");
for (const c of [{ time: 120, money: 0, energy: 10 }, { time: 600, money: 150, energy: 60 }]) {
  const t0 = performance.now();
  const bt = runBacktracking(ACTIVITIES, c);
  const bnb = runBranchAndBound(ACTIVITIES, c);
  const dp = runDP(ACTIVITIES, c);
  const t1 = performance.now();
  console.log(`T${c.time}/M${c.money}/E${c.energy}: total ${ (t1 - t0).toFixed(1) }ms | bt nodes=${bt.metrics.nodesExplored} bnb nodes=${bnb.metrics.nodesExplored} dp states=${dp.metrics.nodesExplored}`);
  if (t1 - t0 > 2000) {
    console.log("  \u2717 TOO SLOW - would risk freezing the browser");
    process.exitCode = 1;
  }
}

process.exit(failures === 0 ? 0 : 1);

import { useState } from "react";
import { motion } from "framer-motion";
import { ALGO_META, COLOR_CLASSES } from "./theme";
import { ACTIVITIES } from "../data/activities";
import BudgetDials from "./BudgetDials";

function JoyBars({ rows }) {
  const max = Math.max(...rows.map((r) => r.joy), 1);
  return (
    <div className="space-y-2.5">
      {rows.map((r) => (
        <div key={r.key} className="flex items-center gap-3">
          <span className="w-32 text-xs font-mono text-ink-dim shrink-0">{r.label}</span>
          <div className="flex-1 h-6 bg-line2 rounded overflow-hidden relative">
            <motion.div
              className={`h-full ${r.optimal ? "bg-cyan" : `bg-${r.color}`}`}
              initial={{ width: 0 }}
              animate={{ width: `${(r.joy / max) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <span className="w-12 text-right font-mono text-sm">{r.joy}</span>
          {!r.feasible && <span className="text-[10px] font-mono text-rose">over budget</span>}
        </div>
      ))}
    </div>
  );
}

function DiffGrid({ userDay, solved }) {
  const cols = [
    { key: "user", label: "You", color: "ink" },
    { key: "greedy", label: ALGO_META.greedy.tag, color: "amber" },
    { key: "backtracking", label: ALGO_META.backtracking.tag, color: "rose" },
    { key: "dp", label: ALGO_META.dp.tag, color: "violet" },
    { key: "bnb", label: ALGO_META.bnb.tag, color: "cyan" },
  ];
  const sets = {
    user: new Set(userDay.chosen.map((a) => a.id)),
    greedy: new Set(solved.greedy.chosen.map((a) => a.id)),
    backtracking: new Set(solved.backtracking.chosen.map((a) => a.id)),
    dp: new Set(solved.dp.chosen.map((a) => a.id)),
    bnb: new Set(solved.bnb.chosen.map((a) => a.id)),
  };
  const touched = ACTIVITIES.filter((a) => cols.some((c) => sets[c.key].has(a.id)));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-separate border-spacing-y-1">
        <thead>
          <tr className="text-ink-faint font-mono text-[10px] uppercase">
            <th className="text-left pl-1 pb-1">activity</th>
            {cols.map((c) => (
              <th key={c.key} className={`px-2 pb-1 text-${c.color}`}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {touched.map((a) => (
            <tr key={a.id} className="bg-panel2">
              <td className="pl-2 py-1.5 rounded-l-md whitespace-nowrap">
                <span className="mr-1.5">{a.icon}</span>
                {a.name}
              </td>
              {cols.map((c, i) => (
                <td key={c.key} className={`text-center px-2 ${i === cols.length - 1 ? "rounded-r-md" : ""}`}>
                  {sets[c.key].has(a.id) ? <span className={`text-${c.color}`}>&#9679;</span> : <span className="text-line">&middot;</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CompareStage({ userDay, solved, constraints, onWhatIf }) {
  const [whatIfOpen, setWhatIfOpen] = useState(false);
  const [whatIfConstraints, setWhatIfConstraints] = useState(constraints);

  const rows = [
    { key: "user", label: "Your day", joy: userDay.joy, color: "ink", feasible: userDay.feasible },
    { key: "greedy", label: "Greedy", joy: solved.greedy.joy, color: "amber", feasible: true },
    { key: "backtracking", label: "Backtracking", joy: solved.backtracking.joy, color: "rose", feasible: true },
    { key: "dp", label: "Dynamic Programming", joy: solved.dp.joy, color: "violet", optimal: true, feasible: true },
    { key: "bnb", label: "Branch & Bound", joy: solved.bnb.joy, color: "cyan", optimal: true, feasible: true },
  ];

  const regret = Math.max(0, solved.optimalJoy - userDay.joy);
  const regretPct = solved.optimalJoy > 0 ? Math.round((regret / solved.optimalJoy) * 100) : 0;

  return (
    <div className="max-w-[1400px] mx-auto px-5 py-8">
      <h2 className="font-display text-2xl mb-1">The verdict</h2>
      <p className="text-ink-dim text-sm mb-6 max-w-2xl">
        Same 16 activities. Same budget. Five different processes for deciding how to spend a day.
      </p>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">
        <div className="border border-line rounded-lg bg-panel p-5">
          <div className="font-mono text-[11px] uppercase tracking-wider text-ink-dim mb-4">joy score by strategy</div>
          <JoyBars rows={rows} />
        </div>

        <div className="border border-line rounded-lg bg-panel p-5 flex flex-col">
          <div className="font-mono text-[11px] uppercase tracking-wider text-ink-dim mb-3">your regret score</div>
          <div className="flex items-end gap-3">
            <span className="font-display text-5xl text-rose">{regretPct}%</span>
            <span className="text-xs text-ink-faint mb-1.5 leading-snug">
              of the achievable joy left on the table ({regret} pts) compared to the provably optimal day.
            </span>
          </div>
          <div className="h-2 bg-line2 rounded-full overflow-hidden mt-4">
            <motion.div className="h-full bg-rose" initial={{ width: 0 }} animate={{ width: `${regretPct}%` }} transition={{ duration: 0.8 }} />
          </div>
          <p className="text-[11px] text-ink-faint mt-3 leading-snug">
            Dynamic Programming and Branch &amp; Bound both prove {solved.optimalJoy} is the ceiling for today's budget &mdash; they just
            reach it by very different routes (a full state table vs. a pruned search tree).
          </p>
        </div>
      </div>

      <div className="mt-6 border border-line rounded-lg bg-panel p-5">
        <div className="font-mono text-[11px] uppercase tracking-wider text-ink-dim mb-3">what each strategy actually picked</div>
        <DiffGrid userDay={userDay} solved={solved} />
      </div>

      <div className="mt-6 border border-line rounded-lg bg-panel p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="font-mono text-[11px] uppercase tracking-wider text-ink-dim">what-if mode</div>
          <button onClick={() => setWhatIfOpen((v) => !v)} className="text-[11px] font-mono text-cyan border border-cyan/30 rounded px-2 py-0.5 hover:bg-cyan/10 focus-ring">
            {whatIfOpen ? "close" : "change today's constraints"}
          </button>
        </div>
        {whatIfOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3">
            <p className="text-xs text-ink-dim mb-3 max-w-xl">
              Drag a dial. Every algorithm recomputes instantly against the new budget &mdash; including whether your original day still fits.
            </p>
            <BudgetDials constraints={whatIfConstraints} onChange={setWhatIfConstraints} accent="cyan" />
            <button
              onClick={() => onWhatIf(whatIfConstraints)}
              className="mt-4 font-mono text-xs px-4 py-2 rounded-md bg-cyan text-void font-medium focus-ring"
            >
              recompute the lab &rarr;
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

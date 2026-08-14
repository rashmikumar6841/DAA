import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ActivityGrid from "./ActivityGrid";
import BudgetDials from "./BudgetDials";
import ResourceMeter from "./ResourceMeter";
import { ACTIVITIES } from "../data/activities";
import { usedResources, totalJoy } from "../algorithms/common";

export default function BuildStage({ constraints, setConstraints, selectedIds, setSelectedIds, onLockIn }) {
  const [budgetsLocked, setBudgetsLocked] = useState(false);

  const chosen = useMemo(() => ACTIVITIES.filter((a) => selectedIds.has(a.id)), [selectedIds]);
  const used = usedResources(chosen);
  const joy = totalJoy(chosen);
  const remaining = { time: constraints.time - used.time, money: constraints.money - used.money, energy: constraints.energy - used.energy };

  const toggle = (activity) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(activity.id)) next.delete(activity.id);
      else next.add(activity.id);
      return next;
    });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-5 py-8 grid lg:grid-cols-[1fr_320px] gap-6">
      <div>
        <div className="flex items-baseline justify-between mb-1">
          <h2 className="font-display text-2xl">Build your day</h2>
          <span className="font-mono text-[11px] text-ink-faint">n = 16 candidates</span>
        </div>
        <p className="text-ink-dim text-sm mb-5 max-w-xl">
          Set today&rsquo;s budget, then choose activities by hand — exactly the way you&rsquo;d actually plan a day.
          This is the baseline every algorithm will be measured against.
        </p>

        <div className="border border-line rounded-lg bg-panel p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-dim">today&rsquo;s constraints</span>
            <button
              onClick={() => setBudgetsLocked((v) => !v)}
              className="text-[11px] font-mono text-cyan border border-cyan/30 rounded px-2 py-0.5 hover:bg-cyan/10 focus-ring"
            >
              {budgetsLocked ? "unlock dials" : "lock in budget"}
            </button>
          </div>
          <fieldset disabled={budgetsLocked} className={budgetsLocked ? "opacity-50" : ""}>
            <BudgetDials constraints={constraints} onChange={setConstraints} accent="cyan" />
          </fieldset>
        </div>

        <ActivityGrid activities={ACTIVITIES} selectedIds={selectedIds} remaining={remaining} onToggle={toggle} />
      </div>

      <div className="lg:sticky lg:top-[70px] self-start">
        <div className="border border-line rounded-lg bg-panel p-4">
          <div className="font-mono text-[11px] uppercase tracking-wider text-ink-dim mb-3">your day so far</div>
          <div className="flex flex-col gap-3 mb-4">
            <ResourceMeter label="Time" icon={"\u23F1"} used={used.time} budget={constraints.time} unit="m" />
            <ResourceMeter label="Money" icon={"\u{1F4B5}"} used={used.money} budget={constraints.money} unit="$" />
            <ResourceMeter label="Energy" icon={"\u26A1"} used={used.energy} budget={constraints.energy} unit="u" />
          </div>

          <div className="flex items-end justify-between border-t border-line pt-3">
            <span className="text-xs text-ink-dim font-mono">joy score</span>
            <motion.span key={joy} initial={{ scale: 1.3, color: "#6FE7DD" }} animate={{ scale: 1, color: "#E7E9EC" }} className="font-display text-3xl">
              {joy}
            </motion.span>
          </div>

          <div className="mt-4 space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {chosen.length === 0 && <div className="text-ink-faint text-xs font-mono py-4 text-center">no activities chosen yet</div>}
              {chosen.map((a) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="flex items-center gap-2 text-xs bg-panel2 border border-line rounded px-2 py-1.5"
                >
                  <span>{a.icon}</span>
                  <span className="flex-1 truncate">{a.name}</span>
                  <span className="text-amber font-mono">+{a.joy}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button
            onClick={() => onLockIn(chosen)}
            disabled={chosen.length === 0}
            className="mt-5 w-full font-mono text-sm py-2.5 rounded-md bg-cyan text-void font-medium disabled:opacity-30 disabled:cursor-not-allowed focus-ring"
          >
            send to the lab &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GreedyView from "./GreedyView";
import TreeView from "./TreeView";
import DPView from "./DPView";
import { ALGO_META } from "./theme";
import { ACTIVITIES } from "../data/activities";

const TABS = ["greedy", "backtracking", "dp", "bnb"];

export default function AlgorithmLab({ solved, constraints, onContinue }) {
  const [tab, setTab] = useState("greedy");
  const meta = ALGO_META[tab];
  const result = solved[tab];

  return (
    <div className="max-w-[1400px] mx-auto px-5 py-8">
      <div className="flex items-baseline justify-between mb-1">
        <h2 className="font-display text-2xl">The algorithm lab</h2>
        <span className="font-mono text-[11px] text-ink-faint">same instance, four solvers</span>
      </div>
      <p className="text-ink-dim text-sm mb-5 max-w-2xl">
        Identical activities, identical budget. Watch how differently each strategy explores the same possibility space.
      </p>

      <div className="flex flex-wrap gap-2 mb-5 border-b border-line pb-4">
        {TABS.map((t) => {
          const m = ALGO_META[t];
          const active = t === tab;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                "px-3.5 py-2 rounded-md border font-mono text-xs flex items-center gap-2 transition-colors focus-ring",
                active ? `border-${m.color} text-${m.color} bg-${m.color}/10` : "border-line text-ink-dim hover:text-ink",
              ].join(" ")}
            >
              <span className="opacity-70">{m.tag}</span> {m.label}
              {solved[t].isOptimal && <span className="w-1.5 h-1.5 rounded-full bg-cyan" title="finds the optimum" />}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
          <div className="mb-4 flex items-start gap-3 border border-line rounded-lg bg-panel2 px-4 py-3">
            <span className={`font-mono text-[10px] mt-0.5 px-1.5 py-0.5 rounded border border-${meta.color} text-${meta.color}`}>{meta.tag}</span>
            <p className="text-sm text-ink-dim">{meta.desc}</p>
          </div>

          {tab === "greedy" && <GreedyView result={result} constraints={constraints} />}
          {tab === "backtracking" && <TreeView result={result} items={ACTIVITIES} accent="rose" />}
          {tab === "dp" && <DPView result={result} constraints={constraints} />}
          {tab === "bnb" && <TreeView result={result} items={ACTIVITIES} accent="cyan" />}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-end">
        <button onClick={onContinue} className="font-mono text-sm px-6 py-2.5 rounded-md bg-cyan text-void font-medium focus-ring">
          see the verdict &rarr;
        </button>
      </div>
    </div>
  );
}

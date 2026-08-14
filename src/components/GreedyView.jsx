import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "../hooks/usePlayer";
import PlaybackBar from "./PlaybackBar";
import MetricsStrip from "./MetricsStrip";
import ResourceMeter from "./ResourceMeter";

export default function GreedyView({ result, constraints }) {
  const decisions = result.trace.slice(1); // drop the leading "rank" event
  const player = usePlayer(decisions.length, { initialSpeed: 4 });
  const { index } = player;
  const maxRatio = Math.max(...decisions.map((d) => d.ratio));
  const lastDecided = decisions[index - 1];
  const remaining = lastDecided ? lastDecided.remainingAfter || lastDecided.remainingBefore : constraints;
  const runningJoy = [...decisions.slice(0, index)].filter((d) => d.type === "take").reduce((s, d) => s + d.item.joy, 0);

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-5">
      <div>
        <p className="text-ink-dim text-sm mb-3 max-w-2xl">
          Every activity is ranked once by <span className="font-mono text-amber">joy &divide; resource-fraction</span>. The algorithm then
          walks the ranking a single time, taking anything that still fits — no reconsideration, no lookahead.
        </p>
        <PlaybackBar player={player} length={decisions.length} accent="amber" />
        <div className="mt-4 space-y-1.5 max-h-[430px] overflow-y-auto pr-1">
          {decisions.map((d, i) => {
            const revealed = i < index;
            const isCurrent = i === index - 1;
            const taken = d.type === "take";
            return (
              <motion.div
                key={d.item.id}
                initial={false}
                animate={{ opacity: revealed ? 1 : 0.3, x: 0 }}
                className={[
                  "flex items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors",
                  revealed ? (taken ? "border-amber/40 bg-amber/5" : "border-line2 bg-panel2") : "border-line2 bg-panel2",
                  isCurrent ? "ring-1 ring-amber" : "",
                ].join(" ")}
              >
                <span className="font-mono text-[10px] text-ink-faint w-5">#{d.rank}</span>
                <span className="text-lg">{d.item.icon}</span>
                <span className="flex-1 min-w-0 truncate">{d.item.name}</span>
                <div className="w-24 h-1.5 bg-line2 rounded-full overflow-hidden hidden sm:block">
                  <div className="h-full bg-amber" style={{ width: `${(d.ratio / maxRatio) * 100}%` }} />
                </div>
                <span className="font-mono text-[11px] text-ink-faint w-14 text-right">{d.ratio.toFixed(1)} r</span>
                {revealed ? (
                  <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${taken ? "border-amber text-amber" : "border-rose/50 text-rose"}`}>
                    {taken ? "TAKEN" : `SKIP \u2013 ${d.reason}`}
                  </span>
                ) : (
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-line text-ink-faint">&hellip;</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="border border-line rounded-lg bg-panel p-4">
          <div className="font-mono text-[11px] uppercase tracking-wider text-ink-dim mb-3">live budget</div>
          <div className="flex flex-col gap-3">
            <ResourceMeter label="Time" icon={"\u23F1"} used={constraints.time - remaining.time} budget={constraints.time} unit="m" />
            <ResourceMeter label="Money" icon={"\u{1F4B5}"} used={constraints.money - remaining.money} budget={constraints.money} unit="$" />
            <ResourceMeter label="Energy" icon={"\u26A1"} used={constraints.energy - remaining.energy} budget={constraints.energy} unit="u" />
          </div>
          <div className="flex items-end justify-between border-t border-line mt-4 pt-3">
            <span className="text-xs text-ink-dim font-mono">joy score</span>
            <span className="font-display text-2xl text-amber">{runningJoy}</span>
          </div>
        </div>
        <MetricsStrip result={result} accent="amber" />
      </div>
    </div>
  );
}

import { motion } from "framer-motion";

function Card({ activity, selected, disabled, onToggle, highlight }) {
  return (
    <motion.button
      layout
      onClick={() => onToggle(activity)}
      disabled={disabled && !selected}
      whileHover={!disabled || selected ? { y: -3 } : {}}
      whileTap={!disabled || selected ? { scale: 0.98 } : {}}
      className={[
        "relative text-left rounded-lg border p-3 transition-colors focus-ring",
        selected ? "border-cyan bg-cyan/10 shadow-glow" : "border-line bg-panel hover:border-line2",
        disabled && !selected ? "opacity-35 cursor-not-allowed" : "cursor-pointer",
        highlight ? "ring-1 ring-amber" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xl leading-none">{activity.icon}</span>
        {selected && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-cyan text-[10px] font-mono border border-cyan rounded px-1 py-0.5">
            IN
          </motion.span>
        )}
      </div>
      <div className="mt-2 font-display text-[13px] leading-tight text-ink">{activity.name}</div>
      <div className="text-[10px] text-ink-faint font-mono uppercase tracking-wide mt-0.5">{activity.cat}</div>
      <div className="mt-2 flex gap-2 text-[10px] font-mono text-ink-dim">
        <span>{activity.time}m</span>
        <span>${activity.money}</span>
        <span>{activity.energy}u</span>
        <span className="text-amber ml-auto">+{activity.joy}</span>
      </div>
    </motion.button>
  );
}

export default function ActivityGrid({ activities, selectedIds, remaining, onToggle, highlightIds }) {
  const fits = (a) => a.time <= remaining.time && a.money <= remaining.money && a.energy <= remaining.energy;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
      {activities.map((a) => (
        <Card
          key={a.id}
          activity={a}
          selected={selectedIds.has(a.id)}
          disabled={!fits(a)}
          onToggle={onToggle}
          highlight={highlightIds?.has(a.id)}
        />
      ))}
    </div>
  );
}

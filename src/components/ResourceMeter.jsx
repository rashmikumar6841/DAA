import { motion } from "framer-motion";

export default function ResourceMeter({ label, icon, used, budget, unit, danger }) {
  const pct = budget > 0 ? Math.min(100, (used / budget) * 100) : 0;
  const over = used > budget;
  return (
    <div className="flex-1 min-w-[120px]">
      <div className="flex items-center justify-between text-[11px] font-mono text-ink-dim mb-1">
        <span className="flex items-center gap-1">
          <span>{icon}</span> {label}
        </span>
        <span className={over ? "text-rose" : "text-ink-dim"}>
          {Math.round(used)}
          <span className="opacity-50">/{budget}{unit}</span>
        </span>
      </div>
      <div className="h-1.5 w-full bg-line2 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${over ? "bg-rose" : "bg-cyan"}`}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}

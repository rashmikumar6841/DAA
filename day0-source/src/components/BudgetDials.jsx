import { CONSTRAINTS_CONFIG } from "../data/activities";

function Dial({ cfg, value, onChange, accent = "cyan" }) {
  const pct = ((value - cfg.min) / (cfg.max - cfg.min)) * 100;
  return (
    <div className="flex-1 min-w-[160px]">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-mono uppercase tracking-wider text-ink-dim flex items-center gap-1.5">
          <span className="text-sm">{cfg.icon}</span> {cfg.label}
        </span>
        <span className={`font-mono text-sm text-${accent} mono-tab`}>
          {cfg.unit === "$" ? "$" : ""}
          {value}
          {cfg.unit !== "$" ? cfg.unit : ""}
        </span>
      </div>
      <input
        type="range"
        min={cfg.min}
        max={cfg.max}
        step={cfg.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-cyan h-1.5 rounded-full cursor-pointer focus-ring"
        style={{
          background: `linear-gradient(to right, #6FE7DD ${pct}%, #1A1F26 ${pct}%)`,
        }}
      />
    </div>
  );
}

export default function BudgetDials({ constraints, onChange, accent }) {
  return (
    <div className="flex flex-wrap gap-6">
      {Object.entries(CONSTRAINTS_CONFIG).map(([key, cfg]) => (
        <Dial key={key} cfg={cfg} value={constraints[key]} onChange={(v) => onChange({ ...constraints, [key]: v })} accent={accent} />
      ))}
    </div>
  );
}

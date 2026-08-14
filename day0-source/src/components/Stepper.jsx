const STAGES = [
  { id: "build", label: "Build the Day", tag: "01" },
  { id: "lab", label: "Algorithm Lab", tag: "02" },
  { id: "compare", label: "Verdict", tag: "03" },
];

export default function Stepper({ current, onJump, unlocked }) {
  return (
    <div className="flex items-center gap-0 w-full">
      {STAGES.map((s, i) => {
        const active = s.id === current;
        const isUnlocked = unlocked.includes(s.id);
        return (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <button
              disabled={!isUnlocked}
              onClick={() => isUnlocked && onJump(s.id)}
              className={[
                "group flex items-center gap-2 px-3 py-1.5 rounded-md focus-ring transition-colors",
                active ? "text-cyan" : isUnlocked ? "text-ink-dim hover:text-ink" : "text-ink-faint cursor-not-allowed",
              ].join(" ")}
            >
              <span className={`font-mono text-[10px] border rounded px-1 ${active ? "border-cyan text-cyan" : "border-line"}`}>{s.tag}</span>
              <span className="font-display text-[13px] whitespace-nowrap">{s.label}</span>
            </button>
            {i < STAGES.length - 1 && (
              <div className="flex-1 h-px mx-1 bg-line relative overflow-hidden">
                {active === false && unlocked.includes(STAGES[i + 1].id) ? <div className="absolute inset-0 bg-cyan/40" /> : null}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

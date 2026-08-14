import { useEffect, useState } from "react";

export default function CaseHeader({ stage }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = String(time.getHours()).padStart(2, "0");
  const mm = String(time.getMinutes()).padStart(2, "0");
  const ss = String(time.getSeconds()).padStart(2, "0");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-void/85 backdrop-blur">
      <div className="max-w-[1400px] mx-auto px-5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-sm bg-cyan/10 border border-cyan/40 flex items-center justify-center text-cyan font-mono text-[11px]">0</div>
          <span className="font-display font-semibold tracking-tight text-[15px]">
            DAY<span className="text-cyan">//</span>0
          </span>
          <span className="hidden sm:inline text-[10px] font-mono text-ink-faint border border-line rounded px-1.5 py-0.5 ml-1">
            algorithm laboratory
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono text-ink-dim">
          <span className="hidden md:inline">STAGE: <span className="text-cyan">{stage}</span></span>
          <span className="mono-tab text-ink-dim">{hh}:{mm}:{ss}</span>
          <span className="flex items-center gap-1 text-cyan/80">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse2" /> LIVE
          </span>
        </div>
      </div>
    </header>
  );
}

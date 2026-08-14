export default function PlaybackBar({ player, length, accent = "cyan" }) {
  const { index, playing, setPlaying, speed, setSpeed, step, jumpTo, reset, jumpToEnd } = player;
  return (
    <div className="flex items-center gap-3 border border-line rounded-lg bg-panel px-3 py-2.5">
      <button onClick={reset} className="text-ink-dim hover:text-ink text-xs font-mono px-1.5 focus-ring" title="Reset">
        &#8676;
      </button>
      <button onClick={() => step(-1)} className="text-ink-dim hover:text-ink text-xs font-mono px-1.5 focus-ring" title="Step back">
        &#9664;
      </button>
      <button
        onClick={() => setPlaying((p) => !p)}
        className={`w-8 h-8 flex items-center justify-center rounded-md bg-${accent}/15 text-${accent} border border-${accent}/30 focus-ring`}
        title={playing ? "Pause" : "Play"}
      >
        {playing ? "\u23F8" : "\u25B6"}
      </button>
      <button onClick={() => step(1)} className="text-ink-dim hover:text-ink text-xs font-mono px-1.5 focus-ring" title="Step forward">
        &#9654;
      </button>
      <button onClick={jumpToEnd} className="text-ink-dim hover:text-ink text-xs font-mono px-1.5 focus-ring" title="Jump to result">
        &#8677;
      </button>

      <input
        type="range"
        min={0}
        max={length}
        value={index}
        onChange={(e) => jumpTo(Number(e.target.value))}
        className="flex-1 accent-cyan h-1.5 cursor-pointer focus-ring"
      />

      <span className="font-mono text-[11px] text-ink-dim mono-tab w-16 text-right">
        {index}/{length}
      </span>

      <div className="flex items-center gap-1 border-l border-line pl-3">
        {[1, 4, 12, 40].map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`text-[10px] font-mono px-1.5 py-0.5 rounded focus-ring ${speed === s ? `bg-${accent}/20 text-${accent}` : "text-ink-faint hover:text-ink-dim"}`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
